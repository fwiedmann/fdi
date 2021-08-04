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
    this.pdfY = 10;
    const doc = new jsPDF();
    // header
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(167, 41, 32);
    doc.setFontSize(20);
    doc.addImage('assets/img/swd.png', 'PNG', 20, this.addY(0), 40, 30);
    doc.text('Feuerwehr Schutterwald', 65, 38);
    doc.addImage('assets/img/loewe.png', 'PNG', 155, 13, 15, 25);

    // city hall address
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Gemeindeverwaltung Schutterwald', 20, this.addY(40));
    doc.text('Hauptamt', 20, this.addY(5));
    doc.text('z. Hd. Herrn Feger', 20, this.addY(5));
    doc.text('77746 Schutterwald', 20, this.addY(5));
    this.addEmptyLine(doc);

    // Emergency meta data
    doc.text(`Anlage zum Einsatzbericht der FF Schutterwald vom ${PdfGeneratorService.buildFullDate(metadata.startDate)}`, 20, this.addY(5));
    this.drawLine(doc);
    doc.text('Antrag für Auslagen bzw. Einsatzvergütung', 20, this.addY(5));

    doc.setFont('helvetica', 'bold');
    doc.text('Kostenberechnung', 20, this.addY(5));

    doc.setFont('helvetica', 'normal');
    doc.text(`${metadata.startDate.getHours()}:${metadata.startDate.getMinutes() === 0 ? '00' : 0} Uhr bis ${metadata.endDate.getHours()}:${metadata.endDate.getMinutes() === 0 ? '00' : 0} Uhr    rund ${PdfGeneratorService.calculateHalfHoursCount(metadata.startDate, metadata.endDate)} x 0,5 Stunden`, 20, this.addY(5));
    this.drawLine(doc);
    this.addEmptyLine(doc);

    // generate list
    let totalCosts: number = 0;
    crewsSelections.forEach(selection => {
        const halfHoursCount = PdfGeneratorService.calculateHalfHoursCount(selection.startDate, selection.endDate);
        this.createCrewSelectionHeader(doc, selection, halfHoursCount);
        this.addEmptyLine(doc);

        selection.crew.forEach(member => {
          const memberCosts = PdfGeneratorService.calculateCrwMemberCostRate(member, costRate, halfHoursCount);
          totalCosts += memberCosts;
          doc.text(`${member.name}`, 20, this.addY(5));
          doc.text('=', 60, this.addY(0));
          doc.text(`${memberCosts} €`, 110, this.addY(0));
        });
        this.addEmptyLine(doc);
      }
    );

    // total costs
    this.drawLine(doc);
    doc.text('Gesamtkosten', 20, this.addY(5));
    doc.text('=', 60, this.addY(0));
    doc.text(`${totalCosts} €`, 110, this.addY(0));
    this.addEmptyLine(doc);

    // footer
    // line 1
    doc.setFont('helvetica', 'bold');
    doc.text('Auslagen gemäß § 1 FwES:', 20, this.addY(5));
    doc.text(`Rechnung an:`, 110, this.addY(0));
    doc.setFont('helvetica', 'normal');

    // line 2
    doc.text(`Schutterwald, den: ${PdfGeneratorService.buildFullDate(new Date())}`, 20, this.addY(5));
    metadata.hasInvoiceReceiver ? doc.text(`${metadata.invoiceReceiverName}`, 110, this.addY(0)) : '';

    // line 3
    doc.text(`Stantke Thomas, Kdt`, 20, this.addY(5));
    metadata.hasInvoiceReceiver ? doc.text(`${metadata.invoiceReceiverAddress}`, 110, this.addY(0)) : '';

    // line 3
    metadata.hasInvoiceReceiver ? doc.text(`${metadata.invoiceReceiverPostcodeAndCity}`, 110, this.addY(5)) : '';

    doc.save(`${fileName}.pdf`);
  }

  private createCrewSelectionHeader(doc: jsPDF, selection: CrewSelectorResponse, halfHoursCount: number): void {
    let dirtAllowance: boolean = false;
    selection.crew.forEach(value => {
      if (value.dirtAllowance) {
        dirtAllowance = true;
      }
    });

    if (dirtAllowance) {
      doc.text(`${halfHoursCount} x 0,5 Stunden á 6 € + 1,00 € Schmutzzulage`, 20, this.addY(5));
      return;
    }
    doc.text(`${halfHoursCount} x 0,5 Stunden á 6 €`, 20, this.addY(5));
  }

  private addY(val: number): number {
    this.pdfY += val;
    return this.pdfY;
  }

  private addEmptyLine(doc: jsPDF) {
    doc.text('', 20, this.addY(5));
  }

  private drawLine(doc: jsPDF) {
    doc.line(20, this.addY(2), 160, this.pdfY); // horizontal line
  }

  private static buildFullDate(date: Date): string {
    return `${date.getDate()}.${date.getUTCMonth() + 1}.${date.getFullYear()}`;
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
