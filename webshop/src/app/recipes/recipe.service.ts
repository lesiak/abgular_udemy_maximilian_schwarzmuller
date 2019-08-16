import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {Ingredient} from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Lasagne',
  //     'Lasagne',
  //     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Lasagne_-_stonesoup.jpg/1200px-Lasagne_-_stonesoup.jpg',
  //     [
  //       new Ingredient('Lasagne', 1),
  //       new Ingredient('Cream', 1)
  //     ]),
  //   new Recipe('Pasta alla Norma',
  //     'This is a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/3/3f/Pasta_alla_Norma_%282563876877%29.jpg',
  //     [
  //       new Ingredient('Pasta', 1),
  //       new Ingredient('Aubergine', 1),
  //       new Ingredient('Tomatoe', 2)
  //     ]),
  // ];

  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
