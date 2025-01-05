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

  @IsString()
  @IsNotEmpty()
  readonly latitude: string; // Latitude da localização

  @IsString()
  @IsNotEmpty()
  readonly longitude: string; // Longitude da localização

  @IsString()
  @IsNotEmpty()
  readonly address1: string; // Endereço principal

  @IsString()
  @IsOptional()
  readonly address2?: string; // Endereço secundário (opcional)

  @IsString()
  @IsOptional()
  readonly address3?: string; // Endereço terciário (opcional)

  @IsString()
  @IsNotEmpty()
  readonly city: string; // Cidade

  @IsString()
  @IsNotEmpty()
  readonly district: string; // Distrito/Bairro

  @IsString()
  @IsNotEmpty()
  readonly state: string; // Estado

  @IsString()
  @IsNotEmpty()
  readonly type: string; // Tipo da loja (PDV ou LOJA)

  @IsString()
  @IsNotEmpty()
  readonly country: string; // País

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