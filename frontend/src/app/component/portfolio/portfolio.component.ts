import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  ngOnInit() {
    AOS.init({
      offset: 200, // offset (in px) from the original trigger point
  duration: 1000, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  delay: 100, // values from 0 to 3000, with step 50ms
      once: true       // Animation occurs only once when scrolling down
    });
  }
}
