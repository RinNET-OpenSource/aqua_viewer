import {Component, OnInit} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {OngekiCard} from '../model/OngekiCard';
import {OngekiCharacter} from '../model/OngekiCharacter';
import {PlayerCard} from '../model/PlayerCard';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {OngekiSkill} from '../model/OngekiSkill';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-ongeki-card',
  templateUrl: './ongeki-card.component.html',
  styleUrls: ['./ongeki-card.component.css']
})
export class OngekiCardComponent implements OnInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  cardList: Observable<PlayerCard[]>;
  loading: boolean;

  currentPage = 1;
  totalElements = 0;

  constructor(
    private api: ApiService,
    public route: ActivatedRoute,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService,
    public router: Router
  ) {
  }
  ngOnInit() {
    this.loading = true;
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
      this.load(this.currentPage);
    });
  }

  load(page: number) {
    const aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = new HttpParams().set('aimeId', aimeId).set('page', String(page - 1)).set('size', 12);
    this.cardList = this.api.get('api/game/ongeki/card', param).pipe(
      tap(
        data => {
          this.totalElements = data.totalElements;
          this.currentPage = page;
        }
      ),
      map(
        data => {
          data.content.forEach(x => {
            this.dbService.getByID<OngekiCard>('ongekiCard', x.cardId).subscribe(
              y => {
                x.cardInfo = y;
                this.dbService.getByID<OngekiCharacter>('ongekiCharacter', y.charaId).subscribe(
                  z => x.characterInfo = z
                );
                this.dbService.getByID<OngekiSkill>('ongekiSkill', y.skillId).subscribe(
                  z => x.skillInfo = z
                );
              }
            );
          });
          this.loading = false;
          return data.content;
        },
        error => this.messageService.notice(error)
      )
    );
  }

  kaika(cardId: number, type: string) {
    const aimeId = String(this.auth.currentAccountValue.currentCard);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.post('api/game/ongeki/card/' + cardId + '/' + type, param).subscribe(
      data => {
        this.messageService.notice('Successful');
        this.load(this.currentPage);
      },
      error => this.messageService.notice(error)
    );
  }

  pageChanged(page: number) {
    this.router.navigate(['ongeki/card'], {queryParams: {page}});
  }

}
