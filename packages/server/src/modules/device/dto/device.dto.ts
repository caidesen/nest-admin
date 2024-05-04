export interface DeviceVO {
  id: string;
  code: string;
  name: string;
}

export interface CreateDeviceInput {
  code: string;
  name: string;
}

export interface UpdateDeviceInput extends CreateDeviceInput {
  id: string;
}
