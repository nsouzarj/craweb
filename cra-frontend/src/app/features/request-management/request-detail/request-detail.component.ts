import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { Solicitacao, SolicitacaoStatus } from '../../../shared/models/solicitacao.model';
import { ProcessStatus } from '../../../shared/models/processo.model';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  solicitacao: Solicitacao | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoService: SolicitacaoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const requestId = +params['id'];
      if (requestId) {
        this.loadRequest(requestId);
      }
    });
  }

  private loadRequest(requestId: number): void {
    this.solicitacaoService.getSolicitacaoById(requestId).subscribe({
      next: (solicitacao) => {
        this.solicitacao = solicitacao;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading solicitacao:', error);
        this.snackBar.open('Erro ao carregar solicitação', 'Fechar', { duration: 5000 });
        this.loading = false;
        this.goBack();
      }
    });
  }

  editRequest(): void {
    if (this.solicitacao?.id) {
      this.router.navigate(['/solicitacoes/editar', this.solicitacao.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/solicitacoes']);
  }

  getStatusText(status: SolicitacaoStatus | undefined): string {
    switch (status) {
      case SolicitacaoStatus.PENDENTE:
        return 'Pendente';
      case SolicitacaoStatus.EM_ANDAMENTO:
        return 'Em Andamento';
      case SolicitacaoStatus.FINALIZADA:
        return 'Finalizada';
      case SolicitacaoStatus.CANCELADA:
        return 'Cancelada';
      default:
        return 'Pendente';
    }
  }

  getProcessStatusText(status: string | undefined): string {
    switch (status) {
      case ProcessStatus.EM_ANDAMENTO:
        return 'Em Andamento';
      case ProcessStatus.SUSPENSO:
        return 'Suspenso';
      case ProcessStatus.ARQUIVADO:
        return 'Arquivado';
      case ProcessStatus.FINALIZADO:
        return 'Finalizado';
      default:
        return status || 'Não informado';
    }
  }

  getStatusClass(status: SolicitacaoStatus | undefined): string {
    switch (status) {
      case SolicitacaoStatus.PENDENTE:
        return 'status-pendente';
      case SolicitacaoStatus.EM_ANDAMENTO:
        return 'status-andamento';
      case SolicitacaoStatus.FINALIZADA:
        return 'status-finalizada';
      case SolicitacaoStatus.CANCELADA:
        return 'status-cancelada';
      default:
        return 'status-pendente';
    }
  }
}