import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.scss']
})
export class PreviewModalComponent {
  @ViewChild('preview') container: ElementRef;

  source: string;
  loading: boolean = true;
  objectEl: HTMLObjectElement;

  constructor(
    public storage: AngularFireStorage,
    public dialogRef: MatDialogRef<PreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const imageRef = this.storage.ref(data.sourceFile);
    // Create an Object dynamically to avoid XSS
    imageRef.getDownloadURL().subscribe(url => {
      this.objectEl = document.createElement('object');
      this.objectEl.data = url;
      this.objectEl.type = 'application/pdf';
      this.objectEl.width = '100%';
      this.objectEl.height = '100%';

      // Put that element inside a container
      this.container.nativeElement.appendChild(this.objectEl);
      this.loading = false;
    });
  }

}
