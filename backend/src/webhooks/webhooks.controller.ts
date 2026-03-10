import { Controller, Get, Post, Req, Res, Headers, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import type { Request, Response } from 'express';

@Controller('webhooks/meta')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  // Fase 1: Validação do Webhook (Quando configura o App na Meta for Developers)
  @Get()
  verifyWebhook(@Req() req: Request, @Res() res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook Verificado pela Meta com Sucesso!');
      return res.status(HttpStatus.OK).send(challenge);
    }

    return res.sendStatus(HttpStatus.FORBIDDEN);
  }

  // Fase 2: Recepção de Eventos em Tempo Real (Mensagens novas, Lido, etc)
  @Post()
  async handleIncomingWebhook(
    @Req() req: Request, 
    @Res() res: Response,
    @Headers('x-hub-signature-256') signature: string
  ) {
    const body = req.body;

    // Retornamos 200 OK imediatamente para a Meta não achar que nosso server caiu
    res.status(HttpStatus.OK).send('EVENT_RECEIVED');

    // Mandamos jogar na Fila do Redis (BullMQ - Será implementado no Service)
    if (body.object) {
      await this.webhooksService.processWebhook(body);
    }
  }
}
