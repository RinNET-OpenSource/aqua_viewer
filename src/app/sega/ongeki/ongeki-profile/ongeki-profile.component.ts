import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { AuthenticationService } from '../../../auth/authentication.service';
import { MessageService } from '../../../message.service';
import { HttpParams } from '@angular/common/http';
import { DisplayOngekiProfile } from '../model/OngekiProfile';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {environment} from '../../../../environments/environment';
import {OngekiTrophy} from '../model/OngekiTrophy';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-ongeki-profile',
  templateUrl: './ongeki-profile.component.html',
  styleUrls: ['./ongeki-profile.component.css']
})
export class OngekiProfileComponent implements OnInit {

  protected readonly Math = Math;
  profile: DisplayOngekiProfile;
  aimeId: string;
  host = environment.assetsHost;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    private dbService: NgxIndexedDBService
  ) {
    this.aimeId = String(this.userService.currentUser.defaultCard.extId);
  }

  ngOnInit() {
    const aimeId = String(this.userService.currentUser.defaultCard.extId);
    const param = new HttpParams().set('aimeId', aimeId);
    this.api.get('api/game/ongeki/profile', param).subscribe(
      data => {
        this.profile = data;
        this.profile.rankId = this.getRankId(this.profile.battlePoint);
        this.profile.rankPattern = this.getRankPattern(this.profile.battlePoint);
        this.dbService.getByID<OngekiTrophy>('ongekiTrophy', this.profile.trophyId).subscribe(
          x => this.profile.trophy = x
        );
      },
      error => this.messageService.notice(error)
    );
  }

  getTrophyRarityCode(rt: string): number{
    if (rt === 'Silver') { return 1; }
    else if (rt === 'Gold') { return 2; }
    else if (rt === 'Platinum') { return 3; }
    else if (rt === 'Rainbow') { return 4; }
    else { return 0; }
  }

  getRatingType(rt: number): string{
    if (rt < 200) { return '00Bule'; }
    else if (rt < 400) { return '01Green'; }
    else if (rt < 700) { return '02Orange'; }
    else if (rt < 1000) { return '03Red'; }
    else if (rt < 1200) { return '04Purple'; }
    else if (rt < 1300) { return '05Bronze'; }
    else if (rt < 1400) { return '06Silver'; }
    else if (rt < 1450) { return '07Gold'; }
    else if (rt < 1500) { return '08Platinum'; }
    else{ return '09Rainbow'; }
  }

  getRankId(bp: number): number{
    if (bp < 200) { return 0; }
    else if (bp < 500) { return 1; }
    else if (bp < 1000) { return 2; }
    else if (bp < 1500) { return 3; }
    else if (bp < 2000) { return 4; }
    else if (bp < 2500) { return 5; }
    else if (bp < 3000) { return 6; }
    else if (bp < 3500) { return 7; }
    else if (bp < 4000) { return 8; }
    else if (bp < 4500) { return 9; }
    else if (bp < 5000) { return 10; }
    else if (bp < 6000) { return 11; }
    else if (bp < 7000) { return 12; }
    else if (bp < 8000) { return 13; }
    else if (bp < 9000) { return 14; }
    else if (bp < 10000) { return 15; }
    else if (bp < 11000) { return 16; }
    else if (bp < 12000) { return 17; }
    else if (bp < 13000) { return 18; }
    else if (bp < 14000) { return 19; }
    else if (bp < 15000) { return 20; }
    else if (bp < 17000) { return 21; }
    else if (bp < 19000) { return 22; }
    else if (bp < 20000) { return 23; }
    else { return 24; }
  }

  getRankPattern(bp: number): number{
    if (bp < 200) { return 0; }
    else if (bp < 5000) { return 1; }
    else if (bp < 12000) { return 2; }
    else if (bp < 15000) { return 3; }
    else if (bp < 17000) { return 4; }
    else if (bp < 19000) { return 5; }
    else if (bp < 20000) { return 6; }
    else { return 7; }
  }
}
