import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Recipe} from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from './recipe.actions';

@Injectable()
export class RecipeEffects {

  private recipesUrl = environment.webshopBaseUrl + 'recipes.json';

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(fetchAction => this.http.get<Recipe[]>(this.recipesUrl)),
    map(recipes => recipes.map(recipe => {
      return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
    })),
    map(recipes => new RecipeActions.SetRecipes(recipes))
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([storeAction, recipesState]) => {
      return this.http.put(this.recipesUrl, recipesState.recipes);
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {

  }

}
