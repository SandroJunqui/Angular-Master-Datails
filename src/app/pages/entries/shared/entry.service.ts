import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { EntryModule } from './entry.module';
import { map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";

  constructor(private http: HttpClient) { }

  getAll(): Observable<EntryModule[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntries)  // retorno da api
    )
  }

  getById(id: number): Observable<EntryModule> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: EntryModule): Observable<EntryModule> {
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    )
  }

  update(entry: EntryModule): Observable<EntryModule> {
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

  private jsonDataToEntries(jsonData: any[]): EntryModule[] {
    const entries: EntryModule[] = [];
    jsonData.forEach(Element => entries.push(Element as EntryModule));
    return entries;
  }

  private jsonDataToEntry(jsonData: any): EntryModule {
    return jsonData as EntryModule;
  }

  private handlerError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }

}
