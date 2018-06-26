import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalksService } from '../services/talks.services';
import { HttpClientModule } from '@angular/common/http'; import { HttpModule } from '@angular/http';
declare const jQuery:any;
declare const $:any;

@Component({
    selector:'talks-component',
    templateUrl:'talks.component.html',
    styleUrls:['talks.component.css']
})
export class TalksComponent implements OnInit{
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
        //Animation effect and variables are created  and assigned for cards.
        'use strict';

        $(document).ready(function() {
            var animating = false;
            var step1 = 500;
            var step2 = 500;
            var step3 = 500;
            var reqStep1 = 600;
            var reqStep2 = 800;
            var reqClosingStep1 = 500;
            var reqClosingStep2 = 500;
            var $scrollCont = $(".phone__scroll-cont");

            $(document).on("click", ".card:not(.active)", function() {
                if (animating) return;
                    animating = true;
                    
                var $card = $(this);
                var cardTop = $card.position().top;
                var scrollTopVal = cardTop - 30;
                $card.addClass("flip-step1 active");

                $scrollCont.animate({scrollTop: scrollTopVal}, step1);

                setTimeout(function() {
                    $scrollCont.animate({scrollTop: scrollTopVal}, step2);
                    $card.addClass("flip-step2");

                    setTimeout(function() {
                        $scrollCont.animate({scrollTop: scrollTopVal}, step3);
                        $card.addClass("flip-step3");

                        setTimeout(function() {
                            animating = false;
                        }, step3);

                    }, step2*0.5);

                }, step1*0.65);
            });

            $(document).on("click", ".card:not(.req-active1) .card__header__close-btn", function() {
                if (animating) return;
                    animating = true;
                    
                var $card = $(this).parents(".card");
                $card.removeClass("flip-step3 active");

                setTimeout(function() {
                    $card.removeClass("flip-step2");

                    setTimeout(function() {
                        $card.removeClass("flip-step1");

                        setTimeout(function() {
                        animating = false;
                        }, step1);

                    }, step2*0.65);

                }, step3/2);
            });

                
                
            $(document).on("click", 
                            ".card.req-active1 .card__header__close-btn, .card.req-active1 ", 
                                function() {
                if (animating) return;
                    animating = true;
                    
                var $card = $(this).parents(".card");
                    
                $card.addClass("req-closing1");
                    
                setTimeout(function() {
                    $card.addClass("req-closing2");
                    
                    setTimeout(function() {
                        $card.addClass("no-transition hidden-hack")
                        $card.css("top");
                        $card.removeClass("req-closing2 req-closing1 req-active2 req-active1 map-active flip-step3 flip-step2 flip-step1 active");
                        $card.css("top");
                        $card.removeClass("no-transition hidden-hack");
                        animating = false;
                    }, reqClosingStep2);
                    
                }, reqClosingStep1);
            });

        });
        var node_Theme={
            hex: '#6cc24a',
            logo:'fab fa-node-js',
            color:'node-green'                
        }
        var js_Theme={
            hex:'#f7df1e',
            logo:'fab fa-js',
            color:'js-yellow'
        }
    }


}