export interface SheetInterface {
    ID: number;           
    Title: string;          
    Description: string;   
    FilePath: string;       
    Price: number;          
    Rating: number;        
    PurchaseCount: number;  
    CourseID: number;       
    Year: number;          
    SellerID: number;      
    Seller?: {              
        Name: string;
    };
    Course?: {              
        CourseCode: string;
    };
    Term?: {              
        Name: string;
    };
}