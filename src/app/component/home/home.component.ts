import { Component, OnInit, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit,AfterViewInit,OnDestroy {
  blogs = [
    {
      image: 'https://taskhive.co.in/uploads/New1712861443707.jpg',
      content: 'Information technology (IT) is the use of any computers, storage, networking and other physical devices, infrastructure and processes to create, process, store, secure and exchange all forms of electronic data...',
      link: 'https://taskhive.co.in/blog_details/5'
    },
    {
      image: 'https://taskhive.co.in/uploads/New1712930189272.jpg',
      content: 'Web development is the work involved in developing a website for the Internet (World Wide Web) or an intranet (a private network). Web development can range from developing a simple single static page of plain text to complex web applications...',
      link: 'https://taskhive.co.in/blog_details/5'
    },
    {
      image: 'https://taskhive.co.in/uploads/New1712997544158.jpg',
      content: 'At Taskhive, we seamlessly merge cutting-edge design concepts with impeccable development practices, resulting in meticulously crafted web solutions that deliver exceptional user experiences and drive online success for your business.',
      link: 'https://taskhive.co.in/blog_details/5'
    },
    {
      image: 'https://taskhive.co.in/uploads/New1712857274279.png',
      content: 'At Taskhive, we seamlessly merge cutting-edge design concepts with impeccable development practices, resulting in meticulously crafted web solutions that deliver exceptional user experiences and drive online success for your business.',
      link: 'https://taskhive.co.in/blog_details/5'
    },
    {
      image: 'https://taskhive.co.in/uploads/New1712997544158.jpg',
      content: 'Web development is the work involved in developing a website for the Internet (World Wide Web) or an intranet (a private network). Web development can range from developing a simple single static page of plain text to complex web applications...',
      link: 'https://taskhive.co.in/blog_details/5'
    },
    {
      image: 'https://taskhive.co.in/uploads/New1712930189272.jpg',
      content: 'Information technology (IT) is the use of any computers, storage, networking and other physical devices, infrastructure and processes to create, process, store, secure and exchange all forms of electronic data...',
      link: 'https://taskhive.co.in/blog_details/5'
    }
  ];

  currentIndex = 0;
  itemsToShow = 3;
  autoSlideInterval: any;
  autoSlideDelay = 1000; // 5 seconds

  constructor() { }

  ngOnInit() {
    AOS.init({
      offset: 200, 
      duration: 1000, 
      easing: 'ease', 
      delay: 100, 
      once: true, 
    });
    console.log('AOS initialized'); // Check if this appears in the browser's console
    this.setItemsToShow();
    this.startAutoSlide();
    window.addEventListener('resize', () => this.setItemsToShow());
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
    this.currentIndex = (this.currentIndex + 1) % this.blogs.length;
    this.resetAutoSlide();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.blogs.length) % this.blogs.length;
    this.resetAutoSlide();
  }

  get visibleBlogs() {
    let blogs = [];
    for (let i = 0; i < this.itemsToShow; i++) {
      blogs.push(this.blogs[(this.currentIndex + i) % this.blogs.length]);
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
}