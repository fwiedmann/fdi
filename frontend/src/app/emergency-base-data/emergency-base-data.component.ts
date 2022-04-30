import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

export type MetaData = {
  startDate: Date;
  endDate: Date;
  hasInvoiceReceiver: boolean;
  invoiceReceiverName?: string;
  invoiceReceiverAddress?: string;
  invoiceReceiverPostcodeAndCity?: string;
}

@Component({
  selector: 'emergency-base-data',
  templateUrl: './emergency-base-data.component.html',
  styleUrls: ['./emergency-base-data.component.scss']
})

export class EmergencyBaseDataComponent implements OnInit {

  @Output()
  emergencyData$: EventEmitter<MetaData> = new EventEmitter<MetaData>();

  editingDone: boolean = false;

  startDate: Date = new Date();
  endDate: Date = new Date();
  hasInvoiceReceiver: boolean = false;
  invoiceReceiverName?: string;
  invoiceReceiverAddress?: string;
  invoiceReceiverPostcode?: string;

  dateControlStart = new FormControl();
  dateControlEnd = new FormControl();

  defaultDate = [0, 0, 0]

  constructor() {
  }

  ngOnInit(): void {
  }

  editDone(event: any) {
    if (!event.checked) {
      return;
    }
    this.emergencyData$.emit({
      startDate: this.startDate,
      endDate: this.endDate,
      hasInvoiceReceiver: this.hasInvoiceReceiver,
      invoiceReceiverName: this.invoiceReceiverName,
      invoiceReceiverAddress: this.invoiceReceiverAddress,
      invoiceReceiverPostcodeAndCity: this.invoiceReceiverPostcode
    });
  }
}
