export type AddressInput = {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
};

export type CartItems = Record<string, number>;

export type CouponPayload = {
  code?: string;
  discount?: number;
};
