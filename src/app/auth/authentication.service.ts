import {BehaviorSubject, mergeMap} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Card} from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentAccountSubject: BehaviorSubject<Account>;

  constructor(
    private http: HttpClient) {
    this.currentAccountSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('currentAccount')));
  }

  public get currentUserValue(): Account {
    return this.currentAccountSubject.value;
  }

  public set currentUserValue(account: Account) {
    localStorage.setItem('currentAccount', JSON.stringify(account));
    this.currentAccountSubject.next(account);
  }

  login(usernameOrEmail: string, password: string) {
    return this.http.post<any>(environment.apiServer + 'api/auth/signin', {usernameOrEmail, password})
      .pipe(
        map(
          resp => {
            if (resp && resp.tokenType && resp.accessToken) {
              return new Account(resp.tokenType, resp.accessToken, null);
            }
          }
        ),
        mergeMap((account: Account) => {
          const headers = {Authorization: `${account.tokenType} ${account.accessToken}`};
          return this.http.get<any>(environment.apiServer + 'api/user/me', {headers})
            .pipe(
              map(
                user => {
                  for (const card of user.cards){
                    if (card.default){
                      account.currentCard = card.extId;
                      break;
                    }
                  }
                  this.currentUserValue = account;
                  return account;
                }
              )
            );
        }));
  }

  signUp(name: string, username: string, email: string, verifyCode: string, password: string) {
    return this.http.post<any>(environment.apiServer + 'api/auth/signup', {name, username, email, verifyCode, password})
      .pipe(
        map(
          resp => {
            if (resp) {
              return resp;
            }
          }
        )
      );
  }

  getVerifyCode(email: string){
    return this.http.post<any>(environment.apiServer + 'api/auth/getVerifyCode', {emailAddress: email})
      .pipe(
        map(
          resp => {
            if (resp) {
              return resp;
            }
          }
        )
      );
  }

  logout() {
    localStorage.removeItem('currentAccount');
    this.currentAccountSubject.next(null);
  }

}

export class Account {
  tokenType: string;
  accessToken: string;
  currentCard: number;

  constructor(tokenType: string, accessToken: string, currentCard: number) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.currentCard = currentCard;
  }
}
