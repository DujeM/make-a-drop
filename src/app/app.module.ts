import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { DropComponent } from './components/drop/drop.component';
import { DropItemComponent } from './components/drop-item/drop-item.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { DropCreateComponent } from './components/drop-create/drop-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropFindComponent } from './components/drop-find/drop-find.component';
import { firebaseConfig } from 'src/environments/firebase';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DropzoneDirective,
    DropComponent,
    DropItemComponent,
    DropCreateComponent,
    DropFindComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
