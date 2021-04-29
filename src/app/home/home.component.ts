import { Component, OnInit } from '@angular/core';

function toggleLanguageText() {
  const englishText = document.getElementById('englishText');
  if (englishText) englishText.hidden = !englishText.hidden;
  const vietnameseText = document.getElementById('vietnameseText');
  if (vietnameseText) vietnameseText.hidden = !vietnameseText.hidden;
  setTimeout(toggleLanguageText, 5000);
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    toggleLanguageText();
  }
}
