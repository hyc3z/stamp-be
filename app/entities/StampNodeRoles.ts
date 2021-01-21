import { Column, Entity, OneToMany } from "typeorm";
import { StampNodeInfo } from "./StampNodeInfo";

@Entity("stamp_node_roles", { schema: "stamp-hyc" })
export class StampNodeRoles {
  @Column("tinyint", { primary: true, name: "role_id" })
  roleId: number;

  @Column("varchar", { name: "description", nullable: true, length: 64 })
  description: string | null;

  @OneToMany(() => StampNodeInfo, (stampNodeInfo) => stampNodeInfo.role2)
  stampNodeInfos: StampNodeInfo[];
}
