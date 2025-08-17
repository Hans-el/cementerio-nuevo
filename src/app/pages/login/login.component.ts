import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ✅ ng-bootstrap
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbAlertModule,   // Alertas
    NgbTooltipModule,  // Tooltips
    HttpClientModule // Para HttpClient en ApiService
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cedula: string = '';
  contrasena: string = '';
  showPassword: boolean = false;

  // Para usar <ngb-alert> en caso de error adicional
  loginError: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.apiService.login(this.cedula, this.contrasena).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        //usando SweetAlert2 
        Swal.fire({
          title: 'Inicio de sesión exitoso!',
          text: 'Has iniciado sesión correctamente.',
          timerProgressBar: true,
          timer: 2200,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Cédula o contraseña incorrectos.',
          timerProgressBar: true,
          timer: 2200,
          icon: 'error',
          confirmButtonText: 'OK'
        });

      

        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
