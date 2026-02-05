import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;
}