import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component'
import { TalksComponent } from './talks/talks.component';

export const routes = [
    { path: '', component: HomeComponent, pathMatch: 'full'},
    { path: 'talks', component: TalksComponent},
    /** Talks subsites*/

    /* End Talks Subsites */
    { path: 'about', component: MenuComponent},
    { path: 'portfolio', component: MenuComponent},
    { path: 'contact', component: MenuComponent},

  ];