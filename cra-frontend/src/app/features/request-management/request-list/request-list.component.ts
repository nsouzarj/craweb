import { Component, OnInit } from '@angular/core';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { SolicitacaoStatusService } from '../../../core/services/solicitacao-status.service';
import { ProcessoService } from '../../../core/services/processo.service';
import { ComarcaService } from '../../../core/services/comarca.service';
import { OrgaoService } from '../../../core/services/orgao.service';
import { Solicitacao, SolicitacaoStatus } from '../../../shared/models/solicitacao.model';
import { Processo } from '../../../shared/models/processo.model';
import { Comarca } from '../../../shared/models/comarca.model';
import { Orgao } from '../../../shared/models/orgao.model';
import { AuthService } from '@/app/core/services/auth.service';
import { PermissionService } from '@/app/core/services/permission.service'; // Added PermissionService

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  filteredSolicitacoes: Solicitacao[] = [];
  displayedColumns: string[] = ['id', 'complemento', 'tipoSolicitacao', 'processo', 'correspondente', 'status', 'actions'];
  loading = true;
  statuses: SolicitacaoStatus[] = [];
  
  // Filter properties
  filterStatus: string = '';
  filterSearch: string = '';
  filterProcesso: string = '';
  filterComarca: number | null = null;
  filterOrgao: number | null = null;
  
  // Filter options
  processos: Processo[] = [];
  comarcas: Comarca[] = [];
  orgaos: Orgao[] = [];

  constructor(
    private solicitacaoService: SolicitacaoService,
    private solicitacaoStatusService: SolicitacaoStatusService,
    private processoService: ProcessoService,
    private comarcaService: ComarcaService,
    private orgaoService: OrgaoService,
    public authService: AuthService,
    public permissionService: PermissionService   // Added PermissionService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadStatuses();
    this.loadFilterOptions();
  }

  loadRequests(): void {
    this.solicitacaoService.getSolicitacoes().subscribe({
      next: (solicitacoes) => {
        this.solicitacoes = solicitacoes;
        this.filteredSolicitacoes = solicitacoes;
        this.loading = false;
      },
      error: () => {
        this.solicitacoes = [];
        this.filteredSolicitacoes = [];
        this.loading = false;
      }
    });
  }

  loadStatuses(): void {
    this.solicitacaoStatusService.getSolicitacaoStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
        // Log statuses for debugging
        console.log('Loaded statuses:', statuses);
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
      }
    });
  }

  loadFilterOptions(): void {
    // Load processos
    this.processoService.getProcessos().subscribe({
      next: (processos) => {
        this.processos = processos;
      },
      error: (error) => {
        console.error('Error loading processos:', error);
      }
    });

    // Load comarcas
    this.comarcaService.getComarcas().subscribe({
      next: (comarcas) => {
        this.comarcas = comarcas;
      },
      error: (error) => {
        console.error('Error loading comarcas:', error);
      }
    });

    // Load orgaos
    this.orgaoService.getOrgaos().subscribe({
      next: (orgaos) => {
        this.orgaos = orgaos;
      },
      error: (error) => {
        console.error('Error loading orgaos:', error);
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-pendente';
    
    // Map status values to CSS classes
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'status-pendente';
      case 'em andamento':
      case 'em_andamento':
        return 'status-andamento';
      case 'finalizada':
        return 'status-finalizada';
      case 'cancelada':
        return 'status-cancelada';
      default:
        return 'status-pendente';
    }
  }

  applyFilter(): void {
    console.log('Applying filters:', {
      status: this.filterStatus,
      search: this.filterSearch,
      processo: this.filterProcesso,
      comarca: this.filterComarca,
      orgao: this.filterOrgao
    });
    
    this.filteredSolicitacoes = this.solicitacoes.filter(solicitacao => {
      // Log each solicitacao for debugging
      console.log('Checking solicitacao:', solicitacao);
      
      // Filter by status
      const statusMatch = this.filterStatus ? 
        solicitacao.statusSolicitacao?.status === this.filterStatus : true;
      
      // Filter by search term (in complemento field)
      const searchMatch = this.filterSearch ? 
        solicitacao.complemento?.toLowerCase().includes(this.filterSearch.toLowerCase()) : true;
      
      // Filter by processo
      const processoMatch = this.filterProcesso ? 
        solicitacao.processo?.numeroprocesso?.toLowerCase().includes(this.filterProcesso.toLowerCase()) : true;
      
      // Filter by comarca
      const comarcaMatch = this.filterComarca ? 
        solicitacao.processo?.comarca?.id === this.filterComarca : true;
      
      // Filter by orgao
      const orgaoMatch = this.filterOrgao ? 
        solicitacao.processo?.orgao?.id === this.filterOrgao : true;
      
      console.log('Filter results:', { statusMatch, searchMatch, processoMatch, comarcaMatch, orgaoMatch });
      
      return statusMatch && searchMatch && processoMatch && comarcaMatch && orgaoMatch;
    });
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterSearch = '';
    this.filterProcesso = '';
    this.filterComarca = null;
    this.filterOrgao = null;
    this.filteredSolicitacoes = this.solicitacoes;
  }
  
  // Added delete request method
  deleteRequest(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      this.solicitacaoService.deleteSolicitacao(id).subscribe({
        next: () => {
          // Remove the deleted request from the lists
          this.solicitacoes = this.solicitacoes.filter(s => s.id !== id);
          this.filteredSolicitacoes = this.filteredSolicitacoes.filter(s => s.id !== id);
          console.log('Solicitação excluída com sucesso');
        },
        error: (error) => {
          console.error('Erro ao excluir solicitação:', error);
          alert('Erro ao excluir solicitação');
        }
      });
    }
  }
}