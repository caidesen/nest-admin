export interface FundMovementVO {
  id: string;
  date: string;
  amount: number;
  purchaseOrder: {
    code: string;
  };
}

export interface CreateFundMovementInput {
  date: string;
  amount: number;
  purchaseOrder: {
    code: string;
  };
}

export interface UpdateFundMovementInput extends CreateFundMovementInput {
  id: string;
}
