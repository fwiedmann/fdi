import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CrewMembersService, Member} from "../crew-members.service";
import {v4 as uuidv4} from "uuid";
import {CrewSelectorResponse} from "./crew-selector/crew-selector.component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-crew-selections',
  templateUrl: './crew-selections.component.html',
  styleUrls: ['./crew-selections.component.scss']
})
export class CrewSelectionsComponent implements OnInit, OnDestroy {


  @Input()
  startDate: Date | undefined;
  @Input()
  endDate: Date | undefined;
  @Output()
  crewSelections$ = new EventEmitter<CrewSelectorResponse[]>()

  availableMembers: Member[] = []

  memberState: Member[] = []
  crewSelectionCards: string[] = [];
  crewSelections: Map<string, CrewSelectorResponse> = new Map<string, CrewSelectorResponse>();

  private destroy$ = new Subject<any>()


  constructor(private memberService: CrewMembersService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }

  ngOnInit(): void {
    this.memberService.listAll().pipe(takeUntil(this.destroy$)).subscribe(
      members => {
        this.availableMembers = members
        this.memberState = members
      }
    )
  }

  memberChecked(id: string) {
    this.memberState = this.memberState.filter(member => member.id !== id);
  }

  memberUnchecked(id: string) {
    const member = this.availableMembers.find(member => member.id === id)
    if (!member) {
      return
    }

    this.memberState.push(member);
    this.memberState.sort((a, b) => {
      if (a.surname.toLocaleLowerCase() < b.surname.toLocaleLowerCase()) {
        return -1
      }
      if (a.surname.toLocaleLowerCase() < b.surname.toLocaleLowerCase()) {
        return 1
      }
      return 0
    });
  }

  addCrewMemberSelection() {
    this.crewSelectionCards.push(uuidv4());
  }

  updateCrewSelections(selection: CrewSelectorResponse) {
    if (selection.crew.length < 1) {
      this.crewSelections.delete(selection.id);
      return;
    }
    this.crewSelections.set(selection.id, selection);
    this.crewSelections$.emit(Array.from(this.crewSelections.values()));
  }

  removeCrewMemberSelection(id: string) {
    this.crewSelections.delete(id);
    this.crewSelectionCards = this.crewSelectionCards.filter(value => id !== value);
    if (this.crewSelectionCards.length === 0) {
      this.memberState = this.availableMembers
    }
  }

  selectedMembersCount(): number {
    let count = 0;
    this.crewSelections.forEach(selection => {
      count += selection.crew.length
    })
    return count
  }

}


