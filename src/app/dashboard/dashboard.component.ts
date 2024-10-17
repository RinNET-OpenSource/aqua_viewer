import {Component, OnInit} from '@angular/core';
import {PreloadService} from '../database/preload.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {environment} from '../../environments/environment';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {MessageService} from '../message.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../auth/authentication.service';
import {StatusCode} from '../status-code';
import {Router} from '@angular/router';
import {Announcement, AnnouncementComponent} from '../announcements/announcement/announcement.component';
import {LanguageService} from "../language.service";
import {HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  host = environment.assetsHost;
  totalPreloadTaskCount = 0;
  downloadingPreloadTaskCount = 0;
  completedPreloadTaskCount = 0;
  errorPreloadTaskCount = 0;
  enableImages = environment.enableImages;
  announcement: Announcement;
  loadingAnnouncement = true;
  loadingDatabase = true;
  loadingProfile = true;
  loadingKeychip = true;
  loadingTrustedKeychip = true;
  checkingUpdate = true;
  dbVersion = 0;
  noCard = false;
  hasKeychip = false;
  hasTrustedKeychip = false;
  protected ongekiProfile;
  protected chusanProfile;
  protected mai2Profile;

  constructor(
    private dbService: NgxIndexedDBService,
    private preload: PreloadService,
    protected authenticationService: AuthenticationService,
    private api: ApiService,
    private messageService: MessageService,
    private modalService: NgbModal,
    protected  router: Router,
    protected language: LanguageService,
    private translate: TranslateService
  ) {
    this.loadAnnouncements();
  }

  ngOnInit() {
    this.addStatusSubscribe(this.preload.ongekiCardState);
    this.addStatusSubscribe(this.preload.ongekiCharacterState);
    this.addStatusSubscribe(this.preload.ongekiMusicState);
    this.addStatusSubscribe(this.preload.ongekiSkillState);
    this.addStatusSubscribe(this.preload.ongekiTrophyState);
    this.addStatusSubscribe(this.preload.chusanMusicState);
    this.addStatusSubscribe(this.preload.chusanCharacterState);
    this.addStatusSubscribe(this.preload.chusanTrophyState);
    this.addStatusSubscribe(this.preload.chusanNamePlateState);
    this.addStatusSubscribe(this.preload.chusanSystemVoiceState);
    this.addStatusSubscribe(this.preload.chusanMapIconState);
    this.addStatusSubscribe(this.preload.chusanFrameState);
    this.addStatusSubscribe(this.preload.chusanAvatarAccState);
    this.addStatusSubscribe(this.preload.maimai2MusicState);
    this.preload.checkingUpdateObservable.subscribe(checkingUpdate => {
      this.checkingUpdate = checkingUpdate;
    });
    this.preload.dbVersionObservable.subscribe(dbVersion => {
      this.dbVersion = dbVersion;
    });
    this.translate.onLangChange.subscribe(event => {
      this.loadingAnnouncement = true;
      this.loadAnnouncements()
    })

    this.getProfiles();
    this.loadKeychip();
    this.loadTrustedKeychip();
  }

  getProfiles(){
    this.api.get('api/user/profiles').subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.chusanProfile = resp.data.chusan;
            this.ongekiProfile = resp.data.ongeki;
            this.mai2Profile = resp.data.maimai2;
          }
          else if (statusCode === StatusCode.NOT_FOUND){
            this.noCard = true;
          }
          else{
            this.messageService.notice(resp.status.message);
          }
          this.loadingProfile = false;
        }
      },
      error => {
        this.messageService.notice(error);
        this.loadingProfile = false;
      });
  }

  addStatusSubscribe(observable: Observable<string>){
    this.totalPreloadTaskCount++;
    observable.subscribe(data => {this.onStateChanged(data); });
  }

  onStateChanged(data: string) {
    if (data === 'Downloading') {
      this.downloadingPreloadTaskCount++;
    }
    if (data === 'OK') {
      this.completedPreloadTaskCount++;
    }
    if (data === 'Error') {
      this.errorPreloadTaskCount++;
    }
    if (this.completedPreloadTaskCount + this.errorPreloadTaskCount === this.totalPreloadTaskCount) {
      this.loadingDatabase = false;
    }
  }

  reload() {
    this.preload.reload();
  }

  loadAnnouncements() {
    const param = new HttpParams().set('lang', this.language.getCurrentLang())
    this.api.get('api/user/announcement/recent', param).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.announcement = Announcement.fromJSON(resp.data);
          }
          else{
            this.messageService.notice(resp.status.message);
          }
          this.loadingAnnouncement = false;
        }
      },
      error => {
        this.messageService.notice(error);
        this.loadingAnnouncement = false;
      });
  }

  loadKeychip(){
    this.api.get('api/user/keychip').subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.hasKeychip = resp.data.length > 0;
          } else {
            this.messageService.notice(resp.status.message);
          }
        } else {
          this.messageService.notice('Load keychips failed.');
        }
        this.loadingKeychip = false;
      },
      error => {
        this.messageService.notice(error);
      }
    );
  }

  loadTrustedKeychip(){
    this.api.get('api/user/keychip/trustKeychip').subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.hasTrustedKeychip = resp.data.length > 0;
          } else {
            this.messageService.notice(resp.status.message);
          }
        } else {
          this.messageService.notice('Load trusted keychips failed.');
        }
        this.loadingTrustedKeychip = false;
      },
      error => {
        this.messageService.notice(error);
      }
    );
  }

  showAnnouncement(announcement: Announcement) {
    const modalRef = this.modalService.open(AnnouncementComponent, {scrollable: true, centered: true});
    modalRef.componentInstance.announcement = announcement;
  }

  getFormattedNumberByDigit(input: string, digit: number): string {
    return input.toString().padStart(digit, '0');
  }
}

