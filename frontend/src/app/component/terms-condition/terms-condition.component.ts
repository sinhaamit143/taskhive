import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrl: './terms-condition.component.scss'
})
export class TermsConditionComponent implements OnInit {
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