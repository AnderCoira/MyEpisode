import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title: string = 'MyEpisode';

  constructor(private config: PrimeNGConfig, private translateService: TranslateService) {}

  ngOnInit() {
    this.config.ripple = true;
    this.translateService.setDefaultLang('en');
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('en').subscribe(
      res => this.config.setTranslation(res));
  }

  ngOnDestroy() {
    
  }

}
