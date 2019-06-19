import {Recipe} from './recipe.model';
import {EventEmitter} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';

export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Lasagne',
      'Lasagne',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Lasagne_-_stonesoup.jpg/1200px-Lasagne_-_stonesoup.jpg',
      [
        new Ingredient('Lasagne', 1),
        new Ingredient('Cream', 1)
      ]),
    new Recipe('Pasta alla Norma',
      'This is a test',
      'https://upload.wikimedia.org/wikipedia/commons/3/3f/Pasta_alla_Norma_%282563876877%29.jpg',
      [
        new Ingredient('Pasta', 1),
        new Ingredient('Aubergine', 1),
        new Ingredient('Tomatoe', 2)
      ]),
  ];

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }
}
