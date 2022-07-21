import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: CategoryListComponent }, // rota listagem de categoria
  { path: 'new', component: CategoryFormComponent },  // rota formulario de nova categoria
  { path: ':id/edit', component: CategoryFormComponent },  // rota formulario de alteração categoria
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
