// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiServer: '/',
  // apiServer: 'http://192.168.123.112/',
  // apiServer: 'http://127.0.0.1/',
  production: false,
  enableImages: true,
  assetsHost: 'https://rinnet.stehp.cn/',
  oauth: {
    github: {
      client_id: 'e076e7aebe1ca5b0b2b5',
      scoop: 'user:email'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
