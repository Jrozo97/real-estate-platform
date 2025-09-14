export type Property = {
  id: string;       
  name: string;      
  address: string;   
  price: number;    
  codeInternal: string;
  year: number;
  owner: Owner;
  images: Images[];
  traces: Trace[];
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type ListParams = {
  page: number;
  pageSize?: number;
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // e.g., "price:asc" or "price:desc"
};

export type Owner = {
  id: string;
  name: string;
  address: string;
  photo: string;
  birthday: string;
};

export type Images ={
  id: string;
  file: string; 
  enabled: boolean;
}

export type Trace = {
  id: string;
  name: string;
  dateSale: string;   // ← era "date"
  value: number;
  tax: number;
};

export type PropertiesMeta = {
  minPrice: number;
  maxPrice: number;
};