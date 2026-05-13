import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { TipoCuentaService } from '../../core/services/tipo-cuenta.service';
import { AuditContextService } from '../../core/audit-context.service';

import { TipoCuentaRead } from '../../models/api.models';

@Component({
  selector: 'app-tipo-cuenta-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatDialogModule],
  templateUrl: './tipo-cuenta-dialog.html',
})
export class TipoCuentaDialog implements OnInit {

  private fb = inject(FormBuilder);
  private tipoCuentaService = inject(TipoCuentaService);
  private audit = inject(AuditContextService);
  private snack = inject(MatSnackBar);

  readonly dialogRef = inject(MatDialogRef<TipoCuentaDialog>);
  readonly data = inject<TipoCuentaRead | null>(MAT_DIALOG_DATA);

  form = this.fb.nonNullable.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.audit.usuarioId();

    if (!userId) {
      this.snack.open('No hay usuario en sesión', 'Cerrar');
      return;
    }

    const value = this.form.getRawValue();

    if (this.data) {
      // UPDATE
      this.tipoCuentaService.update(this.data.id_tipo_cuenta, {
        ...value,
        id_usuario_edita: userId,
      }).subscribe({
        next: () => {
          this.snack.open('Tipo de cuenta actualizado', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: () => this.snack.open('Error al actualizar', 'Cerrar'),
      });

    } else {
      // CREATE
      this.tipoCuentaService.create({
        ...value,
        id_usuario_creacion: userId,
      }).subscribe({
        next: () => {
          this.snack.open('Tipo de cuenta creado', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: () => this.snack.open('Error al crear', 'Cerrar'),
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}