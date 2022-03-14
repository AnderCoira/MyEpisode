import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonComponent } from './common/common.component';
import { AnimeViewComponent } from './anime-view/anime-view.component';

//Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

//PrimeNG imports
import {ButtonModule} from 'primeng/button';
import {MenubarModule} from 'primeng/menubar';
import {DataViewModule} from 'primeng/dataview';
import {CardModule} from 'primeng/card';
import { AnimeSearchComponent } from './anime-search/anime-search.component';
import {BlockUIModule} from 'primeng/blockui';
import {DialogModule} from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TableModule} from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputNumberModule} from 'primeng/inputnumber';
import { AnimeLoaderComponent } from './anime-loader/anime-loader.component';

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    AnimeViewComponent,
    AnimeSearchComponent,
    AnimeLoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    //PrimeNG imports
    ButtonModule,
    NgbModule,
    MenubarModule,
    DataViewModule,
    CardModule,
    BlockUIModule,
    DialogModule,
    TagModule,
    ProgressSpinnerModule,
    TableModule,
    SkeletonModule,
    ToastModule,
    TooltipModule,
    ConfirmDialogModule,
    InputNumberModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
