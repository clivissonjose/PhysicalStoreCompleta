import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class CalculateFrete{
   
  async calcularFrete(cepOrigem: string, cepDestino: string) {
    let data = JSON.stringify({
      cepOrigem,
      cepDestino,
      comprimento: '20',
      largura: '15',
      altura: '10',
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://www.correios.com.br/@@precosEPrazosView',
      headers: {
        'Content-Type': 'application/json',
        Cookie:
          'LBprdExt2=852033546.47873.0000; LBprdint2=3074031626.47873.0000; TS01a7fccb=01ff9e5fc64fd38a5b2e50a2ae3a570ef11d7b9449096c5247fb9319b4c45f9e32e3efda46b82068af62752a57017007cc253c024822dff0b9b9460ba987098591ab9710f6df38a05c6b4bfe42834161daf1fad8d3',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular o frete:', error.message);
      throw new Error('Erro ao calcular o frete');
    }
  }


}