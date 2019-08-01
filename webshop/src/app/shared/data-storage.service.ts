import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  private recipesUrl = environment.webshopBaseUrl + 'recipes.json';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  storeData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.recipesUrl, recipes)
      .subscribe(response => console.log(response));
  }

  fetchData(): Observable<Recipe[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Recipe[]>(
          this.recipesUrl,
          {
            params: new HttpParams().set('auth', user.token)
          }
        );
      }),
      map(recipes => recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      })),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
