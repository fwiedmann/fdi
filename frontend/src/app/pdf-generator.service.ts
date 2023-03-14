import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { MetaData } from './emergency-base-data/emergency-base-data.component';
import {
  CheckedMember,
  CrewSelectorResponse,
} from './crew-selections/crew-selector/crew-selector.component';

export type CostRate = {
  forAHalfHourInEuro: number;
  forDirtAllowanceInEuro: number;
};

type pageState = { count: number; page: number };
const defaultYStartPosition: number = 10;
const defaultPageState: pageState = {
  page: 1,
  count: 0,
};

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  private doc: jsPDF;
  private pdfY = defaultYStartPosition;
  private pageState: pageState = {
    page: 1,
    count: 0,
  };

  constructor() {
    this.doc = new jsPDF();
  }

  private static buildFullDate(date: Date): string {
    return `${date.getDate()}.${date.getUTCMonth() + 1}.${date.getFullYear()}`;
  }

  private static calculateHalfHoursCount(
    startDate: Date,
    endDate: Date
  ): number {
    const fits =
      PdfGeneratorService.calculateMinutesBetweenDates(startDate, endDate) / 30;
    fits.toFixed();
    if (!fits.toString().includes('.')) {
      return fits;
    }
    return Number(fits.toString().split('.')[0]) + 1;
  }

  private static calculateMinutesBetweenDates(
    startDate: Date,
    endDate: Date
  ): number {
    const millSec = endDate.getTime() - startDate.getTime();
    return Math.floor(millSec / 60000);
  }

  private static calculateCrwMemberCostRate(
    member: CheckedMember,
    costRate: CostRate,
    halfHourCount: number
  ): number {
    if (member.dirtAllowance) {
      return (
        costRate.forAHalfHourInEuro * halfHourCount +
        costRate.forDirtAllowanceInEuro
      );
    }
    return costRate.forAHalfHourInEuro * halfHourCount;
  }

  private static buildHoursRepresentation(date: Date): string {
    let hour = date.getHours().toString();
    if (date.getHours() < 10) {
      hour = '0' + hour;
    }

    let minutes = date.getMinutes().toString();
    if (date.getMinutes() < 10) {
      minutes = '0' + minutes;
    }
    return hour + ':' + minutes + ' Uhr';
  }

  generatePdf(
    metadata: MetaData,
    crewsSelections: CrewSelectorResponse[],
    costRate: CostRate,
    fileName: string
  ) {
    this.pdfY = 10;
    this.doc = new jsPDF();
    this.pageState = defaultPageState;

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
    this.doc.text(
      `Anlage zum Einsatzbericht der FF Schutterwald vom ${PdfGeneratorService.buildFullDate(
        metadata.startDate
      )}`,
      20,
      this.addY(5)
    );
    this.drawLine();
    this.doc.text(
      'Antrag für Auslagen bzw. Einsatzvergütung',
      20,
      this.addY(5)
    );

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Kostenberechnung', 20, this.addY(5));

    this.doc.setFont('helvetica', 'normal');
    this.doc.text(
      `${PdfGeneratorService.buildHoursRepresentation(
        metadata.startDate
      )} bis ${PdfGeneratorService.buildHoursRepresentation(
        metadata.endDate
      )}    rund ${PdfGeneratorService.calculateHalfHoursCount(
        metadata.startDate,
        metadata.endDate
      )} x 0,5 Stunden`,
      20,
      this.addY(5)
    );
    this.drawLine();
    this.addEmptyLine();

    // generate list
    let totalCosts: number = 0;

    crewsSelections.forEach((selection) => {
      const halfHoursCount = PdfGeneratorService.calculateHalfHoursCount(
        selection.startDate,
        selection.endDate
      );
      this.incLineCountAndAddPageIfNeeded(2);
      this.createCrewSelectionHeader(this.doc, selection, halfHoursCount);
      this.addEmptyLine();

      selection.crew.forEach((member, index) => {
        this.incLineCountAndAddPageIfNeeded(1);
        const memberCosts = PdfGeneratorService.calculateCrwMemberCostRate(
          member,
          costRate,
          halfHoursCount
        );
        totalCosts += memberCosts;
        this.doc.text(`${member.surname} ${member.name}`, 20, this.addY(5));
        this.doc.text('=', 60, this.addY(0));
        this.doc.text(`${memberCosts} €`, 110, this.addY(0));
      });
      this.incLineCountAndAddPageIfNeeded(1);
      this.addEmptyLine();
    });

    // total costs
    this.incLineCountAndAddPageIfNeeded(1);
    this.drawLine();
    this.incLineCountAndAddPageIfNeeded(1);
    this.doc.text('Gesamtkosten', 20, this.addY(5));
    this.incLineCountAndAddPageIfNeeded(1);
    this.doc.text('=', 60, this.addY(0));
    this.incLineCountAndAddPageIfNeeded(1);
    this.doc.text(`${totalCosts} €`, 110, this.addY(0));
    this.incLineCountAndAddPageIfNeeded(1);
    this.addEmptyLine();

    // footer
    // line 1
    this.incLineCountAndAddPageIfNeeded(1);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Auslagen gemäß § 1 FwES:', 20, this.addY(5));
    this.doc.text(`Rechnung an:`, 110, this.addY(0));
    this.doc.setFont('helvetica', 'normal');

    // line 2
    this.doc.text(
      `Schutterwald, den: ${PdfGeneratorService.buildFullDate(new Date())}`,
      20,
      this.addY(5)
    );
    metadata.hasInvoiceReceiver
      ? this.doc.text(`${metadata.invoiceReceiverName}`, 110, this.addY(0))
      : '';

    // line 3
    this.doc.text(`Stantke Thomas, Kdt`, 20, this.addY(5));
    metadata.hasInvoiceReceiver
      ? this.doc.text(`${metadata.invoiceReceiverAddress}`, 110, this.addY(0))
      : '';

    // line 3
    metadata.hasInvoiceReceiver
      ? this.doc.text(
        `${metadata.invoiceReceiverPostcodeAndCity}`,
        110,
        this.addY(5)
      )
      : '';

    this.doc.save(`${fileName}.pdf`);
  }

  incLineCountAndAddPageIfNeeded(inc: number): void {
    if (this.pageState.count > 35) {
      this.doc.addPage();
      this.doc.setPage(this.pageState.page + 1);
      this.pdfY = defaultYStartPosition;
      this.pageState.page = this.pageState.page + 1;
      this.pageState.count = 0;
      return;
    }
    this.pageState.count = this.pageState.count + inc;
  }

  private createCrewSelectionHeader(
    doc: jsPDF,
    selection: CrewSelectorResponse,
    halfHoursCount: number
  ): void {
    let dirtAllowance: boolean = false;
    selection.crew.forEach((value) => {
      if (value.dirtAllowance) {
        dirtAllowance = true;
      }
    });

    if (dirtAllowance) {
      this.doc.text(
        `${halfHoursCount} x 0,5 Stunden á 6 € + einmalige 2,00 € Schmutzzulage Pauschale`,
        20,
        this.addY(5)
      );
      return;
    }
    this.doc.text(`${halfHoursCount} x 0,5 Stunden á 6,50 €`, 20, this.addY(5));
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
}
