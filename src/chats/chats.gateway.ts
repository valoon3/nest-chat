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
import { InjectModel } from '@nestjs/mongoose';
import { Chatting } from './models/chatting.model';
import { Socket as SocketModel } from './models/socket.model';
import { Model } from 'mongoose';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger('chats');

  constructor(
    @InjectModel(Chatting.name)
    private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {}

  // 최초 구현 시
  afterInit(@ConnectedSocket() socket: Socket): any {
    this.logger.log(`init ${socket.id}`);
  }

  // 사용자 접속 시
  handleConnection(@ConnectedSocket() socket: Socket): any {
    this.logger.log(`Client connected: ${socket.id}`);
  }

  // 사용자 접속 종료 시
  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<any> {
    const user = await this.socketModel.findOne({ id: socket.id });

    if (user) {
      socket.broadcast.emit('disconnected_user', `${user.username}`);
      await this.socketModel.deleteOne({ id: socket.id }).exec();
    }
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    const exist = await this.socketModel.exists({ username });

    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
    }
    await this.socketModel.create({ id: socket.id, username });

    // 연결된 모든 소켓에 메세지 전송
    socket.broadcast.emit('user_connected', `${username}`);

    socket.emit('hello_user', `${username}`);

    return username;
  }

  @SubscribeMessage('send_message')
  async recieveMessage(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });

    await this.chattingModel.create({ user: socketObj, chat: message });

    socket.broadcast.emit('new_chat', {
      message,
      username: socketObj.username,
    });
  }
}
