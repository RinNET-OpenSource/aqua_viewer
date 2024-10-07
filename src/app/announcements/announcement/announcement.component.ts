import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {marked} from 'marked';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as DOMPurify from 'dompurify';
import {LanguageService} from "../../language.service";

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent {
  @Input() announcement: Announcement;
  @ViewChild('content') set div(div: ElementRef<HTMLDivElement>) {
    const html: string = marked.parse(this.announcement.getLocalContent(this.language.getCurrentLang())) as string;
    div.nativeElement.innerHTML = DOMPurify.sanitize(html);
  }

  constructor(
    public activeModal: NgbActiveModal,
    protected language: LanguageService
  ) {}
}

export class Announcement {
  id: number;
  title: string = '';
  content: string = '';
  expirationDate: Date;
  updatedAt: Date;
  status: AnnouncementStatus;
  type: AnnouncementType;
  priority: number;
  translations: LocalAnnouncement[] = [{language: 'en', translatedTitle: '',translatedContent: ''}];

  static fromJSON(json: any): Announcement{
    let announcement = new Announcement()
    announcement.id = json.id;
    announcement.title = json.title;
    announcement.content = json.content;
    announcement.expirationDate = new Date(json.expirationDate);
    announcement.updatedAt = new Date(json.updatedAt);
    announcement.status = json.status;
    announcement.type = json.type;
    announcement.priority = json.priority;
    announcement.translations = json.translations;
    return announcement;
  }

  public getLocalTitle(lang: string){
    let trans: LocalAnnouncement;
    if(this.translations){
      trans = this.translations.find(t => t.language === lang);
    }
    return trans?.translatedTitle??this.title;
  }

  public getLocalContent(lang: string){
    let trans: LocalAnnouncement;
    if(this.translations){
      trans = this.translations.find(t => t.language === lang);
    }
    return trans?.translatedContent??this.content;
  }
}

export interface LocalAnnouncement{
  language: string;
  translatedTitle: string;
  translatedContent: string;
}

export enum AnnouncementStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DRAFT = 'DRAFT'
}

export enum AnnouncementType {
  GENERAL = 'GENERAL',
  MAINTENANCE = 'MAINTENANCE',
  UPDATE = 'UPDATE',
  EVENT = 'EVENT',
  TUTORIAL = 'TUTORIAL',
  OTHER = 'OTHER'
}
