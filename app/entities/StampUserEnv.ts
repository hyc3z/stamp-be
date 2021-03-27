import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { StampUser } from "./StampUser";
  
  @Index("FK__stamp_user", ["userId"], {})
  @Entity("stamp_user_env", { schema: "stamp-user-env" })
  export class StampUserEnv {
    @PrimaryGeneratedColumn({ type: "int", name: "envId" })
    envId: number;
  
    @Column("int", { name: "userId" ,nullable: true})
    userId: number;
  
    @Column("varchar", { name: "env_key", length: 32, default: () => "'0'" })
    envKey: string;

    @Column("varchar", { name: "env_val", length: 1024, default: () => "'0'" })
    envVal: string;
  
    @ManyToOne(() => StampUser, (stampUser) => stampUser.stampUserEnvs, {
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
    user: StampUser;
    
  }
  