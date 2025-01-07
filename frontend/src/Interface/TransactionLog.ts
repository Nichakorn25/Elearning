import { PaymentInterface } from "./Payment";

export interface TransactionLogInterface {
    ID?: number;                    
    TransactionDate: Date;         
  
    StatusID: number;               
    PaymentStatus?: PaymentInterface; 
  
    PaymentID: number;              
    Payment?: PaymentInterface;     
  }
  