export enum PackId {
  SMAL = "SMAL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type CreditsPack = {
  id: PackId
  name: string
  label: string
  credits: number
  price: number
  priceId: string
}

export const CreditsPack: CreditsPack[] = [
  {
    id: PackId.SMAL,
    name: "Small Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 999, // $9.99
    priceId: process.env.STRIPE_SMAL_PACK_PRICE_ID as string,
  },
  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 3999, // $39.99
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID as string,
  },
  {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "10,000 credits",
    credits: 10000,
    price: 6999, // $69.99
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID as string,
  },
]

export const getCreditsPack = (id: PackId) =>
  CreditsPack.find((p) => p.id === id)
