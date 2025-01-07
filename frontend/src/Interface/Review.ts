import { UserInterface } from "./IUser";
import { SheetInterface } from "./Sheet";


export interface ReviewInterface {
  id?: number;            
  comment: string;        
  rating: number;         
  reviewDate?: string;     
  userId: number;         
  user?: UserInterface;  
  sheetId: number;        
  sheet?: SheetInterface; 
}
