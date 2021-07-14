import { Component, ComponentFactory, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FDI';


  crewMemberSelection: number[] = [];
  constructor() {
  }

  addCrewMemberSelection() {
    this.crewMemberSelection.push(this.crewMemberSelection.length)
  }

  removeCrewMemberSelection(id: number) {
    this.crewMemberSelection.splice(id-1, 1)
  }
}
