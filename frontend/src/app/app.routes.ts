import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { AddEmployeeComponent } from './employees/add-employee/add-employee.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';
import { UpdateEmployeeComponent } from './employees/update-employee/update-employee.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'employees', 
    component: EmployeeListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'employees/add', 
    component: AddEmployeeComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'employees/view/:id', 
    component: EmployeeDetailComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'employees/edit/:id', 
    component: UpdateEmployeeComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/employees' }
];