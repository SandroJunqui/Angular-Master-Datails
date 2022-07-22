import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { EntryModel } from './entryModel';
import { map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";

  constructor(private http: HttpClient) { }

  getAll(): Observable<EntryModel[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntries)  // retorno da api
    )
  }

  getById(id: number): Observable<EntryModel> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    )
  }

  update(entry: EntryModel): Observable<EntryModel> {
    const url = `${this.apiPath}/${entry.id}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handlerError),
      map(() => entry) // desta forma porque o put nao retorna dados
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe (
      catchError(this.handlerError),
      map(() => null)
    )
  }

  // PRIVATE METODOS

  private jsonDataToEntries(jsonData: any[]): EntryModel[] {  // retorno em json do bd
    const entries: EntryModel[] = [];
    jsonData.forEach(element => {
      const entry = Object.assign(new EntryModel(), element); // para poder usar o metodo da model
      entries.push(entry);
    });
    return entries;
  }

  private jsonDataToEntry(jsonData: any): EntryModel {
    return  Object.assign(new EntryModel(), jsonData);
  }

  private handlerError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }

}
