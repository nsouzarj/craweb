import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { User, UserType } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['id', 'login', 'nomeCompleto', 'emailPrincipal', 'tipo', 'ativo', 'dataEntrada', 'actions'];
  loading = true;
  
  searchControl = new FormControl('');
  typeFilterControl = new FormControl('');
  statusFilterControl = new FormControl('');
  
  UserType = UserType;
  currentUserId: number | undefined;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    public permissionService: PermissionService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.currentUserValue?.id;
    this.loadUsers();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  setupFilters(): void {
    // Search filter
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.applyFilters();
      });

    // Type filter
    this.typeFilterControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    // Status filter
    this.statusFilterControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (user: User, filter: string): boolean => {
      const searchTerm = this.searchControl.value?.toLowerCase() || '';
      const typeFilter = this.typeFilterControl.value;
      const statusFilter = this.statusFilterControl.value;

      // Search filter
      const matchesSearch = !searchTerm || 
        user.login.toLowerCase().includes(searchTerm) ||
        user.nomecompleto.toLowerCase().includes(searchTerm) ||
        (user.emailprincipal ? user.emailprincipal.toLowerCase().includes(searchTerm) : false);

      // Type filter
      const matchesType = !typeFilter || typeFilter === '' || user.tipo === Number(typeFilter);

      // Status filter - fixed logic
      let statusFilterValue: boolean | null = null;
      if (statusFilter === 'true') {
        statusFilterValue = true;
      } else if (statusFilter === 'false') {
        statusFilterValue = false;
      }
      
      const matchesStatus = !statusFilter || statusFilter === '' || 
                           (statusFilterValue !== null && user.ativo === statusFilterValue);

      return Boolean(matchesSearch && matchesType && matchesStatus);
    };

    this.dataSource.filter = 'trigger'; // Trigger filter
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.typeFilterControl.setValue('');
    this.statusFilterControl.setValue('');
  }

  getUserTypeText(tipo: UserType): string {
    switch (tipo) {
      case UserType.ADMIN:
        return 'Administrador';
      case UserType.ADVOGADO:
        return 'Advogado';
      case UserType.CORRESPONDENTE:
        return 'Correspondente';
      default:
        return 'Indefinido';
    }
  }

  getUserTypeClass(tipo: UserType): string {
    switch (tipo) {
      case UserType.ADMIN:
        return 'type-admin';
      case UserType.ADVOGADO:
        return 'type-advogado';
      case UserType.CORRESPONDENTE:
        return 'type-correspondente';
      default:
        return '';
    }
  }

  viewUser(user: User): void {
    this.router.navigate(['/usuarios', user.id]);
  }

  editUser(user: User): void {
    this.router.navigate(['/usuarios/editar', user.id]);
  }

  toggleUserStatus(user: User): void {
    // Check if user has a valid ID
    if (!user.id) return;

    const action = user.ativo ? 'desativar' : 'ativar';
    const service = user.ativo ? 
      this.userService.deactivateUser(user.id) : 
      this.userService.activateUser(user.id);

    service.subscribe({
      next: (updatedUser) => {
        const index = this.dataSource.data.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.dataSource.data[index] = updatedUser;
          this.dataSource._updateChangeSubscription();
        }
        
        this.snackBar.open(`Usuário ${action}do com sucesso!`, 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error(`Error ${action}ing user:`, error);
        this.snackBar.open(`Erro ao ${action} usuário`, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteUser(user: User): void {
    // Check if user has a valid ID
    if (!user.id) {
      this.snackBar.open('Não foi possível excluir o usuário: ID inválido', 'Fechar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o usuário "${user.nomecompleto}"?`,
        confirmText: 'SIM',
        cancelText: 'NÃO'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id!).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
            this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.snackBar.open('Erro ao excluir usuário', 'Fechar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}