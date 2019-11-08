import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSoapModule } from 'ngx-soap';
import { ReactiveFormsModule } from '@angular/forms';

// Leaflet
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Used to create fake backend
import { fakeBackendProvider, JwtInterceptor, ErrorInterceptor } from './_helpers';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './_services/auth.service';
import { AlertComponent } from './_components';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      LoginComponent,
      AlertComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      NgxSoapModule,
      ReactiveFormsModule,
      LeafletModule.forRoot()
   ],
   providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      // Provider used to create fake backend
      fakeBackendProvider,
      AuthService,
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
