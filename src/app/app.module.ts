import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ZoomComponent } from './zoom/zoom.component';
import { OmegleComponent } from './omegle/omegle.component';
import { RouterModule } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RoutingModule } from './routing.module';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from './service/common.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MeetingComponent } from './zoom/meeting/meeting.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ZoomComponent,
    OmegleComponent,
    ErrorPageComponent,
    MeetingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    RouterModule,
    RoutingModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [CommonService],
  bootstrap: [AppComponent],
})
export class AppModule {}
