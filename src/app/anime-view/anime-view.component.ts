import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnimeSearch } from 'src/interfaces/anime-search';
import { MainService } from '../services/main.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


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
  editAnimeEpisode: String;
  loader: boolean = false;
  blockUI: boolean = false;

  constructor(private service: MainService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  displayModal: any = false;

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
    this.myAnimes.sort(this.compare);
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
    this.editAnimeEpisode = animeData.anime_mal_id;
  }

  saveEpisode(animeData){
    this.startLoader();
    this.lockUI();
    this.editAnimeEpisode = undefined;
    this.service.getAnimeEpisodeById(animeData.anime_mal_id, animeData.mal_id).subscribe({
      next: res => {
        const found = this.myAnimes.find(id => id.mal_id === animeData.anime_mal_id);
        found.myConfig[0].data.mal_id = res.data.mal_id;
        found.myConfig[0].data.title = res.data.title;
        found.myConfig[0].data.filler = res.data.filler;
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
    this.editAnimeEpisode = undefined;
  }


  addSingleToast(severity, summary, detail) {
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  exportExcel() {
    import("xlsx").then(xlsx => {

      let myConfigArr = [];
      let myImagesArr = [];
      let myTrailerArr = [];
      let myAiredArr = [];
      let myBroadcastArr = [];
      let myProducersArr = [];
      let myLicensorsArr = [];
      let myStudiosArr = [];
      let myGenresArr = [];
      let myExplicitGenresArr = [];
      let myThemesArr = [];
      let myDemographicsArr = [];

      this.myAnimes.forEach(anime => {
        myConfigArr.push(anime.myConfig[0].data);
        myImagesArr.push(anime.images.jpg);
        myTrailerArr.push(anime.trailer);
        myAiredArr.push(anime.aired);
        myBroadcastArr.push(anime.broadcast);
        anime.producers.forEach(producer => {
          myProducersArr.push(producer);
        });
        anime.licensors.forEach(licensor => {
          myLicensorsArr.push(licensor);
        });
        anime.studios.forEach(studio => {
          myStudiosArr.push(studio);
        });
        anime.genres.forEach(genre => {
          myGenresArr.push(genre);
        });
        anime.explicit_genres.forEach(explicit_genre => {
          myGenresArr.push(explicit_genre);
        });
        anime.themes.forEach(theme => {
          myThemesArr.push(theme);
        });
        anime.demographics.forEach(demographic => {
          myDemographicsArr.push(demographic);
        });
      });

      const worksheet = xlsx.utils.json_to_sheet(this.myAnimes);
      const myConfig = xlsx.utils.json_to_sheet(myConfigArr);
      const images = xlsx.utils.json_to_sheet(myImagesArr);
      const trailer = xlsx.utils.json_to_sheet(myTrailerArr);
      const aired = xlsx.utils.json_to_sheet(myAiredArr);
      const broadcast = xlsx.utils.json_to_sheet(myBroadcastArr);
      const producers = xlsx.utils.json_to_sheet(myProducersArr);
      const licensors = xlsx.utils.json_to_sheet(myLicensorsArr);
      const studios = xlsx.utils.json_to_sheet(myStudiosArr);
      const genres = xlsx.utils.json_to_sheet(myGenresArr);
      const explicitGenres = xlsx.utils.json_to_sheet(myExplicitGenresArr);
      const themes = xlsx.utils.json_to_sheet(myThemesArr);
      const demographics = xlsx.utils.json_to_sheet(myDemographicsArr);
      const workbook = { 
        Sheets: { 
          'general': worksheet,
          'myconfig': myConfig,
          'images': images,
          'trailer': trailer,
          'aired': aired,
          'broadcast': broadcast,
          'producers': producers,
          'licensors': licensors,
          'studios': studios,
          'genres': genres,
          'explicitgenres': explicitGenres,
          'themes': themes,
          'demographics': demographics,
        }, 
        SheetNames: ['general', 'myconfig', 'images', 'trailer', 'aired', 'broadcast', 'producers', 'licensors', 'studios', 'genres', 'explicitgenres', 'themes', 'demographics']
      };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "MyAnimes");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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

  compare (a, b) {
    if ( a.title < b.title ){
      return -1;
    }
    if ( a.title > b.title ){
      return 1;
    }
    return 0;
  }

}
