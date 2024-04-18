import {ThemeService} from './theme.service';
import {LanguageService} from './language.service';
import {Component, HostListener, Inject, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from './auth/authentication.service';
import {NavigationEnd, Router} from '@angular/router';
import {PreloadService} from './database/preload.service';
import {Observable, filter, map} from 'rxjs';
import {ApiService} from './api.service';
import {ToastService} from './toast-service';
import * as bootstrap from 'bootstrap';
import {MessageService} from './message.service';
import {environment} from '../environments/environment';
import {DOCUMENT} from '@angular/common';
import {SwUpdate} from '@angular/service-worker';
import {UserService} from './user.service';
import {Account, AccountService} from './auth/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  themes = ['Auto', 'Light', 'Dark'];

  title = 'aqua-viewer';
  host = environment.assetsHost;

  sidebarOffcanvas: bootstrap.Offcanvas;
  sidebarOffcanvasOpened = false;

  disableSidebar = false;

  loading$: Observable<boolean>;
  ongekiMenu: Menu[] = [
    {
      id: 0,
      name: 'Profile',
      url: 'ongeki/profile',
      show: false,
    },
    {
      id: 1,
      name: 'BattlePoint',
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
      name: 'PlayRecord',
      url: 'ongeki/recent',
      show: false,
    },
    {
      id: 4,
      name: 'MusicList',
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
      name: 'Rival',
      url: 'ongeki/rival',
      show: false,
    },
    {
      id: 7,
      name: 'MusicRanking',
      url: 'ongeki/musicRanking',
      show: true,
    },
    {
      id: 8,
      name: 'UserRanking',
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
      name: 'PlayRecord',
      url: 'chuni/v2/recent',
      show: false,
    },
    {
      id: 3,
      name: 'MusicList',
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
      name: 'Rival',
      url: 'chuni/v2/rival',
      show: false,
    },
    {
      id: 6,
      name: 'UserBox',
      url: 'chuni/v2/userbox',
      show: false,
    },
    {
      id: 7,
      name: 'UserRanking',
      url: 'chuni/v2/userRanking',
      show: true,
    },
    {
      id: 8,
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


  constructor(
    protected authenticationService: AuthenticationService,
    protected accountService: AccountService,
    protected userService: UserService,
    protected router: Router,
    private api: ApiService,
    private preLoad: PreloadService,
    private messageService: MessageService,
    protected toastService: ToastService,
    protected languageService: LanguageService,
    protected themeService: ThemeService,
    updates: SwUpdate,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/') {
        this.initializeApp();
      }
    });
    this.loading$ = this.api.loadingState;
    if (updates.isEnabled) {
      updates.available.subscribe(
        event => {
          updates.activateUpdate().then(() => document.location.reload());
        });
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let currentRoute = this.router.routerState.root;
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }
        return currentRoute;
      }),
      filter(route => route.outlet === 'primary'),
      map(route => route.snapshot),
      map(snapshot => snapshot.data.disableSidebar)
    ).subscribe((disableSidebar) => {
      this.disableSidebar = disableSidebar;
    });
  }

  ngOnInit(): void {
    this.initializeApp();
  }

  private initializeApp() {
    if (this.accountService.currentAccountValue) {
      this.preLoad.checkDbUpdate();
      this.loadUser();
      this.refreshMenus();
    }
  }

  loadUser() {
    this.userService.load().then(resp => {
      this.refreshMenus();
    });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  refreshMenus() {
    const menuMap = new Map(
      [
        ['ongeki', this.ongekiMenu.filter(m => ![4, 7, 8].includes(m.id))],
        ['chusan', this.v2Menus.filter(m => ![3, 7].includes(m.id))],
        ['maimai2', this.mai2Menus]
      ]
    );
    // 先全部设置为false再调
    menuMap.forEach((menu, _) => {
      menu.forEach(m => m.show = false);
    });
    if(this.userService?.currentUser){
      this.userService.currentUser.games.forEach(game => {
        menuMap.get(game).forEach(menu => menu.show = true);
      });
    }
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
