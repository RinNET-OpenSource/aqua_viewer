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
import {forkJoin, lastValueFrom} from 'rxjs';
import {map, take} from 'rxjs/operators';

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
  ready = false;

  constructor(
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    public route: ActivatedRoute,
    private dbService: NgxIndexedDBService,
    public router: Router
  ) {
  }

  async ngOnInit() {
    this.cardList = await lastValueFrom(this.dbService.getAll<OngekiCard>('ongekiCard'));
    this.filteredCardList = [...this.cardList];
    const observers = this.cardList.map(card => {
      const character$ = this.dbService.getByID<OngekiCharacter>('ongekiCharacter', card.charaId).pipe(take(1));
      const skill$ = this.dbService.getByID<OngekiSkill>('ongekiSkill', card.skillId).pipe(take(1));
      const choKaikaSkill$ = this.dbService.getByID<OngekiSkill>('ongekiSkill', card.choKaikaSkillId).pipe(take(1));
      return forkJoin([character$, skill$, choKaikaSkill$]).pipe(
        map(([character, skill, choKaikaSkill]) => {
          card.characterInfo = character;
          card.skillInfo = skill;
          card.choKaikaSkillInfo = choKaikaSkill;
          return card;
        })
      );
    });
    forkJoin(observers).subscribe(cards => {
      this.cardList = cards;
      this.filteredCardList = [...this.cardList];
      console.log('ok');
      this.ready = true;
    });
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

  filterCards(searchTerm: string) {
    if (searchTerm) {
      this.filteredCardList = this.cardList.filter(card => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const sameId = card.id === Number(searchTerm);
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
