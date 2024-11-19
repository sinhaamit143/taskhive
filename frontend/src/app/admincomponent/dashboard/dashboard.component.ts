import { Component } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { ApiService } from '../../services/api/api.service';
import { ContactForm, ContactService } from '../../services/contact/contact.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  totalProjects: number = 0;
  totalQueries: number = 0;
  totalBlogs: number = 0;

  constructor(
    private _projectService: ProjectService,
    private _apiService: ApiService,
    private _contactService: ContactService
    ) {
    this.fetchCounts();
  }

  fetchCounts() {
    this.fetchTotalProjects();
    this.fetchTotalQueries();
    this.fetchTotalBlogs();
  }

  fetchTotalProjects() {
    this._projectService.get('projects', {}).subscribe(res => {
      this.totalProjects = res.data ? res.data.length : 0;
      console.log('Total Projects:', this.totalProjects);
    });
  }

  fetchTotalQueries() {
    this._contactService.onContactGetAll().subscribe((res: ContactForm[]) => {
      this.totalQueries = res.length; // Assuming res is an array of ContactForm objects
      console.log('Total Queries:', this.totalQueries);
    });
  }

  fetchTotalBlogs() {
    this._apiService.get('blogs', {}).subscribe(res => {
      this.totalBlogs = res.length;
      console.log('Total Blogs:', this.totalBlogs);
    });
  }
}