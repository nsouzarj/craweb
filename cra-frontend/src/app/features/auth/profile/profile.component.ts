import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { User } from '@shared/models/user.model';

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
    this.currentUser = this.authService.currentUserValue;
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