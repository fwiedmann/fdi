import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormControl } from '@angular/forms';
import { CrewMembersService } from '../crew-members.service';

export type CrewSelectorResponse = {
  id: string;
  crew: CheckedMember[];
  startDate: Date;
  endDate: Date;
}


export type CheckedMember = {
  name: string
  dirtAllowance: boolean
}


@Component({
  selector: 'app-crew-selector',
  templateUrl: './crew-selector.component.html',
  styleUrls: ['./crew-selector.component.scss']
})

export class CrewSelectorComponent implements OnInit {
  crewMembers: string[] = [];
  @Input()
  id: string = '';

  @Output()
  crewSelectorResponse$: EventEmitter<CrewSelectorResponse> = new EventEmitter<CrewSelectorResponse>();
  @Output()
  deleteComponent$: EventEmitter<string> = new EventEmitter<string>();

  checkedMembers: CheckedMember[] = [];
  columnsToDisplay = ['members', 'duty', 'dirtAllowance'];

  dateControlStart = new FormControl();
  dateControlEnd = new FormControl();

  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(private crewMemberService: CrewMembersService) {
  }


  ngOnInit(): void {
    this.crewMemberService.listAll().subscribe(members => this.crewMembers = members);
  }

  onCheckboxEventInOperation(change: MatCheckboxChange) {
    if (change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.push({ name: change.source.name, dirtAllowance: false });
      }
    }

    if (!change.checked) {
      this.checkedMembers = this.checkedMembers.filter(value => value.name !== change.source.name);
    }
    this.emmitCurrentState();
  }

  onCheckboxEventDirtAllowance(change: MatCheckboxChange) {
    if (change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.forEach((value, index) => {
          if (change.source.name === value.name) {
            this.checkedMembers[index] = { name: value.name, dirtAllowance: true };
          }
        });
      }
    }
    if (!change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.forEach((value, index) => {
          if (change.source.name === value.name) {
            this.checkedMembers[index] = { name: value.name, dirtAllowance: false };
          }
        });
      }
    }
  }

  isPermittedForDirtAllowance(memberName: string): boolean {
    for (const member of this.checkedMembers) {
      if (member.name === memberName) {
        return true;
      }
    }
    return false;
  }

  deleteComponent() {
    this.deleteComponent$.emit(this.id);
  }

  private emmitCurrentState() {
    this.crewSelectorResponse$.emit({
      id: this.id,
      crew: this.checkedMembers,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  updateInputStart() {
    this.startDate = this.dateControlStart.value;
    this.emmitCurrentState();
  }

  updateInputEnd() {
    this.endDate = this.dateControlEnd.value;
    this.emmitCurrentState();
  }
}
