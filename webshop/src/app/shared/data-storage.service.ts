import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  private recipesUrl = environment.webshopBaseUrl + 'recipes.json';

  constructor(private http: HttpClient, private recipeService: RecipeService) {
  }

  storeData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.recipesUrl, recipes)
      .subscribe(response => console.log(response));
  }

  fetchData(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.recipesUrl)
      .pipe(
        map(recipes => recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
