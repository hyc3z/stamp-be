import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StampUser } from "./StampUser";
import { StampResourceTypes } from "./StampResourceTypes";
import { StampTaskStates } from "./StampTaskStates";

@Index("FK__stamp_user", ["userId"], {})
@Index("FK_stamp_task_stamp_task_states", ["stateId"], {})
@Index("FK_stamp_task_stamp_resource_types", ["resourceType"], {})
@Entity("stamp_task", { schema: "stamp-hyc" })
export class StampTask {
  @PrimaryGeneratedColumn()
  taskId: string;

  @Column("int")
  userId: string;

  @Column("varchar", { name: "task_name", length: 32, default: () => "'0'" })
  taskName: string;

  @Column("datetime", {
    name: "start_time",
    default: () => "'2010-01-01 00:00:00'",
  })
  startTime: Date;

  @Column("tinyint", { name: "state_id", default: () => "'0'" })
  stateId: number;

  @Column("datetime", { name: "finish_time", nullable: true })
  finishTime: Date | null;

  @Column("tinyint", { name: "resource_type" })
  resourceType: number;

  @Column("int", { name: "resource_amount" })
  resourceAmount: number;

  @ManyToOne(() => StampUser, (stampUser) => stampUser.stampTasks, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: StampUser;

  @ManyToOne(
    () => StampResourceTypes,
    (stampResourceTypes) => stampResourceTypes.stampTasks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "resource_type", referencedColumnName: "typeId" }])
  resourceType2: StampResourceTypes;

  @ManyToOne(
    () => StampTaskStates,
    (stampTaskStates) => stampTaskStates.stampTasks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "state_id", referencedColumnName: "stateId" }])
  state: StampTaskStates;
}
