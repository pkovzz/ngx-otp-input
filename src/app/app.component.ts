import { inject as injectAnalytics } from '@vercel/analytics';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../components/Header.component';
import { HeroComponent } from '../components/hero.component';
import { FeaturesComponent } from '../components/features.component';
import { ExamplesComponent } from '../components/examples.component';
import { PlaygroundComponent } from '../components/playground.component';
import { ApiReferenceComponent } from '../components/api-reference.component';
import { FooterComponent } from '../components/footer.component';

type DemoTheme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    ExamplesComponent,
    PlaygroundComponent,
    ApiReferenceComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  isDarkTheme = false;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      injectAnalytics();
    }
    this.initializeTheme();
  }

  toggleTheme(): void {
    this.applyTheme(this.isDarkTheme ? 'light' : 'dark', true);
  }

  private initializeTheme(): void {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('ngx-demo-theme')
        : null;
    const initialTheme: DemoTheme =
      storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : prefersDark
          ? 'dark'
          : 'light';

    this.applyTheme(initialTheme, false);
  }

  private applyTheme(theme: DemoTheme, persist: boolean): void {
    this.isDarkTheme = theme === 'dark';
    const root = this.document.documentElement;
    root.setAttribute('data-theme', theme);

    const themeMeta = this.document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      const color = theme === 'dark' ? '#090b10' : '#fafaf9';
      themeMeta.setAttribute('content', color);
    }

    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem('ngx-demo-theme', theme);
    }
  }
}
