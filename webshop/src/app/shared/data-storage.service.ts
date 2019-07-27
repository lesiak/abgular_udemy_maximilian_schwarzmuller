import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {
  }

  storeData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://angular-udemy-webshop.firebaseio.com/recipes.json', recipes)
      .subscribe(response => console.log(response));
  }

  fetchData() {
    this.http.get<Recipe[]>('https://angular-udemy-webshop.firebaseio.com/recipes.json')
      .subscribe(response => this.recipeService.setRecipes(response));
  }
}