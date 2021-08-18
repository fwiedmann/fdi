import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CrewMembersService, Member } from '../crew-members.service';

@Component({
  selector: 'app-crew-manager',
  templateUrl: './crew-manager.component.html',
  styleUrls: ['./crew-manager.component.scss']
})
export class CrewManagerComponent implements OnInit {

  crewMembers: Member[] = []
  memberToCreateName: string = '';
  memberToCreateSurname: string = '';

  constructor(
    public dialogRef: MatDialogRef<CrewManagerComponent>,
    private readonly crewMemberService: CrewMembersService
  ) {
  }

  ngOnInit(): void {
    this.updateCrewMemberList()
  }

  deleteCrewMember(id: string) {
    this.crewMemberService.deleteById(id).subscribe(value => {
      this.updateCrewMemberList()
      }
    );
  }

  updateCrewMemberList() {
    this.crewMemberService.listAll().subscribe(members => this.crewMembers = members);
  }

  createMember() {
    // TODO update to use form validator
    this.crewMemberService.create(this.memberToCreateName, this.memberToCreateSurname).subscribe(
      value => {
        this.updateCrewMemberList()
      }
    )
  }
}
