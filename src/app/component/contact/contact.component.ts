import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  myForm!: FormGroup;
  isLoading=false;
  constructor(private fb: FormBuilder, private _contactService:ContactService) {}
  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }
  onSubmit(form: FormGroup) {
this.isLoading=true;
    this._contactService.onContactSave(form.value).subscribe(res=>{
      Swal.fire({
        title: "Success!",
        text: "We have received your message !!",
        icon: "success"
      });
      this.isLoading=false;
      this.myForm.reset();
    })

    // console.log('Valid?', form.valid); // true or false
    // console.log('Name', form.value.name);
    // console.log('Email', form.value.email);
    // console.log('Message', form.value.message);
  }
}