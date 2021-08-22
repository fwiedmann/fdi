import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormControl } from '@angular/forms';
import { CrewMembersService, Member } from '../crew-members.service';

export type CrewSelectorResponse = {
  id: string;
  crew: CheckedMember[];
  startDate: Date;
  endDate: Date;
}


export type CheckedMember = Member & {
  dirtAllowance: boolean
}


@Component({
  selector: 'app-crew-selector',
  templateUrl: './crew-selector.component.html',
  styleUrls: ['./crew-selector.component.scss']
})

export class CrewSelectorComponent implements OnInit {
  crewMembers: Member[] = [];
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

  onCheckboxEventInOperation(change: MatCheckboxChange, member: Member) {
    if (change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.push({ id: member.id, name: member.name, surname: member.surname,  dirtAllowance: false });
      }
    }

    if (!change.checked) {
      this.checkedMembers = this.checkedMembers.filter(value => value.id !== member.id);
    }
    this.emmitCurrentState();
  }

  onCheckboxEventDirtAllowance(change: MatCheckboxChange, member: Member) {
    if (change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.forEach((value, index) => {
          if (member.id === value.id) {
            this.checkedMembers[index] = { id: member.id, name: member.name, surname: member.surname,  dirtAllowance: true };
          }
        });
      }
    }
    if (!change.checked) {
      if (change.source.name != null) {
        this.checkedMembers.forEach((value, index) => {
          if (member.id === value.id) {
            this.checkedMembers[index] = { id: member.id, name: member.name, surname: member.surname,  dirtAllowance: false };
          }
        });
      }
    }
  }

  isPermittedForDirtAllowance(id: string): boolean {
    for (const member of this.checkedMembers) {
      if (member.id === id) {
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
