import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Profile } from "../../profiles/entities/profile.entity";
import { Post } from "../../posts/entities/post.entity";

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

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}