import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '../../components/mainpage-layout/layout.component';
import { FormParcelaComponent } from './form-painel-parcela/form-painel-parcela.component';
import { ParcelaService } from '../../services/parcela.service';
import { AuthService } from '../../services/auth.service';
import { Parcela } from '../../models/parcela.model';

@Component({
    selector: 'app-parcela',
    standalone: true,
    templateUrl: './parcela.component.html',
    styleUrls: ['./parcela.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        LayoutComponent
    ]
})
export class ParcelaComponent implements OnInit, AfterViewInit {
    itensPorPagina: number = 5;

    parcelas: Parcela[] = [];
    displayedColumns: string[] = ['proprietario', 'usoDaTerra', 'data', 'acoes'];

    dataSource = new MatTableDataSource<Parcela>([]);
    filtroProprietario: string = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private parcelaService: ParcelaService,
        public authService: AuthService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.carregarDados();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    carregarDados(): void {
        this.parcelaService.listarTodos().subscribe({
            next: (data) => {
                this.parcelas = data;
                this.dataSource.data = data;
            },
            error: (e) => {
                console.error('Erro ao carregar parcelas:', e);
                this.snackBar.open('Erro ao carregar parcelas.', 'Fechar', { duration: 3000 });
            }
        });
    }

    formatarData(p: Parcela): string {
        if (!p.dataDoEvento) return '-';
        // Considerando ISO YYYY-MM-DD
        const dateArray = p.dataDoEvento.split('-');
        if (dateArray.length >= 3) {
            return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
        }
        return p.dataDoEvento;
    }

    alterarItensPorPagina(): void {
        if (this.paginator) {
            this.paginator._changePageSize(this.itensPorPagina);
        }
    }

    aplicarFiltros(): void {
        const filterValue = this.filtroProprietario;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        this.dataSource.filterPredicate = (data: Parcela, filter: string) => {
            return (data.proprietario || '').toLowerCase().includes(filter);
        };

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    abrirCadastroParcela(): void {
        const dialogRef = this.dialog.open(FormParcelaComponent, {
            width: '70vw',
            height: '85vh',
            maxWidth: '100vw',
            autoFocus: false,
            data: null, // Para criação
            panelClass: 'dialog-parcela',
            disableClose: false
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.carregarDados();
            }
        });
    }

    excluirParcela(parcela: Parcela): void {
        const confirmar = confirm(`Tem certeza que deseja excluir a parcela de ${parcela.proprietario}?`);
        if (!confirmar) return;

        this.parcelaService.deletar(parcela.id!).subscribe({
            next: () => {
                this.snackBar.open('Parcela excluída com sucesso!', 'Fechar', { duration: 3000 });
                this.carregarDados();
            },
            error: () => {
                this.snackBar.open('Erro ao excluir a parcela.', 'Fechar', { duration: 3000 });
            }
        });
    }
}
