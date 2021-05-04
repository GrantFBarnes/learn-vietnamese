import { Component, OnInit, OnDestroy, Input } from '@angular/core';

interface Title {
  english: string;
  vietnamese: string;
}

let timeoutCall: any;
function toggleLanguageText() {
  const englishText = document.getElementById('englishText');
  if (englishText) englishText.hidden = !englishText.hidden;
  const vietnameseText = document.getElementById('vietnameseText');
  if (vietnameseText) vietnameseText.hidden = !vietnameseText.hidden;
  timeoutCall = setTimeout(toggleLanguageText, 5000);
}

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css'],
})
export class JumbotronComponent implements OnInit, OnDestroy {
  @Input() title: Title = { english: '', vietnamese: '' };
  @Input() subTitle: Title = { english: '', vietnamese: '' };

  constructor() {}

  ngOnInit(): void {
    toggleLanguageText();
  }

  ngOnDestroy(): void {
    clearTimeout(timeoutCall);
  }
}
