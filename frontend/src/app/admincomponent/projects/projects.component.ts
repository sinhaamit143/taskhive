import { Component, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../services/file/file.service';
import { environment } from '../../../environments/environment';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  p: number = 1;
  itemsPerPage: number = 10;
  env: string;
  selectedProject: any = {};
  getData: any;
  myForm: FormGroup;
  projectToDeleteId: string | null = null;
  image: File[] = [];
  collection: any[] = [];

  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;

  constructor(
    private _projectService: ProjectService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private fileServ: FileService
  ) {
    this.env = environment.url;
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      descriptions: this.fb.array([]),
      images: this.fb.array([])
    });
  }

  ngOnInit() {
    this.fetchAllProjects();
  }

  fetchAllProjects() {
    this._projectService.get('projects', {}).subscribe((res: any) => {
      this.getData = res.data.map((project: any) => ({
        ...project,
        description: project.descriptions?.[0] || 'No description available',
      }));
      console.log(this.getData)
    });
  }

  getSNo(index: number): number {
    return (this.p - 1) * this.itemsPerPage + index + 1;
  }

  editProjects(project: any, content: any) {
    this.selectedProject = { ...project };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-name' });
  }

  onDelete(id: any) {
    this.projectToDeleteId = id;
    const modalRef = this.modalService.open(this.confirmDeleteModal, { ariaLabelledBy: 'modal-basic-name' });
    modalRef.result.then((result) => {
      if (result === 'Delete' && this.projectToDeleteId) {
        this._projectService.delete('projects', this.projectToDeleteId).subscribe(() => {
          this.fetchAllProjects();
        });
      }
    });
  }

  confirmDelete(modal: any) {
    modal.close('Delete');
  }

  handleFileInput(event: any) {
    this.selectedProject.image = event.target.files[0];
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

  uploadImage(modal: any) {
    if (this.image.length > 0) {
      this.fileServ.uploadFile(this.image[0]).subscribe(
        (res: any) => {
          if (res.type === HttpEventType.Response) {
            const body: any = res.body;
            const imagePath = body.file.path;
            this.selectedProject.image = imagePath;

            if (!this.selectedProject || !this.selectedProject._id) {
              alert('No project selected or project ID is missing');
              return;
            }

            this._projectService.put('projects', this.selectedProject._id, this.selectedProject).subscribe(() => {
              this.fetchAllProjects();
              modal.close();
            });
          }
        },
        (error) => {
          alert(`Error uploading image: ${error.message}`);
        }
      );
    } else {
      alert('Please Select Image');
    }
  }
}