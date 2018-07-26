import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:"exists"
  })
  export class ExistsPipe implements PipeTransform {
    transform(value: String): String {
        
        return value == ''|| value == "" ||value == ' '|| value == " " || value == null || value== undefined? 'display-none':'';
    }
  }