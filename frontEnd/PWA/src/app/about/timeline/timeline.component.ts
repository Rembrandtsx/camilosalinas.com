import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeLineService } from '../../services/timeline.services';
import { trigger,state,style,transition,animate } from '@angular/animations'
declare const jQuery:any;
declare const $:any;
declare const GitHubCalendar:any;


@Component({
    selector:'timeline-component',
    templateUrl:'timeline.component.html',
    styleUrls:['timeline.component.css']
})
export class TimeLineComponent implements OnInit{
    public timelineEvents:any[];
    constructor(
        private appSettingsService : TimeLineService 
    ) { }

   ngOnInit(){
       /*--------------------*/
       // JSON is Loaded.
       /*--------------------*/
       this.appSettingsService.getJSON().subscribe(data => {
            this.timelineEvents= data;
            console.log(data.lenght)
            console.log(data)
        });
    }

}