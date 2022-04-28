import { Module } from '@nestjs/common';
import { WebSocketioGateway } from './websocket.gateway';

@Module({
  providers: [WebSocketioGateway],
})
export class EventsModule {}
