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
    this.logger.log(`init ${socket.id}`);
  }

  // 사용자 접속 시
  handleConnection(@ConnectedSocket() socket: Socket): any {
    this.logger.log(`Client connected: ${socket.id}`);
  }

  // 사용자 접속 종료 시
  handleDisconnect(client: any): any {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ): string {
    console.log(username);
    console.log(socket.id);

    // 연결된 모든 소켓에 메세지 전송
    socket.broadcast.emit('user_connected', `${username}`);

    socket.emit('hello_user', `${username}`);

    return 'new_user event received';
  }

  @SubscribeMessage('send_message')
  recieveMessage(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', { message, username: socket.id });
  }
}
