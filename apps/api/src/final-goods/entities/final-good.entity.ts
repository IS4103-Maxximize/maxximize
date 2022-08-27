import { Entity, OneToOne } from "typeorm";
import { Recipe } from "../../recipes/entities/recipe.entity";

@Entity()
export class FinalGood extends Product {
    @OneToOne(() => Recipe, (recipe) => recipe.finalGood)
    recipe: Recipe
}
