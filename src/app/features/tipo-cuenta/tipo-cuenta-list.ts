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

import { TipoCuentaService } from '../../core/services/tipo-cuenta.service';
import { TipoCuentaRead } from '../../models/api.models';
import { TipoCuentaDialog } from './tipo-cuenta-dialog';

@Component({
  selector: 'app-tipo-cuenta-list',
  standalone: true,
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
  templateUrl: './tipo-cuenta-list.html',
  styleUrl: './tipo-cuenta-list.scss',
})
export class TipoCuentaListComponent implements AfterViewInit {

  private readonly tipoCuentaService = inject(TipoCuentaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id_tipo_cuenta',
    'codigo',
    'nombre',
    'id_usuario_creacion',
    'acciones',
  ];

  readonly dataSource = new MatTableDataSource<TipoCuentaRead>([]);

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.tipoCuentaService.list().subscribe({
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

  nuevo(): void {
    this.openDialog(null);
  }

  editar(row: TipoCuentaRead): void {
    this.openDialog(row);
  }

  private openDialog(data: any): void {
    this.dialog
      .open(TipoCuentaDialog, { width: '700px',maxWidth: '90vw', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: TipoCuentaRead): void {
    if (!confirm(`¿Eliminar tipo de cuenta ${row.nombre}?`)) return;

    this.tipoCuentaService.delete(row.id_tipo_cuenta).subscribe({
      next: () => {
        this.snack.open('Tipo de cuenta eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}