import { CategoryService } from './../shared/category.service';
import { CategoryModel } from './../shared/categoryModel';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string | undefined; // se esta editando ou criando nova categoria
  categoryForm = {} as FormGroup;
  pageTitle: string | undefined;
  serverErrorMessages: string[] | undefined;
  submittingForm: boolean = false;
  category = {} as CategoryModel;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();

  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  //  PRIVATE METHODS

  private setCurrentAction() {
    if( this.route.snapshot.url[0].path == 'new' )
    this.currentAction = 'new'
    else
    this.currentAction = 'edit'
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]

    })
  }

  private loadCategory() {
    if ( this.currentAction == 'edit' ) {

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')!))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category) // binds loaded category data to categories
        },
        (error) => alert('ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle() {
    if ( this.currentAction == 'new')
    this.pageTitle = "Cadastro de Nova Categoria"
    else{
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

}
