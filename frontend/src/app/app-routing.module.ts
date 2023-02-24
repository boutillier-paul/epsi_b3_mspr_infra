import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'form-declare',
    loadChildren: () => import('./form-declare/form-declare.module').then( m => m.FormDeclarePageModule)
  },
  {
    path: 'form-garde',
    loadChildren: () => import('./form-garde/form-garde.module').then( m => m.FormGardePageModule)
  },
  {
    path: 'mes-plantes',
    loadChildren: () => import('./mes-plantes/mes-plantes.module').then( m => m.MesPlantesPageModule)
  },
  {
    path: 'mes-plantes-click',
    loadChildren: () => import('./mes-plantes-click/mes-plantes-click.module').then( m => m.MesPlantesClickPageModule)
  },
  {
    path: 'historique-session',
    loadChildren: () => import('./historique-session/historique-session.module').then( m => m.HistoriqueSessionPageModule)
  },
  {
    path: 'historique-session-click',
    loadChildren: () => import('./historique-session-click/historique-session-click.module').then( m => m.HistoriqueSessionClickPageModule)
  },
  {
    path: 'mes-gardes',
    loadChildren: () => import('./mes-gardes/mes-gardes.module').then( m => m.MesGardesPageModule)
  },
  {
    path: 'mes-gardes-click',
    loadChildren: () => import('./mes-gardes-click/mes-gardes-click.module').then( m => m.MesGardesClickPageModule)
  },
  {
    path: 'form-session',
    loadChildren: () => import('./form-session/form-session.module').then( m => m.FormSessionPageModule)
  },
  {
    path: 'mes-messages',
    loadChildren: () => import('./mes-messages/mes-messages.module').then( m => m.MesMessagesPageModule)
  },
  {
    path: 'advices',
    loadChildren: () => import('./advices/advices.module').then( m => m.AdvicesPageModule)
  },
  {
    path: 'mon-profil',
    loadChildren: () => import('./mon-profil/mon-profil.module').then( m => m.MonProfilPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
