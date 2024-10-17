import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {HttpParams} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../environments/environment';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/user.service';
import {Maimai2Music} from '../model/Maimai2Music';
import {Difficulty} from '../model/Maimai2Enums';
import {Maimai2Playlog} from '../model/Maimai2Playlog';

@Component({
  selector: 'app-maimai2-recent',
  templateUrl: './maimai2-recent.component.html',
  styleUrls: ['./maimai2-recent.component.scss']
})
export class Maimai2RecentComponent implements OnInit {

  protected readonly Math = Math;
  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId: string;

  recent: Observable<Maimai2Playlog[]>;
  isDetailVisible: boolean[] = [];
  difficulty = Difficulty;

  currentPage = 1;
  totalElements = 0;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    private offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.load(this.currentPage);
  }

  load(page: number) {
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
    this.recent = this.api.get('api/game/maimai2/recent', param).pipe(
      tap(
        (data: any) => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        (data: any) => {
          data.content.forEach(x => {
            this.dbService.getByID<Maimai2Music>('maimai2Music', x.musicId).subscribe(
              m => {
                if (m !== null){
                  x.songInfo = m;
                }
              }
            );
          });
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  toggleDetail(index: number): void {
    const formerstate = this.isDetailVisible[index];
    this.isDetailVisible = [];
    this.isDetailVisible[index] = !formerstate;
  }

  getIconVisibility(item: Maimai2Playlog, mode: number): boolean {
    switch (mode) {
        case 0:
          return item.comboStatus !== 0;
        case 1:
          return item.playerNum > 1;
        case 2:
          return !this.getIconVisibility(item, 0) && !this.getIconVisibility(item, 1) && item.isClear;
      default:
        return true;
    }
  }

  getComboIcon(item: Maimai2Playlog): string{
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

  getSyncIcon(item: Maimai2Playlog): string{
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

  getRankIcon(item: Maimai2Playlog): string{
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

  getRivalNumber(item: Maimai2Playlog): string{
    if (item.vsRank === 0){
      return '1st';
    }else{
      return '2nd';
    }
  }

  getDxScoreStar(item: Maimai2Playlog): string{
    const theoryDeluxe = item.totalCombo * 3;
    if (item.deluxscore >= theoryDeluxe * 0.97){
      return '⭐⭐⭐⭐⭐';
    }
    if (item.deluxscore >= theoryDeluxe * 0.95){
      return '⭐⭐⭐⭐';
    }
    if (item.deluxscore >= theoryDeluxe * 0.93){
      return '⭐⭐⭐';
    }
    if (item.deluxscore >= theoryDeluxe * 0.90){
      return '⭐⭐';
    }
    if (item.deluxscore >= theoryDeluxe * 0.85){
      return '⭐';
    }
    return 'DXScore';
  }
  getJacketId(input: number): string {
    const inputString = input.toString();
    const lastFourDigits = inputString.slice(-4);
    return lastFourDigits.padStart(6, '0');
  }
  imgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.host + 'assets/mai2/jacket/UI_Jacket_000000.webp';
  }
}
