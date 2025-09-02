import { Component, OnInit } from '@angular/core';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { Solicitacao, SolicitacaoStatus } from '../../../shared/models/solicitacao.model';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  displayedColumns: string[] = ['id', 'complemento', 'tipoSolicitacao', 'processo', 'correspondente', 'status', 'actions'];
  loading = true;

  constructor(private solicitacaoService: SolicitacaoService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.solicitacaoService.getSolicitacoes().subscribe({
      next: (solicitacoes) => {
        this.solicitacoes = solicitacoes;
        this.loading = false;
      },
      error: () => {
        this.solicitacoes = [];
        this.loading = false;
      }
    });
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