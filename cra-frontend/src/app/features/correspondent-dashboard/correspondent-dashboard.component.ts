import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SolicitacaoService } from '../../core/services/solicitacao.service';
import { SolicitacaoStatusService } from '../../core/services/solicitacao-status.service';
import { User } from '../../shared/models/user.model';
import { Solicitacao, SolicitacaoStatus } from '../../shared/models/solicitacao.model';
import { catchError, of } from 'rxjs';

interface ChartData {
  labels: string[];
  values: number[];
  colors: string[];
}

@Component({
  selector: 'app-correspondent-dashboard',
  templateUrl: './correspondent-dashboard.component.html',
  styleUrls: ['./correspondent-dashboard.component.scss']
})
export class CorrespondentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;
  
  solicitacoesPorStatusChart: ChartData = {
    labels: [],
    values: [],
    colors: []
  };

  private statusColors: { [key: string]: string } = {
    // Process and general statuses
    'EM_ANDAMENTO': '#4facfe',
    'PENDENTE': '#ffcc00',
    'CONCLUIDO': '#43e97b',
    'CANCELADO': '#f5576c',
    'SUSPENSO': '#ff9800',
    'ARQUIVADO': '#9e9e9e',
    'FINALIZADO': '#2196f3',
    'ABERTO': '#00bcd4',
    'FECHADO': '#607d8b',
    'NOVO': '#9c27b0',
    
    // Confirmation-related statuses
    'Agurdando Confirmação': '#9c27b0',
    'Agurdando Confirmacao': '#9c27b0',
    'Aguardando Confirmação': '#9c27b0',
    'Aguardando Confirmacao': '#9c27b0',
    
    // Additional common statuses
    'APROVADO': '#8bc34a',
    'REJEITADO': '#e91e63',
    'EM_ANALISE': '#ff9800',
    'ANALISE': '#ff9800',
    'PROCESSANDO': '#3f51b5',
    'ENVIADO': '#009688',
    'RECEBIDO': '#cddc39',
    'ATRASADO': '#f44336',
    'URGENTE': '#ff5722',
    
    // Portuguese variations
    'Em Andamento': '#4facfe',
    'Pendente': '#ffcc00',
    'Concluído': '#43e97b',
    'Cancelado': '#f5576c',
    'Suspenso': '#ff9800',
    'Arquivado': '#9e9e9e',
    'Finalizado': '#2196f3',
    'Aprovado': '#8bc34a',
    'Rejeitado': '#e91e63',
    'Em Análise': '#ff9800',
    'Processando': '#3f51b5',
    'Enviado': '#009688',
    'Recebido': '#cddc39'
  };

  constructor(
    public authService: AuthService,
    private solicitacaoService: SolicitacaoService,
    private solicitacaoStatusService: SolicitacaoStatusService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Get all solicitacao statuses
    this.solicitacaoStatusService.getSolicitacaoStatuses().pipe(
      catchError((error) => {
        console.error('Error fetching solicitacao statuses:', error);
        return of([]);
      })
    ).subscribe({
      next: (statuses: SolicitacaoStatus[]) => {
        console.log('Loaded solicitacao statuses:', statuses);
        // Load solicitacoes by status data
        this.loadSolicitacoesPorStatusData(statuses);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  private loadSolicitacoesPorStatusData(statuses: SolicitacaoStatus[]): void {
    console.log('Loading solicitacoes por status data:', statuses);
    
    if (!statuses || statuses.length === 0) {
      console.log('No statuses found, initializing empty chart');
      // Initialize with empty data
      this.solicitacoesPorStatusChart = {
        labels: ['Nenhum status encontrado'],
        values: [1],
        colors: ['#cccccc']
      };
      this.loading = false;
      return;
    }

    // Get all solicitations for the current correspondent
    this.solicitacaoService.getSolicitacoes().pipe(
      catchError((error) => {
        console.error('Error fetching all solicitacoes:', error);
        return of([]);
      })
    ).subscribe({
      next: (solicitacoes: Solicitacao[]) => {
        console.log(`Fetched ${solicitacoes.length} total solicitacoes`);
        
        // Filter solicitations for the current correspondent
        const correspondentId = this.currentUser?.correspondentId;
        if (correspondentId) {
          solicitacoes = solicitacoes.filter(s => s.correspondente?.id === correspondentId);
          console.log(`Filtered to ${solicitacoes.length} solicitacoes for correspondent ID ${correspondentId}`);
        }
        
        // Group solicitations by status
        const solicitacoesPorStatus: { [key: string]: number } = {};
        
        // Initialize with all known statuses set to 0
        statuses.forEach(status => {
          solicitacoesPorStatus[status.status.trim()] = 0;
        });
        
        // Count solicitations by their actual status
        solicitacoes.forEach(solicitacao => {
          if (solicitacao.statusSolicitacao?.status) {
            const status = solicitacao.statusSolicitacao.status.trim();
            solicitacoesPorStatus[status] = (solicitacoesPorStatus[status] || 0) + 1;
          }
        });
        
        console.log('Grouped solicitacoes por status:', solicitacoesPorStatus);
        
        // Update chart data with distinct colors for each status
        const labels = Object.keys(solicitacoesPorStatus);
        const values = Object.values(solicitacoesPorStatus);
        const colors = labels.map((status, index) => this.getStatusColor(status, index));
        
        this.solicitacoesPorStatusChart = {
          labels: labels,
          values: values,
          colors: colors
        };
        
        console.log('Updated solicitacoesPorStatusChart:', this.solicitacoesPorStatusChart);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading solicitacoes por status data:', error);
        this.loading = false;
      }
    });
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

  // Method to calculate total solicitacoes for pie chart center
  getTotalSolicitacoes(): number {
    return this.solicitacoesPorStatusChart.values.reduce((sum, value) => sum + value, 0);
  }

  // Helper method to get color for a status with fallback to generated colors
  private getStatusColor(status: string, index: number): string {
    // First check if we have a predefined color
    if (this.statusColors[status]) {
      return this.statusColors[status];
    }
    
    // Generate a distinct color based on the index
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607', 
      '#8338EC', '#3A86FF', '#38B000', '#9EF01A', '#FF006E',
      '#8338EC', '#0077B6', '#00B4D8', '#90E0EF', '#007F5F',
      '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653'
    ];
    
    // Return a color from our palette, cycling if necessary
    return colors[index % colors.length];
  }
}