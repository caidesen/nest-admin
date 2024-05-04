import { DeviceVO } from "./device.dto";
import { IdOnly } from "../../../common/dto";

export interface WorkOrderVO {
  id: string;
  device: DeviceVO;
  testingDate?: string | null;
  faultDescription: string;
  maintainDate?: string | null;
  maintenanceResult: string;
}

export interface CreateWorkOrderInput {
  device: IdOnly;
  testingDate?: string;
  faultDescription: string;
  maintainDate?: string;
  maintenanceResult: string;
}

export interface UpdateWorkOrderInput extends CreateWorkOrderInput {
  id: string;
}
