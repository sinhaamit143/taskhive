import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { FileService } from '../../services/file/file.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent implements OnInit {
  env: string = environment.url;
  selectedBlog: any = {};
  myForm!: FormGroup;
  image: File[] = [];

  constructor(
    private _blogService: ApiService,
    private fb: FormBuilder,
    private fileServ: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.myForm = this.fb.group({
      image: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.fetchBlogById(blogId);
    } else {
      console.error('Blog ID is undefined on initialization');
      alert('Error: Blog ID is undefined on initialization');
    }
  }

  fetchBlogById(id: string) {
    this._blogService.get(`blogs/${id}`, {}).subscribe(
      (res) => {
        if (res && res.data && res.data._id) {
          this.selectedBlog = res.data;
          
          
          if (this.selectedBlog.image && !this.selectedBlog.image.startsWith('http')) {
            this.selectedBlog.image = this.selectedBlog.image.replace(/\\/g, '/');
          }
          console.log('Selected Blog Image:', this.selectedBlog.image);


          
          this.populateForm();
        } else {
          console.error('Blog data does not contain an _id:', res);
          alert('Error: Blog data is missing an ID.');
        }
      },
      (error) => {
        console.error(`Error fetching blog with ID ${id}:`, error);
        alert(`Error fetching blog: ${error.message}`);
      }
    );
  }

  populateForm() {
    this.myForm.patchValue({
      title: this.selectedBlog.title,
      description: this.selectedBlog.description,
      image: null
    });
  }

  handleFileInput(event: any) {
    this.selectedBlog.image = event.target.files[0];
  }

  onSelect(event: any): void {
    const file: File = event.addedFiles[0];
    if (file) {
      this.image = [file];
      this.myForm.patchValue({ image: file });
      this.myForm.get('image')?.updateValueAndValidity();
    }
  }

  onRemove(file: File): void {
    if (this.image.includes(file)) {
      this.image = [];
      this.myForm.patchValue({ image: null });
      this.myForm.get('image')?.updateValueAndValidity();
    }
  }

  uploadImage() {
    
    if (this.image.length === 0 && !this.selectedBlog.image) {
      alert('Please select an image');
      return;
    }
  
    
    this.selectedBlog.title = this.myForm.value.title;
    this.selectedBlog.description = this.myForm.value.description;
  
    if (this.image.length > 0) {
      this.fileServ.uploadFile(this.image[0]).subscribe(
        (res: any) => {
          if (res.type === HttpEventType.Response) {
            const body: any = res.body;
            if (body && body.file && body.file.path) {
              const imagePath = body.file.path.replace(/\\/g, '/'); 
              this.selectedBlog.image = imagePath;
              this.updateBlog();
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
      
      this.updateBlog();
    }
  }
  

  updateBlog() {
    this._blogService.put('blogs', this.selectedBlog._id, this.selectedBlog).subscribe(
      () => {
        alert('Blog updated successfully');
        this.router.navigate(['/blogs']);
      },
      (error) => {
        console.error('Error updating blog:', error);
        alert(`Error updating blog: ${error.message}`);
      }
    );
  }
}