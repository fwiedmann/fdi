import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { MetaData } from './emergency-base-data/emergency-base-data.component';
import { CheckedMember, CrewSelectorResponse } from './crew-selector/crew-selector.component';


export type CostRate = {
  forAHalfHourInEuro: number;
  forDirtAllowanceInEuro: number;
}

@Injectable({
  providedIn: 'root'
})

export class PdfGeneratorService {

  constructor() {
  }

  private doc = new jsPDF();
  private pdfY = 10;

  generatePdf(metadata: MetaData, crewsSelections: CrewSelectorResponse[], costRate: CostRate, fileName: string) {
    // header
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(167, 41, 32);
    this.doc.setFontSize(20);
    this.doc.addImage('assets/img/swd.png', 'PNG', 20, this.addY(0), 40, 30);
    this.doc.text('Feuerwehr Schutterwald', 65, 38);
    this.doc.addImage('assets/img/loewe.png', 'PNG', 155, 13, 15, 25);

    // city hall address
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.text('Gemeindeverwaltung Schutterwald', 20, this.addY(40));
    this.doc.text('Hauptamt', 20, this.addY(5));
    this.doc.text('z. Hd. Herrn Feger', 20, this.addY(5));
    this.doc.text('77746 Schutterwald', 20, this.addY(5));
    this.addEmptyLine();

    // Emergency meta data
    this.doc.text(`Anlage zum Einsatzbericht der FF Schutterwald vom ${PdfGeneratorService.buildFullDate(metadata.startDate)}`, 20, this.addY(5));
    this.drawLine();
    this.doc.text('Antrag für Auslagen bzw. Einsatzvergütung', 20, this.addY(5));

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Kostenberechnung', 20, this.addY(5));

    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${metadata.startDate.getHours()}:${metadata.startDate.getMinutes()} Uhr bis ${metadata.endDate.getHours()}:${metadata.endDate.getMinutes()} Uhr    rund ${PdfGeneratorService.calculateHalfHoursCount(metadata.startDate, metadata.endDate)} x 0,5 Stunden`, 20, this.addY(5));
    this.drawLine();
    this.addEmptyLine();

    // generate list
    let totalCosts: number = 0;
    crewsSelections.forEach(selection => {
        const halfHoursCount = PdfGeneratorService.calculateHalfHoursCount(selection.startDate, selection.endDate);
        this.createCrewSelectionHeader(selection, halfHoursCount);
        this.addEmptyLine();

        selection.crew.forEach(member => {
          const memberCosts = PdfGeneratorService.calculateCrwMemberCostRate(member, costRate, halfHoursCount);
          totalCosts += memberCosts;
          this.doc.text(`${member.name}`, 20, this.addY(5));
          this.doc.text('=', 60, this.addY(0));
          this.doc.text(`${memberCosts} €`, 110, this.addY(0));
        });
        this.addEmptyLine();
      }
    );

    // total costs
    this.drawLine();
    this.doc.text('Gesamtkosten', 20, this.addY(5));
    this.doc.text('=', 60, this.addY(0));
    this.doc.text(`${totalCosts} €`, 110, this.addY(0));
    this.addEmptyLine();

    // footer
    // line 1
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Auslagen gemäß § 1 FwES:', 20, this.addY(5));
    this.doc.text(`Rechnung an:`, 110, this.addY(0));
    this.doc.setFont('helvetica', 'normal');

    // line 2
    this.doc.text(`Schutterwald, den: ${PdfGeneratorService.buildFullDate(new Date())}`, 20, this.addY(5));
    metadata.hasInvoiceReceiver ? this.doc.text(`${metadata.invoiceReceiverName}`, 110, this.addY(0)) : '';

    // line 3
    this.doc.text(`Stantke Thomas, Kdt`, 20, this.addY(5));
    metadata.hasInvoiceReceiver ? this.doc.text(`${metadata.invoiceReceiverAddress}`, 110, this.addY(0)) : '';

    // line 3
    metadata.hasInvoiceReceiver ? this.doc.text(`${metadata.invoiceReceiverPostcodeAndCity}`, 110, this.addY(5)) : '';

    this.doc.save(`${fileName}.pdf`);
  }

  private createCrewSelectionHeader(selection: CrewSelectorResponse, halfHoursCount: number): void {
    let dirtAllowance: boolean = false;
    selection.crew.forEach(value => {
      if (value.dirtAllowance) {
        dirtAllowance = true;
      }
    });

    if (dirtAllowance) {
      this.doc.text(`${halfHoursCount} x 0,5 Stunden á 6 € + 1,00 € Schmutzzulage`, 20, this.addY(5));
      return;
    }
    this.doc.text(`${halfHoursCount} x 0,5 Stunden á 6 €`, 20, this.addY(5));
  }

  private addY(val: number): number {
    this.pdfY += val;
    return this.pdfY;
  }

  private addEmptyLine() {
    this.doc.text('', 20, this.addY(5));
  }

  private drawLine() {
    this.doc.line(20, this.addY(2), 160, this.pdfY); // horizontal line
  }

  private static buildFullDate(date: Date): string {
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
  }


  private static calculateHalfHoursCount(startDate: Date, endDate: Date): number {
    const fits = PdfGeneratorService.calculateMinutesBetweenDates(startDate, endDate) / 30;
    fits.toFixed();
    if (!fits.toString().includes('.')) {
      return fits;
    }
    return Number(fits.toString().split('.')[0]) + 1;
  }

  private static calculateMinutesBetweenDates(startDate: Date, endDate: Date): number {
    const millSec = endDate.getTime() - startDate.getTime();
    return Math.floor(millSec / 60000);
  }

  private static calculateCrwMemberCostRate(member: CheckedMember, costRate: CostRate, halfHourCount: number): number {
    let baseRate = costRate.forAHalfHourInEuro;
    if (member.dirtAllowance) {
      baseRate += costRate.forDirtAllowanceInEuro;
    }
    return baseRate * halfHourCount;
  }
}
