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
  projectForm: FormGroup;
  images: File[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private fileService: FileService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      descriptions: this.fb.array([]),
      images: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const fetchedData = {
      "name": '',
      "descriptions": [''],
      "images": [''],
    };

    this.projectForm.patchValue({ name: fetchedData.name });

    this.setDescriptions(fetchedData.descriptions);
    this.setImages(fetchedData.images);
    console.log(this.projectForm.value);
    console.log('Descriptions Controls:', this.descriptions.controls);
    console.log('Images Controls:', this.imagesArray.controls);
  }

  
  get descriptions(): FormArray {
    return this.projectForm.get('descriptions') as FormArray;
  }

  
  get imagesArray(): FormArray {
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
      console.log(image);
    });
  }

  addDescription() {
    this.descriptions.push(this.fb.control('', Validators.required));
    console.log('After Adding Description:', this.projectForm.value);
    console.log('Descriptions Controls:', this.descriptions.controls);
  }

  removeDescription(index: number) {
    this.descriptions.removeAt(index);
    console.log('After Removing Description:', this.projectForm.value);
    console.log('Descriptions Controls:', this.descriptions.controls);
  }


  onFileSelect(event: any, index: number): void {
    const fileInput = event.target;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file: File = fileInput.files[0]; 
      this.images[index] = file; 
      this.imagesArray.at(index).setValue(file.name);
      console.log('Selected file:', file);
      console.log('Images Array After File Select:', this.imagesArray.controls);
    } else {
      console.error('No file selected or invalid file input.');
    }
  }

  
  addImage() {
    this.imagesArray.push(this.fb.control('', Validators.required));
    console.log('After Adding Image:', this.projectForm.value);
    console.log('Images Controls:', this.imagesArray.controls);
    console.log(this.imagesArray.value);
  }

  removeImage(index: number) {
    this.images.splice(index, 1); 
    this.imagesArray.removeAt(index); 
    console.log('After Removing Image:', this.projectForm.value);
    console.log('Images Controls:', this.imagesArray.controls);
  }

  async uploadImages(): Promise<string[]> {
    const uploadTasks = this.images.map((file) =>
      this.fileService.uploadFile(file).toPromise().then((res: any) => {
        if (res.type === HttpEventType.Response && res.body?.file) {
          return res.body.file.path.replace(/\\/g, '/'); 
        }
        return '';
      })
    );

    return Promise.all(uploadTasks);
  }

  async onSubmit() {
    if (this.projectForm.valid) {
      console.log('Form on Submit:', this.projectForm.value);
      try {
        const imagePaths = await this.uploadImages();

        
        this.imagesArray.clear();
        imagePaths.forEach((path) => {
          if (path) { 
            this.imagesArray.push(this.fb.control(path));
          }
        });

        
        const formData = this.projectForm.value;
        console.log(formData)
        console.log(typeof formData);
       
        const result = await this.projectService.post('projects', formData).toPromise();
        
        this.alertService.successToast('Project created successfully');
        alert("Project created successfully");
        this.router.navigate(['/projects']);
        this.resetForm();

        console.log('Project created:', result);
      } catch (error) {
        this.alertService.errorToast('Error submitting the project');
        console.error('Error in onSubmit:', error);
      }
    } else {
      this.alertService.errorToast('Please complete all required fields.');
      console.error('Form is invalid:', this.projectForm.value);
    }
  }

  resetForm(): void {
    this.projectForm.reset();
    this.images = []; 
    this.imagesArray.clear(); 
    this.descriptions.clear();
  }
}
