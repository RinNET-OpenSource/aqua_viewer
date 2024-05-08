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
import { MenuService } from './menu.service';

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


  constructor(
    protected authenticationService: AuthenticationService,
    protected accountService: AccountService,
    protected userService: UserService,
    protected router: Router,
    private api: ApiService,
    private preLoad: PreloadService,
    private messageService: MessageService,
    protected menuService: MenuService,
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
      this.userService.load();
    }
  }

  ngOnDestroy(): void {
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
