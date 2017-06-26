export type ID = number;
export type ProductTypeName = string;

export type Color = number[]; // better: [number, number, number] | [number, number, number, number];, but typescript sucks at tuples

export type ProductType = {
  color: Color;
  name: ProductTypeName;
  id: ID;
  discontinued: boolean;
};
export type ProductTypes = ProductType[];

export type NewType = {
  kind: 'create';
  color: Color;
  name: ProductTypeName;
};

export type ModifyType = {
  kind: 'modify';
  id: ID;
  color?: Color;
  name?: ProductTypeName;
  discontinued?: boolean;
};

export type DiscontinueType = {
  kind: 'discontinue';
  id: ID;
}

export type TypeUpdate = NewType | ModifyType | DiscontinueType;
export type TypesUpdate = TypeUpdate[];

export type Product = {
  name: string;
  quantity: number;
  id: ID;
  type: ID;
  discontinued: boolean;
};
export type Products = Product[];

export type NewProduct = {
  kind: 'create';
  name: string;
  type: ID;
  quantity: number;
};

export type ModifyProduct = {
  kind: 'modify';
  id: ID;
  name?: string;
  quantity?: number;
  discontinued?: boolean;
};

export type DiscontinueProduct = {
  kind: 'discontinue';
  id: ID;
};

export type ProductUpdate = NewProduct | ModifyProduct | DiscontinueProduct;
export type ProductsUpdate = ProductUpdate[];

export type Record = {
  products: ID[];
  price: number;
  time: number;
};
export type Records = Record[];
export type RecordUpdate = {
  products: ID[];
  price: number;
  time: number;
};
export type RecordsUpdate = RecordUpdate[];

export type PriceList = number[][];

export type Price = {
  type: ID;
  product: ID | null,
  prices: PriceList;
}
export type Prices = Price[];
export type PriceUpdate = {
  type_id: ID;
  product_id: ID | null;
  price: PriceList;
};

export type PricesUpdate = PriceUpdate[];

export type ConventionData = {
  products: Products;
  records: Records;
  prices: Prices;
  types: ProductTypes;
};

export type MetaConvention = {
  type: 'meta',
  title: string;
  code: string;
  start: Date;
  end: Date;
};

export type FullConvention = {
  type: 'full',
  title: string;
  code: string;
  start: Date;
  end: Date;
  data: ConventionData;
};

export type Convention = MetaConvention | FullConvention;
export type Conventions = Convention[];

export type APISuccessResult<T> = {
  status: 'Success';
  data: T;
};
export type APIErrorResult = {
  status: 'Error';
  error: string;
};
export type APIResult<T> = APISuccessResult<T> | APIErrorResult;

export type UserInfo = {
  email: string;
  keys: number;
  products: Products;
  prices: Prices;
  types: ProductTypes;
  conventions: Conventions;
};
