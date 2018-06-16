import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/race';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';
import { Exercise } from '../exercise.model';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  stopPerformed = new Subject<void>();
  hundredReached = new Subject<void>();

  constructor(private dialog: MatDialog,
              private trainingService: TrainingService,
              private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.startOrResumeProgress();
  }

  private startOrResumeProgress() {
    this.store.select(fromTraining.getActiveTraining).take(1).mergeMap((activeTraining: Exercise) => {
      const step = (activeTraining.duration / 100) * 1000;
      return Observable
        .interval(step)
        .takeUntil(Observable.race([this.stopPerformed, this.hundredReached]));
    }).subscribe(() => {
      if (this.progress < 100) {
        this.progress += 1;
      } else {
        this.hundredReached.next();
        this.trainingService.completeExercise();
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
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeProgress();
      }
    });
  }
}
