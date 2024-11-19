import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit{
  @Input() sideNavStatus: boolean = false;
  
  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa-solid fa-house',
      route: '/dashboard' // Add route path here
    },
    {
      number: '2',
      name: 'Blogs',
      icon: 'fa-solid fa-blog',
      route: '/blogs' // Add route path here
    },
    {
      number: '3',
      name: 'Contacts',
      icon: 'fa-solid fa-phone',
      route: '/query' // Add route path here
    },
    {
      number: '4',
      name: 'Projects',
      icon: 'fa-solid fa-diagram-project',
      route: '/projects' // Add route path here
    }
  ];

  constructor(){}
  ngOnInit(): void {
    
  }
}
