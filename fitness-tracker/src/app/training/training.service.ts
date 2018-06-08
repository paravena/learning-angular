import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Array<Exercise>>();
  finishedExercisesChanged = new Subject<Array<Exercise>>();
  private availableExercises: Array<Exercise>;
  private runningExercise: Exercise;
  private fbSubscriptions: Array<Subscription> = [];

  constructor(private db: AngularFirestore) {}

  public fetchAvailableExercises(): void {
    this.fbSubscriptions.push(this.db
      .collection<Exercise>('availableExercises')
      .snapshotChanges().map((docArray: Array<DocumentChangeAction>) => {
        return docArray.map((doc: DocumentChangeAction) => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }).subscribe((exercises: Array<Exercise>) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...exercises]);
      }));
  }

  public startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  public completeExercise() {
    this.saveExercise({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public cancelExercise(progress: number) {
    this.saveExercise({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public getRunningExercise() {
    return { ...this.runningExercise };
  }

  public fetchCompletedOrCancelledExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Array<Exercise>) => {
      this.finishedExercisesChanged.next(exercises);
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
