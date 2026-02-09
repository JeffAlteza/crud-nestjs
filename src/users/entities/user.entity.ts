import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Profile } from "../../profiles/entities/profile.entity";

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

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}