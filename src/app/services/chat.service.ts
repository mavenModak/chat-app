import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: firebase.User;
  chatCollection: AngularFirestoreCollection<ChatMessage>;
  chat: Observable<ChatMessage[]>;
  userName: Observable<string>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    public authService: AuthService
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth != undefined && auth != null) {
        this.user = auth;
      }


    });

    this.chatCollection = afs.collection<ChatMessage>('messages');
    this.chat = this.chatCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ChatMessage;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )


  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.afs.doc(path);
  }

  getUsers() {
    const path = '/users';
    //return this.afs.list(path);
    return this.afs.collection<any>('users').snapshotChanges();
  }

  sendMessage(msg: string) {
    const timeStamp = this.getTimeStamp();
    const email = this.user.email;
    //const email = "hasan.banna@example.com";
    this.getMessages();
    console.log(timeStamp);
    const data = {
      message: msg,
      timeSent: timeStamp,    // need to fix the timestamp
      userName: 'test_user',
      email: email
    };
    this.chatCollection.add(data);

    console.log('called sendmessage()');


  }

  getDisplayName() {

  }
  getMessages() {

    console.log('Calling getMessages()......')
    // return this.afs.collection('messages', ref => ref.orderBy('mid').limitToLast(25));
    return this.chat;

  }


  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
      (now.getUTCMonth() + 1) + '/' +
      now.getUTCDate();
    const time = now.getUTCHours() + ':' +
      now.getUTCMinutes() + ':' +
      now.getUTCSeconds();

    //return (date + ' ' + time);

    return now;
  }



}

