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
import {StatusCode} from './status-code';

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
      url: 'ongeki/profile',
      show: false,
    },
    {
      id: 1,
      name: 'Battle Point',
      url: 'ongeki/battle',
      show: false,
    },
    {
      id: 2,
      name: 'Rating',
      url: 'ongeki/rating',
      show: false,
    },
    {
      id: 3,
      name: 'Play Record',
      url: 'ongeki/recent',
      show: false,
    },
    {
      id: 4,
      name: 'Music List',
      url: 'ongeki/song',
      show: true,
    },
    {
      id: 5,
      name: 'Card',
      url: 'ongeki/card',
      show: false,
    },
    {
      id: 6,
      name: 'Rival List',
      url: 'ongeki/rival',
      show: false,
    },
    {
      id: 7,
      name: 'Music Ranking',
      url: 'ongeki/musicRanking',
      show: true,
    },
    {
      id: 8,
      name: 'User Ranking',
      url: 'ongeki/userRanking',
      show: true,
    },
    {
      id: 9,
      name: 'Setting',
      url: 'ongeki/setting',
      show: false,
    }
  ];

  mobileQuery: MediaQueryList;

  dark = 'dark';
  v1Menus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'chuni/v1/profile',
      show: false,
    },
    {
      id: 1,
      name: 'Rating',
      url: 'chuni/v1/rating',
      show: false,
    },
    {
      id: 2,
      name: 'Play Record',
      url: 'chuni/v1/recent',
      show: false,
    },
    {
      id: 3,
      name: 'Music List',
      url: 'chuni/v1/song',
      show: true,
    },
    {
      id: 4,
      name: 'Character',
      url: 'chuni/v1/character',
      show: false,
    },
    {
      id: 5,
      name: 'Setting',
      url: 'chuni/v1/setting',
      show: false,
    }
  ];

  v2Menus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'chuni/v2/profile',
      show: false,
    },
    {
      id: 1,
      name: 'Rating',
      url: 'chuni/v2/rating',
      show: false,
    },
    {
      id: 2,
      name: 'Play Record',
      url: 'chuni/v2/recent',
      show: false,
    },
    {
      id: 3,
      name: 'Music List',
      url: 'chuni/v2/song',
      show: true,
    },
    {
      id: 4,
      name: 'Character',
      url: 'chuni/v2/character',
      show: false,
    },
    {
      id: 5,
      name: 'User Box',
      url: 'chuni/v2/userbox',
      show: false,
    },
    {
      id: 6,
      name: 'Setting',
      url: 'chuni/v2/setting',
      show: false,
    }
  ];

  mai2Menus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'mai2/profile',
      show: false,
    },
    {
      id: 1,
      name: 'Setting',
      url: 'mai2/setting',
      show: false,
    }
  ];

  divaMenus: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'diva/profile',
      show: false,
    },
    {
      id: 1,
      name: 'Pv Record',
      url: 'diva/record',
      show: false,
    },
    {
      id: 2,
      name: 'Pv List',
      url: 'diva/pv',
      show: true,
    },
    {
      id: 3,
      name: 'Recent Play',
      url: 'diva/recent',
      show: false,
    },
    {
      id: 4,
      name: 'Setting',
      url: 'diva/setting',
      show: false,
    },
    {
      id: 5,
      name: 'Management',
      url: 'diva/management',
      show: false,
    },
    {
      id: 6,
      name: 'Modules',
      url: 'diva/modules',
      show: false,
    },
    {
      id: 7,
      name: 'Customizes',
      url: 'diva/customizes',
      show: false,
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
    this.refreshMenus();
  }

  loadUser() {
    this.api.get('api/user/me').subscribe(
      resp => {
        if (resp?.status) {
          const statusCode: StatusCode = resp.status.code;
          if (statusCode === StatusCode.OK && resp.data) {
            this.authenticationService.currentAccountValue.name = resp.data.name;
            for (const card of resp.data.cards) {
              if (card.default) {
                this.authenticationService.currentAccountValue.currentCard = card.extId;
              }
            }
            this.authenticationService.currentAccountValue.games = resp.data.games;
            this.authenticationService.currentAccountValue = this.authenticationService.currentAccountValue;
            this.refreshMenus();
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

  ngOnChanges(): void {
    this.account = this.authenticationService.currentAccountValue;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    this.toastService.clear();
  }

  refreshMenus() {
    const map = new Map(
      [
        ['ongeki', this.ongekiMenu.filter(m => ![4, 7, 8].includes(m.id))],
        ['chusan', this.v2Menus.filter(m => m.id !== 3)],
        ['diva', this.divaMenus.filter(m => m.id !== 2)],
        ['maimai2', this.mai2Menus]
      ]
    );
    // 先全部设置为false再调
    map.forEach((menu, _) => {
      menu.forEach(m => m.show = true);
    });
    this.authenticationService.currentAccountValue.games.forEach(game => {
      map.get(game).forEach(menu => menu.show = true);
    });
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

  filterItems(menu: Menu[]) {
    return menu.filter(m => m.show);
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
  show: boolean;
}
