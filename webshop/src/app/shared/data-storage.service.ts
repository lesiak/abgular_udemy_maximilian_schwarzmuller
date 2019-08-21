import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {environment} from '../../environments/environment';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  private recipesUrl = environment.webshopBaseUrl + 'recipes.json';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>) {
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
          this.store.dispatch(new RecipeActions.SetRecipes(recipes));
        })
      );
  }
}
