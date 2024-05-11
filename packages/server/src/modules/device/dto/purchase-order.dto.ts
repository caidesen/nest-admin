import { DeviceVO } from "./device.dto";
import { SimpleUserVO } from "../../auth/dto/user.dto";
import { IdOnly } from "../../../common/dto";

export interface PurchaseOrderVO {
  id: string;
  code: string;
  device: DeviceVO;
  date: string;
  purchaseUser: SimpleUserVO;
  quantity: number;
  contractNumber: string;
}

export interface CreatePurchaseOrderInput {
  device: IdOnly;
  date: string;
  purchaseUser: IdOnly;
  quantity: number;
  contractNumber: string;
}

export interface UpdatePurchaseOrderInput extends CreatePurchaseOrderInput {
  id: string;
}
