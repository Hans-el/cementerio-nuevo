// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(cedula: string, contrasena: string) {
    return this.http.post(`${this.apiUrl}/login`, { cedula, contrasena }).pipe(
      tap((response: any) => {
        // Guardar el token en el almacenamiento local
        localStorage.setItem(this.tokenKey, response.token);
      })
    );
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}
