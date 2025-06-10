import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api';
  
  private mockUsers: User[] = [
    { enrollid: 1, name: 'John Doe', admin: 1, backupnum: 50 },
    { enrollid: 2, name: 'Jane Smith', admin: 0, backupnum: 11 },
    { enrollid: 3, name: 'Robert Johnson', admin: 0, backupnum: 50 },
    { enrollid: 4, name: 'Emily Brown', admin: 0, backupnum: 11 }
  ];

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    // return this.http.get<User[]>(`${this.apiUrl}/user-getuserinfos`);
    return of(this.mockUsers);
  }

  getUserById(id: number): Observable<User> {
    // return this.http.get<User>(`${this.apiUrl}/user-getuserinfo/${id}`);
    const user = this.mockUsers.find(u => u.enrollid === id);
    return of(user || {} as User);
  }

  addUser(user: User): Observable<any> {
    // return this.http.post(`${this.apiUrl}/user-adduserinfo`, user);
    const newId = Math.max(0, ...this.mockUsers.map(u => u.enrollid)) + 1;
    const newUser = { ...user, enrollid: newId };
    this.mockUsers.push(newUser);
    return of({ success: true });
  }

  updateUser(user: User): Observable<any> {
    // return this.http.put(`${this.apiUrl}/user-setuserinfo`, user);
    const index = this.mockUsers.findIndex(u => u.enrollid === user.enrollid);
    if (index >= 0) {
      this.mockUsers[index] = { ...user };
    }
    return of({ success: true });
  }

  deleteUser(id: number): Observable<any> {
    // return this.http.delete(`${this.apiUrl}/user-deleteuser/${id}`);
    this.mockUsers = this.mockUsers.filter(u => u.enrollid !== id);
    return of({ success: true });
  }
  
  getUserType(backupnum: number): string {
    switch (backupnum) {
        case 50: return 'Face ID';
        case 11: return 'Card';
        default: return 'Unknown';
    }
  }
}