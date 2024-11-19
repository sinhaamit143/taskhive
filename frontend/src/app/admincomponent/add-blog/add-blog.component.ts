import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { ApiService } from '../../services/api/api.service';
import { FileService } from '../../services/file/file.service';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent implements OnInit {
  myForm!: FormGroup;
  isLoading = false;
  image: File[] = []; 
  

  constructor(
    private fb: FormBuilder,
    private fileServ: FileService,
    private api: ApiService,
    private as: AlertService,
    private route : Router
  ) {
    this.myForm = this.fb.group({
      image: [null, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {}

  uploadImage(frm: FormGroup) {
    if (this.image.length > 0) {
      this.fileServ.uploadFile(this.image[0]).subscribe(
        (res: any) => {
          if (res.type === HttpEventType.Response) {
            const body: any = res.body;
            const imagePath = body.file.path;
            this.myForm.patchValue({ image: imagePath }); // Update image path in form
            this.onSubmit(frm);
          }
        },
        (error) => {
          this.as.errorToast(`Error uploading image: ${error.message}`);
        }
      );
    } else {
      this.as.warningToast('Please select an image');
    }
  }

  onSubmit(frm: FormGroup) {
    if (frm.valid) {
      this.isLoading = true;
      this.api.post('blogs', frm.value).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res) {
            this.route.navigate(['/blogs']);
            this.as.successToast('Blog created successfully!');
          } else {
            this.as.warningToast(res.error.message);
          }
        },
        (error) => {
          this.isLoading = false;
          this.as.errorToast(error.message);
        }
      );
    }
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
}
