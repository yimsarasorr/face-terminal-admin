import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    displayName: string;
    _id: string;
    username: string;
    access_token: string;
    refresh_token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const token = localStorage.getItem('access_token');
        if (token) {
        }
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth-login`, credentials)
            .pipe(
                tap(response => {
                    this.currentUserSubject.next(response);
                })
            );
    }

    refreshToken(): Observable<any> {
        const refreshToken = localStorage.getItem('refresh_token');
        return this.http.get(`${environment.apiUrl}/auth-refresh-token?token=${refreshToken}`)
            .pipe(
                tap((response: any) => {
                    if (response.access_token) {
                        localStorage.setItem('access_token', response.access_token);
                    }
                    if (response.refresh_token) {
                        localStorage.setItem('refresh_token', response.refresh_token);
                    }
                })
            );
    }

    logout(): Observable<any> {
        const refreshToken = localStorage.getItem('refresh_token');
        return this.http.post(`${environment.apiUrl}/auth-logout`, { token: refreshToken })
            .pipe(
                tap(() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    this.currentUserSubject.next(null);
                })
            );
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    getCurrentUser(): LoginResponse | null {
        return this.currentUserSubject.value;
    }
}