import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';
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
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      number: ['', Validators.required],
      //subject: ['', Validators.required],
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

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this._contactService.onContactSave(this.myForm.value).subscribe(
        (response) => {
          console.log(response);
          alert("Thank you for contacting us. We will get back to you soon.");
          this.myForm.reset();
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          alert("Error sending contact data. Please try again.");
          this.isLoading = false;
        }
      );
    } else {
      alert("Please fill all the fields");
      this.isLoading = false;
    }
  }
}