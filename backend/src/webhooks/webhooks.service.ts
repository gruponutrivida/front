import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhooksService {
  async processWebhook(payload: any) {
    try {
      if (
        payload.entry &&
        payload.entry[0].changes &&
        payload.entry[0].changes[0] &&
        payload.entry[0].changes[0].value.messages &&
        payload.entry[0].changes[0].value.messages[0]
      ) {
        const message = payload.entry[0].changes[0].value.messages[0];
        const contact = payload.entry[0].changes[0].value.contacts[0];
        const wamId = message.id; // WhatsApp Message ID

        console.log(`Nova mensagem recebida do número ${contact.wa_id}`);
        console.log(`Payload completo:`, message);

        // TODO: Aqui a Fila consumirá o Payload e tratará a Lógica de Coexistência 
        // e Fluxo do Bot (Salvar no Prisma Prisma, Emitir Socket, etc)
      }
    } catch (error) {
      console.error('Erro ao processar Webhook bruto:', error);
    }
  }
}
