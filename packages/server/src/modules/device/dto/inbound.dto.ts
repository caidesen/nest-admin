import { DeviceVO } from "./device.dto";
import { SimpleUserVO } from "../../auth/dto/user.dto";
import { IdOnly } from "../../../common/dto";

export interface InboundVO {
  id: string;
  device: DeviceVO;
  agentUser: SimpleUserVO;
  date: string;
}

export interface CreateInboundInput {
  device: IdOnly;
  agentUser: IdOnly;
  date: string;
}

export interface UpdateInboundInput extends CreateInboundInput {
  id: string;
}
