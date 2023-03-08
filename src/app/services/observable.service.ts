import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ObservableService {

    private backRefresh = new Subject<any>();

    constructor() {

    }

    publishSomeData(data: any) {
        this.backRefresh.next(data);
    }

    unsubscribe() {
        this.backRefresh.unsubscribe();
    }

    getObservable(): Subject<any> {
        return this.backRefresh;
    }

}