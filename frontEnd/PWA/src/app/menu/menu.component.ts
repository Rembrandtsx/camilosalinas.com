import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'menu-hamburger',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css']
})
export class MenuComponent implements OnInit {
  public message: string;

  constructor() {}

  ngOnInit() {
    this.message = 'Hello';
  }
  toggle(){
    let input:any =document.getElementById("menu")
   input.checked = !input.checked
  }
}