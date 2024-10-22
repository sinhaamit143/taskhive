import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import * as AOS from 'aos';

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
    AOS.init({
      offset: 200, // offset (in px) from the original trigger point
  duration: 1000, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  delay: 100, // values from 0 to 3000, with step 50ms
      once: true       // Animation occurs only once when scrolling down
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