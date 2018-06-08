import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Exercise } from 'app/training/exercise.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  public availableExercises: Array<Exercise>;
  availableExercisesSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.availableExercisesSubscription = this.trainingService.exercisesChanged.subscribe((exercises: Array<Exercise>) => {
      this.availableExercises = exercises;
    });
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.availableExercisesSubscription.unsubscribe();
  }

  onStartTraining({ value: { exercise }}: NgForm) {
    this.trainingService.startExercise(exercise);
  }
}
