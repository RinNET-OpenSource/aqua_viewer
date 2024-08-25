import {AfterViewInit, Component, OnInit} from '@angular/core';
import {marked} from "marked";
import * as DOMPurify from "dompurify";
import {Announcement, AnnouncementComponent, AnnouncementStatus} from "../announcement/announcement.component";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {A} from "@angular/cdk/keycodes";
import {LanguageService} from "../../language.service";
import {HttpParams} from "@angular/common/http";
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
        this.loading = false;
        this.announcement = new Announcement();
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
    modalRef.componentInstance.announcement = {title, content};
  }

  post(status: AnnouncementStatus){
    let data;
    if(this.announcement.id === undefined){
      data = {
        title: this.announcement.title,
        content: this.announcement.content,
        translations: this.announcement.translations,
        status: status
      };
    }
    else{
      data = this.announcement;
      data.status = status;
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
}
