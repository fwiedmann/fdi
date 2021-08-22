import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type Member = {
  id: string;
  name: string;
  surname: string;
}

export type MemberCreateResponse = {
  id: string
}



@Injectable({
  providedIn: 'root'
})

export class CrewMembersService {

  constructor(private http: HttpClient) { }

  create(name: string, surname: string): Observable<MemberCreateResponse> {
    return this.http.post<MemberCreateResponse>('http://localhost:8080/members',{
      name: name,
      surname: surname
    });
  }

  listAll(): Observable<Member[]> {
    return this.http.get<Member[]>('http://localhost:8080/members?sort=true')
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/members/${id}`)
  }
}
