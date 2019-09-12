import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {DiscussionComponent} from './discussion/discussion.component';

/**
 * add a redirect route that translates the initial
 * relative URL ('') to the desired default path (/login-page).
 * The browser address bar shows .../login-page as if you'd
 * navigated there directly.
 */
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'discussion/:id', component: DiscussionComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
