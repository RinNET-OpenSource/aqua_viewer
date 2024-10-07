import {AfterViewInit, Component, OnInit} from '@angular/core';
import {
  Announcement,
  AnnouncementComponent,
  AnnouncementStatus,
  AnnouncementType
} from "../announcement/announcement.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute} from "@angular/router";
import {LanguageService} from "../../language.service";
import {StatusCode} from "../../status-code";
import {MessageService} from "../../message.service";
import {ApiService} from "../../api.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit   {
  announcement: Announcement;
  loading = true;
  activeTab: string;
  announcementType = AnnouncementType;

  constructor(
    public route: ActivatedRoute,
    private messageService: MessageService,
    private api: ApiService,
    protected language: LanguageService,
    private modalService: NgbModal) {
    this.activeTab = language.getDefaultLang();
  }

  ngOnInit(){
    this.route.queryParams.subscribe((data) => {
      if ((Number)(data.id)) {
        this.loadAnnouncement(data.id);
      }
      else{
        let announcement = new Announcement();
        announcement.type = AnnouncementType.GENERAL;
        announcement.priority = 0;
        this.announcement = announcement;
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    document.getElementById('myTab').addEventListener('shown.bs.tab', (event: any) => {
      const activatedTabId = event.target.id;
      this.activeTab = activatedTabId.split('-')[0];
    });
  }

  showPreview(title, content) {
    const modalRef = this.modalService.open(AnnouncementComponent, {scrollable: true, centered: true});
    const announcement = new Announcement();
    announcement.title = title;
    announcement.content = content;
    modalRef.componentInstance.announcement = announcement;
  }

  post(status: AnnouncementStatus){
    let data;
    if(this.announcement.id === undefined){
      data = {
        title: this.announcement.title,
        content: this.announcement.content,
        translations: this.announcement.translations,
        type: this.announcement.type,
        status: status,
        updatedAt: Date.now()
      };
    }
    else{
      data = this.announcement;
      data.status = status;
    }
    if(status === AnnouncementStatus.EXPIRED || status === AnnouncementStatus.DRAFT){
      data.updatedAt = this.announcement.updatedAt;
    }
    this.api.post('api/admin/announcement', data).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK) {
            this.messageService.notice(resp.status.message);
          }
          else{
            this.messageService.notice(resp.status.message);
          }
        }
      },
        error => {
        this.messageService.notice(error);
    });
  }

  private loadAnnouncement(id: number) {
    this.api.get('api/admin/announcement/' + id).subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.announcement = Announcement.fromJSON(resp.data);
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

  protected readonly AnnouncementStatus = AnnouncementStatus;
  protected readonly AnnouncementType = AnnouncementType;
}
