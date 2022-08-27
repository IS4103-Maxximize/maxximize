import { Entity, OneToOne } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import { Recipe } from "../../recipes/entities/recipe.entity";

@Entity()
export class FinalGood extends Product {
    @OneToOne(() => Recipe, (recipe) => recipe.finalGood)
    recipe: Recipe
}
