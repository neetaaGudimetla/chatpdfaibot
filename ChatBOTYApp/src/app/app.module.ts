import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage'; */
import { configPlaceholder } from '../env';
// Instructions ---->
// Replace configPlaceholder with your firebase credentials
//import configPlaceholder from '../env';
import { DropzoneDirective } from './dropzone.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './filter.pipe';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { UploaderComponent } from './uploader/uploader.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PurchaseComponent } from './purchase/purchase.component';
import { SupportComponent } from './support/support.component';
import { ContactusComponent } from './contactus/contactus.component';

import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = [
  { path: 'Home', component: UploaderComponent },
  { path: 'Purchase', component: PurchaseComponent },
  { path: 'Support', component: SupportComponent },
  { path: 'Contactus', component: ContactusComponent },
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: '**', component: UploaderComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    DropzoneDirective,
    FilterPipe,
    UploaderComponent,
    HelpSupportComponent,
    PurchaseComponent,
    SupportComponent,
    ContactusComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }), // ToastrModule added
    ColorPickerModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
