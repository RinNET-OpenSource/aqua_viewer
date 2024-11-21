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
import {Maimai2DxPass} from '../model/Maimai2DxPass';

@Component({
  selector: 'app-maimai2-dxpass',
  templateUrl: './maimai2-dxpass.component.html',
  styleUrls: ['./maimai2-dxpass.component.css']
})
export class Maimai2DxpassComponent implements OnInit{

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

  dxpasses: Observable<Maimai2DxPass[]>;
  isDetailVisible: boolean[] = [];
  difficulty = Difficulty;
  hasData: boolean;

  currentPage = 1;
  totalElements = 0;

  protected readonly environment = environment;

  ngOnInit() {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
    this.load(this.currentPage);
    this.hasData = false;
  }

  load(page: number) {
    this.isDetailVisible = [];
    const param = new HttpParams().set('aimeId', this.aimeId).set('page', String(page - 1));
    this.dxpasses = this.api.get('api/game/maimai2/dxpass', param).pipe(
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
    this.dxpasses.subscribe(data => {
      this.hasData = data.length > 0;
    });
  }

  toggleDetail(index: number): void {
    const formerstate = this.isDetailVisible[index];
    // this.isDetailVisible = [];
    this.isDetailVisible[index] = !formerstate;
  }

  get6digit(input: number): string {
    const inputString = input.toString();
    return inputString.padStart(6, '0');
  }

  calculateRemainingTime(endDate: any): string {
    const now = new Date();
    const end = new Date(endDate);

    const timeDiff = end.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return '已过期';
    }

    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600)); // 计算小时数

    return `${days}天 ${hours}小时`;
  }

  formatDate(input: Date): string {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  protected readonly length = length;
}
