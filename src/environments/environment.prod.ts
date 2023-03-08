export const environment = {
  production: true,
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
