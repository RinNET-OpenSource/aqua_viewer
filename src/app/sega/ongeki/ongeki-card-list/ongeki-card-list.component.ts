import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../../../environments/environment';
import {OngekiCard} from '../model/OngekiCard';
import {OngekiSkill} from '../model/OngekiSkill';
import {OngekiCharacter} from '../model/OngekiCharacter';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-ongeki-card-list',
  templateUrl: './ongeki-card-list.component.html',
  styleUrls: ['./ongeki-card-list.component.css']
})
export class OngekiCardListComponent implements OnInit {
  host = environment.assetsHost;

  cardList: OngekiCard[] = [];
  filteredCardList: OngekiCard[] = [];
  currentPage = 1;
  totalElements = 0;
  searchTerm = '';

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    public route: ActivatedRoute,
    private dbService: NgxIndexedDBService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.dbService.getAll<OngekiCard>('ongekiCard').subscribe(
      x => {
        x.forEach(y => {
          this.dbService.getByID<OngekiCharacter>('ongekiCharacter', y.charaId).subscribe(z => y.characterInfo = z);
          this.dbService.getByID<OngekiSkill>('ongekiSkill', y.skillId).subscribe(z => y.skillInfo = z);
          this.dbService.getByID<OngekiSkill>('ongekiSkill', y.choKaikaSkillId).subscribe(z => y.choKaikaSkillInfo = z);
        });
        this.cardList = x;
        this.filteredCardList = [...this.cardList];
      }
    );
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
    });
  }

  insertCard(cardId: number) {
    const aimeId = this.auth.currentAccountValue.currentCard.extId;
    this.api.post('api/game/ongeki/card', {
      aimeId,
      cardId
    }).subscribe(
      data => this.messageService.notice('Successful, go to check your card list'),
      error => this.messageService.notice(error)
    );
  }

  pageChanged(page: number) {
    this.router.navigate(['ongeki/card/all'], {queryParams: {page}});
  }

  filterCards() {
    if (this.searchTerm) {
      this.filteredCardList = this.cardList.filter(card =>
      {
        const lowerSearchTerm = this.searchTerm.toLowerCase();

        const sameId = card.id === Number(this.searchTerm);
        const includesName = card.name.toLowerCase().includes(lowerSearchTerm);
        const includesNickName = card.nickName.toLowerCase().includes(lowerSearchTerm);
        const sameSkillCategory = card.skillInfo.category.toLowerCase() === lowerSearchTerm ||
          card.choKaikaSkillInfo.category.toLowerCase() === lowerSearchTerm;
        const includesNumber = card.cardNumber.toLowerCase().includes(lowerSearchTerm);
        return sameId || includesName || includesNickName || sameSkillCategory || includesNumber;
      });
    } else {
      this.filteredCardList = [...this.cardList];
    }
  }
}
