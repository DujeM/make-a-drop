import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropCreateComponent } from './components/drop-create/drop-create.component';
import { DropFindComponent } from './components/drop-find/drop-find.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'create',
    component: DropCreateComponent
  },
  {
    path: 'find',
    component: DropFindComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
