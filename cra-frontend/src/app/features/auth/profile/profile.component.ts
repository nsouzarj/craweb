import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Try to get fresh user data from the server
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        // Ensure emailprincipal is properly set
        this.currentUser = this.normalizeUser(user);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile from server:', error);
        // If server request fails, use cached data but try to refresh it
        this.loadCachedUserData();
      }
    });
  }

  /**
   * Normalize user data to ensure emailprincipal is properly set
   * Handles potential case sensitivity or naming differences from backend
   */
  private normalizeUser(user: User): User {
    // If emailprincipal is not set but emailPrincipal is, use that
    if (!user.emailprincipal && (user as any).emailPrincipal) {
      return {
        ...user,
        emailprincipal: (user as any).emailPrincipal
      };
    }
    
    // If nomecompleto is not set but nomeCompleto is, use that
    if (!user.nomecompleto && (user as any).nomeCompleto) {
      return {
        ...user,
        nomecompleto: (user as any).nomeCompleto
      };
    }
    
    // Fallback: if nomecompleto is still missing, use login as the name
    if (!user.nomecompleto) {
      return {
        ...user,
        nomecompleto: user.login || 'Usuário'
      };
    }
    
    return user;
  }

  private loadCachedUserData(): void {
    // Get cached user data
    let user = this.authService.currentUserValue;
    
    // Normalize the user data
    if (user) {
      user = this.normalizeUser(user);
      this.currentUser = user;
    }
    
    // If we have cached data, we're done
    if (this.currentUser) {
      this.loading = false;
      return;
    }
    
    // If no cached data, try to get it from localStorage directly
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        let user = JSON.parse(storedUser);
        user = this.normalizeUser(user);
        this.currentUser = user;
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }
    
    this.loading = false;
  }

  getUserRoleText(): string {
    if (!this.currentUser) {
      return 'Usuário não identificado';
    }
    
    if (!this.currentUser.authorities || this.currentUser.authorities.length === 0) {
      return 'Sem permissão';
    }
    
    const role = this.currentUser.authorities[0];
    
    if (!role) {
      return 'Indefinido';
    }
    
    // Ensure role is a string before calling string methods
    if (typeof role !== 'string') {
      return 'Indefinido';
    }
    
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_ADVOGADO':
        return 'Advogado';
      case 'ROLE_CORRESPONDENTE':
        return 'Correspondente';
      default:
        return role.startsWith('ROLE_') ? role.substring(5) : role;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}