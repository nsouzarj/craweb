import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessoService } from '../../../core/services/processo.service';
import { Processo, ProcessStatus } from '../../../shared/models/processo.model';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss']
})
export class ProcessListComponent implements OnInit {
  processos: Processo[] = [];
  displayedColumns: string[] = ['numeroprocesso', 'parte', 'adverso', 'assunto', 'proceletronico', 'status', 'actions'];
  loading = true;

  constructor(
    private processoService: ProcessoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProcesses();
  }

  loadProcesses(): void {
    this.processoService.getProcessos().subscribe({
      next: (processos) => {
        this.processos = processos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading processes:', error);
        this.loading = false;
        this.snackBar.open('Erro ao carregar processos', 'Fechar', { duration: 5000 });
      }
    });
  }

  getStatusText(status?: ProcessStatus): string {
    if (!status) return 'Indefinido';
    switch (status) {
      case ProcessStatus.EM_ANDAMENTO: return 'Em Andamento';
      case ProcessStatus.SUSPENSO: return 'Suspenso';
      case ProcessStatus.ARQUIVADO: return 'Arquivado';
      case ProcessStatus.FINALIZADO: return 'Finalizado';
      default: return status;
    }
  }

  getStatusClass(status?: ProcessStatus): string {
    if (!status) return '';
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  viewProcess(processo: Processo): void {
    this.router.navigate(['/processos', processo.id]);
  }

  editProcess(processo: Processo): void {
    this.router.navigate(['/processos/editar', processo.id]);
  }
}