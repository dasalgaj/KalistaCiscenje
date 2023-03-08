// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cache: false,
  rest_server: {
    protokol: 'https://',
    host: 'kalista-ciscenje.app',
    functions: {
        api: '/rest/api2.php',
        token: '/rest/token.php'
        //user_info: '/api/user/info'
    }
  },
  google_map_api: 'AIzaSyBT0jYZNte-NOsAICVMEOtmRYJamX0hVuM',
  cache_key: 'cache-key-',
  car_key: 'car-key-',
  company: 1
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
