import { CartInterface } from "./Cart";
import { SheetInterface } from "./Sheet";

export interface CartItemInterface {
    ID?: number | undefined;  
    Sheet?: SheetInterface;   
    sheetId?: number;         
    cartId?: number;          
    cart?: CartInterface;     
    addedDate?: string;      
    createdAt?: string;       
    updatedAt?: string;       
}
