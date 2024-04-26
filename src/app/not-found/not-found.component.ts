import {Component, ElementRef, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  @ViewChildren('faultTurtle') faultTurtle: QueryList<ElementRef>;
  faultTimer = null;
  host = environment.assetsHost;
  constructor(
    private renderer: Renderer2,
  ) {
  }


  ngOnInit(): void {
    clearInterval(this.faultTimer);
    this.faultTimer = setInterval(() => {
      this.faultTurtle.forEach((img) => {
        this.renderer.setStyle(img.nativeElement, 'transform', `translate(${Math.random() * 60 - 30}%, ${Math.random() * 60 - 30}%)`);
        this.renderer.addClass(img.nativeElement, 'logo-img_fault');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const h = Math.random() * 50 + 50;
        const w = Math.random() * 40 + 10;
        this.renderer.setStyle(img.nativeElement, 'clipPath', `
        polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`);
      });
    }, 30);
    setTimeout(() => this.faultStop(), 3000);
  }

  faultStop(): void {
    clearInterval(this.faultTimer);
    this.faultTurtle.forEach((img) => {
      this.renderer.removeClass(img.nativeElement, 'logo-img_fault');
      this.renderer.setStyle(img.nativeElement, 'transform', '');
      this.renderer.setStyle(img.nativeElement, 'clipPath', '');
    });
  }
}

