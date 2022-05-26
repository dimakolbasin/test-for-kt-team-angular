import {TodoModel} from "./models/todo.model";

export class TablePage {
  public totalCount: number;
  public rows: TodoModel[];
  public fullData: TodoModel[];

  constructor(totalCount: number, rows: TodoModel[], fullData: TodoModel[]) {
    this.totalCount = totalCount;
    this.rows = rows;
    this.fullData = fullData;
  }
}
