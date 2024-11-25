import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog/blog.service';
import { environment } from '../../../environments/environment';
import * as AOS from 'aos';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blog: any;
  env = environment.url;

  constructor(private route: ActivatedRoute, private _blogService: BlogService) {}

  ngOnInit(): void {
    AOS.init({
      offset: 120,
      duration: 1000,
      easing: 'ease',
      delay: 100,
      once: true,
    });
    console.log('AOS initialized');
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this._blogService.onBlogFindOne(blogId).subscribe(
        (response: any) => {
          this.blog = response.data;
        },
        (error) => {
          console.error('Error fetching blog data:', error);
        }
      );
    }
  }
}
