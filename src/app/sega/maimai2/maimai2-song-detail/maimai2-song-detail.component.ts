import {Component, Input} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ApiService} from '../../../api.service';
import {MessageService} from '../../../message.service';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {HttpParams} from '@angular/common/http';
import { UserService } from 'src/app/user.service';
import {Maimai2Music, Maimai2MusicDetail} from '../model/Maimai2Music';

interface ISongData {
  musicId: number;
  level: number;
  playCount: number;
  achievement: number;
  comboStatus: number;
  syncStatus: number;
  deluxscoreMax: number;
  scoreRank: number;
  extNum1: number;
  ranking: UserRanking;
  musicDetail: Maimai2MusicDetail;
  totalCombo: number;
}

interface Ranking {
  level?: number;
  username: string;
  score: number;
}

interface UserRanking {
  rank: number;
  playedCount: number;
}

@Component({
  selector: 'app-v2-song-score-ranking',
  templateUrl: './maimai2-song-detail.component.html',
  styleUrls: ['./maimai2-song-detail.component.scss']
})
export class Maimai2SongDetailComponent {
  protected readonly Math = Math;
  ranking: Ranking[];
  songData: { [key: number]: ISongData };
  host = environment.assetsHost;
  protected readonly parseFloat = parseFloat;
  @Input() public music: Maimai2Music;
  currentDiffTab = 3;
  hasRemaster = false;

  constructor(
    private api: ApiService,
    private userService: UserService,
    public messageService: MessageService,
    public offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    console.log(this.music);
    const {musicId} = this.music;
    if (this.music.details[4]){
      this.hasRemaster = true;
    }
    if (this.music.musicId > 100000){
      this.currentDiffTab = 0;
    }
    this.api.get(`api/game/maimai2/song/${musicId}?aimeId=${String(this.userService.currentUser.defaultCard.extId)}`).subscribe(
      res => {
        const songData = {};
        for (const data of res) {
          songData[data.level] = data;
          if (this.music.details[data.level]){
            songData[data.level].musicDetail = this.music.details[data.level];
            songData[data.level].totalCombo = (this.music.details[data.level].tapCount +
              this.music.details[data.level].holdCount +
              this.music.details[data.level].slideCount +
              this.music.details[data.level].breakCount +
              this.music.details[data.level].touchCount);
          }
          console.log(songData);
        }
        this.songData = songData;
      }
    );
    const param = new HttpParams().set('musicId', musicId).set('level', 3);
    this.api.get("api/game/maimai2/musicScoreRanking", param).subscribe((res) => {
      if (res.length > 0) {
        this.ranking = res;
      } else {
        const param = new HttpParams().set("musicId", musicId).set("level", 0);
        this.api.get("api/game/maimai2/musicScoreRanking", param).subscribe((res) => {
          this.ranking = res;
        });
      }
    });
  }

  handleTabButtonClick(level: number) {
    const {musicId} = this.music;
    const param = new HttpParams().set('musicId', musicId).set('level', level);
    this.api.get('api/game/maimai2/musicScoreRanking', param).subscribe(
      res => {
        this.ranking = res;
      }
    );
    this.currentDiffTab = level;
  }

  getLevelString(song: Maimai2Music, index: number): string {
    const level: Maimai2MusicDetail = song.details[index.toString()];
    return `${level.levelDecimal / 10}` ?? '0';
  }
  getColumnWidth(): string {
    const columnCount = this.music.details[this.currentDiffTab].touchCount !== 0 ? 5 : 4;
    return (100 / columnCount) + '%';
  }
  getIconVisibility(item: ISongData, mode: number): boolean {
    switch (mode) {
      case 0:
        return item.comboStatus !== 0;
      case 1:
        return false;
      case 2:
        return !this.getIconVisibility(item, 0) && !this.getIconVisibility(item, 1) && item.achievement > 800000;
      default:
        return true;
    }
  }

  getComboIcon(item: ISongData): string{
    switch (item.comboStatus){
      case 1:
        return 'music_icon_fc';
      case 2:
        return 'music_icon_fcp';
      case 3:
        return 'music_icon_ap';
      case 4:
        return 'music_icon_app';
      default:
        return '';
    }
  }

  getSyncIcon(item: ISongData): string{
    switch (item.syncStatus){
      case 1:
        return 'music_icon_fs';
      case 2:
        return 'music_icon_fsp';
      case 3:
        return 'music_icon_fdx';
      case 4:
        return 'music_icon_fdxp';
      case 5:
        return 'music_icon_sync';
      default:
        return '';
    }
  }

  getRankIcon(item: ISongData): string{
    switch (item.scoreRank){
      case 0:
        return 'music_icon_d';
      case 1:
        return 'music_icon_c';
      case 2:
        return 'music_icon_b';
      case 3:
        return 'music_icon_bb';
      case 4:
        return 'music_icon_bbb';
      case 5:
        return 'music_icon_a';
      case 6:
        return 'music_icon_aa';
      case 7:
        return 'music_icon_aaa';
      case 8:
        return 'music_icon_s';
      case 9:
        return 'music_icon_sp';
      case 10:
        return 'music_icon_ss';
      case 11:
        return 'music_icon_ssp';
      case 12:
        return 'music_icon_sss';
      case 13:
        return 'music_icon_sssp';
      default:
        return '';
    }
  }

  getRivalNumber(item: ISongData): string{
    return '1st';
  }

  getDxScoreStar(item: ISongData): string{
    const theoryDeluxe = item.totalCombo * 3;
    if (item.deluxscoreMax >= theoryDeluxe * 0.97){
      return '⭐⭐⭐⭐⭐';
    }
    if (item.deluxscoreMax >= theoryDeluxe * 0.95){
      return '⭐⭐⭐⭐';
    }
    if (item.deluxscoreMax >= theoryDeluxe * 0.93){
      return '⭐⭐⭐';
    }
    if (item.deluxscoreMax >= theoryDeluxe * 0.90){
      return '⭐⭐';
    }
    if (item.deluxscoreMax >= theoryDeluxe * 0.85){
      return '⭐';
    }
    return 'DXScore';
  }
  imgError(event: Event) {
    (event.target as HTMLImageElement).src = this.host + 'assets/mai2/jacket/UI_Jacket_000000.webp';
  }
  getJacketId(input: number): string {
    return input.toString().slice(-4).padStart(6, '0');
  }

}
