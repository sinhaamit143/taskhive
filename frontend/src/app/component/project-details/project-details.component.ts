import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProjectService } from '../../services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  project: any; 
  env: string = environment.url; 

  constructor(
    private projectService: ProjectService, 
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    AOS.init({
      offset: 200, 
      duration: 1000, 
      easing: 'ease', 
      delay: 100, 
      once: true       
    });

    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.fetchProjectDetails(projectId);
    }
  }

   // Fetch project details by ID
   fetchProjectDetails(id: string): void {
    this.projectService.onProjectFindOne(id).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.project = response.data; 
          console.log('Project Details:', this.project);
        } else {
          console.error('Unexpected API response:', response);
        }
      },
      (error) => {
        console.error('Error fetching project details:', error);
      }
    );
  }

  getImageUrl(imagePath: string): string {
    return `${this.env}/${imagePath}`;
  }

}
