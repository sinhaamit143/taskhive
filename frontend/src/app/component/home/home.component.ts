import { Component, OnInit, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog/blog.service';
import * as AOS from 'aos';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  getData: any;
  p: number = 1;
  itemsPerPage: number = 6; 
  id: any;
  data: any;
  env: any;

  currentIndex = 0;
  itemsToShow = 3;
  autoSlideInterval: any;
  autoSlideDelay = 1000; // 1 second

  constructor(private _blogService: BlogService, private route: ActivatedRoute) {
    this.env = environment.url;
    this.route.params.subscribe((param: any) => {
      this.id = param.id;
      if (this.id) {
        this._blogService.onBlogFindOne(this.id).subscribe((res: any) => {
          this.data = res;
        }, err => {
          console.log(err.message);
        });
      }
    });
  }

  ngOnInit() {
    AOS.init({
      offset: 120, 
      duration: 1000, 
      easing: 'ease', 
      delay: 100, 
      once: true, 
    });
    this.setItemsToShow();
    this.startAutoSlide();
    window.addEventListener('resize', () => this.setItemsToShow());

    // Fetch all public blogs
    this._blogService.onBlogGetAllPublic().subscribe(res => { 
      this.getData = res;
    });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  @HostListener('window:resize')
  onResize() {
    this.setItemsToShow();
  }

  setItemsToShow() {
    this.itemsToShow = window.innerWidth < 768 ? 1 : 3;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.getData.length; // Update to use getData
    this.resetAutoSlide();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.getData.length) % this.getData.length; // Update to use getData
    this.resetAutoSlide();
  }

  get visibleBlogs() {
    let blogs = [];
    for (let i = 0; i < this.itemsToShow; i++) {
      if (this.getData && this.getData.length) {
        const blog = this.getData[(this.currentIndex + i) % this.getData.length];
        blogs.push(blog);
      }
    }
    return blogs;
  }
  

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.next();
    }, this.autoSlideDelay);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // Optional: methods to pause and resume auto-sliding
  pauseAutoSlide() {
    this.stopAutoSlide();
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }

  ngAfterViewInit() {
    this.initCarousel();
  }

  initCarousel() {
    // @ts-ignore
    if (typeof bootstrap !== 'undefined') {
      const carouselElement = document.getElementById('carouselExampleInterval');
      if (carouselElement) {
        // @ts-ignore
        new bootstrap.Carousel(carouselElement, {
          interval: 5000,
          wrap: true,
          pause: 'hover'
        });
      }
    }
  }

  getPageArray(totalItems: number): number[] {
    return Array(Math.ceil(totalItems / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
  }
}