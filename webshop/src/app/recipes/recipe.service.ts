import {Recipe} from './recipe.model';
import {EventEmitter} from '@angular/core';

export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('A Test Recipe',
      'This is a test',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Lasagne_-_stonesoup.jpg/1200px-Lasagne_-_stonesoup.jpg'),
    new Recipe('A Test Recipe 2',
      'This is a test',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Lasagne_-_stonesoup.jpg/1200px-Lasagne_-_stonesoup.jpg'),
  ];

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }
}
