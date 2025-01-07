import { CartInterface } from "./Cart";

export interface CartStatusInterface {
    id?: number;         
    statusName: string;   
    carts?: CartInterface[]; 
    createdAt?: string;   
    updatedAt?: string;    
  }
  