import User from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('Pruducts')
export default class Pruducts {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    title: string

    @Column({nullable: true})
    description: string

    @Column({nullable: true})
    price: number

    @Column('int', {nullable: true})
    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user' })
    user: User
}
