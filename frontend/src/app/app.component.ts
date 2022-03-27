import {Component} from '@angular/core';
import {CrewSelectorResponse} from './crew-selections/crew-selector/crew-selector.component';
import {MetaData} from './emergency-base-data/emergency-base-data.component';
import {PdfGeneratorService} from './pdf-generator.service';
import {MatDialog} from '@angular/material/dialog';
import {CrewManagerComponent} from './crew-manager/crew-manager.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'FDI';

  crewSelections: CrewSelectorResponse[] = []
  emergencyMetaData: MetaData | undefined;
  fileName: string = 'kostenaufstellung';

  constructor(
    private pdfGeneratorService: PdfGeneratorService,
    public dialog: MatDialog
  ) {

  }

  generatePdf() {
    if (!this.emergencyMetaData) {
      console.log('meta data is undefined');
      return;
    }

    this.pdfGeneratorService.generatePdf(this.emergencyMetaData, this.crewSelections, {
      forAHalfHourInEuro: 6,
      forDirtAllowanceInEuro: 2
    }, this.fileName);
  }

  openCrewMemberConfigDialog() {
    this.dialog.open(CrewManagerComponent)
  }
}
