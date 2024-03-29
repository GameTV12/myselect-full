import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { CreateCommentDto } from '../dtos/create-comment.dto';
import { EditCommentDto } from '../dtos/edit-comment.dto';
import { KafkaClient } from '../kafka';

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export enum Type {
  POST = 'POST',
  VARIANT = 'VARIANT',
}

@Injectable()
export class CommentService implements OnModuleInit {
  constructor(
    @Inject(KafkaClient.CommentService)
    private readonly commentClient: ClientKafka,
  ) {}

  async createComment(userId: string, type: Type, dto: CreateCommentDto) {
    const newCommentDto = {
      userId: userId,
      type: type,
      text: dto.text,
      goalId: dto.goalId,
      replyTo: dto.replyTo,
    };
    const comment = await new Promise((resolve) => {
      this.commentClient
        .send('create_comment', newCommentDto)
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comment;
  }

  async getCommentList(goalId: string, type: Type, viewerId?: string) {
    const comments = await new Promise((resolve) => {
      this.commentClient
        .send('get_comments', { goalId, type, viewerId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comments;
  }

  async getAllCommentsOfUser(linkNickname: string, viewerId?: string) {
    const comments = await new Promise((resolve) => {
      this.commentClient
        .send('get_all_comments_of_user', { linkNickname, viewerId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comments;
  }

  async updateComment(userId: string, dto: EditCommentDto) {
    const comment = await new Promise((resolve) => {
      this.commentClient
        .send('update_comment', { userId, dto })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comment;
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await new Promise((resolve) => {
      this.commentClient
        .send('delete_comment', { userId, commentId })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return comment;
  }

  async reactOnComment(commentId: string, userId: string, type: ReactionType) {
    const reaction = await new Promise((resolve) => {
      this.commentClient
        .send('react_on_comment', { commentId, userId, type })
        .subscribe((data) => {
          resolve(data);
        });
    });
    return reaction;
  }

  async onModuleInit() {
    this.commentClient.subscribeToResponseOf('create_comment');
    this.commentClient.subscribeToResponseOf('get_comments');
    this.commentClient.subscribeToResponseOf('get_number_comments_of_user');
    this.commentClient.subscribeToResponseOf('get_all_comments_of_user');
    this.commentClient.subscribeToResponseOf('update_comment');
    this.commentClient.subscribeToResponseOf('delete_comment');
    this.commentClient.subscribeToResponseOf('react_on_comment');
    this.commentClient.subscribeToResponseOf('comment_create_user');
    this.commentClient.subscribeToResponseOf('comment_update_user');
    this.commentClient.subscribeToResponseOf('comment_ban_user');
    this.commentClient.subscribeToResponseOf('comment_make_moderator');
    this.commentClient.subscribeToResponseOf('comment_cancel_moderator');
    this.commentClient.subscribeToResponseOf('comment_verify_user');
    await this.commentClient.connect();
  }
}
