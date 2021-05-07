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
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
})
export class TitleComponent implements OnInit, OnDestroy {
  @Input() title: Title = { english: '', vietnamese: '' };
  @Input() subTitle: Title = { english: '', vietnamese: '' };

  constructor() {}

  ngOnInit(): void {
    if (this.title.vietnamese) {
      toggleLanguageText();
    } else {
      const englishText = document.getElementById('englishText');
      if (englishText) {
        englishText.hidden = false;
        englishText.className = '';
      }
    }
  }

  ngOnDestroy(): void {
    clearTimeout(timeoutCall);
  }
}
