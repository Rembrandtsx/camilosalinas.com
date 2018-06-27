import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component'
import { TalksComponent } from './talks/talks.component';
import { AboutComponent } from './about/about.component';

export const routes = [
    { path: '', component: HomeComponent, pathMatch: 'full'},
    { path: 'talks', component: TalksComponent},
    { path: 'about', component: AboutComponent},
    { path: 'portfolio', component: MenuComponent},
    { path: 'contact', component: MenuComponent},

  ];