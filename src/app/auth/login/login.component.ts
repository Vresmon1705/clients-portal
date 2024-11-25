import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  spinnerLogin: boolean = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  public myForm: FormGroup = this.fb.group({
    userNit: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  login() {
    const { userNit, password } = this.myForm.value;

    if (this.myForm.valid) {
      this.spinnerLogin = true;

      this.authService.login(userNit, password)
        .subscribe({
          next: () => {
            this.spinnerLogin = false;
            this.router.navigateByUrl('/home/shopping');
          },
          error: (err) => {
            this.spinnerLogin = false;

            let errorMessage = 'Error al iniciar sesión, vuelve a intentarlo';

            console.error('Error:', err);

            Swal.fire({
              icon: "error",
              title: err.error.message || errorMessage,
              showConfirmButton: true,
              confirmButtonColor: "#157347"
            });

            this.myForm.reset();
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Por favor complete el formulario correctamente",
        showConfirmButton: true,
        confirmButtonColor: "#157347"
      });
    }
  }
}


