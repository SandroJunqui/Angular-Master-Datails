import { CategoryModel } from './../shared/categoryModel';
import { CategoryService } from './../shared/category.service';
import { CategoriesModule } from './../categories.module';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: CategoryModel[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      (categories) => (this.categories = categories),
      (error) => alert('Erro ao carregar categorias!')
    );
  }

  deleteCategory(category: any) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () =>
          this.categories = this.categories.filter(
            element => element != category),
        () => alert('Erro ao tentar excluir')
      )
    }
  }
}
