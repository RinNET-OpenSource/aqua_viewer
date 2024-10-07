import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {MessageService} from "../message.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {StatusCode} from "../status-code";
import {LanguageService} from "../language.service";
import {HttpParams} from "@angular/common/http";
import {Announcement, AnnouncementComponent, AnnouncementType} from "./announcement/announcement.component";
import {UserService} from "../user.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  announcementType = AnnouncementType;
  protected announcements: Announcement[];
  protected loading = true;
  currentPage = 1;
  type : AnnouncementType;
  pageSize = 10;
  totalElements = 0;
  constructor(
    private api: ApiService,
    protected lang: LanguageService,
    protected user: UserService,
    private messageService: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.route.queryParams.subscribe((data) => {
      if (data.page) {
        this.currentPage = data.page;
      }
      if (data.type) {
        if(Object.values(AnnouncementType).includes(data.type.toUpperCase())){
          this.type = data.type.toUpperCase() as AnnouncementType;
        }
        else{
          this.router.navigate([], {
            queryParams: { type: null },
            queryParamsHandling: 'merge'
          });
          return;
        }
      }
      else{
        this.type = undefined;
      }
      this.loadAnnouncements(this.currentPage);
    });
    this.translate.onLangChange.subscribe(event => {
      this.loadAnnouncements(this.currentPage)
    })
  }

  loadAnnouncements(page: number){
    this.loading = true;
    let param = new HttpParams()
      .set('lang', this.lang.getCurrentLang())
      .set('page', page - 1)
      .set('size', this.pageSize);
    if(this.type){
      param = param.set('type', this.type)
    }
    let api: string;
    if(this.isAdmin()){
      api = 'api/admin/announcement/';
    }
    else {
      api = 'api/user/announcement/';
    }

    this.api.get(api, param).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.totalElements = resp.data.totalElements;
            this.announcements = resp.data.content.map(a => {
                return Announcement.fromJSON(a);
            });
          }
          else{
            this.messageService.notice(resp.status.message);
          }
          this.loading = false;
        }
      },
      error => {
        this.messageService.notice(error);
        this.loading = false;
      });
  }

  showAnnouncement(announcement: Announcement) {
    let api: string;
    if(this.isAdmin()){
      api = 'api/admin/announcement/';
    }
    else {
      api = 'api/user/announcement/';
    }
    this.api.get(api + announcement.id, new HttpParams().set('lang', this.lang.getCurrentLang())).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            let announcement = Announcement.fromJSON(resp.data);
            const modalRef = this.modalService.open(AnnouncementComponent, {scrollable: true, centered: true});
            modalRef.componentInstance.announcement = announcement;
          }
          else{
            this.messageService.notice(resp.status.message);
          }
          this.loading = false;
        }
      },
      error => {
        this.messageService.notice(error);
        this.loading = false;
      });
  }

  pageChanged(page: number) {
    this.router.navigate(['/announcements'], {queryParams: {page}});
  }

  isAdmin() {
    return this.user.currentUser.roles.some(r => r.id === 5)
  }

  itemContext($event: MouseEvent, id: number) {
    if(this.isAdmin()){
      this.router.navigate(['/announcements/edit'], {queryParams: {id}});
      $event.preventDefault();
    }
  }

  protected readonly AnnouncementType = AnnouncementType;
}
