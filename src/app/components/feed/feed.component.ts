import { Component, OnChanges, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../models/chat-message';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnChanges {

  feed: Observable<ChatMessage[]>;


  constructor(private chat: ChatService) {


  }

  ngOnInit() {
    console.log('feed initializing.....');

    this.feed = this.chat.getMessages();



  }

  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.feed = this.chat.getMessages();

  }

}
