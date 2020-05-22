import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  private customMatIcons = [
    { key: 'animal_crossing_logo', location: '../assets/logo/logo.svg' }
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.customMatIcons.forEach(matIcon => {
      this.matIconRegistry.addSvgIcon(matIcon.key, this.domSanitizer.bypassSecurityTrustResourceUrl(matIcon.location));
    });
  }
}
