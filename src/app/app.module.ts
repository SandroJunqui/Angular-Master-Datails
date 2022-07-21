import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'; // especifico para usar o in-memory -  excluir para conectar ao bd real
import { InMemoryDatabase } from './in-memory-database'; // especifico para usar o in-memory -  excluir para conectar ao bd real

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase), // especifico para usar o in-memory -  excluir para conectar ao bd real
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
