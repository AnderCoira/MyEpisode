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

  constructor(private service: MainService, private messageService: MessageService) { }

  ngOnInit(): void {
  
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkAddedAnimes();
  }

  addToMyList(clickedId){
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
        },
        error: err => {
          console.log(err);
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
      this.service.searchAnime(this.animeName).subscribe({
        next: res => {
          this.animeSearch = res;
          this.checkAddedAnimes();
          this.animeName = '';
        },
        error: err => {
          console.log(err);
        }
     });
    }
  }

  addSingleToast(severity, summary, detail) {
    this.messageService.add({severity: severity, summary: summary, detail: detail});
}
}
