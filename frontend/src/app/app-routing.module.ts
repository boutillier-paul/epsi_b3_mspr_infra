import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'form-declare',
    loadChildren: () => import('./pages/form-declare/form-declare.module').then( m => m.FormDeclarePageModule)
  },
  {
    path: 'form-garde',
    loadChildren: () => import('./pages/form-garde/form-garde.module').then( m => m.FormGardePageModule)
  },
  {
    path: 'mes-plantes',
    loadChildren: () => import('./pages/mes-plantes/mes-plantes.module').then( m => m.MesPlantesPageModule)
  },
  {
    path: 'mes-plantes-click',
    loadChildren: () => import('./pages/mes-plantes-click/mes-plantes-click.module').then( m => m.MesPlantesClickPageModule)
  },
  {
    path: 'historique-session',
    loadChildren: () => import('./pages/historique-session/historique-session.module').then( m => m.HistoriqueSessionPageModule)
  },
  {
    path: 'historique-session-click',
    loadChildren: () => import('./pages/historique-session-click/historique-session-click.module').then( m => m.HistoriqueSessionClickPageModule)
  },
  {
    path: 'mes-gardes',
    loadChildren: () => import('./pages/mes-gardes/mes-gardes.module').then( m => m.MesGardesPageModule)
  },
  {
    path: 'mes-gardes-click',
    loadChildren: () => import('./pages/mes-gardes-click/mes-gardes-click.module').then( m => m.MesGardesClickPageModule)
  },
  {
    path: 'form-session',
    loadChildren: () => import('./pages/form-session/form-session.module').then( m => m.FormSessionPageModule)
  },
  {
    path: 'mes-messages',
    loadChildren: () => import('./pages/mes-messages/mes-messages.module').then( m => m.MesMessagesPageModule)
  },
  {
    path: 'advices',
    loadChildren: () => import('./pages/advices/advices.module').then( m => m.AdvicesPageModule)
  },
  {
    path: 'mon-profil',
    loadChildren: () => import('./pages/mon-profil/mon-profil.module').then( m => m.MonProfilPageModule)
  },
  {
    path: 'mes-plantes-gardes',
    loadChildren: () => import('./pages/mes-plantes-gardes/mes-plantes-gardes.module').then( m => m.MesPlantesGardesPageModule)
  },
  {
    path: 'form-modify-advice',
    loadChildren: () => import('./pages/form-modify-advice/form-modify-advice.module').then( m => m.FormModifyAdvicePageModule)
  },
  {
    path: 'form-advice',
    loadChildren: () => import('./pages/form-advice/form-advice.module').then( m => m.FormAdvicePageModule)
  },
  {
    path: 'advice-click',
    loadChildren: () => import('./pages/advice-click/advice-click.module').then( m => m.AdviceClickPageModule)
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
    loadChildren: () => import('./pages/form-modify-user/form-modify-user.module').then( m => m.FormModifyUserPageModule)
  },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
