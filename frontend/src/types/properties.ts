export type Property = {
  id: string;       
  idOwner: string;
  name: string;      
  address: string;   
  price: number;     
  imageUrl?: string; 
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type ListParams = {
  page: number;
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
};