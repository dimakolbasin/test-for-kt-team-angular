
export class TablePage {
  public totalCount: any;
  public rows: Array<any>;
  public fullData: any;

  constructor(totalCount: any, rows: Array<any>, fullData: any) {
    this.totalCount = totalCount;
    this.rows = rows;
    this.fullData = fullData;
  }
}
