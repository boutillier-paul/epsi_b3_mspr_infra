import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth/auth.guard';
import { AuthRoleGuard } from './guard/authrole/authrole.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule), canActivate: [AuthRoleGuard]
  },
  {
    path: 'form-declare',
    loadChildren: () => import('./pages/form-declare/form-declare.module').then( m => m.FormDeclarePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'form-garde',
    loadChildren: () => import('./pages/form-garde/form-garde.module').then( m => m.FormGardePageModule), canActivate: [AuthRoleGuard]
  },
  {
    path: 'mes-plantes',
    loadChildren: () => import('./pages/mes-plantes/mes-plantes.module').then( m => m.MesPlantesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'mes-plantes-click',
    loadChildren: () => import('./pages/mes-plantes-click/mes-plantes-click.module').then( m => m.MesPlantesClickPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'historique-session',
    loadChildren: () => import('./pages/historique-session/historique-session.module').then( m => m.HistoriqueSessionPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'historique-session-click',
    loadChildren: () => import('./pages/historique-session-click/historique-session-click.module').then( m => m.HistoriqueSessionClickPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'mes-gardes',
    loadChildren: () => import('./pages/mes-gardes/mes-gardes.module').then( m => m.MesGardesPageModule), canActivate: [AuthRoleGuard]
  },
  {
    path: 'mes-gardes-click',
    loadChildren: () => import('./pages/mes-gardes-click/mes-gardes-click.module').then( m => m.MesGardesClickPageModule), canActivate: [AuthRoleGuard]
  },
  {
    path: 'form-session',
    loadChildren: () => import('./pages/form-session/form-session.module').then( m => m.FormSessionPageModule), canActivate: [AuthRoleGuard]
  },
  {
    path: 'mes-messages',
    loadChildren: () => import('./pages/mes-messages/mes-messages.module').then( m => m.MesMessagesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'advices',
    loadChildren: () => import('./pages/advices/advices.module').then( m => m.AdvicesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'mon-profil',
    loadChildren: () => import('./pages/mon-profil/mon-profil.module').then( m => m.MonProfilPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'mes-plantes-gardes',
    loadChildren: () => import('./pages/mes-plantes-gardes/mes-plantes-gardes.module').then( m => m.MesPlantesGardesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'form-modify-advice',
    loadChildren: () => import('./pages/form-modify-advice/form-modify-advice.module').then( m => m.FormModifyAdvicePageModule), canActivate: [AuthRoleGuard]
  },
  {
    path: 'form-advice',
    loadChildren: () => import('./pages/form-advice/form-advice.module').then( m => m.FormAdvicePageModule), canActivate: [AuthRoleGuard]
  },
  {
    path: 'advice-click',
    loadChildren: () => import('./pages/advice-click/advice-click.module').then( m => m.AdviceClickPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'mentions-legales',
    loadChildren: () => import('./pages/mentions-legales/mentions-legales.module').then( m => m.MentionsLegalesPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'form-modify-user',
    loadChildren: () => import('./pages/form-modify-user/form-modify-user.module').then( m => m.FormModifyUserPageModule), canActivate: [AuthGuard]
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
