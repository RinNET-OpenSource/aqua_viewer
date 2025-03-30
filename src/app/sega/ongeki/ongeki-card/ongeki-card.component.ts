import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StatusCode} from '../../../status-code';
import {MessageService} from '../../../message.service';
import {PlayerCard} from '../model/PlayerCard';
import {HttpParams} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {OngekiCard} from '../model/OngekiCard';
import {OngekiSkill} from '../model/OngekiSkill';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ongeki-card',
  templateUrl: './ongeki-card.component.html',
  styleUrls: ['./ongeki-card.component.css']
})
export class OngekiCardComponent implements OnInit {
  protected CardType = CardType;
  cardIDs: number[] = [];
  cardInfoMap: Map<number, PlayerCard> = new Map();
  deckIDs: number[] = [1, 2, 3, 4, 5];
  skinValid: boolean[] = [false, false, false, false, false];
  currentDeck: number[];
  currentDeckID: number = this.deckIDs[0];

  type: CardType;

  constructor(
    private api: ApiService,
    protected route: ActivatedRoute,
    protected router: Router,
    private messageService: MessageService,
    private modalService: NgbModal,
    private dbService: NgxIndexedDBService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      this.currentDeck = undefined;
      if (data.type) {
        if (Object.values(CardType).includes(data.type.toUpperCase())) {
          this.type = data.type.toUpperCase() as CardType;
        } else {
          this.router.navigate([], {
            queryParams: {type: undefined},
            queryParamsHandling: 'merge'
          });
          return;
        }
      } else {
        this.type = CardType.SKILL;
      }
      if (this.type === CardType.SKILL) {
        this.getUserDeck();
      } else if (this.type === CardType.SKIN) {
        this.getUserSkin();
      }
    });
  }

  getCard(id: number): PlayerCard {
    if (this.cardInfoMap.has(id)) {
      return this.cardInfoMap.get(id);
    }

    return {
      cardId: id,
      digitalStock: 0,
      analogStock: 0,
      level: 0,
      maxLevel: 0,
      exp: 0,
      printCount: 0,
      useCount: 0,
      kaikaDate: '2000-00-00 00:00:00.0',
      choKaikaDate: '2000-00-00 00:00:00.0',
      skillId: 0,
      created: '0000-00-00 00:00:00.0',
      isNew: false,
      isAcquired: false
    };
  }

  async getUserDeck() {
    this.cardIDs = [];
    try {
      const resp = await lastValueFrom(this.api.get('api/game/ongeki/userDeckList'));
      if (resp.status) {
        const statusCode: StatusCode = resp.status.code;
        if (statusCode === StatusCode.OK) {
          const deckList: UserDeck[] = resp.data;
          for (const deck of deckList) {
            this.cardIDs = this.cardIDs.concat([deck.cardId1, deck.cardId2, deck.cardId3]);
          }
        } else {
          this.messageService.notice(resp.status.message);
          return;
        }
      }
    } catch (error) {
      this.messageService.notice(error);
      return;
    }
    await this.getCardInfo();
  }

  async getUserSkin() {
    this.cardIDs = [];
    try {
      const skinList: UserSkin[] = await lastValueFrom(this.api.get('api/game/ongeki/skin'));
      for (const skin of skinList) {
        this.cardIDs = this.cardIDs.concat([skin.cardId1, skin.cardId2, skin.cardId3]);
        this.skinValid[skin.deckId - 1] = skin.isValid;
      }
    } catch (error) {
      this.messageService.notice(error);
      return;
    }
    await this.getCardInfo();
  }

  async getCardInfo() {
    const cardIdsParam = this.cardIDs.join(',');
    const params = new HttpParams().set('cardIds', cardIdsParam);
    try {
      const cards: PlayerCard[] = await lastValueFrom(this.api.get('api/game/ongeki/cardInfos', params));
      for (const card of cards) {
        this.dbService.getByID<OngekiCard>('ongekiCard', card.cardId).subscribe(c => {
          card.cardInfo = c;
          if (card.choKaikaDate !== '0000-00-00 00:00:00.0') {
            this.dbService.getByID<OngekiSkill>('ongekiSkill', c.choKaikaSkillId).subscribe(
              z => card.skillInfo = z
            );
          } else {
            this.dbService.getByID<OngekiSkill>('ongekiSkill', c.skillId).subscribe(
              z => card.skillInfo = z
            );
          }
        });
        this.cardInfoMap.set(card.cardId, card);
      }
      this.updateCurrentDeck();
    } catch (error) {
      this.messageService.notice(error);
    }
  }

  selectDeck(deckId: number) {
    this.currentDeckID = deckId;
    this.updateCurrentDeck();
  }

  updateCurrentDeck() {
    const deckItemCount = 3;
    const index = (this.currentDeckID - 1) * deckItemCount;
    this.currentDeck = this.cardIDs.slice(index, index + deckItemCount);
  }

  changeCard(deckID: number, cardIndex: number, cardId: number) {
    if (this.type === CardType.SKILL) {
      this.changeDeck(deckID, cardIndex, cardId);
    } else {
      this.ChangeCardSkin(deckID, cardIndex, cardId);
    }
  }

  changeDeck(deckID: number, cardIndex: number, cardId: number) {
    const deckIndex = deckID - 1;
    const param = {
      cardId1: this.cardIDs[deckIndex * 3],
      cardId2: this.cardIDs[deckIndex * 3 + 1],
      cardId3: this.cardIDs[deckIndex * 3 + 2],
    };
    if (cardIndex === 0) {
      param.cardId1 = cardId;
    } else if (cardIndex === 1) {
      param.cardId2 = cardId;
    } else if (cardIndex === 2) {
      param.cardId3 = cardId;
    }

    this.api.put('api/game/ongeki/userDeckList/' + deckID, param).subscribe({
      next: async resp => {
        if (resp.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            const deck: UserDeck = resp.data;
            this.cardIDs[deckIndex * 3] = deck.cardId1;
            this.cardIDs[deckIndex * 3 + 1] = deck.cardId2;
            this.cardIDs[deckIndex * 3 + 2] = deck.cardId3;
            await this.getCardInfo();
          } else {
            this.messageService.notice(resp.status.message);
            return;
          }
        }
      },
      error: err => {
        this.messageService.notice(err);
      }
    });
  }

  ChangeCardSkin(deckID: number, cardIndex: number, cardId: number) {
    const deckIndex = deckID - 1;
    const param: UserSkin = {
      deckId: deckID,
      cardId1: this.cardIDs[deckIndex * 3],
      cardId2: this.cardIDs[deckIndex * 3 + 1],
      cardId3: this.cardIDs[deckIndex * 3 + 2],
      isValid: this.skinValid[deckIndex],
    };
    if (cardIndex === 0) {
      param.cardId1 = cardId;
    } else if (cardIndex === 1) {
      param.cardId2 = cardId;
    } else if (cardIndex === 2) {
      param.cardId3 = cardId;
    }

    this.api.post('api/game/ongeki/skin/', [param]).subscribe({
      next: async resp => {
        const skins: UserSkin[] = resp;
        for (const skin of skins) {
          const i = skin.deckId - 1;
          this.cardIDs[i * 3] = skin.cardId1;
          this.cardIDs[i * 3 + 1] = skin.cardId2;
          this.cardIDs[i * 3 + 2] = skin.cardId3;
          this.skinValid[i] = skin.isValid;
        }
        await this.getCardInfo();
      },
      error: err => {
        this.messageService.notice(err);
      }
    });
  }

  open(content) {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  getSelectCardCallback(deckID: number, cardIndex: number) {
    return (cardId: number) => {
      this.changeCard(deckID, cardIndex, cardId);
      this.modalService.dismissAll();
    };
  }
}

interface UserDeck {
  deckId: number;
  cardId1: number;
  cardId2: number;
  cardId3: number;
}

interface UserSkin extends UserDeck {
  isValid: boolean;
}

export enum CardType {
  SKILL = 'SKILL',
  SKIN = 'SKIN',
}
