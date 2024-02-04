import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {OngekiCard} from '../model/OngekiCard';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Component({
  selector: 'app-ongeki-card-gacha',
  templateUrl: './ongeki-card-gacha.component.html',
  styleUrls: ['./ongeki-card-gacha.component.css']
})
export class OngekiCardGachaComponent implements OnInit, AfterViewInit {

  host = environment.assetsHost;
  enableImages = environment.enableImages;

  isStarted = false;

  cardResultList: OngekiCard[] = [];
  currentShowedIndex = 0;

  submitSuccessful = 0;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  gacha(count: number) {
    this.cardResultList = [];
    this.currentShowedIndex = 0;
    this.isStarted = true;
    this.submitSuccessful = 0;

    const requestData: GachaRequest = {
      aimeId: this.auth.currentAccountValue.currentCard.extId.toString(),
      count,
    };
    this.api.post('api/game/ongeki/gacha', requestData).subscribe(res => {
      this.cardResultList = res;
    });
  }


  goBack() {
    this.isStarted = false;
  }

  formatNumber(value: number, length?: number): string {
    let str = value.toString();
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

}

interface GachaRequest {
  aimeId: string;
  count: number;
}
