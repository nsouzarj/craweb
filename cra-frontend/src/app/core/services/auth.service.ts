import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, JwtResponse, UserType } from '../../shared/models/user.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { environment } from '../../../environments/environment';

/**
 * Service for authentication and user session management in the CRA system
 * Handles user login, registration, token management, and user role verification
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Gets the current user value from the BehaviorSubject
   * 
   * @returns The current user object or null if not authenticated
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Checks if the user is currently authenticated
   * 
   * @returns True if the user is authenticated, false otherwise
   */
  public get isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Gets the role of the current user
   * 
   * @returns The user's role or null if not available
   */
  public get userRole(): string | null {
    const user = this.currentUserValue;
    if (!user || !user.authorities || user.authorities.length === 0) {
      return null;
    }
    return user.authorities[0];
  }

  /**
   * Checks if the current user has a specific role
   * 
   * @param role The role to check for
   * @returns True if the user has the specified role, false otherwise
   */
  public hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.authorities?.includes(role) || false;
  }

  /**
   * Checks if the current user is an administrator
   * 
   * @returns True if the user is an administrator, false otherwise
   */
  public isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  /**
   * Checks if the current user is a lawyer (Advogado)
   * 
   * @returns True if the user is a lawyer, false otherwise
   */
  public isAdvogado(): boolean {
    return this.hasRole('ROLE_ADVOGADO');
  }

  /**
   * Checks if the current user is a correspondent (Correspondente)
   * 
   * @returns True if the user is a correspondent, false otherwise
   */
  public isCorrespondente(): boolean {
    return this.hasRole('ROLE_CORRESPONDENTE');
  }

  /**
   * Authenticates a user with the provided credentials
   * 
   * @param credentials The login credentials containing username and password
   * @returns Observable containing the JWT response with token and user information
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          // Store JWT token
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          // Create user object from response
          const user: User = {
            id: response.id,
            login: response.login,
            nomecompleto: response.nomecompleto,
            emailprincipal: response.emailprincipal,
            tipo: response.tipo,
            ativo: true,
            authorities: response.roles
          };
          
          // Store user and notify subscribers
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Registers a new user in the system
   * 
   * @param userData The user registration data
   * @returns Observable containing the API response
   */
  register(userData: RegisterRequest): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, userData, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Refreshes the JWT token using the refresh token
   * 
   * @returns Observable containing the new JWT response with refreshed token
   */
  refreshToken(): Observable<JwtResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<JwtResponse>(`${this.apiUrl}/refresh`, 
      { refreshToken }, { headers })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Retrieves the current user's information from the server
   * 
   * @returns Observable containing the current user's information
   */
  getCurrentUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<User>(`${this.apiUrl}/me`, { headers })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Validates the current JWT token
   * 
   * @returns Observable for the validation response
   */
  validateToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get(`${this.apiUrl}/validate`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs out the current user and clears all authentication data
   */
  logout(): void {
    // Remove stored data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    // Notify subscribers
    this.currentUserSubject.next(null);
    
    // Redirect to login
    this.router.navigate(['/login']);
  }

  /**
   * Gets the current JWT token from local storage
   * 
   * @returns The JWT token or null if not available
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Gets the current refresh token from local storage
   * 
   * @returns The refresh token or null if not available
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Checks if a JWT token is expired
   * 
   * @param token The JWT token to check
   * @returns True if the token is expired, false otherwise
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Handles HTTP errors for authentication operations
   * 
   * @param error The error object
   * @returns Observable that throws the error
   */
  private handleError(error: any) {
    console.error('Auth Service Error:', error);
    
    if (error.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    }
    
    return throwError(() => error);
  }
}