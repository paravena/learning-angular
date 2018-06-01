import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/race';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExit = new EventEmitter<void>();
  progress = 0;
  stopPerformed = new Subject<void>();
  hundredReached = new Subject<void>();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.startOrResumeProgress();
  }

  private startOrResumeProgress() {
    Observable
      .interval(1000)
      .takeUntil(Observable.race([this.stopPerformed, this.hundredReached])).subscribe(() => {
      if (this.progress < 100) {
        this.progress += 5;
      } else {
        this.hundredReached.next();
      }
    });
  }

  onStop() {
    this.stopPerformed.next();
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingExit.emit();
      } else {
        this.startOrResumeProgress();
      }
    });
  }
}
