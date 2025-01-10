import { Injectable } from "@nestjs/common";

@Injectable()
export class CalculateDistances{
  
  private radianos(graus: number) {
    return graus * (Math.PI / 180);
  }

   async calculateDistances(
    lat: number,
    log: number,
    latStore: number,
    logStore: number,
  ) {
    const R = 6371; // Raio da Terra em km

    // Diferenças entre as latitudes de longitudes
    const dLat = this.radianos(latStore - lat);
    const dLon = this.radianos(logStore - log);

    // Fórmula de harvesine para  calcular distancias
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.radianos(lat)) *
        Math.cos(this.radianos(latStore)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c; // Resultado em qquilometros
    return distancia;
  }
}