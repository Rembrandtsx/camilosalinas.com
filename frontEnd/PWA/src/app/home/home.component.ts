import {Component, OnInit} from '@angular/core';
import Typed from 'typed.js';
import { trigger,state,style,transition,animate } from '@angular/animations'

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls:['home.component.css'],
  animations:[
    trigger('enterState',[
      state('void',style({
        transition : "all ease-out",
        opacity:0,
        transform:'scale(0.1)'
      })),
      transition(':enter',[
        animate(500,style({
          transform:'scale(1)',
          opacity:1
        }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  public message: string;

  constructor() {}

  
  
  ngOnInit() {

    //Elemento Typed
    let typed:any = new Typed('#typed',{
      strings:["Developer","Student","中文演讲人","Creator","Monitor", "Engineer","Entrepeneur", "Inventor", "Student Representative", "Monitor"],
      backSpeed: 40,
      typeSpeed: 40,
      loop: true
    });
  }

}
