import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Recipe} from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  recipeId: number;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.pipe(
      map((params: Params) => parseInt(params.id, 10)),
      switchMap((id: number) => {
        this.recipeId = id;
        return this.store.select('recipes');
      }),
      map(recipesState => recipesState.recipes[this.recipeId])
    ).subscribe(recipe => this.recipe = recipe);
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipeId));
    this.router.navigate(['/recipes']);
  }
}
