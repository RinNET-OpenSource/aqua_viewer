import {Observable} from 'rxjs';
import {Time} from '@angular/common';

export interface User {
  id: number;
  username: string;
  name: string;
  cards: Card[];
}

export interface Card {
  id: number;
  extId: number;
  luid: string;
  registerTime: Time;
  accessTime: Time;
  cardExternalList: CardExternal[];
  default: boolean;
}

export interface CardExternal {
  id: number;
  luid: string;
}
