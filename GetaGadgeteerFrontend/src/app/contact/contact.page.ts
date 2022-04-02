import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { API_URL } from 'src/environments/environment';
import { ContactModel } from '../models/user/contactModel';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  public message: string;
  public subject: string;

  constructor(private httpClient : HttpClient, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.message = '';
    this.subject = ''
  }

  sendMail(){
    var obj = new ContactModel;
    obj.message = this.message;
    obj.subject = this.subject;

    this.httpClient.post(API_URL + "/user/contact", obj).pipe(first()).subscribe(
      data => {
        this.toastCtrl.create({
          message: 'Message sent',
          position: 'bottom',
          color: 'success',
          duration: 5000,
          buttons: ['Dismiss']
        }).then((el) => el.present())
        this.message = '';
        this.subject = '';
      },
      error => {
        this.toastCtrl.create({
          message: 'Failed to send the message. Try again',
          position: 'bottom',
          color: 'danger',
          duration: 5000,
          buttons: ['Dismiss']
        }).then((el) => el.present())
      }
    );
  }
}
