# CRA Frontend - Angular 18

Frontend web application for the CRA (Correspondente Responsável por Atos) system built with Angular 18 and Angular Material.

## 🚀 Features


- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete CRUD operations for users (Admin/Advogado access)
- **Correspondent Management**: Manage legal correspondents with search and filtering
- **Process Management**: Handle legal processes with comprehensive tracking
- **Request Management**: Manage service requests with status tracking
- **Responsive Design**: Mobile-friendly interface with Angular Material
- **Real-time Dashboard**: Statistics and quick actions overview

## 🛠️ Technologies

- **Angular 18**: Latest Angular framework
- **Angular Material**: Modern UI components
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming
- **SCSS**: Advanced styling

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 18)
- **CRA Backend** running on `http://localhost:8080`

## 🔧 Installation

1. **Clone or navigate to the frontend directory:**
   ```bash
   cd cra-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally (if not already installed):**
   ```bash
   npm install -g @angular/cli@18
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

### Production Build

```bash
npm run build
# or
ng build --configuration production
```

Built files will be in the `dist/` directory.

## 🔐 Default Login Credentials

Use the same credentials configured in your backend:

- **Admin**: admin / admin123
- **Advogado**: advogado / senha123
- **Correspondente**: correspondente / senha123

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                     # Core functionality
│   │   ├── guards/               # Route guards
│   │   ├── interceptors/         # HTTP interceptors
│   │   └── services/             # Core services
│   ├── features/                 # Feature modules
│   │   ├── auth/                 # Authentication
│   │   ├── dashboard/            # Dashboard
│   │   ├── user-management/      # User management
│   │   ├── correspondent-management/  # Correspondent management
│   │   ├── process-management/   # Process management
│   │   └── request-management/   # Request management
│   ├── shared/                   # Shared components and utilities
│   │   ├── components/           # Reusable components
│   │   └── models/               # TypeScript interfaces
│   ├── app-routing.module.ts     # Main routing
│   ├── app.component.ts          # Root component
│   └── app.module.ts             # Root module
├── assets/                       # Static assets
├── styles.scss                   # Global styles
└── index.html                    # Main HTML file
```

## 🎯 Key Features

### Authentication System
- JWT token management with automatic refresh
- Role-based access control (Admin, Advogado, Correspondente)
- Protected routes with guards
- Automatic token expiration handling

### User Management (Admin/Advogado only)
- Create, read, update, delete users
- Search by login, name, or type
- Activate/deactivate users
- Role assignment

### Correspondent Management
- Full CRUD operations for correspondents
- Search by OAB, CPF/CNPJ, name, type
- Address management
- Active/inactive status control

### Process Management
- Create and manage legal processes
- Search by number, party, adverse party, subject
- Filter by status, comarca, or orgao
- Process statistics

### Request Management
- Create and track service requests
- Link requests to processes and correspondents
- Status tracking (Pending, In Progress, Completed, Cancelled)
- Due date management

## 🔧 Configuration

### API Endpoint Configuration

The backend API URL is configured in each service. To change it:

1. Update the `apiUrl` property in service files:
   - `src/app/core/services/auth.service.ts`
   - `src/app/core/services/user.service.ts`
   - And other service files

2. Default backend URL: `http://localhost:8080`

### Environment Configuration

Create environment files for different configurations:

```typescript
// src/environments/environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## 🚨 Common Issues

### Backend Connection Issues
- Ensure the CRA backend is running on `http://localhost:8080`
- Check CORS configuration in the backend
- Verify API endpoints are accessible

### Authentication Issues
- Clear browser localStorage if experiencing login issues
- Check JWT token expiration
- Verify user credentials in the backend database

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Angular CLI version: `ng version`
- Ensure all peer dependencies are satisfied

## 🎨 Customization

### Theming
The application uses Angular Material theming. Customize colors in `src/styles.scss`:

```scss
$cra-frontend-primary: mat-palette($mat-indigo);
$cra-frontend-accent: mat-palette($mat-pink, A200, A100, A400);
```

### Adding New Features
1. Create feature modules under `src/app/features/`
2. Add routing in `src/app/app-routing.module.ts`
3. Add navigation items in `src/app/shared/components/layout/sidenav/sidenav.component.ts`

## 📱 Mobile Support

The application is fully responsive and supports mobile devices with:
- Responsive grid layouts
- Touch-friendly interface
- Mobile-optimized navigation
- Adaptive form layouts

## 🐳 Docker Deployment

This application can be containerized using Docker for easy deployment and scalability.

For detailed instructions on Docker deployment, please refer to:
- [DOCKER.md](DOCKER.md) (English)
- [DOCKER.pt.md](DOCKER.pt.md) (Portuguese)

### Quick Start

```bash
# Build the Docker image
docker build -t cra-frontend .

# Run the container
docker run -d -p 4200:80 --name cra-frontend-app cra-frontend
```

The application will be available at `http://localhost:4200`

## 🧪 Testing

```
# Run unit tests
npm test

# Run e2e tests
npm run e2e
```

## 📦 Dependencies

Key dependencies include:
- **@angular/core**: ^18.0.0
- **@angular/material**: ^18.0.0
- **@angular/cdk**: ^18.0.0
- **rxjs**: ~7.8.0
- **typescript**: ~5.4.0

## 🤝 Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Implement proper error handling
4. Add appropriate comments
5. Test your changes

## 📄 License

This project is part of the CRA system for legal correspondent management.

## 🆘 Support

For issues and questions:
1. Check the backend is running and accessible
2. Verify user permissions and roles
3. Check browser console for errors
4. Review network requests in developer tools

## 🔄 Updates

To update Angular and dependencies:

```bash
# Update Angular
ng update @angular/core @angular/cli

# Update Angular Material
ng update @angular/material

# Update all dependencies
npm update

