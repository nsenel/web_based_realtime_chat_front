import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthComponent } from '../app/auth/auth.component';
import { RegisterComponent } from '../app/register/register.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

import { AuthService } from '../app/services/auth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'chat',
    component: ChatRoomComponent
  }];

export const appRoutingProviders: any[] = [
  AuthService
];

// export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

