import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class TalksService{
    constructor(private http: HttpClient) {
        this.getJSON().subscribe(data => {
            console.log(data)
        });
    }

    public getJSON(): Observable<any> {
        return this.http.get("./assets/data/talks.json")
    }
}