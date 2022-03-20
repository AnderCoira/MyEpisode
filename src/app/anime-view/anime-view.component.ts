import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnimeSearch } from 'src/interfaces/anime-search';
import { MainService } from '../services/main.service';


@Component({
  selector: 'app-anime-view',
  templateUrl: './anime-view.component.html',
  styleUrls: ['./anime-view.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AnimeViewComponent implements OnInit {

  myAnimes: any = [];
  animeSearch: AnimeSearch;
  animeName: String;
  notSavedEpisode: String;
  loader: boolean = false;
  blockUI: boolean = false;

  constructor(private service: MainService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  displayModal: any = false;
  editMode: boolean = false;

  ngOnInit(): void {
    this.getMyAnimeList();
  }

  submitAnimeName(){
    if(this.animeName){
      this.lockUI();
      this.displayModal = true;
      this.service.searchAnime(this.animeName).subscribe({
        next: res => {
          this.animeSearch = res;
          this.animeName = '';
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

  getMyAnimeList(){
    this.myAnimes = [];
    Object.keys(localStorage).forEach(data => {
        let item = localStorage.getItem(data);
        this.myAnimes.push(JSON.parse(item));
    });

    console.log('My animes -> ', this.myAnimes);

  }

  removeFromMyList(clickedId){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this anime?',
      accept: () => {
        localStorage.removeItem(clickedId);
        this.getMyAnimeList();
        this.addSingleToast('success', 'Removed', 'The anime was removed successfully');
      }
    });
  }

  hideModal(event){
    if (event.target.className.includes('p-dialog-header-close')) {
      this.getMyAnimeList();
      this.animeSearch = undefined;
    }
  }

  editEpisode(animeData){
    this.notSavedEpisode = animeData.mal_id;
    this.editMode = true;
  }

  saveEpisode(animeData){
    this.startLoader();
    this.lockUI();
    this.editMode = false;
    this.service.getAnimeEpisodeById(animeData.anime_mal_id, animeData.mal_id).subscribe({
      next: res => {
        const found = this.myAnimes.find(id => id.mal_id === animeData.anime_mal_id);
        found.myConfig[0].data.mal_id = res.data.mal_id;
        found.myConfig[0].data.title = res.data.title;
        localStorage.setItem(animeData.anime_mal_id, JSON.stringify(found));
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

  cancelEdition(animeData){
    animeData.mal_id = this.notSavedEpisode;
    this.editMode = false;
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
