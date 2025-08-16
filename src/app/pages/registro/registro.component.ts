import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import moment from 'moment';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlatpickrModule,
    HttpClientModule // Para HttpClient en ApiService
], 
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  nombre: string = '';
  cedula: string = '';
  correo: string = '';
  contrasena: string = '';
  genero: string = '';
  fechaNacimiento: string = '';
  isAdult: boolean = true; // Variable para verificar si el usuario es mayor de edad
  acceptTerms: boolean = false; // Variable para aceptar términos
  cedulaInvalida: boolean = false; // Variable para validar cédula
  showPassword: boolean = false; // Variable para mostrar/ocultar contraseña en el formulario



  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  limitCedulaLength() {
    if (this.cedula.length > 10) {
      this.cedula = this.cedula.slice(0, 10);
    }
  }

  checkAdult(): boolean {
    if (!this.fechaNacimiento) {
      return false;
    }
    const birthDate = moment(this.fechaNacimiento, 'YYYY-MM-DD');
    const today = moment();
    const age = today.diff(birthDate, 'years');
    return age >= 18;
  }

  isValidEmailDomain(): boolean {
    const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'email.com', 'icloud.com', 'utm.edu.ec'];
    const emailDomain = this.correo.split('@')[1];
    return typeof emailDomain === 'string' && allowedDomains.includes(emailDomain);
  }


  onSubmit(Form: NgForm) {
    if (Form.invalid || !this.acceptTerms) {
      return;
    }
    if (this.cedulaInvalida) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, ingresa una cédula válida.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    //validaciones del formulario
    // Validamos si el usuario es mayor de edad
    if (!this.checkAdult()) {
      Swal.fire({
        title: 'Error!',
        text: 'Debes ser mayor de edad para registrarte.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validamos si la cédula tiene 10 dígitos
    if (this.cedula.length !== 10) {
      Swal.fire({
        title: 'Error!',
        text: 'La cédula debe tener exactamente 10 dígitos.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    // Validamos si el nombre contiene solo letras y espacios, así evitamos caracteres numéricos y especiales
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ ]+$/.test(this.nombre)) {
      Swal.fire({
        title: 'Error!',
        text: 'El nombre solo debe contener letras y espacios. No use tildes.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validamos correos válidos
    if (!this.isValidEmailDomain()) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, introduce un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Creamos el objeto de datos del usuario, por defecto la cuenta se creará con rol usuario
    const userData = {
      nombre: this.nombre,
      cedula: this.cedula,
      correo: this.correo,
      contrasena: this.contrasena,
      genero: this.genero,
      fechaNacimiento: this.fechaNacimiento,
      rol: 'usuario'
    };

    // Mandamos los datos al servicio de API para registrar el usuario
    // Usamos la librería SweetAlert2 para mostrar mensajes de éxito o error en modales para que sea vea bonito
    this.apiService.register(userData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Registro exitoso!',
          text: 'Usuario registrado correctamente.',
          icon: 'success',
          timerProgressBar: true,
          timer: 3000,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      (error) => {
        let errorMessage = 'Error al registrar usuario.';
        if (error.error && error.error.mensaje) {
          errorMessage = error.error.mensaje;
        }
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error al registrar usuario:', error);
      }
    );
  }
}
