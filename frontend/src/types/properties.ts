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
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
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
  enabled: boolean | string;
}

export type Trace ={
  id: string;
  name: string;
  date: string;
  value: number;
  tax: number;
};


