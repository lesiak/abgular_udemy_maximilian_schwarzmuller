import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {SharedModule} from '../shared/shared.module';


const routes: Routes = [
  {path: 'auth', component: AuthComponent}
];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule {
}
