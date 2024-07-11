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
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-ongeki-card-list',
  templateUrl: './ongeki-card-list.component.html',
  styleUrls: ['./ongeki-card-list.component.css']
})
export class OngekiCardListComponent implements OnInit {
  host = environment.assetsHost;

  cardList: OngekiCard[] = [];
  skillList: OngekiSkill[] = [];
  charaList: OngekiCharacter[] = [];
  filteredCardList: OngekiCard[] = [];
  currentPage = 1;
  totalElements = 0;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private messageService: MessageService,
    public route: ActivatedRoute,
    private dbService: NgxIndexedDBService,
    public router: Router
  ) {
  }

  async ngOnInit() {
    this.cardList = await lastValueFrom(this.dbService.getAll<OngekiCard>('ongekiCard'));
    this.skillList = await lastValueFrom(this.dbService.getAll<OngekiSkill>('ongekiSkill'));
    this.charaList = await lastValueFrom(this.dbService.getAll<OngekiCharacter>('ongekiCharacter'));
    this.filteredCardList = [...this.cardList];
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
    });
  }

  insertCard(cardId: number) {
    const aimeId = this.userService.currentUser.defaultCard.extId;
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
        const sameSkillCategory = this.isSameSkillCategory(lowerSearchTerm, card);
        const includesNumber = card.cardNumber.toLowerCase().includes(lowerSearchTerm);
        return sameId || includesName || includesNickName || sameSkillCategory || includesNumber;
      });
    } else {
      this.filteredCardList = [...this.cardList];
    }
  }

  isSameSkillCategory(category: string, card: OngekiCard){
    const skill = this.findSkill(card.skillId);
    const choKaikaSkill = this.findSkill(card.choKaikaSkillId);
    return skill?.category?.toLowerCase() === category || choKaikaSkill?.category?.toLowerCase() === category
  }

  findSkill(skillId: number){
    return this.skillList.find(skill => skill.id === skillId)
  }

  getSkillName(skillId: number){
    const skill = this.findSkill(skillId);
    if(skill){
      return skill.name;
    }
    else{
      return 'ID:' + skillId;
    }
  }

  getCharaString(charaId: number){
    const chara = this.charaList.find(skill => skill.id === charaId);
    if(chara){
      return chara.name + "<br>" + (chara.cv ? '(CV: ' + chara.cv + ')' : '');
    }
    else{
      return ""
    }
  }
}
