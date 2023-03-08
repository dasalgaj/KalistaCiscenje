import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

import { DataServiceService } from '../services/data-service.service';

@Injectable({
  providedIn: 'root'
})
export class ReadyPageGuard implements CanLoad {
  constructor(
    private authService: DataServiceService
  ){

  }

  canLoad(): Observable<boolean>{
    return this.authService.readyPage.pipe(
      filter(val => val !== null),
      take(1),
      map (readyPage => {
        if(readyPage){
          return true;
        }
        else{
          return false;
        }
      })
    )
  }
}
