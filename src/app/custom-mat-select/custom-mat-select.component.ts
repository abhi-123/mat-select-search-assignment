import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, NgModel } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material';



@Component({
  selector: 'app-custom-mat-select',
  templateUrl: './custom-mat-select.component.html',
  styleUrls: ['./custom-mat-select.component.scss']
})
export class CustomMatSelectComponent implements OnInit {

  @ViewChild('select',{static: false}) select:any;  
  destroy$: Subject<boolean> = new Subject<boolean>();
  selectCtrl: FormControl = new FormControl();
  selectFilterCtrl: FormControl = new FormControl();
  @Input() customClass: string = '';
  @Input() isColumnHeader: boolean = true;
  @Input() placeholder: string = "Select";
  @Input() label: string = this.placeholder;
  @Input() value: any;
  @Input() options: object[];
  title: string = "title";
  @Input() id: any = "id";
  isMultiple: boolean = true;
  @Input() isSearch: boolean = true;
  @Output() change = new EventEmitter<any>();
  optionListObject: any = {};
  filteredoptions: object[];
  model: NgModel;
  constructor() { }

  ngOnInit() {
    this.filteredoptions = this.options;
    this.selectCtrl.setValue(this.value) 
    this.options.forEach((option) => {
      this.optionListObject[option[this.id]] = option;
    });
    this.selectFilterCtrl.valueChanges.pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.filterOptions();
    });

    this.selectCtrl.valueChanges.pipe(takeUntil(this.destroy$))
    .subscribe((event) => {
      if(!this.isMultiple) {
        this.change.emit({
          value: this.selectCtrl.value,
          objectValue: this.optionListObject[this.selectCtrl.value]
        })
      }
    });
  }

  ngOnChanges(event) {
    if(event.value) {
      this.selectCtrl.setValue(event.value.currentValue, {emitEvent: false});
    }
    if(event.options) {
      this.options = event.options.currentValue;
      this.filteredoptions = this.options;
      this.options.forEach((option) => {
        this.optionListObject[option[this.id]] = option;
      });
    }
  }

  setOptions() {
    let objectValue = this.getArrayValueObjects(this.selectCtrl.value);
    this.change.emit({
      value: this.selectCtrl.value,
      objectValue
    });
    this.select.close();
  }

  resetOptions() {
    this.selectCtrl.setValue([]);
    this.change.emit({
      value: [],
      objectValue: []
    });
    this.select.close();
  }

  getArrayValueObjects(value) {
    let objectValue = [];
    value.forEach((selectedValue) => {
      objectValue.push(this.optionListObject[selectedValue])
    })
    return objectValue;
  }

  protected filterOptions() {
    if (!this.options) {
      return;
    }
    // get the search keyword
    let search = this.selectFilterCtrl.value;
    if (!search) {
      this.filteredoptions = this.options.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the options
    this.filteredoptions = this.options.filter(option => option[this.title].toLowerCase().indexOf(search) > -1)
  }

  isChecked(): boolean {
    console.log(this.selectCtrl.value && this.options.length
      && this.selectCtrl.value.length === this.options.length);
    
    return this.selectCtrl.value && this.options.length
      && this.selectCtrl.value.length === this.options.length;
  }
  
  isIndeterminate(): boolean {
    return this.selectCtrl.value && this.options.length && this.selectCtrl.value.length
      && this.selectCtrl.value.length < this.options.length;
  }
  

  toggleSelection(change: MatCheckboxChange): void {    
    if (change.checked) {
      this.selectCtrl.setValue(this.options);
    } else {
      this.selectCtrl.setValue([]);
    }    
  }
  


}
