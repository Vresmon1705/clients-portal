import { IArticle } from "./article";

export interface PaginatedResponse { 
        data: IArticle[];
        totalRecords: number;      
}
