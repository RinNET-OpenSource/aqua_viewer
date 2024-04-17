import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentAccountSubject: BehaviorSubject<Account>;

  constructor() {
    this.currentAccountSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('currentAccount')));
  }

  public get currentAccountValue(): Account {
    return this.currentAccountSubject.value;
  }

  public set currentAccountValue(account: Account) {
    localStorage.setItem('currentAccount', JSON.stringify(account));
    this.currentAccountSubject.next(account);
  }

  public clear(){
    localStorage.removeItem('currentAccount');
    this.currentAccountSubject.next(null);
  }
}

export class Account {
  tokenType: string;
  accessToken: string;
}
