import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoDataService} from "../../services/todo-data.service";
import {Subscription} from "rxjs";
import {TodoModel} from "../../models/todo.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.less']
})
export class TodoListComponent implements OnInit, OnDestroy {

  public data: TodoModel[] = [];
  private subscription: Subscription = new Subscription();
  public limit: number = 10;
  public page: number = 0;
  public collectionSize: number = 0;
  public form: FormGroup = new FormGroup({});
  public fullData: TodoModel[] = [];
  public visibleLoader: boolean = false;
  public remainder: number = 0;
  private deleteClickCounter: number = 0;


  constructor(private todoDataService: TodoDataService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
      ])
    });
    this.page = 1;
    this.loadPage();
  }

  public completeTodoItem(item: TodoModel, i: number): void {
    this.data[i].completed = !this.data[i].completed;
    this.todoDataService.updateTodo(item.id, this.data[i]).subscribe(() => {
    });
  }

  public loadPage(): void {
    this.visibleLoader = true;
    this.subscription = this.todoDataService.getTodoList(this.page, this.limit).subscribe(todoList => {
      this.data = todoList.rows;
      this.collectionSize = todoList.totalCount;
      this.fullData = todoList.fullData;
      this.visibleLoader = false;
      this.remainder = this.collectionSize % this.limit;
    });
    this.deleteClickCounter = 0;
  }

  public submit(): void {
    const body: TodoModel = {
      title: this.form.value.title,
      id: uuidv4(),
      completed: false,
      time: new Date().getTime()
    };

    this.subscription = this.todoDataService.addTodo(body).subscribe(() => {
      this.page = 1;
      this.loadPage();
    });
  }

  public deleteItem(item: TodoModel): void {
    ++this.deleteClickCounter;
    this.subscription = this.todoDataService.deleteTodo(item.id).subscribe(() => {
      const updatedData = this.data.filter(i => i != item);
      if (updatedData.length === 0) {
        if (this.page != 1) {
          this.page = this.page - 1;
        }
        this.loadPage();
      } else if (this.deleteClickCounter === this.remainder) {
        this.loadPage()
        this.deleteClickCounter = 0;
      } else {
        this.data = updatedData;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
