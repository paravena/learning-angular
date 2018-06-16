import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { UiService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import 'rxjs/add/operator/take';

@Injectable()
export class TrainingService {
  private fbSubscriptions: Array<Subscription> = [];

  constructor(private db: AngularFirestore,
              private uiService: UiService,
              private store: Store<fromTraining.State>) {}

  public fetchAvailableExercises(): void {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubscriptions.push(this.db
      .collection<Exercise>('availableExercises')
      .snapshotChanges().map((documents: Array<DocumentChangeAction>) => {
        return documents.map((doc: DocumentChangeAction) => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }).subscribe((exercises: Array<Exercise>) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackBar('Fetching exercises failed, please try again later', null, 3000);
      }));
  }

  public startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  public completeExercise() {
    this.store.select(fromTraining.getActiveTraining).take(1).subscribe(activeTraining => {
      this.saveExercise({
        ...activeTraining,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  public cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).take(1).subscribe(activeTraining => {
      this.saveExercise({
        ...activeTraining,
        duration: activeTraining.duration * (progress / 100),
        calories: activeTraining.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  public fetchCompletedOrCancelledExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Array<Exercise>) => {
      this.store.dispatch(new UI.StopLoading());
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }));
  }

  private saveExercise(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  public cancelSubscriptions(): void {
    this.fbSubscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
