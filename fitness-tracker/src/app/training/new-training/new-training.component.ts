import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Exercise } from 'app/training/exercise.model';
import { UiService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  public availableExercises$: Observable<Array<Exercise>>;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService,
              private uiService: UiService,
              private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.availableExercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchAvailableExercises();
  }

  fetchAvailableExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining({ value: { exercise }}: NgForm) {
    this.trainingService.startExercise(exercise);
  }
}
