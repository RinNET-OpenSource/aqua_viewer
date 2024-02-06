import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Announcement} from '../dashboard.component';
import {marked} from 'marked';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent {
  @Input() announcement: Announcement;
  @ViewChild('content') set div(div: ElementRef<HTMLDivElement>) {
    const html: string = marked.parse(this.announcement.content) as string; // sb
    div.nativeElement.innerHTML = html;
  }
}
