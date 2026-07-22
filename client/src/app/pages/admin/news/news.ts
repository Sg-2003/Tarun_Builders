import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { NewsService } from '../../../core/services/news.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe, FormsModule],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class AdminNewsComponent implements OnInit {
  newsItems = signal<any[]>([]);
  loading = signal(true);

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading.set(true);
    this.newsService.getAll({ _t: Date.now() }).subscribe({
      next: res => { this.newsItems.set(res.data || []); this.loading.set(false); },
      error: () => { this.newsItems.set(this.getMockNews()); this.loading.set(false); }
    });
  }

  getMockNews() {
    return [
      { _id: '1', title: 'Tarun Builders wins National Construction Award 2024', category: 'Award', createdAt: new Date() }
    ];
  }
}
