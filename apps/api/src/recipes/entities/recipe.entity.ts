import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinalGood } from "../../final-goods/entities/final-good.entity";
import { RawMaterial } from "../../raw-materials/entities/raw-material.entity";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @ManyToMany(() => RawMaterial)
    @JoinTable()
    ingredients: RawMaterial[]

}
