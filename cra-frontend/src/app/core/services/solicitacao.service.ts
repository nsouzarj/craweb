import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Solicitacao, SolicitacaoStatus } from '../../shared/models/solicitacao.model';
import { environment } from '../../../environments/environment';

/**
 * Service for managing service requests in the CRA system
 * Provides CRUD operations and request management functionality
 */
@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private apiUrl = `${environment.apiUrl}/api/solicitacoes`;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all service requests from the system
   * 
   * @returns Observable containing array of service requests
   */
  getSolicitacoes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a specific service request by ID
   * 
   * @param id The ID of the service request to retrieve
   * @returns Observable containing the requested service request
   */
  getSolicitacaoById(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new service request in the system
   * 
   * @param solicitacao The service request object to create
   * @returns Observable containing the created service request
   */
  createSolicitacao(solicitacao: Solicitacao): Observable<Solicitacao> {
    console.log(solicitacao);
    return this.http.post<Solicitacao>(this.apiUrl, solicitacao)
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing service request
   * 
   * @param id The ID of the service request to update
   * @param solicitacao The updated service request data
   * @returns Observable containing the updated service request
   */
  updateSolicitacao(id: number, solicitacao: Solicitacao): Observable<Solicitacao> {
        console.log(solicitacao);
    return this.http.put<Solicitacao>(`${this.apiUrl}/${id}`, solicitacao)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a service request from the system
   * 
   * @param id The ID of the service request to delete
   * @returns Observable for the delete operation
   */
  deleteSolicitacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Searches for service requests by status
   * 
   * @param status The service request status to search for
   * @returns Observable containing array of matching service requests
   */
  searchByStatus(status: string): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/buscar/status/${status}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Searches for service requests by correspondent
   * 
   * @param correspondenteId The correspondent ID to search for
   * @returns Observable containing array of matching service requests
   */
  searchByCorrespondente(correspondenteId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/buscar/correspondente/${correspondenteId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Searches for service requests by process
   * 
   * @param processoId The process ID to search for
   * @returns Observable containing array of matching service requests
   */
  searchByProcesso(processoId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/buscar/processo/${processoId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Searches for service requests by type
   * 
   * @param tipo The service request type to search for
   * @returns Observable containing array of matching service requests
   */
  searchByTipo(tipo: string): Observable<Solicitacao[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/buscar/tipo`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Searches for service requests by deadline period
   * 
   * @param dataInicio The start date for the deadline period
   * @param dataFim The end date for the deadline period
   * @returns Observable containing array of matching service requests
   */
  searchByPrazo(dataInicio: string, dataFim: string): Observable<Solicitacao[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/buscar/prazo`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves service request statistics by status
   * 
   * @param status The service request status to get statistics for
   * @returns Observable containing the count of service requests with the specified status
   */
  getStatusStatistics(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/estatisticas/status/${status}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all pending service requests
   * 
   * @returns Observable containing array of pending service requests
   */
  getPendingRequests(): Observable<Solicitacao[]> {
    // Assuming 'Pendente' is the pending status, this should be updated based on actual status values from backend
    return this.searchByStatus('Pendente');
  }

  /**
   * Retrieves all overdue service requests
   * 
   * @returns Observable containing array of overdue service requests
   */
  getOverdueRequests(): Observable<Solicitacao[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/vencidas?data=${today}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all available service request statuses
   * 
   * @returns Observable containing array of service request statuses
   */
  getSolicitacaoStatuses(): Observable<SolicitacaoStatus[]> {
    return this.http.get<SolicitacaoStatus[]>(`${environment.apiUrl}/api/status-solicitacao`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors for all service methods
   * 
   * @param error The error object
   * @returns Observable that throws the error
   */
  private handleError(error: any): Observable<never> {
    console.error('Solicitacao Service Error:', error);
    throw error;
  }
}