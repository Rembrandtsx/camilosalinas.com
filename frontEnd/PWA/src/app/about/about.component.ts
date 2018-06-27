import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalksService } from '../services/talks.services';
import { HttpClientModule } from '@angular/common/http'; import { HttpModule } from '@angular/http';
import { trigger,state,style,transition,animate } from '@angular/animations'
declare const jQuery:any;
declare const $:any;
declare const GitHubCalendar:any;


@Component({
    selector:'about-component',
    templateUrl:'about.component.html',
    styleUrls:['about.component.css'],
    animations:[
        trigger('enterState',[
          state('void',style({
            transition : "all ease-out",
            opacity:0,
            transform:'translateX(-1500px)'
          })),
          transition(':enter',[
            animate(800,style({
              transform:'translate(0px)',
              opacity:1
            }))
          ])
        ])
      ]
})
export class AboutComponent implements OnInit{
    public talks:any[];
    constructor(
        private appSettingsService : TalksService 
    ) { }

   ngOnInit(){
       /*--------------------*/
       // JSON is Loaded.
       /*--------------------*/
       this.appSettingsService.getJSON().subscribe(data => {
            this.talks= data;
            console.log(data.lenght)
        });
        GitHubCalendar(".calendar", "Rembrandtsx");
    }
}