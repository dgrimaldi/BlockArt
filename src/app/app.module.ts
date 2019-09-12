import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import { DiscussionComponent } from './discussion/discussion.component';

/**
 * In order to use the Router, you must first register the RouterModule from
 * the @angular/router package. Define an array of routes, appRoutes, and pass
 * them to the RouterModule.forRoot() method.
 */
const appRoutes: Routes = [{
  path: 'login', component: LoginComponent
},
  {path: 'home', component: HomeComponent},

{path: 'discussion/:id', component: DiscussionComponent}
];
/**  @NgModule takes a metadata object
 * that describes how to compile a component's template and how to create an injector at runtime.
 * It identifies the module's own components, directives, and pipes, making some of them public,
 * through the exports property, so that external components can use them.
 */
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DiscussionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // It returns a module, containing the configured Router
    //  service provider, plus other providers that the routing
    //  library requires.
    RouterModule.forRoot(
      appRoutes),
    ReactiveFormsModule
  ],
  providers: [],
  /** bootstrapping process creates the component(s)
   * listed in the bootstrap array and inserts each one
   * into the browser DOM.
   */
  bootstrap: [AppComponent]
})
export class AppModule {
}
