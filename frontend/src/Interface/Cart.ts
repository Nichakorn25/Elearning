import { CartItemInterface } from "./CartItem";
import { CartStatusInterface } from "./CartStatus";
import { UserInterface } from "./IUser";

export interface CartInterface {
    id?: number;             
    cartStatusId: number;  
    cartStatus?: CartStatusInterface; 
    userId?: number;       
    user?: UserInterface;   
    cartItems?: CartItemInterface[]; 
    createdAt?: string;      
    updatedAt?: string;      
    
  }
  