import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class CalculateCoordinates{

   // Funcao para encontrar coordenadas
   async searchCoordinates(cep: string) {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: `${cep}, Brazil`,
         key: process.env.GOOGLE_API_KEY,

          random: Math.random(),
        },
      },
    );

    const data = response.data;

    // Verificar se tudo está ok
    if (data.status !== 'OK' || data.results.length === 0) {
      console.error('CEP não encontrado ou erro na requisição:', data.status);
      return null;
    }

    return {
      latitude: data.results[0].geometry.location.lat,
      longitude: data.results[0].geometry.location.lng,
    };
  }
}