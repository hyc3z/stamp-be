import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StampTask } from "./StampTask";

@Entity("stamp_user", { schema: "stamp-hyc" })
export class StampUser{
  @PrimaryGeneratedColumn()
  userId: string;

  @Column("varchar", { name: "user_pwd", length: 32, default: () => "'0'" })
  userPwd: string;

  @Column("varchar", { name: "user_name", length: 20, default: () => "'0'" })
  userName: string;

  @Column("datetime", {
    name: "create_time",
    nullable: true,
  })
  createTime: Date | null;

  @Column("varchar", { name: "user_email", nullable: true, length: 32 })
  userEmail: string | null;

  @Column("varchar", { name: "user_realname", nullable: true, length: 20 })
  userRealname: string | null;

  @Column("int", { name: "vcoin", default: () => "'1000'" })
  vcoin: number;

  @OneToMany(() => StampTask, (stampTask) => stampTask.user)
  stampTasks: StampTask[];
}
