import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsOptional } from "class-validator";


export class CreateStoreDTO{

  @IsString()
  @IsNotEmpty()
  readonly storeID: string; // ID único da loja

  @IsString()
  @IsNotEmpty()
  readonly storeName: string; // Nome da loja

  @IsBoolean()
  @IsNotEmpty()
  readonly takeOutInStore: boolean; // Produto disponível para retirada na loja

  @IsNumber()
  @IsNotEmpty()
  readonly shippingTimeInDays: number; // Tempo de envio/preparo em dias

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