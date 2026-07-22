import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { GalleryService } from '../../../core/services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit, OnDestroy {
  galleryItems = signal<any[]>([]);
  filteredItems = signal<any[]>([]);
  loading = signal(true);
  selectedCategory = signal('');

  // Lightbox
  lightboxOpen = signal(false);
  lightboxIndex = signal(0);

  categories = ['Projects', 'Construction', 'Office', 'Events', 'Awards', 'Completed'];

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.loadGallery();
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  loadGallery() {
    this.loading.set(true);
    this.galleryService.getAll({ _t: Date.now() }).subscribe({
      next: res => {
        const items = res.data || [];
        this.galleryItems.set(items);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => {
        const mock = this.getMockGallery();
        this.galleryItems.set(mock);
        this.applyFilter();
        this.loading.set(false);
      }
    });
  }

  applyFilter() {
    const cat = this.selectedCategory();
    if (!cat) {
      this.filteredItems.set(this.galleryItems());
    } else {
      this.filteredItems.set(this.galleryItems().filter(i => i.category === cat));
    }
  }

  filterCategory(cat: string) {
    this.selectedCategory.set(cat);
    this.applyFilter();
  }

  // Lightbox
  openLightbox(index: number) {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    document.body.style.overflow = '';
  }

  prevImage() {
    const items = this.filteredItems();
    const idx = (this.lightboxIndex() - 1 + items.length) % items.length;
    this.lightboxIndex.set(idx);
  }

  nextImage() {
    const items = this.filteredItems();
    const idx = (this.lightboxIndex() + 1) % items.length;
    this.lightboxIndex.set(idx);
  }

  currentItem() {
    return this.filteredItems()[this.lightboxIndex()];
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.lightboxOpen()) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowLeft') this.prevImage();
    if (e.key === 'ArrowRight') this.nextImage();
  }

  getCategoryCount(cat: string) {
    return this.galleryItems().filter(i => i.category === cat).length;
  }

  getMockGallery() {
    return [
      { _id: '1', title: 'National Highway NH-44 Paving', category: 'Construction', type: 'image', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', caption: 'Phase 2 highway surface work in progress, Haryana stretch.' },
      { _id: '2', title: 'CPWD Office Complex — Completed', category: 'Completed', type: 'image', url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80', caption: 'Fully completed CPWD administrative office, New Delhi.' },
      { _id: '3', title: 'Tarun Builders HQ — Corporate Office', category: 'Office', type: 'image', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80', caption: 'Our Mumbai headquarters with modern facilities.' },
      { _id: '4', title: 'National Construction Excellence Award 2024', category: 'Awards', type: 'image', url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80', caption: 'Receiving the Ministry of Road Transport Award, New Delhi.' },
      { _id: '5', title: 'Pune Metro — Elevated Pillars', category: 'Projects', type: 'image', url: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=600&q=80', caption: 'Elevated metro pillar construction, Pune stretch.' },
      { _id: '6', title: 'Ganga Bridge Well Foundation', category: 'Construction', type: 'image', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80', caption: 'Bridge foundation drilling works, Varanasi bypass.' },
      { _id: '7', title: 'Annual Contractor Meet 2023', category: 'Events', type: 'image', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80', caption: 'Annual event gathering sub-contractors and partners.' },
      { _id: '8', title: 'Smart City Road Widening — Indore', category: 'Projects', type: 'image', url: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=600&q=80', caption: 'Smart city road-widening project under UIDSSMT.' },
      { _id: '9', title: 'Ready-Mix Concrete Batching Plant', category: 'Construction', type: 'image', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', caption: 'On-site RMC plant providing quality concrete for bridges.' },
    ];
  }
}
