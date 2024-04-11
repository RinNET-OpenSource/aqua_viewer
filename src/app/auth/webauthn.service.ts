import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {StatusCode} from '../status-code';
import {
  create,
  parseCreationOptionsFromJSON,
} from '@github/webauthn-json/browser-ponyfill';

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor(
    private http: HttpClient,
  ) { }

  register() {
    this.http.get(environment.apiServer + 'api/user/webauthn/startRegister').subscribe({
      next: async (response: any) => {
        const statusCode: StatusCode = response?.status?.code;
        if (statusCode !== StatusCode.OK) {
          console.error('Web authn service failed with statusCode ' + statusCode);
        } else {
          const credentialGetOptions = JSON.parse(response?.data);
          if (credentialGetOptions) {
            const options = parseCreationOptionsFromJSON(credentialGetOptions);
            const result = await create(options);
            this.http.post(environment.apiServer + 'api/user/webauthn/finishRegister',
              { credentialCreateJson: result}).subscribe({
              next: async (resp: any) => { console.error(resp); }
              }
            );
          } else {
            console.error('credentialGetOptions not present');
          }
        }
      },
      error: err => { console.error('Webauthn Failed', err); }
    });
  }
}
