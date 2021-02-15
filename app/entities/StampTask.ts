import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StampTaskStates } from "./StampTaskStates";
import { StampUser } from "./StampUser";
import { StampResourceTypes } from "./StampResourceTypes";

@Index("FK_stamp_task_stamp_resource_types", ["resourceType"], {})
@Index("FK_stamp_task_stamp_task_states", ["stateId"], {})
@Index("FK__stamp_user", ["userId"], {})
@Entity("stamp_task", { schema: "stamp-hyc" })
export class StampTask {
  @PrimaryGeneratedColumn({ type: "int", name: "taskId" })
  taskId: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("varchar", { name: "task_name", length: 32, default: () => "'0'" })
  taskName: string;

  @Column("datetime", {
    name: "start_time",
    default: () => "'2010-01-01 00:00:00'",
  })
  startTime: Date;

  @Column("tinyint", { name: "state_id",nullable: true })
  stateId: number;

  @Column("datetime", { name: "finish_time", nullable: true })
  finishTime: Date | null;

  @Column("tinyint", { name: "resource_type" })
  resourceType: number;

  @Column("int", { name: "resource_amount" })
  resourceAmount: number;

  @ManyToOne(
    () => StampTaskStates,
    (stampTaskStates) => stampTaskStates.stampTasks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "state_id", referencedColumnName: "stateId" }])
  state: StampTaskStates;

  @ManyToOne(() => StampUser, (stampUser) => stampUser.stampTasks, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "userId" }])
  user: StampUser;

  @ManyToOne(
    () => StampResourceTypes,
    (stampResourceTypes) => stampResourceTypes.stampTasks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "resource_type", referencedColumnName: "typeId" }])
  resourceType2: StampResourceTypes;
}
