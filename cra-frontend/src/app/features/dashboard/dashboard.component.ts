import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { CorrespondenteService } from '../../core/services/correspondente.service';
import { ProcessoService } from '../../core/services/processo.service';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { User } from '../../shared/models/user.model';
import { Correspondente } from '../../shared/models/correspondente.model';
import { Processo, ProcessStatus } from '../../shared/models/processo.model';
import { Solicitacao, SolicitacaoStatus } from '../../shared/models/solicitacao.model';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCorrespondentes: number;
  activeCorrespondentes: number;
  totalProcessos: number;
  processosEmAndamento: number;
  totalSolicitacoes: number;
  solicitacoesPendentes: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalCorrespondentes: 0,
    activeCorrespondentes: 0,
    totalProcessos: 0,
    processosEmAndamento: 0,
    totalSolicitacoes: 0,
    solicitacoesPendentes: 0
  };

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private correspondenteService: CorrespondenteService,
    private processoService: ProcessoService,
    private solicitacaoService: SolicitacaoService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  canViewUsers(): boolean {
    return this.authService.isAdmin() || this.authService.isAdvogado();
  }

  private loadDashboardData(): void {
    const requests = [];

    // Add user-related requests for admin/advogado
    if (this.canViewUsers()) {
      requests.push(
        this.userService.getUsers().pipe(catchError(() => of([]))),
        this.userService.getActiveUsers().pipe(catchError(() => of([])))
      );
    } else {
      requests.push(of([]), of([])); // Placeholder values
    }

    // Add correspondent requests
    requests.push(
      this.correspondenteService.getCorrespondentes().pipe(catchError(() => of([]))),
      this.correspondenteService.getActiveCorrespondentes().pipe(catchError(() => of([])))
    );

    // Add process requests
    requests.push(
      this.processoService.getProcessos().pipe(catchError(() => of([]))),
      this.processoService.searchByStatus(ProcessStatus.EM_ANDAMENTO).pipe(catchError(() => of([])))
    );

    // Add solicitacao requests
    requests.push(
      this.solicitacaoService.getSolicitacoes().pipe(catchError(() => of([]))),
      this.solicitacaoService.searchByStatus(SolicitacaoStatus.PENDENTE).pipe(catchError(() => of([])))
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const [
          allUsers, activeUsers,
          allCorrespondentes, activeCorrespondentes,
          allProcessos, processosEmAndamento,
          allSolicitacoes, solicitacoesPendentes
        ] = results as [User[], User[], Correspondente[], Correspondente[], Processo[], Processo[], Solicitacao[], Solicitacao[]];

        this.stats = {
          totalUsers: allUsers.length,
          activeUsers: activeUsers.length,
          totalCorrespondentes: allCorrespondentes.length,
          activeCorrespondentes: activeCorrespondentes.length,
          totalProcessos: allProcessos.length,
          processosEmAndamento: processosEmAndamento.length,
          totalSolicitacoes: allSolicitacoes.length,
          solicitacoesPendentes: solicitacoesPendentes.length
        };

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }
}