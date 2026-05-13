import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { CuentaService } from '../../core/services/cuenta.service';
import { CuentaRead } from '../../models/api.models';
import { CuentaDialog } from './cuenta-dialog';
import { TipoCuentaService } from '../../core/services/tipo-cuenta.service';

@Component({
  selector: 'app-cuenta-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './cuenta-list.html',
  styleUrl: './cuenta-list.scss',
})
export class CuentaListComponent implements AfterViewInit {
  private readonly cuentaService = inject(CuentaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly tipoCuentaService = inject(TipoCuentaService);

  readonly displayedColumns = [
    'id_cuenta',
    'numero_cuenta',
    'saldo',
    'id_usuario',
    'id_sucursal',
    'id_tipo_cuenta',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<CuentaRead>([]);

  loading = true;
  tiposCuenta: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
    this.loadTiposCuenta();
  }

  reload(): void {
    this.loading = true;
    this.cuentaService.list().subscribe({
      next: (rows: any) => {
        this.dataSource.data = rows.data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
      },
    });
  }

  loadTiposCuenta(): void {
  this.tipoCuentaService.list().subscribe({
      next: (res: any) => this.tiposCuenta = res.data,
      error: () => this.snack.open('Error cargando tipos de cuenta', 'Cerrar'),
    });
  }

  getNombreTipoCuenta(id: string): string {
    return this.tiposCuenta.find(t => t.id_tipo_cuenta === id)?.nombre || id;
  }

  nuevo(): void {
    this.openDialog({ mode: 'create' });
  }

  editar(row: CuentaRead): void {
    this.openDialog({ mode: 'edit', row });
  }

  private openDialog(data: any): void {
    this.dialog
      .open(CuentaDialog, { width: '520px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: CuentaRead): void {
    if (!confirm(`¿Eliminar cuenta ${row.numero_cuenta}?`)) return;
    this.cuentaService.delete(row.id_cuenta).subscribe({
      next: () => {
        this.snack.open('Cuenta eliminada', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}