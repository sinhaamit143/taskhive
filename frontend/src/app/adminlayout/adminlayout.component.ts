import { Component } from '@angular/core';

@Component({
  selector: 'app-adminlayout',
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.scss'
})
export class AdminlayoutComponent {
  title = 'HeaderSideNav';
  sideNavStatus: boolean = false;
}
