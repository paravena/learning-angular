import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TrainingService } from '../training.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { Exercise } from '../exercise.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;
  filterForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  finishedExercisesSubscription: Subscription;
  constructor(private trainingService: TrainingService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      filter: fb.control([''])
    });
  }

  ngOnInit() {
    this.finishedExercisesSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Array<Exercise>) => {
      this.dataSource.data = exercises;
    });
    this.trainingService.fetchCompletedOrCancelledExercises();
    this.dataSource.paginator = this.paginator;
    this.filterForm.get('filter').valueChanges.debounceTime(300).subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.finishedExercisesSubscription.unsubscribe();
  }
}
