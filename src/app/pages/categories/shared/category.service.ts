import { CategoryModel } from './categoryModel';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiPath: string = 'api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategoryModel[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToCategories) // retorno da api
    );
  }

  getById(id: number): Observable<CategoryModel> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get(url)
      .pipe(catchError(this.handlerError), map(this.jsonDataToCategory));
  }

  create(category: CategoryModel): Observable<CategoryModel> {
    return this.http
      .post(this.apiPath, category)
      .pipe(catchError(this.handlerError), map(this.jsonDataToCategory));
  }

  update(category: CategoryModel): Observable<CategoryModel> {
    const url = `${this.apiPath}/${category.id}`;

    return this.http.put(url, category).pipe(
      catchError(this.handlerError),
      map(() => category) // desta forma porque o put nao retorna dados
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handlerError),
      map(() => null)
    );
  }

  // PRIVATE METODOS

  private jsonDataToCategories(jsonData: any[]): CategoryModel[] {
    const categories: CategoryModel[] = [];
    jsonData.forEach((Element) => categories.push(Element as CategoryModel));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): CategoryModel {
    return jsonData as CategoryModel;
  }

  private handlerError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO => ', error);
    return throwError(error);
  }
}
