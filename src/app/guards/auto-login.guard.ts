import { Injectable } from '@angular/core';
import { CanLoad, Router, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { DataServiceService } from '../services/data-service.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
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
        console.log('Auto GUARD: ', isAuthenticated);
        if(isAuthenticated){
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
        else{
          return true;
        }
      })
    )
  }
}
