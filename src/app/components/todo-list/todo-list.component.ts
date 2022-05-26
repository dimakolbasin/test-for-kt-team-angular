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
  public formData: any = null;
  private fullData: any = [];
  public visibleLoader: boolean = false;
  public interval: number|undefined;


  constructor(private todoDataService: TodoDataService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.min(1)])
    })
    this.page = 1;
    this.loadPage();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
  }

  public completeTodoItem(item: any, i: number): void {
    this.data[i].completed = !this.data[i].completed;
    this.todoDataService.updateTodo(item.id, this.data[i]).subscribe(() => {
      console.log("todo done")
    })

  }

  public loadPage(): void {
    this.subscription = this.todoDataService.getTodoList(this.page, this.limit).subscribe(todoList => {
      this.data = todoList.rows;
      this.collectionSize = todoList.totalCount;
      this.fullData = todoList.fullData;
    })
  }

  public onPageChanged(event: any): void {
    this.loadPage();
    this.visibleLoader = true;
    this.interval = setInterval(() => {
      this.visibleLoader = false;
    }, 2000);
  }

  public submit() {
    this.formData = {...this.form.value};
    this.formData.id = uuidv4();
    this.formData.completed = false;
    this.formData.time = new Date().getTime();

    this.subscription = this.todoDataService.addTodo(this.formData).subscribe(() => {
      location.reload();
    })

  }

  public deleteItem(item: any) {
    this.subscription = this.todoDataService.deleteTodo(item.id).subscribe(() => {
      location.reload()
    })
  }


}
