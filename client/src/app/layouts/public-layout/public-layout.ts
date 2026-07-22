import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <main id="main-content" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <button class="scroll-to-top" [class.visible]="showTop" (click)="scrollTop()" title="Back to top">
      <span class="material-icons-round">keyboard_arrow_up</span>
    </button>
  `,
  styles: [`
    main { min-height: 60vh; outline: none; }
    .scroll-to-top { position: fixed; bottom: 1.5rem; right: 1.5rem; width: 44px; height: 44px;
      background: #003580; color: white; border: none; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 200; opacity: 0; pointer-events: none; transition: all 250ms ease;
      .material-icons-round { font-size: 22px; }
      &.visible { opacity: 1; pointer-events: auto; }
      &:hover { background: #C9A227; transform: translateY(-2px); }
    }
  `]
})
export class PublicLayoutComponent {
  showTop = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => { this.showTop = window.scrollY > 300; });
    }
  }

  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
