import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { FileService } from '../../services/file/file.service';
import { ProjectService } from '../../services/project/project.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {
  myForm!: FormGroup;
  isLoading = false;
  projects: any[] = [];
  images: File[] = [];

  constructor(
    private fb: FormBuilder,
    private fileServ: FileService,
    private _projectService: ProjectService,
    private as: AlertService,
    private route: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      descriptions: this.fb.array([this.createDescriptionField()], Validators.required), 
      images: this.fb.array([], Validators.required), 
    });
  }

  createDescriptionField(): FormGroup {
    return this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(600)]],
    });
  }

  get descriptions(): FormArray {
    return this.myForm.get('descriptions') as FormArray;
  }

  get imagesArray(): FormArray {
    return this.myForm.get('images') as FormArray;
  }

  addDescription(): void {
    this.descriptions.push(this.createDescriptionField());
  }

  removeDescription(index: number): void {
    this.descriptions.removeAt(index);
  }

  onFileSelect(event: any): void {
    const fileInput = event.target;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file: File = fileInput.files[0]; // Access the first file
      this.images.push(file); // Add file to the local images array
      console.log('Selected file:', file);
    } else {
      console.error('No file selected or invalid file input.');
    }
  }
  

  removeFile(index: number): void {
    this.images.splice(index, 1); // Remove file from the images array
    this.imagesArray.removeAt(index); // Remove file from the form array
  }
  
  

  uploadImages(): Promise<string[]> {
    const uploadTasks = this.images.map((file) =>
      this.fileServ.uploadFile(file).toPromise().then((res: any) => {
        if (res.type === HttpEventType.Response && res.body?.file) {
          return res.body.file.path.replace(/\\/g, '/'); // Normalize file path
        }
        return '';
      })
    );

    return Promise.all(uploadTasks);
  }

  async collectAndSubmitForm(): Promise<void> {
    if (this.myForm.valid) {
      try {

        const imagePaths = await this.uploadImages();


        this.imagesArray.clear();
        imagePaths.forEach((path) =>
          this.imagesArray.push(this.fb.control(path))
        );

        const formData = this.myForm.value;


        const result = await this._projectService.post('projects', formData).toPromise();

        
        this.as.successToast('Project created successfully');
        this.route.navigate(['/projects']);
        this.resetForm();

        console.log('Project created:', result);
      } catch (error) {
        
        this.as.errorToast('Error submitting the project');
        console.error('Error in collectAndSubmitForm:', error);
      }
    } else {
      
      this.as.errorToast('Please complete all required fields.');
    }
  }

  resetForm(): void {
    this.myForm.reset();
    this.images = [];
    while (this.descriptions.length > 1) {
      this.descriptions.removeAt(1);
    }
    this.descriptions.at(0).reset(); 
  }
}
