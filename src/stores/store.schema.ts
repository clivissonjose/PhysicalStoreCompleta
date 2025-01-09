import { Schema, Document } from 'mongoose';

// Criando a classe Store
export class Store extends Document {
  storeName: string;
  takeOutInStore: boolean;
  shippingTimeInDays: number;
  latitude: string;
  longitude: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  district: string;
  state: string;
  type: string; // PDV ou LOJA
  country: string;
  postalCode: string;
  telephoneNumber: string;
  emailAddress: string;
}

// Definindo o schema Mongoose com o tipo da classe Store
export const StoreSchema = new Schema<Store>({
  storeName: { type: String, required: true },
  takeOutInStore: { type: Boolean, required: true },
  shippingTimeInDays: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  address3: { type: String },
  city: { type: String, required: true },
  district: { type: String },
  state: { type: String, required: true },
  type: { type: String, required: true }, // PDV ou LOJA
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  telephoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
});
