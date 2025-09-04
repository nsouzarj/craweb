import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  toggleTheme(): void {
    console.log('Toggling theme');
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    const isDark = this.themeService.isDarkMode();
    console.log('Checking dark mode:', isDark);
    return isDark;
  }

  getUserRoleText(): string {
    // First check if we have a current user
    if (!this.currentUser) {
      return 'Carregando...';
    }
    
    // Check if authorities exist and is not empty
    if (!this.currentUser.authorities || this.currentUser.authorities.length === 0) {
      return 'Sem permissão';
    }
    
    // Get the first role (primary role)
    const role = this.currentUser.authorities[0];
    
    // Handle null or undefined role
    if (!role) {
      return 'Indefinido';
    }
    
    // Ensure role is a string before calling string methods
    if (typeof role !== 'string') {
      return 'Indefinido';
    }
    
    // Map role to display text
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_ADVOGADO':
        return 'Advogado';
      case 'ROLE_CORRESPONDENTE':
        return 'Correspondente';
      default:
        // Return the role without ROLE_ prefix if it's not a standard role
        return role.startsWith('ROLE_') ? role.substring(5) : role;
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
  }
}