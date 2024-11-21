import {Component, Injectable, OnInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {


  constructor(
  ) {
  }


  ngOnInit() {}

}
