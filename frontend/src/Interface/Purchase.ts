import { CartInterface } from "./Cart";
import { UserInterface } from "./IUser";
import { PaymentInterface } from "./Payment";
import { SheetInterface } from "./Sheet";

export interface PurchaseInterface {
    ID?: number;                    
    PurchaseDate: Date;              
    TotalPrice: number;             
  
    Payment?: PaymentInterface[];    
  
    CartID: number;                
    Cart?: CartInterface;            
  
    SheetID: number;                
    Sheet?: SheetInterface;         
  
    UserID: number;                  
    User?: UserInterface;            
}
  