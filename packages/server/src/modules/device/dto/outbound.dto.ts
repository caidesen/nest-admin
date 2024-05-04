import { DeviceVO } from "./device.dto";
import { SimpleUserVO } from "../../auth/dto/user.dto";
import { IdOnly } from "../../../common/dto";

export interface OutboundVO {
  id: string;
  device: DeviceVO;
  agentUser: SimpleUserVO;
  date: string;
}

export interface CreateOutboundInput {
  device: IdOnly;
  agentUser: IdOnly;
  date: string;
}

export interface UpdateOutboundInput extends CreateOutboundInput {
  id: string;
}
