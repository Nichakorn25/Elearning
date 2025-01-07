export interface SheetInterface {
    Term: string;
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
        CourseDate: string;
    };
}
