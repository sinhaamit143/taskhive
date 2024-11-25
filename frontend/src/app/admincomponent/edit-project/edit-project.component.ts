import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  projectForm: FormGroup;
  images: File[] = [];
  env: string = environment.url;
  selectedProject: any = {};
  image: File[] = [];

  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,
    private fileServ: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.env = environment.url;
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      descriptions: this.fb.array([]),
      images: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const fetchedData = {
      "name": '',
      "descriptions": [''],
      "images": [''],
    };
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.fetchProjectById(projectId);
      this.setDescriptions(this.selectedProject.descriptions);
      this.setImages(this.selectedProject.images); 
    } else {
      console.error('Project ID is undefined on initialization');
      alert('Error: Project ID is undefined on initialization');
    }
    this.projectForm.patchValue({ name: fetchedData.name });
  }
  
  fetchProjectById(id: string) {
    this.projectService.get(`projects/${id}`, {}).subscribe(
      (res: any) => {
        if (res?.data) {
          this.selectedProject = res.data;
          this.projectForm.patchValue({ name: this.selectedProject.name });
          const descriptionsControl = this.projectForm.get('descriptions') as FormArray;
          this.selectedProject.descriptions.forEach((desc: string) => {
            descriptionsControl.push(this.fb.control(desc, Validators.required));
          });
          const imagesControl = this.projectForm.get('images') as FormArray;
          this.selectedProject.images.forEach((img: string) => {
            imagesControl.push(this.fb.control(`${img}`));
          });
        } else {
          console.error('Project data not found:', res);
          alert('Error: Project data not found.');
        }
      },
      (error) => {
        alert('Error fetching project data.');
        console.error('Error fetching project:', error);
      }
    );
  }
  
  get descriptions() {
    return this.projectForm.get('descriptions') as FormArray;
  }
  
  get imagesArray() {
    return this.projectForm.get('images') as FormArray;
  }

  setDescriptions(descriptions: string[]) {
    descriptions.forEach(description => {
      this.descriptions.push(this.fb.control(description, Validators.required));
    });
  }

  setImages(images: string[]) {
    images.forEach(image => {
      this.imagesArray.push(this.fb.control(image, Validators.required));
    });
  }
  
  addDescription() {
    this.descriptions.push(this.fb.control('', Validators.required));
  }
  
  removeDescription(index: number) {
    this.descriptions.removeAt(index);
  }
  
  addImage() {
    this.imagesArray.push(this.fb.control('', Validators.required));
  }
  
  removeImage(index: number) {
    this.imagesArray.removeAt(index);
  }
  
  onFileSelect(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.images[index] = file;
      const imagesControl = this.projectForm.get('images') as FormArray;
      imagesControl.controls[index].setValue(file);
    }
  }

  async uploadImages(): Promise<string[]> {
    console.log(this.images);
    const uploadTasks = this.images.map((file) =>
      this.fileServ.uploadFile(file).toPromise().then((res: any) => {
        if (res.type === HttpEventType.Response && res.body?.file) {
          return res.body.file.path.replace(/\\/g, '/'); 
        }
        return '';
      })
    );
    return Promise.all(uploadTasks);
  }
  
  async onSubmit() {
    if (this.projectForm.invalid) {
      alert('Please complete all required fields.');
      return;
    }
    const imagePaths = await this.uploadImages();
        imagePaths.forEach((path) => {
          if (path) { 
            this.imagesArray.push(this.fb.control(path));
          }
    });
    const formData = this.projectForm.value;
    formData.images = formData.images.filter((obj: {}) => Object.keys(obj).length > 0);
    this.projectService.put('projects', this.selectedProject._id, formData).subscribe(
      (response) => {
        alert('Project updated successfully!');
        this.router.navigate(['/projects']);
      },
      (error) => {
        console.error('Error updating project:', error);
        alert('Error updating project.');
      }
    );
  }
}