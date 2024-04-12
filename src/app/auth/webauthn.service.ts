import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StatusCode } from '../status-code';

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {
  constructor(private http: HttpClient) {}

  register(nick: string) {
    this.http.get(environment.apiServer + 'api/user/webauthn/startRegister').subscribe({
      next: async (response: any) => {
        const statusCode: StatusCode = response?.status?.code;
        if (statusCode !== StatusCode.OK) {
          console.error('Web authn service failed with statusCode ' + statusCode);
        } else {
          const options = JSON.parse(response?.data);
          if (options) {
            options.user.id = this.base64UrlToByteArray(options.user.id);
            options.challenge = this.base64UrlToByteArray(options.challenge);
            const excludeCredentials = options.excludeCredentials as Array<PublicKeyCredentialDescriptor>;
            const rawExcludeCredentials: Array<PublicKeyCredentialDescriptor> = [];
            excludeCredentials.forEach((excludeCredential: PublicKeyCredentialDescriptor) => {
              {
                rawExcludeCredentials.push({
                  type: excludeCredential.type,
                  id: this.base64UrlToByteArray(excludeCredential.id)
                });
              }
            });
            options.excludeCredentials = rawExcludeCredentials;
            const publicKeyCredential = await navigator.credentials.create({publicKey: options}) as PublicKeyCredential;
            const registrationResponse = publicKeyCredential.response as AuthenticatorAttestationResponse;

            // Convert to b64url
            const registrationResponseInB64Url = {
              id: publicKeyCredential.id,
              rawId: this.arrayBufferToBase64Url(publicKeyCredential.rawId),
              type: publicKeyCredential.type,
              response: {
                clientDataJSON: this.arrayBufferToBase64Url(registrationResponse.clientDataJSON),
                attestationObject: this.arrayBufferToBase64Url(registrationResponse.attestationObject)
              },
              clientExtensionResults: publicKeyCredential.getClientExtensionResults()
            };

            const registrationResponseJSON = JSON.stringify(registrationResponseInB64Url);
            console.log(registrationResponseJSON);
            this.http.post(environment.apiServer + 'api/user/webauthn/finishRegister',
              {
                nick,
                credentialCreateJson: registrationResponseJSON
              })
              .subscribe({
              next: async (resp: any) => {
                console.log(resp);
              },
              error: err => console.error(err)
            });
          } else {
            console.error('Attestation options not present');
          }
        }
      },
      error: err => { console.error('Webauthn Failed', err); }
    });
  }

  login(userName: string) {
    this.http.get(environment.apiServer + 'api/auth/webauthn/startAuth?userName=' + userName).subscribe({
      next: async (response: any) => {
        const statusCode: StatusCode = response?.status?.code;
        if (statusCode !== StatusCode.OK) {
          console.error('Web authn service failed with statusCode ' + statusCode);
        } else {
          const options = JSON.parse(response?.data);
          if (options) {
            console.log(options);
            // Convert publicKey[].id to ByteArray
            const newCredentials: Array<PublicKeyCredentialDescriptor> = [];
            const oldCredentials = options.publicKey.allowCredentials as Array<PublicKeyCredentialDescriptor>;
            oldCredentials.forEach((e: PublicKeyCredentialDescriptor) => {
              newCredentials.push({
                id: this.base64UrlToByteArray(e.id),
                type: e.type
              });
            });
            options.publicKey.allowCredentials = newCredentials;
            options.publicKey.challenge = this.base64UrlToByteArray(options.publicKey.challenge);

            const rawAssertion = await navigator.credentials.get(options) as PublicKeyCredential;
            console.log(rawAssertion);
            // Finish Login
            // Construct Data
            const rawAssertionResponse = rawAssertion.response as AuthenticatorAssertionResponse;
            const clientExtensions = rawAssertion.getClientExtensionResults
              ? rawAssertion.getClientExtensionResults()
              : {};
            const assertionResponse = {
              authenticatorData: this.arrayBufferToBase64Url(rawAssertionResponse.authenticatorData),
              clientDataJSON: this.arrayBufferToBase64Url(rawAssertionResponse.clientDataJSON),
              signature: this.arrayBufferToBase64Url(rawAssertionResponse.signature),
              userHandle: this.arrayBufferToBase64Url(rawAssertionResponse.userHandle),
            };

            const assertion = {
              authenticatorAttachment: rawAssertion.authenticatorAttachment,
              id: rawAssertion.id,
              rawId: this.arrayBufferToBase64Url(rawAssertion.rawId),
              response: assertionResponse,
              type: rawAssertion.type,
              clientExtensionResults: clientExtensions // 确保这里不为空
            };

            const assertionJson = JSON.stringify(assertion);
            // Start Finish Authentication
            console.log(assertionJson);
            this.http.post(environment.apiServer + 'api/auth/webauthn/finishAuth', {
              userName,
              credentialGetJson: assertionJson
            }).subscribe({
              next: async (step2Resp: any) => {
                const step2StatusCode: StatusCode = step2Resp?.status?.code;
                if (step2StatusCode !== StatusCode.OK) {
                  console.error('Web authn service failed with statusCode ' + statusCode);
                } else {
                  console.log(step2Resp);
                }
              },
              error: err => console.error(err)
            });
          } else {
            console.error('Assertion options not present');
          }
        }
      },
      error: err => { console.error(err); }
    });
  }

  private base64UrlToByteArray(b64UrlString) {
    const b64String = this.base64UrlToBase64(b64UrlString);
    return Uint8Array.from(atob(b64String), c => c.charCodeAt(0));
  }

  private base64UrlToBase64(input: string) {
    // 替换字符以符合Base64要求
    let base64String = input.replace(/-/g, '+').replace(/_/g, '/');
    // 校正Base64字符串长度
    while (base64String.length % 4) {
      base64String += '=';
    }
    return base64String;
  }

  private arrayBufferToBase64Url(buffer) {
    if (buffer === null) { return null; }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const b64 =  window.btoa(binary);
    return b64.replace(/\+/g, '-').replace(/\//g, '_');
  }
}
