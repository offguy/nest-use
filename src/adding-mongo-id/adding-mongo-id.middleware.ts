import { UsersService } from './../users/users.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AddingMongoIdMiddleware implements NestMiddleware {
  constructor(private readonly UsersService: UsersService){}
  async use(req: Request, res: Response, next: () => void) {
    const {id} = req.body
    req.body = (await this.UsersService.findOne(id))
    next();
  }
}
