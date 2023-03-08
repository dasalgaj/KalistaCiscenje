import { Injectable } from '@angular/core';
import { CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { DataServiceService } from '../services/data-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: DataServiceService,
    private router: Router
  ){

  }

  canLoad(): Observable<boolean>{
    return this.authService.authenticationState.pipe(
      filter(val => val !== null),
      take(1),
      map (isAuthenticated => {
        console.log('GUARD: ', isAuthenticated);
        if(isAuthenticated){
          return true;
        }
        else{
          this.router.navigateByUrl('/tabs/login');
          return false;
        }
      })
    )
  }
}
