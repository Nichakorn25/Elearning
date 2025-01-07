export interface SellerInterface {
    Name: string;
    UserID?: number;
    SellerBankAccount: {
      BankID: number;
      BankNumber: string;
    }[];
  }
  