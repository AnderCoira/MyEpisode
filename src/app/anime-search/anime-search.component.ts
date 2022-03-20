import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AnimeSearch } from 'src/interfaces/anime-search';
import { MainService } from '../services/main.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-anime-search',
  templateUrl: './anime-search.component.html',
  styleUrls: ['./anime-search.component.scss'],
  providers: [MessageService]
})
export class AnimeSearchComponent implements OnInit {

  @Input() animeSearch: any;
  animeName: String;
  loader: Boolean = false;
  blockUI = false;

  constructor(private service: MainService, private messageService: MessageService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.startLoader();
    this.checkAddedAnimes();
  }

  addToMyList(clickedId){
    this.startLoader();
    this.lockUI();
    let found = this.animeSearch.data.find(id => id.mal_id === clickedId);
    if(found.type === 'TV'){
      this.service.getAnimeEpisodeById(clickedId, 1).subscribe({
        next: res => {
          found.myConfig = [res];
          found.myConfig[0].data.anime_mal_id = clickedId;
          found = JSON.stringify(found);
          localStorage.setItem(clickedId, found);
          this.checkAddedAnimes();
          this.addSingleToast('success', 'Added', 'The anime was added successfully');
          this.stopLoader();
          this.unlockUI();
        },
        error: err => {
          console.log(err);
          this.addSingleToast('error', 'Unexpected error', 'Please try again...');
          this.stopLoader();
          this.unlockUI();
        }
      });
    }else{
      found = JSON.stringify(found);
      localStorage.setItem(clickedId, found);
      this.checkAddedAnimes();
      this.addSingleToast('success', 'Added', 'The anime was added successfully');
    }
  }

  checkAddedAnimes(){
    if(this.animeSearch){
      this.stopLoader();
      this.unlockUI();
      this.animeSearch.data.forEach(element => {
        if(localStorage.getItem(element.mal_id.toString())){
          element.added = true;
        }else{
          element.added = false;
        }
      });
    }
  }

  submitAnimeName(){
    if(this.animeName){
      this.startLoader();
      this.lockUI();
      this.service.searchAnime(this.animeName).subscribe({
        next: res => {
          this.animeSearch = res;
          this.checkAddedAnimes();
          this.animeName = '';
          this.stopLoader();
          this.unlockUI();
        },
        error: err => {
          console.log(err);
          this.addSingleToast('error', 'Unexpected error', 'Please try again...');
          this.stopLoader();
          this.unlockUI();
        }
     });
    }
  }

  addSingleToast(severity, summary, detail) {
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  lockUI() {
    this.blockUI = true;
  }

  unlockUI() {
    this.blockUI = false;
  }

  startLoader() {
    this.loader = true;
  }

  stopLoader() {
    this.loader = false;
  }

}
