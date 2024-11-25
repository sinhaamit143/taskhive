import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProjectService } from '../../services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  projects: any[] = []; 
  project: any; 
  id: string | null = null; 
  env: string = environment.url; 
  itemsToShow: number = 3;

  constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    AOS.init({
      offset: 200,
      duration: 1000,
      easing: 'ease',
      delay: 100,
      once: true
    });

    this.route.params.subscribe((params: any) => {
      this.id = params.id;
      if (this.id) {
        this.getProjectById(this.id);
      } else {
        this.getPublicProjects();
      }
    });
  }

  getPublicProjects(): void {
    this.projectService.onProjectGetAllPublic().subscribe(
      (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.projects = res.data.map((project: any) => ({
            ...project,
            description: project.descriptions?.[0] || 'No description available',
          }));
          console.log('Processed Projects:', this.projects);
        } else {
          console.error('Unexpected API response structure:', res);
        }
      },
      (error: any) => {
        console.error('Error fetching projects:', error);
      }
    );
  }
  
  getProjectById(id: string): void {
    this.projectService.onProjectFindOne(id).subscribe((res: any) => {
      this.project = res;
    }, (error: any) => {
      console.error(error); 
    });
  }

  get visibleProjects(): any[] {
    return this.projects.slice(0, this.itemsToShow); 
  }

  getImageUrl(imagePath: string): string {
    return `${this.env}/${imagePath}`; 
  }
  
}
