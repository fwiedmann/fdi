import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type Member = {
  id: string;
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})

export class CrewMembersService {

  constructor(private http: HttpClient) { }

  listAll(): Observable<Member[]> {
    return this.http.get<Member[]>('http://localhost:8080/members')
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/members/${id}`)
  }
}
