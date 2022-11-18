import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../message.service';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../auth/authentication.service';

@Component({
  selector: 'app-importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.css']
})
export class ImporterComponent implements OnInit {

  apiServer: string;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue) {
      this.apiServer = this.authenticationService.currentUserValue.apiServer;
    } else {
      this.apiServer = 'http://localhost:80';
    }
  }

  chunithm(event) {
    this.uploadDocument(event.target.files[0], 'api/game/chuni/v1/import', 'SDBT');
  }

  chusan(event) {
    this.uploadDocument(event.target.files[0], 'api/game/chuni/v2/import', 'SDHD');
  }

  ongeki(event) {
    this.uploadDocument(event.target.files[0], 'api/game/ongeki/import', 'SDDT');
  }

  maimai2(event) {
    this.uploadDocument(event.target.files[0], 'api/game/maimai2/import', 'SDEZ');
  }

  uploadDocument(file: File, path: string, type: string) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const j = JSON.parse(fileReader.result.toString());
      console.log(j);
      if (j.gameId === type) {
        this.http.post(this.apiServer + '/' + path, j).subscribe(
          data => this.messageService.notice('OK'),
          error => this.messageService.notice(error)
        );
      } else {
        this.messageService.notice('Wrong Game ID, please check you have select the correct file.');
      }
    };
    fileReader.readAsText(file);
    this.messageService.notice('Uploading...');
  }
}
