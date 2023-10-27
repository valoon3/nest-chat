import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger('chats');

  // 최초 구현 시
  afterInit(@ConnectedSocket() socket: Socket): any {
    this.logger.log(`init`);
    this.logger.log(`${socket.id}`);
  }

  // 사용자 접속 시
  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('handle connection');
    this.logger.log(`Client connected: ${socket.id}`);
  }

  // 사용자 접속 종료 시
  handleDisconnect(client: any): any {
    console.log(client);
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    console.log(username);
    console.log(socket.id);
    socket.emit('hello_user', `hello ${username}!`);
  }
}
