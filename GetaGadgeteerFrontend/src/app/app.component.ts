import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/', icon: 'mail' },
  ];

  constructor(private authService: AuthService, private router: Router, private menu: MenuController, public navCtrl: NavController) {}

  public name(){
    return this.authService.currentUserName;
  }

  public email(){
    return this.authService.currentUserEmail;
  }

  public isAdmin(){
    return this.authService.isAdmin();
  }

  public onNavigate(url){
    this.router.navigateByUrl(url);
  }

  public about(url){
    window.open(url);
  }

  public onLogout(){
    this.menu.close();
    this.authService.logout();
    this.router.navigateByUrl("/auth");
  }
}
