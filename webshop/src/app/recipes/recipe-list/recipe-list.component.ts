import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  recipesSubscription: Subscription;

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.recipesSubscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => this.recipes = recipes
    );
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.recipesSubscription.unsubscribe();
  }

}
