import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @ManyToMany(() => RawMaterial, (rawMaterial) => rawMaterial.receipes)
    @JoinTable()
    ingredients: RawMaterial[]

    @OneToOne(() => FinalGood, (finalGood) => finalGood.recipe)
    @JoinColumn()
    finalGood: FinalGood
}
