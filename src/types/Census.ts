export type Census = {
  id?: number;
  zone: string;
  age: number;
  year: number;
  amount: number;
  gender: string;
  districtId?: number;
}


export type CensusPage = {
  content: Census[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export const initialCensusPageData: CensusPage = {
  last: true,
  totalPages: 0,
  totalElements: 0,
  size: 10,
  number: 0,
  first: true,
  numberOfElements: 0,
  empty: true,
  content: [{
    id: 1,
    age: 0,
    amount: 0,
    gender: '',
    year: 0,
    zone: ''
  }]
}

export type CensusDeleteResponse = {
  msg: string,
  httpStatus: string
}
