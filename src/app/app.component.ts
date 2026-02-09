import { inject } from '@vercel/analytics';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/Header.component';
import { HeroComponent } from '../components/hero.component';
import { FeaturesComponent } from '../components/features.component';
import { ExamplesComponent } from '../components/examples.component';
import { PlaygroundComponent } from '../components/playground.component';
import { ApiReferenceComponent } from '../components/api-reference.component';
import { FooterComponent } from '../components/footer.component';

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
  ngOnInit(): void {
    inject();
  }
}
