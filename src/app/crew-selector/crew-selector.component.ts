import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

export type CheckedMembers = {
  name: string
  dirtAllowance: boolean
}


@Component({
  selector: 'app-crew-selector',
  templateUrl: './crew-selector.component.html',
  styleUrls: ['./crew-selector.component.scss']
})

export class CrewSelectorComponent implements OnInit, OnDestroy {
  @Input()
  crewMembers: string[] = []

  @Input()
  id: number | undefined = -10


  @Output()
  deleteComponent$: EventEmitter<number> = new EventEmitter<number>()

  checkedMembers: CheckedMembers[] = []

  columnsToDisplay = ['members', 'imEinsatz', 'sz'];

  constructor() {
  }

  ngOnDestroy(): void {
       console.log('destroyed‚')
    }

  ngOnInit(): void {
  }

  onCheckboxEventInOperation(change: MatCheckboxChange) {
    if (change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.push({name: change.source.name, dirtAllowance: false} );
      }
    }

    if (!change.checked) {
      this.checkedMembers = this.checkedMembers.filter(value => value.name !== change.source.name)
    }
  }

  onCheckboxEventDirtAllowance(change: MatCheckboxChange) {
    if (change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.forEach((value, index) => {
          if (change.source.name === value.name) {
            this.checkedMembers[index] = { name: value.name, dirtAllowance: true}
          }
        })
      }
    }
    if (!change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.forEach((value, index) => {
          if (change.source.name === value.name) {
            this.checkedMembers[index] = { name: value.name, dirtAllowance: false}
          }
        })
      }
    }
  }

  isPermittedForDirtAllowance(memberName: string): boolean {
    for (const member of this.checkedMembers) {
      if (member.name === memberName) {
        return true;
      }
    }
    return false
  }

  deleteComponent() {
    console.log('delte')
    this.deleteComponent$.emit(this.id);
  }
}
