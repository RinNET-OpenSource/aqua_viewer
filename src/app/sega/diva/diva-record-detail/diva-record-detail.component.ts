import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../api.service';
import {AuthenticationService} from '../../../auth/authentication.service';
import {MessageService} from '../../../message.service';
import {HttpParams} from '@angular/common/http';
import {DivaRecordDetail} from '../model/DivaRecordDetail';
import {Difficulty, Edition} from '../model/DivaPvRecord';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DivaRankingRecord} from '../model/DivaRankingRecord';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DivaPv} from '../model/DivaPv';
import {DivaModule} from '../model/DivaModule';

@Component({
  selector: 'app-diva-record-detail',
  templateUrl: './diva-record-detail.component.html',
  styleUrls: ['./diva-record-detail.component.css']
})
export class DivaRecordDetailComponent implements OnInit {

  edition = Edition;
  difficulty = Difficulty;
  record: DivaRecordDetail;
  isEdit = false;
  customizeForm: FormGroup;
  pvId: number;
  pdId: number;

  moduleLoadFlag = 0;

  easyRanking: DivaRankingRecord[] = [];
  easyPage = 0;
  normalRanking: DivaRankingRecord[] = [];
  normalPage = 0;
  hardRanking: DivaRankingRecord[] = [];
  hardPage = 0;
  extremeRanking: DivaRankingRecord[] = [];
  extremePage = 0;
  extraExtremeRanking: DivaRankingRecord[] = [];
  extraExtremePage = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private dbService: NgxIndexedDBService
  ) {
  }

  get f() {
    return this.customizeForm.controls;
  }

  ngOnInit() {
    this.pvId = Number(this.route.snapshot.paramMap.get('pvId'));
    this.pdId = this.auth.currentAccountValue.currentCard.extId;
    const param = new HttpParams().set('pdId', String(this.pdId));
    this.api.get('api/game/diva/pvRecord/' + this.pvId, param).subscribe(
      data => {
        this.record = data;
        this.dbService.getByID<DivaPv>('divaPv', this.pvId).subscribe(x => this.record.songInfo = x);
        if (!this.record.customize) {
          this.record.customize = {
            pvId: this.pvId,
            module: '-999,-999,-999',
            customize: '-999,-999,-999,-999,-999,-999,-999,-999,-999,-999,-999,-999',
            customizeFlag: '-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1',
            skin: -1,
            buttonSe: -1,
            slideSe: -1,
            chainSlideSe: -1,
            sliderTouchSe: -1
          };
        }
        const moduleIds = this.record.customize.module.split(',');
        this.record.customize.modulesInfo = [];
        this.setModule(moduleIds, 0);
        this.setModule(moduleIds, 1);
        this.setModule(moduleIds, 2);
        this.customizeForm = this.fb.group({
          module: [this.record.customize.module, Validators.required],
          customize: [this.record.customize.customize, Validators.required],
          customizeFlag: [this.record.customize.customizeFlag, Validators.required],
          skin: [this.record.customize.skin, Validators.required],
          buttonSe: [this.record.customize.buttonSe, Validators.required],
          slideSe: [this.record.customize.slideSe, Validators.required],
          chainSlideSe: [this.record.customize.chainSlideSe, Validators.required],
          sliderTouchSe: [this.record.customize.sliderTouchSe, Validators.required],
        });
      },
      error => this.messageService.notice(error)
    );
    this.getRank('EASY');
    this.getRank('NORMAL');
    this.getRank('HARD');
    this.getRank('EXTREME');
    this.getRank('EXTRA_EXTREME');
  }

  setModule(moduleIds, i) {
    if (moduleIds[i] === '-999' || moduleIds[i] === '-1') {
      this.record.customize.modulesInfo[i] = {
        id: -999,
        name: 'Not Set',
        price: 0
      };
      this.moduleLoadFlag++;
    } else if (moduleIds[i] >= 0) {
      this.dbService.getByID<DivaModule>('divaModule', moduleIds[i]).subscribe(y => {
          this.record.customize.modulesInfo[i] = y;
          this.moduleLoadFlag++;
        }
      );
    }
  }

  onSubmit() {
    if (this.customizeForm.invalid) {
      return;
    }
    this.api.put('api/game/diva/pvRecord/' + this.pvId, {
      pdId: this.pdId,
      pvId: this.pvId,
      module: this.f.module.value,
      customize: this.f.customize.value,
      customizeFlag: this.f.customizeFlag.value,
      skin: this.f.skin.value,
      buttonSe: this.f.buttonSe.value,
      slideSe: this.f.slideSe.value,
      chainSlideSe: this.f.chainSlideSe.value,
      sliderTouchSe: this.f.sliderTouchSe.value
    }).subscribe(
      data => {
        this.record.customize = data;
        this.isEdit = false;
      },
      error => this.messageService.notice(error)
    );
  }

  addRival(recordId: number) {
    this.api.put('api/game/diva/playerInfo/rival/byRecord', {
      pdId: this.pdId,
      recordId
    }).subscribe(
      data => this.messageService.notice('OK'),
      error => this.messageService.notice(error)
    );
  }

  getRank(diff: string) {
    let param = null;
    switch (diff) {
      case 'EASY' :
        param = new HttpParams().set('page', String(this.easyPage));
        break;
      case 'NORMAL' :
        param = new HttpParams().set('page', String(this.normalPage));
        break;
      case 'HARD' :
        param = new HttpParams().set('page', String(this.hardPage));
        break;
      case 'EXTREME' :
        param = new HttpParams().set('page', String(this.extremePage));
        break;
      case 'EXTRA_EXTREME' :
        param = new HttpParams().set('page', String(this.extraExtremePage));
        break;
    }
    if (param == null) {
      return;
    }

    this.api.get('api/game/diva/pvRecord/' + this.pvId + '/ranking/' + diff, param).subscribe(
      data => {
        switch (diff) {
          case 'EASY' :
            data.content.forEach(x => this.easyRanking.push(x));
            break;
          case 'NORMAL' :
            data.content.forEach(x => this.normalRanking.push(x));
            break;
          case 'HARD' :
            data.content.forEach(x => this.hardRanking.push(x));
            break;
          case 'EXTREME' :
            data.content.forEach(x => this.extremeRanking.push(x));
            break;
          case 'EXTRA_EXTREME' :
            data.content.forEach(x => this.extraExtremeRanking.push(x));
            break;
        }
        if (data.page >= data.totalPages) {
          this.messageService.notice('No more record');
        } else {
          switch (diff) {
            case 'EASY' :
              this.easyPage += 1;
              break;
            case 'NORMAL' :
              this.normalPage += 1;
              break;
            case 'HARD' :
              this.hardPage += 1;
              break;
            case 'EXTREME' :
              this.extremePage += 1;
              break;
            case 'EXTRA_EXTREME' :
              this.extraExtremePage += 1;
              break;
          }
        }
      }, error => this.messageService.notice(error)
    );
  }
}
