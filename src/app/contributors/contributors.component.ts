import { Component, OnInit } from '@angular/core';
import { ArrayUtils } from '../util/array-utils';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css']
})
export class ContributorsComponent implements OnInit {

  developers: Developer[] = [
    {id: 20372033, name: "HoshimiRin", link: "https://github.com/mxihan"},
    {id: 29558475, name: "Rinne", link: "https://github.com/OharaRinneY"},
    {id: 35133371, name: "Sanhei", link: "https://github.com/Sanheiii"},
    {id: 88378875, name: "TCPL", link: "https://github.com/xuanxuan-0403"}
  ];
  shuffledDevelopers: Developer[];
  sponsors: Sponsor[];

  constructor(
    protected translate: TranslateService,
    private http: HttpClient) {
    this.shuffledDevelopers = ArrayUtils.shuffleArray(this.developers);
  }

  ngOnInit() {
    this.loadSponsors();
  }

  loadSponsors(){
    const url = 'https://ghproxy.sakuramoe.dev/https://raw.githubusercontent.com/mxihan/afdian-action/main/Sponsors.json';
    this.http.get<any>(url).subscribe(
      resp => {
        if (resp.SponsorsList) {
          const sponsors: Sponsor[] = resp.SponsorsList;
          const sortedSponsors = sponsors.sort((a, b) => {
            const totalMoneyA = a.CurrentPlan && a.CurrentPlan !== "" ? a.TotalMoney * 2 : a.TotalMoney;
            const totalMoneyB = b.CurrentPlan && b.CurrentPlan !== "" ? b.TotalMoney * 2 : b.TotalMoney;
            return totalMoneyB - totalMoneyA;
          });
          this.sponsors = sortedSponsors;
        }
      },
      error =>{

      }
    )
  }
}

interface Developer{
  id: number,
  name: String,
  link: String
}

interface Sponsor {
  UserId: string;
  AvatarUrl: string;
  Name: string;
  SponsorshipCount: number;
  TotalMoney: number;
  Remarks: string;
  CurrentPlan?: string;
}
