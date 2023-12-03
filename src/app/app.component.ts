import {ChangeDetectorRef, Component, HostListener, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Account, AuthenticationService} from './auth/authentication.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {PreloadService} from './database/preload.service';
import {Subscription} from 'rxjs';
import {ApiService} from './api.service';
import {ToastService} from './toast-service';
import * as bootstrap from 'bootstrap';
import {MessageService} from './message.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  title = 'aqua-viewer';
  host = environment.assetsHost;

  sidebarOffcanvas: bootstrap.Offcanvas;
  sidebarOffcanvasOpened = false;
  account: Account;

  loading = false;
  ongekiMenu: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'ongeki/profile'
    },
    {
      id: 1,
      name: 'Battle Point',
      url: 'ongeki/battle'
    },
    {
      id: 2,
      name: 'Rating',
      url: 'ongeki/rating'
    },
    {
      id: 3,
      name: 'Play Record',
      url: 'ongeki/recent'
    },
    {
      id: 4,
      name: 'Music List',
      url: 'ongeki/song'
    },
    {
      id: 5,
      name: 'Card',
      url: 'ongeki/card'
    },
    {
      id: 6,
      name: 'Rival List',
      url: 'ongeki/rival'
    },
    {
      id: 7,
      name: 'Music Ranking',
      url: 'ongeki/musicRanking'
    },
    {
      id: 8,
      name: 'User Ranking',
      url: 'ongeki/userRanking'
    },
    {
      id: 9,
      name: 'Setting',
      url: 'ongeki/setting'
    }
  ];

  mobileQuery: MediaQueryList;

  dark = 'dark';
  v1Menus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'chuni/v1/profile'
    },
    {
      id: 1,
      name: 'Rating',
      url: 'chuni/v1/rating'
    },
    {
      id: 2,
      name: 'Play Record',
      url: 'chuni/v1/recent'
    },
    {
      id: 3,
      name: 'Music List',
      url: 'chuni/v1/song'
    },
    {
      id: 4,
      name: 'Character',
      url: 'chuni/v1/character'
    },
    {
      id: 5,
      name: 'Setting',
      url: 'chuni/v1/setting'
    }
  ];

  v2Menus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'chuni/v2/profile'
    },
    {
      id: 1,
      name: 'Rating',
      url: 'chuni/v2/rating'
    },
    {
      id: 2,
      name: 'Play Record',
      url: 'chuni/v2/recent'
    },
    {
      id: 3,
      name: 'Music List',
      url: 'chuni/v2/song'
    },
    {
      id: 4,
      name: 'Character',
      url: 'chuni/v2/character'
    },
    {
      id: 5,
      name: 'User Box',
      url: 'chuni/v2/userbox'
    },
    {
      id: 6,
      name: 'Setting',
      url: 'chuni/v2/setting'
    }
  ];

  mai2Menus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'mai2/profile'
    },
    {
      id: 1,
      name: 'Setting',
      url: 'mai2/setting'
    }
  ];

  divaMenus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'diva/profile'
    },
    {
      id: 1,
      name: 'Pv Record',
      url: 'diva/record'
    },
    {
      id: 2,
      name: 'Pv List',
      url: 'diva/pv'
    },
    {
      id: 3,
      name: 'Recent Play',
      url: 'diva/recent'
    },
    {
      id: 4,
      name: 'Setting',
      url: 'diva/setting'
    },
    {
      id: 5,
      name: 'Management',
      url: 'diva/management'
    },
    {
      id: 6,
      name: 'Modules',
      url: 'diva/modules'
    },
    {
      id: 7,
      name: 'Customizes',
      url: 'diva/customizes'
    },
  ];
  private subscription: Subscription;
  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public authenticationService: AuthenticationService,
    private router: Router,
    private api: ApiService,
    private preLoad: PreloadService,
    private messageService: MessageService,
    public toastService: ToastService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.account = authenticationService.currentAccountValue;
  }

  ngOnInit(): void {
    if (this.account !== null) {
      this.preLoad.load();
      this.loadUser();
    }
    this.subscription = this.api.loadingState.subscribe(
      state => this.loading = state.show
    );
  }

  loadUser() {
    this.api.get('api/user/me').subscribe(
      data => {
        this.authenticationService.currentAccountValue.name = data.name;
        const cards = data.cards;
        for (const card of cards) {
          if (card.default){
            this.authenticationService.currentAccountValue.currentCard = card.extId;
          }
        }
        this.authenticationService.currentAccountValue = this.authenticationService.currentAccountValue;
      },
      error => {
        this.messageService.notice(error);
      });
  }

  ngOnChanges(): void {
    this.account = this.authenticationService.currentAccountValue;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    this.toastService.clear();
  }

  logout() {
    this.authenticationService.logout();
    location.assign('');
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
  hideSidebar(){
    this.sidebarOffcanvas?.hide();
  }
  showSidebar(){
    if (!this.sidebarOffcanvas){
      const offcanvasElement = document.getElementById('sidebar');
      this.sidebarOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
      offcanvasElement.addEventListener('show.bs.offcanvas', () => {
        this.sidebarOffcanvasOpened = true;
      });
      offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
        this.sidebarOffcanvasOpened = false;
      });
    }
    this.sidebarOffcanvas.show();
  }
  navigateTo(routerLink: string){
    this.router.navigateByUrl(routerLink);
    this.hideSidebar();
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (this.sidebarOffcanvasOpened) {
      this.hideSidebar();
    }
  }
}

export class Menu {
  id: number;
  name: string;
  url: string;
}
