export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    images?: string[];
    videos?: string[];
}
