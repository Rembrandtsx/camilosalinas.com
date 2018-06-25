import {Component, OnInit} from '@angular/core';
import * as Typed from 'typed.js';
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls:['home.component.css'] 
})
export class HomeComponent implements OnInit {
  public message: string;

  constructor() {}

  
  
  ngOnInit() {

    //Elemento Typed
    let typed = new Typed('#typed',{
      strings:["Desarrollador","Estudiante","中文演讲人","Innovador","Monitor", "Ingeniero","Emprendedor", "Inventor"],
      backSpeed: 40,
      typeSpeed: 40,
      loop: true
    });
  }

}
