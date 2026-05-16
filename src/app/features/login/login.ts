import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuditContextService } from '../../core/audit-context.service';
import { AuthService } from '../../core/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly audit = inject(AuditContextService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly loginForm = this.fb.nonNullable.group({
    nombre_usuario: ['', Validators.required],
    clave: ['', Validators.required],
  });

  readonly firstUserForm = this.fb.nonNullable.group({
    nombre_completo: ['', Validators.required],
    nombre_usuario: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(4)]],
    rol: ['admin', Validators.required],
    telefono: [''],
  });

  ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { nombre_usuario, clave } = this.loginForm.getRawValue();
    this.authService.login(nombre_usuario, clave).subscribe({
      next: (data) => {
        this.audit.select(data.id_usuario);
        void this.router.navigateByUrl('/app');
      },
      error: (err: HttpErrorResponse) => {
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
      },
    });
  }

  crearPrimero(): void {
    if (this.firstUserForm.invalid) {
      this.firstUserForm.markAllAsTouched();
      return;
    }
    const v = this.firstUserForm.getRawValue();
    this.usuarioService
      .create({
        nombre: v.nombre_completo,
        nombre_usuario: v.nombre_usuario,
        email: v.email,
        contraseña: v.clave,
        rol: v.rol,
        telefono: v.telefono || null,
        activo: true,
      })
      .subscribe({
        next: () => {
          this.snack.open('Usuario creado. Ahora inicia sesión.', 'Cerrar', { duration: 4000 });
          this.firstUserForm.reset({
            nombre_completo: '',
            nombre_usuario: '',
            email: '',
            clave: '',
            rol: 'admin',
            telefono: '',
          });
        },
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
  }

  private msg(err: HttpErrorResponse): string {
    const detail = err.error?.error?.message;
    if (typeof detail === 'string') return detail;
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}