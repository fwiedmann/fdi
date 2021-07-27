import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CrewSelectorResponse } from './crew-selector/crew-selector.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FDI';

  crewSelectionCards: string[] = [];
  crewSelections: Map<string, CrewSelectorResponse> = new Map<string, CrewSelectorResponse>()

  constructor() {
  }

  addCrewMemberSelection() {
    this.crewSelectionCards.push(uuidv4())
  }

  removeCrewMemberSelection(id: string) {
    this.crewSelections.delete(id);
    this.crewSelectionCards = this.crewSelectionCards.filter(value => id !== value)
  }

  updateCrewSelections(selection: CrewSelectorResponse) {
    if (selection.crew.length < 1) {
      this.crewSelections.delete(selection.id);
      return
    }
    this.crewSelections.set(selection.id, selection)
  }
}
