import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { CuentaService } from '../../core/services/cuenta.service';
import { TipoCuentaService } from '../../core/services/tipo-cuenta.service';
import { AuditContextService } from '../../core/audit-context.service';

import { CuentaRead } from '../../models/api.models';

type CuentaDialogData = {
  mode: 'create' | 'edit';
  row?: CuentaRead;
};

@Component({
  selector: 'app-cuenta-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule ],
  templateUrl: './cuenta-dialog.html',
})
export class CuentaDialog implements OnInit {
  private fb = inject(FormBuilder);
  private cuentaService = inject(CuentaService);
  private tipoCuentaService = inject(TipoCuentaService);
  private audit = inject(AuditContextService);
  private snack = inject(MatSnackBar);

  readonly dialogRef = inject(MatDialogRef<CuentaDialog>);
  readonly data = inject<CuentaDialogData>(MAT_DIALOG_DATA);

  tiposCuenta = signal<any[]>([]);

  form = this.fb.nonNullable.group({
    numero_cuenta: ['', Validators.required],
    saldo: [0],
    id_usuario: ['', Validators.required],
    id_sucursal: ['', Validators.required],
    id_tipo_cuenta: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadTiposCuenta();

    if (this.data?.row) {
      this.form.patchValue(this.data.row);
    }
  }

  loadTiposCuenta() {
    this.tipoCuentaService.list().subscribe({
      next: (res: any) => this.tiposCuenta.set(res.data),
      error: () => this.snack.open('Error cargando tipos de cuenta', 'Cerrar'),
    });
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

    if (this.data?.mode === 'edit') {
        this.cuentaService.update(this.data.row!.id_cuenta, {
        ...value,
        id_usuario_edita: userId,
      }).subscribe({
        next: () => {
          this.snack.open('Cuenta actualizada', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: () => this.snack.open('Error al actualizar', 'Cerrar'),
      });

    } else {

      this.cuentaService.create({
        ...value,
        id_usuario_creacion: userId,
      }).subscribe({
        next: () => {
          this.snack.open('Cuenta creada', 'Cerrar');
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