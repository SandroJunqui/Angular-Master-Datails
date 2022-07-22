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

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new') this.createCategory();
    else this.updateCategory();
  }

  //  PRIVATE METHODS

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') this.currentAction = 'new';
    else this.currentAction = 'edit';
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  private loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) =>
            this.categoryService.getById(+params.get('id')!)
          )
        )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(category); // binds loaded category data to categories
          },
          (error) => alert('ocorreu um erro no servidor, tente mais tarde.')
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Nova Categoria';
    else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: CategoryModel = Object.assign(
      new CategoryModel(),
      this.categoryForm.value
    );

    this.categoryService.create(category).subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionsForError(error)
    );
  }

  private updateCategory() {
    const category: CategoryModel = Object.assign(
      new CategoryModel(),
      this.categoryForm.value
    );

    this.categoryService.update(category).subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionsForError(error)
    );
  }

  private actionsForSuccess(category: CategoryModel) {
    /*     toastr.success('Solicitação processada com sucesso!'); */

    // redirect/reload component page
    this.router
      .navigateByUrl('categories', { skipLocationChange: true })
      .then(() => this.router.navigate(['categories', category.id, 'edit']));
  }

  private actionsForError(error: { status: number; _body: string }) {
    /*     toastr.error('ocorreu um erro ao processar a sua solicitação!'); */

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = [
        'Falha na comunicação com o servidor. Por favor, tente mais tarde.',
      ];
  }
}
