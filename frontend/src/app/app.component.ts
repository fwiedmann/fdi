import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CrewSelectorResponse } from './crew-selector/crew-selector.component';
import { MetaData } from './emergency-base-data/emergency-base-data.component';
import { PdfGeneratorService } from './pdf-generator.service';
import { MatDialog } from '@angular/material/dialog';
import { CrewManagerComponent } from './crew-manager/crew-manager.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'FDI';

  crewSelectionCards: string[] = [];
  crewSelections: Map<string, CrewSelectorResponse> = new Map<string, CrewSelectorResponse>();
  emergencyMetaData: MetaData | undefined;
  fileName: string = 'kostenaufstellung';

  constructor(
    private pdfGeneratorService: PdfGeneratorService,
    public dialog: MatDialog
  ) {

  }

  addCrewMemberSelection() {
    this.crewSelectionCards.push(uuidv4());
  }

  removeCrewMemberSelection(id: string) {
    this.crewSelections.delete(id);
    this.crewSelectionCards = this.crewSelectionCards.filter(value => id !== value);
  }

  updateCrewSelections(selection: CrewSelectorResponse) {
    if (selection.crew.length < 1) {
      this.crewSelections.delete(selection.id);
      return;
    }
    this.crewSelections.set(selection.id, selection);
  }

  generatePdf() {
    if (!this.emergencyMetaData) {
      console.log('meta data is undefined');
      return;
    }

    this.pdfGeneratorService.generatePdf(this.emergencyMetaData, Array.from(this.crewSelections.values()), { forAHalfHourInEuro: 6, forDirtAllowanceInEuro: 1 }, this.fileName);
  }

  openCrewMemberConfigDialog() {
    this.dialog.open(CrewManagerComponent)
  }
}
