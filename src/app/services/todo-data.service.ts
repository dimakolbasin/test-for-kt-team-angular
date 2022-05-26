import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TablePage} from "../table-page";
import {TodoModel} from "../models/todo.model";

@Injectable()
export class TodoDataService {
  constructor(private httpClient: HttpClient) {
  }

  public getTodoList(page: number, itemsPerPage: number): Observable<TablePage> {
    let items = this.httpClient.get("http://localhost:3000/todo?_sort=time&_order=desc");
    return this.getPageItems(items, page, itemsPerPage);
  }

  public getPageItems(items: Observable<any>, page: number, itemsPerPage: number): Observable<TablePage> {
    return items.pipe(
      map(i => {
        let startIndex = itemsPerPage * (page - 1);
        return new TablePage(i.length, i.slice(startIndex, startIndex + itemsPerPage), i);
      })
    );
  }

  public addTodo(body: TodoModel): Observable<TodoModel> {
    return this.httpClient.post<TodoModel>("http://localhost:3000/todo", body)
  }

  public deleteTodo(id: string): Observable<void> {
    return this.httpClient.delete<void>("http://localhost:3000/todo/" + id)
  }

  public updateTodo(id: string, body: TodoModel): Observable<void> {
    return this.httpClient.put<void>("http://localhost:3000/todo/" + id, body)
  }
}

