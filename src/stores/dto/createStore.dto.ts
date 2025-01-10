import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsOptional, isString } from "class-validator";

export class CreateStoreDTO{


  storeName: string; 

  @IsBoolean()
  @IsNotEmpty()
  readonly takeOutInStore: boolean; 

  @IsNumber()
  @IsNotEmpty()
  readonly shippingTimeInDays: number; 

  latitude: string; // Latitude da localização

  longitude: string; // Longitude da localização

  address1: string; // Endereço principal

  address2?: string; // Endereço secundário (opcional)

  address3?: string; // Endereço terciário (opcional)

  city: string; // Cidade


  district: string; // Distrito/Bairro

  state: string; // Estado

  @IsString()
  @IsNotEmpty()
  readonly type: string; // Tipo da loja (PDV ou LOJA)

  @IsString()
  @IsNotEmpty()
  country: string; // País

  @IsString()
  @IsNotEmpty()
  readonly postalCode: string; // Código postal/CEP

  @IsString()
  @IsNotEmpty()
  readonly telephoneNumber: string; // Telefone da loja

  @IsString()
  @IsNotEmpty()
  readonly emailAddress: string; // E-mail da loja


}