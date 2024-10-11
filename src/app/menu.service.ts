import { Injectable } from '@angular/core';
import { User } from './user.service';
import { AccountService } from './auth/account.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public menu = new Map<string, Menu[]>(
    [
      [
        'ongeki',
        [
          {
            id: 0,
            name: 'Profile',
            url: 'ongeki/profile',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 1,
            name: 'BattlePoint',
            url: 'ongeki/battle',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 2,
            name: 'Rating',
            url: 'ongeki/rating',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 3,
            name: 'PlayRecord',
            url: 'ongeki/recent',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 4,
            name: 'MusicList',
            url: 'ongeki/song',
            displayCondition: DisplayCondition.Always,
          },
          {
            id: 5,
            name: 'Card',
            url: 'ongeki/card',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 6,
            name: 'Rival',
            url: 'ongeki/rival',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 7,
            name: 'MusicRanking',
            url: 'ongeki/musicRanking',
            displayCondition: DisplayCondition.Always,
          },
          {
            id: 8,
            name: 'UserRanking',
            url: 'ongeki/userRanking',
            displayCondition: DisplayCondition.Always,
          },
          {
            id: 9,
            name: 'Setting',
            url: 'ongeki/settings',
            displayCondition: DisplayCondition.HasProfile,
          }
        ]
      ],
      [
        'chusan',
        [
          {
            id: 0,
            name: 'Profile',
            url: 'chuni/v2/profile',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 1,
            name: 'Rating',
            url: 'chuni/v2/rating',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 2,
            name: 'PlayRecord',
            url: 'chuni/v2/recent',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 3,
            name: 'MusicList',
            url: 'chuni/v2/song',
            displayCondition: DisplayCondition.Always,
          },
          {
            id: 4,
            name: 'Character',
            url: 'chuni/v2/character',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 5,
            name: 'Rival',
            url: 'chuni/v2/rival',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 6,
            name: 'UserBox',
            url: 'chuni/v2/userbox',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 7,
            name: 'UserRanking',
            url: 'chuni/v2/userRanking',
            displayCondition: DisplayCondition.Always,
          },
          {
            id: 8,
            name: 'Setting',
            url: 'chuni/v2/setting',
            displayCondition: DisplayCondition.HasProfile,
          }
        ]
      ],
      [
        'maimai2',
        [
          {
            id: 0,
            name: 'Profile',
            url: 'mai2/profile',
            displayCondition: DisplayCondition.HasProfile,
          },
          {
            id: 1,
            name: 'Setting',
            url: 'mai2/setting',
            displayCondition: DisplayCondition.HasProfile,
          }
        ]
      ]
    ]
  );

  constructor(
    private accountService: AccountService
  ) { }

  public showItem(game: string, item: Menu, user: User): boolean{
    if(item.displayCondition == DisplayCondition.Always){
      return true;
    }
    else if(item.displayCondition == DisplayCondition.AfterLogin && this.accountService.currentAccountValue){
      return true;
    }
    else if(item.displayCondition == DisplayCondition.HasProfile && user?.games.includes(game)){
      return true;
    }
    else if(item.displayCondition == DisplayCondition.IsAdmin && user?.roles.some(r => r.name === 'ROLE_ADMIN')){
      return true;
    }
    else{
      return false;
    }
  }

  public showMenu(game: string, user: User): boolean{
    return this.menu.get(game).some(item => this.showItem(game, item, user))
  }
}

export class Menu {
  id: number;
  name: string;
  url: string;
  displayCondition: DisplayCondition;
}

export enum DisplayCondition {
  Always = 1,
  AfterLogin = 2,
  HasProfile = 4,
  IsAdmin = 8
}
