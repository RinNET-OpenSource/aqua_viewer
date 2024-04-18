import {Injectable} from '@angular/core';
import {StatusCode} from './status-code';
import {MessageService} from './message.service';
import {ApiService} from './api.service';
import {AccountService} from './auth/account.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User;
  private loadPromise: Promise<any | null> | null = null;
  private cancelRequest: Subject<void>;

  constructor(
    private api: ApiService,
    account: AccountService,
    private messageService: MessageService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (account.currentAccountValue){
      this.load();
    }
    else{
      this.clear();
    }
  }

  public load(forceReload: boolean = false): Promise<any | null> {
    if (this.loadPromise && !forceReload) {
      return this.loadPromise;
    }

    if (forceReload) {
      this.clear();
    }

    this.cancelRequest = new Subject<void>();
    this.loadPromise = new Promise((resolve, reject) => {
      this.api.get('api/user/me')
        .pipe(takeUntil(this.cancelRequest))
        .subscribe(
          resp => {
            if (resp?.status) {
              const statusCode: StatusCode = resp.status.code;
              if (statusCode === StatusCode.OK && resp.data) {
                this.currentUser = resp.data;
                this.currentUser.cards.forEach(card => {
                  if (card.default){
                    this.currentUser.defaultCard = card;
                  }
                });
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
              } else {
                this.messageService.notice(resp.status.message);
              }
            }
            resolve(resp);
          },
          error => {
            this.messageService.notice(error);
            reject(error);
          }
        )
        .add(() => {
          this.loadPromise = null;
          this.cancelRequest = null;
        });
    });

    return this.loadPromise;
  }

  public clear() {
    this.cancelRequest?.next();
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }
}

interface User {
  id: number;
  username: string;
  name: string;
  roles: Role[];
  cards: Card[];
  defaultCard: Card;
  keychips: Keychip[];
  userTrustKeychips: UserTrustKeychip[];
  games: string[];
  oauth2s: OAuth2[];
}

interface Role {
  id: number;
  name: string;
}

interface Card {
  id: number;
  extId: number;
  luid: string;
  registerTime: string;
  accessTime: string;
  cardExternalList: CardExternal[];
  default: boolean;
}

interface CardExternal {
  id: number;
  luid: string;
}

interface Keychip {
  id: number;
  keychipId: string;
  placeName: string;
  whiteListed: boolean;
  user: SimpleUser;
}

interface SimpleUser {
  id: number;
  name: string;
}

interface UserTrustKeychip {
  id: number;
  userId: number;
  keychip: KeychipDetail;
}

interface KeychipDetail {
  id: number;
  keychipId: string;
  placeName: string;
  whiteListed: boolean;
  user: SimpleUser;
}

interface OAuth2 {
  id: number;
  provider: string;
  email: string;
}
