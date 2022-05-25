import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TablePage} from "../table-page";

@Injectable()
export class TodoDataService {
  constructor(private httpClient: HttpClient) {
  }

  public getTodoList(page: number, itemsPerPage: number): Observable<TablePage> {
    let items = this.httpClient.get("http://localhost:3000/todo");
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

  public addTodo(body: any): Observable<any> {
    return this.httpClient.post("http://localhost:3000/todo", body)
  }

  public deleteTodo(id: number): Observable<any> {
    return this.httpClient.delete("http://localhost:3000/todo/" + id)
  }

  public updateTodo(id: number, body: any): Observable<any> {
    return this.httpClient.put("http://localhost:3000/todo/" + id, body)
  }
}

