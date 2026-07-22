import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { NewsService } from '../../../../core/services/news.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss'
})
export class NewsDetailComponent implements OnInit {
  newsItem = signal<any | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private newsService: NewsService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadNewsItem(id);
    });
  }

  loadNewsItem(id: string) {
    this.loading.set(true);
    this.newsService.getById(id).subscribe({
      next: res => {
        this.newsItem.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        const mock = this.getMockNewsItem(id);
        if (mock) {
          this.newsItem.set(mock);
          this.error.set(null);
        } else {
          this.error.set('News item not found');
        }
        this.loading.set(false);
      }
    });
  }

  getMockNewsItem(id: string) {
    const mocks = [
      {
        _id: '1',
        title: 'Tarun Builders wins National Construction Award 2024',
        content: `
          <p>We are proud to announce that Tarun Builders has been awarded the prestigious National Construction Excellence Award 2024 by the Ministry of Infrastructure & Housing.</p>
          <p>The award was presented in recognition of our quality delivery, safety standards, and innovative engineering methods on the NH-48 lane expansion corridor, completed 3 months ahead of schedule.</p>
          <p>Founder & MD Tarun commented: "This award belongs to our 500+ site engineers and laborers who work tirelessly in the field. Quality and trust have been our core values since 2005, and we will continue building India's future with the same passion."</p>
        `,
        category: 'Award',
        createdAt: new Date('2024-11-20'),
        views: 310
      },
      {
        _id: '2',
        title: 'New Tender Floated for Smart City Phase II Utility Integration',
        content: `
          <p>Tarun Builders has released the official tender notice and schedule of bidding for underground electrical and fiber duct integration across western Smart City zones.</p>
          <p>Bidders can download structural drawings and pricing bills of quantities (BOQ) directly from our digital portal starting next Monday.</p>
          <p>Submission deadlines are set for 31 August 2025. Bids will be opened and audited by the executive civil engineering division.</p>
        `,
        category: 'GovtNotification',
        createdAt: new Date('2025-07-15'),
        views: 180
      }
    ];
    return mocks.find(m => m._id === id) || mocks[0];
  }
}
