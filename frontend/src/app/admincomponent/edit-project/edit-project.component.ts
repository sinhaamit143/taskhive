import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project/project.service';
import { FileService } from '../../services/file/file.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {
  env: string = environment.url;
  selectedProject: any = {};
  myForm!: FormGroup;
  pImage: File[] = [];

  constructor(
    private _projectService: ProjectService,
    private fb: FormBuilder,
    private fileServ: FileService,
    private route: ActivatedRoute
  ) {
    this.myForm = this.fb.group({
      pImage: [null, Validators.required],
      pName: ['', Validators.required],
      pDescription: ['', Validators.required],
    });
  }

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.fetchProjectById(projectId);
    } else {
      console.error('project ID is undefined on initialization');
      alert('Error: project ID is undefined on initialization');
    }
  }

  fetchProjectById(id: string) {
    this._projectService.get(`projects/${id}`, {}).subscribe(
      (res) => {
        if (res && res.data && res.data._id) {
          this.selectedProject = res.data;
          
          // Convert backslashes to forward slashes in pImage path if any
          if (this.selectedProject.pImage) {
            this.selectedProject.pImage = this.selectedProject.pImage.replace(/\\/g, '/');
          }

          // Patch the form with project data
          this.populateForm();
        } else {
          console.error('project data does not contain an _id:', res);
          alert('Error: project data is missing an ID.');
        }
      },
      (error) => {
        console.error(`Error fetching project with ID ${id}:`, error);
        alert(`Error fetching project: ${error.message}`);
      }
    );
  }

  populateForm() {
    this.myForm.patchValue({
      pName: this.selectedProject.pName,
      pDescription: this.selectedProject.pDescription,
      pImage: null // Set pImage to null initially
    });
  }

  handleFileInput(event: any) {
    this.selectedProject.pImage = event.target.files[0];
  }

  onSelect(event: any): void {
    const file: File = event.addedFiles[0];
    if (file) {
      this.pImage = [file];
      this.myForm.patchValue({ pImage: file });
      this.myForm.get('pImage')?.updateValueAndValidity();
    }
  }

  onRemove(file: File): void {
    if (this.pImage.includes(file)) {
      this.pImage = [];
      this.myForm.patchValue({ pImage: null });
      this.myForm.get('pImage')?.updateValueAndValidity();
    }
  }

  uploadImage() {
    if (this.pImage.length === 0 && !this.myForm.value.pImage) {
      alert('Please select an pImage');
      return;
    }

    // Patch the selected project with the form values
    this.selectedProject.pName = this.myForm.value.pName;
    this.selectedProject.pDescription = this.myForm.value.pDescription;

    // If there is a new pImage, upload it
    if (this.pImage.length > 0) {
      this.fileServ.uploadFile(this.pImage[0]).subscribe(
        (res: any) => {
          if (res.type === HttpEventType.Response) {
            const body: any = res.body;
            if (body && body.file && body.file.path) {
              const imagePath = body.file.path.replace(/\\/g, '/');  // Ensure forward slashes
              this.selectedProject.pImage = imagePath;
              console.log('Image uploaded successfully, updating project...');
              this.updateProject();
            } else {
              console.error('Image upload response does not contain a valid path');
              alert('Error: Image upload failed.');
            }
          }
        },
        (error) => {
          console.error('Error uploading image:', error);
          alert(`Error uploading image: ${error.message}`);
        }
      );
    } else {
      // If no new image is selected, directly update the project
      this.updateProject();
    }
  }

  updateProject() {
    this._projectService.put('projects', this.selectedProject._id, this.selectedProject).subscribe(
      () => {
        console.log('project updated successfully');
        alert('project updated successfully');
      },
      (error) => {
        console.error('Error updating project:', error);
        alert(`Error updating project: ${error.message}`);
      }
    );
  }
}
