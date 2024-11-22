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
import {Maimai2Photo} from '../model/Maimai2Photo';

@Component({
  selector: 'app-maimai2-photos',
  templateUrl: './maimai2-photos.component.html',
  styleUrls: ['./maimai2-photos.component.scss']
})
export class Maimai2PhotosComponent implements OnInit {

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
  ) {
  }

  protected readonly Math = Math;
  host = environment.assetsHost;
  enableImages = environment.enableImages;

  aimeId: string;

  photos: Observable<Maimai2Photo[]>;
  difficulty = Difficulty;
  hasData: boolean;

  currentPage = 1;
  totalElements = 0;
  enabled = false;

  protected readonly environment = environment;

  ngOnInit() {
    this.hasData = false;
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.load(this.currentPage);
  }

  load(page: number) {
    if (this.enabled){
      const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
      this.photos = this.api.get('api/game/maimai2/recentPhoto', param).pipe(
        tap(
          (data: any) => {
            this.totalElements = data.totalElements;
            this.currentPage = page;
          }
        ),
        map(
          (data: any) => {
            return data.content;
          },
          (error: string) => this.messageService.notice(error)
        )
      );
      this.photos.subscribe(data => {
        this.hasData = data.length > 0;
      });
    }else{
      this.messageService.notice('The function isn\'t yet opened');
    }
  }
}
