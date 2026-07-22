import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../../core/services/gallery.service';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe, FormsModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class AdminGalleryComponent implements OnInit {
  galleryItems = signal<any[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  deleteConfirmId = signal<string | null>(null);
  previewUrl = signal<string>('');

  categories = ['Projects', 'Office', 'Events', 'Awards', 'Construction', 'Completed'];
  filterCat = signal('');
  searchQ = signal('');
  searchVal = '';

  form: any = this.emptyForm();

  constructor(private galleryService: GalleryService) {}

  ngOnInit() { this.loadGallery(); }

  loadGallery() {
    this.loading.set(true);
    this.galleryService.getAll({ _t: Date.now() }).subscribe({
      next: res => { this.galleryItems.set(res.data || []); this.loading.set(false); },
      error: () => { this.galleryItems.set([]); this.loading.set(false); }
    });
  }

  emptyForm() {
    return {
      _id: null,
      title: '',
      caption: '',
      url: '',
      category: 'Projects',
      type: 'image',
      isFeatured: false,
      isPublished: true,
      order: 0,
      tags: ''
    };
  }

  openAdd() {
    this.form = this.emptyForm();
    this.previewUrl.set('');
    this.showForm.set(true);
  }

  openEdit(item: any) {
    this.form = {
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')
    };
    this.previewUrl.set(item.url || '');
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.previewUrl.set('');
  }

  onUrlChange() {
    this.previewUrl.set(this.form.url);
  }

  saveItem() {
    if (!this.form.title || !this.form.url) return;
    this.saving.set(true);

    const payload = {
      ...this.form,
      tags: this.form.tags ? this.form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    };

    if (payload._id === null) {
      delete payload._id;
    }

    if (this.form._id) {
      this.galleryService.update(this.form._id, payload).subscribe({
        next: res => {
          this.galleryItems.update(items => items.map(i => i._id === res.data._id ? res.data : i));
          this.saving.set(false);
          this.closeForm();
        },
        error: (err) => {
          console.error('Update gallery item failed:', err);
          this.saving.set(false);
        }
      });
    } else {
      this.galleryService.create(payload).subscribe({
        next: res => {
          this.galleryItems.update(items => [res.data, ...items]);
          this.saving.set(false);
          this.closeForm();
        },
        error: (err) => {
          console.error('Create gallery item failed:', err);
          this.saving.set(false);
        }
      });
    }
  }

  confirmDelete(id: string) { this.deleteConfirmId.set(id); }
  cancelDelete() { this.deleteConfirmId.set(null); }

  deleteItem(id: string) {
    this.galleryService.delete(id).subscribe({
      next: () => {
        this.galleryItems.update(items => items.filter(i => i._id !== id));
        this.deleteConfirmId.set(null);
      }
    });
  }

  get filteredItems() {
    return this.galleryItems().filter(item => {
      const catOk = !this.filterCat() || item.category === this.filterCat();
      const q = this.searchQ().toLowerCase();
      const searchOk = !q || item.title?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }

  toggleFeatured(item: any) {
    this.galleryService.update(item._id, { isFeatured: !item.isFeatured }).subscribe({
      next: res => this.galleryItems.update(items => items.map(i => i._id === res.data._id ? res.data : i))
    });
  }

  togglePublished(item: any) {
    this.galleryService.update(item._id, { isPublished: !item.isPublished }).subscribe({
      next: res => this.galleryItems.update(items => items.map(i => i._id === res.data._id ? res.data : i))
    });
  }
}
