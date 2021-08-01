import { forwardRef, Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { MetaData } from './emergency-base-data/emergency-base-data.component';
import { CrewSelectorResponse } from './crew-selector/crew-selector.component';
import { throwPortalOutletAlreadyDisposedError } from '@angular/cdk/portal/portal-errors';
import { cdkVariables } from '@angular/material/schematics/ng-update/migrations/theming-api-v12/config';

@Injectable({
  providedIn: 'root'
})

export class PdfGeneratorService {

  constructor() { }

  private doc = new jsPDF();
  private pdfY = 10;

  generatePdf(metadata: MetaData, crewsSelections: CrewSelectorResponse[]) {
    this.doc.setFont("helvetica", "normal");

    this.doc.setTextColor(167, 41, 32)
    this.doc.setFontSize(20);
    this.doc.addImage("assets/img/swd.png", "PNG", 10, this.addY(0) , 40, 30);
    this.doc.text('Feuerwehr Schutterwald', 65 , 38 )
    this.doc.addImage("assets/img/loewe.png", "PNG", 155, 13 , 15, 25);

    this.doc.setTextColor(0,0,0)
    this.doc.setFontSize(10);
    this.doc.text('Gemeindeverwaltung Schutterwald', 10, this.addY(40));
    this.doc.text('Hauptamt', 10, this.addY(5));
    this.doc.text('z. Hd. Herrn Feger', 10, this.addY(5))
    this.doc.text('77746 Schutterwald', 10, this.addY(5))
    this.addEmptyLine()
    this.doc.text(`Anlage zum Einsatzbericht der FF Schutterwald vom ${PdfGeneratorService.buildFullDate(metadata.startDate)}`,10,  this.addY(5) )
    this.doc.line(10, this.addY(2), 115, this.pdfY ); // horizontal line
    this.doc.text('Antrag für Auslagen bzw. Einsatzvergütung',10,  this.addY(5) )

    this.doc.setFont("helvetica", "bold");
    this.doc.text('Kostenberechnung',10, this.addY(5))

    this.doc.setFont("helvetica", "normal");
    this.doc.text(`${metadata.startDate.getHours()}:${metadata.startDate.getMinutes()} Uhr bis ${metadata.endDate.getHours()}:${metadata.endDate.getMinutes()} Uhr    rund ${this.calculateMinutesFitInXTimes(this.calculateMinutesBetweenDates(metadata.startDate, metadata.endDate), 30)} x 0,5 Stunden`,10,this.addY(5))
    this.doc.line(10, this.addY(2), 115, this.pdfY ); // horizontal line
    this.addEmptyLine()

    crewsSelections.forEach(selection => {
      const halfHoursCount = this.calculateMinutesFitInXTimes(this.calculateMinutesBetweenDates(selection.startDate, selection.endDate), 30)
      this.createCrewSelectionHeader(selection, halfHoursCount);
      this.addEmptyLine();

      selection.crew.forEach(member => {
        this.doc.text(`${member.name}`, 10, this.addY(5));
        this.doc.text('=', 60, this.addY(0));
        this.doc.text('500€', 110, this.addY(0));
      })

      this.addEmptyLine()
      }
    );
    this.doc.save("a4.pdf");
  }

  private createCrewSelectionHeader(selection: CrewSelectorResponse, halfHoursCount: number): void {
    let dirtAllowance: boolean = false;
    selection.crew.forEach(value => {
      if (value.dirtAllowance) {
        dirtAllowance = true;
      }
    });

    if (dirtAllowance) {
      this.doc.text(`${halfHoursCount} x 0,5 Stunden á 6 € + 1,00 € Schmutzzulage`, 10, this.addY(5));
      return
    }
      this.doc.text(`${halfHoursCount} x 0,5 Stunden á 6 €`, 10, this.addY(5));
  }

  private addY(val: number):number {
    this.pdfY += val;
    return this.pdfY
  }

  private addEmptyLine() {
    this.doc.text('', 10, this.addY(5));
  }

  private static buildFullDate(date: Date): string {
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
  }

  private calculateMinutesFitInXTimes(minutes: number, x: number): number {
    const fits = minutes / x;
    fits.toFixed()
    if (!fits.toString().includes('.')) {
      return fits;
    }
    return Number(fits.toString().split('.')[0]) + 1
  }

  private calculateMinutesBetweenDates(startDate: Date, endDate: Date): number {
    const millSec = endDate.getTime() - startDate.getTime();
    return Math.floor(millSec / 60000);
  }
}
