export interface Discount {
    discountId: number;
    name: string;
    discount: number;   
  }

  export interface DiscountReq {
    name: string;
    discount: number;   
  }