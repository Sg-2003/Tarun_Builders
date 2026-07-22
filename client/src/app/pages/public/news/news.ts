import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { NewsService } from '../../../core/services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterLink, NgClass, DatePipe],
  templateUrl: './news.html',
  styleUrl: './news.scss'
})
export class News implements OnInit {
  newsItems = signal<any[]>([]);
  loading = signal(true);

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading.set(true);
    this.newsService.getAll({ _t: Date.now() }).subscribe({
      next: res => {
        this.newsItems.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.newsItems.set(this.getMockNews());
        this.loading.set(false);
      }
    });
  }

  getMockNews() {
    return [
      {
        _id: '1',
        title: 'Tarun Builders wins National Construction Award 2024',
        excerpt: 'The Ministry of Infrastructure and Housing presented Tarun Builders with the prestigious Quality Excellence Award in highway engineering.',
        category: 'Award',
        createdAt: new Date('2024-11-20'),
        views: 310
      },
      {
        _id: '2',
        title: 'New Tender Floated for Smart City Phase II Utility Integration',
        excerpt: 'Official invites and bidding schedules for underground electricity and optical fiber routing ducts across western zones.',
        category: 'GovtNotification',
        createdAt: new Date('2025-07-15'),
        views: 180
      },
      {
        _id: '3',
        title: 'Company achieves ISO 14001:2015 Environmental Certification',
        excerpt: 'A landmark audit confirms full ecological compliance across all active urban sewage and highway structures.',
        category: 'Announcement',
        createdAt: new Date('2024-08-01'),
        views: 245
      }
    ];
  }
}
