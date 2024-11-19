import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactForm, ContactService } from '../../services/contact/contact.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  collection: string[] = [];
  p: number = 1;
  itemsPerPage: number = 10;
  getData: any;
  selectedContact: ContactForm = { name: '', email: '', countryCode:'', number: '', message: '' };
  isDeletingAll = false;  // Flag to disable the button
  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;
  private contactToDeleteId: string | null = null;  // Store the ID of the contact to be deleted

  constructor(
    private http: HttpClient, 
    private _contactService: ContactService, 
    private modalService: NgbModal
  ) {
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  ngOnInit() {
    this.fetchAllContacts();
  }

  fetchAllContacts() {
    this._contactService.onContactGetAll().subscribe(res => {
      this.getData = res;
      console.log(this.getData.length)
    });
  }

  getSNo(index: number): number {
    return (this.p - 1) * this.itemsPerPage + index + 1;
  }

  editContact(contact: ContactForm, content: any) {
    this.selectedContact = { ...contact };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result === 'Save') {
        this.updateContact(this.selectedContact._id!, this.selectedContact);
      }
    });
  }

  updateContact(id: string, updatedContact: ContactForm) {
    this._contactService.onContactUpdate(id, updatedContact).subscribe(res => {
      const index = this.getData.findIndex((c: any) => c._id === id);
      if (index !== -1) {
        this.getData[index] = updatedContact;
      }
    });
  }

  onDelete(id: string) {
    this.contactToDeleteId = id;
    const modalRef = this.modalService.open(this.confirmDeleteModal, { ariaLabelledBy: 'modal-basic-title' });
    modalRef.result.then((result) => {
      if (result === 'Delete' && this.contactToDeleteId) {
        this._contactService.onContactDelete(this.contactToDeleteId).subscribe(res => {
          this.fetchAllContacts();
        });
      }
    });
  }

  confirmDelete(modal: any) {
    modal.close('Delete');
  }

  confirmDeleteAll() {
    const modalRef = this.modalService.open(this.confirmDeleteModal, { ariaLabelledBy: 'modal-basic-title' });
    modalRef.result.then((result) => {
      if (result === 'Confirm') {
        this.confirmDeleteAllAction();
      }
    });
  }

  confirmDeleteAllAction() {
    this.isDeletingAll = true;
    setTimeout(() => {
      this._contactService.onContactDeleteAll().subscribe(res => {
        this.fetchAllContacts();
        this.isDeletingAll = false;
      });
    }, 10000);
  }
}
