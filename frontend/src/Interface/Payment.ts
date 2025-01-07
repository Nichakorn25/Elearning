import { UserInterface } from "./IUser";
import { PurchaseInterface } from "./Purchase";
import { TransactionLogInterface } from "./TransactionLog";

export interface PaymentInterface {
    ID?: number;                     
    PaymentDate: Date;               
    Amount: number;                 
    Slip: string;                   
  
    TransactionLog?: TransactionLogInterface[]; 
    UserID: number;                
    User?: UserInterface;           
  
    PurchaseID: number;             
    Purchase?: PurchaseInterface;    
  
    MethodID: number;               
    PaymentMethod?: PaymentInterface; 
  }
  