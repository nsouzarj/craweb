import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { CorrespondenteService } from '../../core/services/correspondente.service';
import { ProcessoService } from '../../core/services/processo.service';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { User } from '../../shared/models/user.model';
import { Correspondente } from '../../shared/models/correspondente.model';
import { Processo } from '../../shared/models/processo.model';
import { Solicitacao } from '../../shared/models/solicitacao.model';
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

interface ChartData {
  labels: string[];
  values: number[];
  colors: string[];
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

  // Chart data
  entityTypeChart: ChartData = {
    labels: ['Usuários', 'Correspondentes', 'Processos', 'Solicitações'],
    values: [0, 0, 0, 0],
    colors: ['#667eea', '#f093fb', '#4facfe', '#43e97b']
  };

  entityStatusChart: ChartData = {
    labels: ['Ativos', 'Inativos', 'Em Andamento', 'Pendentes'],
    values: [0, 0, 0, 0],
    colors: ['#43e97b', '#f5576c', '#4facfe', '#ffcc00']
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
      this.processoService.searchByStatus('EM_ANDAMENTO').pipe(catchError(() => of([])))
    );

    // Add solicitacao requests
    requests.push(
      this.solicitacaoService.getSolicitacoes().pipe(catchError(() => of([]))),
      this.solicitacaoService.searchByStatus('Pendente').pipe(catchError(() => of([])))
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

        // Update chart data
        this.updateChartData();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  private updateChartData(): void {
    // Update entity type chart
    this.entityTypeChart.values = [
      this.stats.totalUsers,
      this.stats.totalCorrespondentes,
      this.stats.totalProcessos,
      this.stats.totalSolicitacoes
    ];

    // Update entity status chart
    this.entityStatusChart.values = [
      this.stats.activeUsers + this.stats.activeCorrespondentes,
      (this.stats.totalUsers - this.stats.activeUsers) + (this.stats.totalCorrespondentes - this.stats.activeCorrespondentes),
      this.stats.processosEmAndamento,
      this.stats.solicitacoesPendentes
    ];
  }

  // Chart helper methods
  getBarHeight(value: number, maxValue: number): string {
    if (maxValue === 0) return '0%';
    return `${(value / maxValue) * 100}%`;
  }

  getMaxValue(values: number[]): number {
    return Math.max(...values, 1); // Return at least 1 to avoid division by zero
  }

  getPieStrokeDasharray(value: number, values: number[]): string {
    const total = values.reduce((sum, val) => sum + val, 0);
    if (total === 0) return '0, 100';
    const percentage = (value / total) * 100;
    return `${percentage}, 100`;
  }

  getPieStrokeDashoffset(index: number, values: number[]): string {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const total = values.reduce((sum, val) => sum + val, 0);
      if (total === 0) return '0';
      offset += (values[i] / total) * 100;
    }
    return `-${offset}`;
  }

  getTotalEntities(): number {
    return this.stats.totalUsers + this.stats.totalCorrespondentes + 
           this.stats.totalProcessos + this.stats.totalSolicitacoes;
  }
}