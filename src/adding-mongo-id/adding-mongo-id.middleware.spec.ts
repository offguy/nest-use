import { UsersService } from './../users/users.service';
import { AddingMongoIdMiddleware } from './adding-mongo-id.middleware';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

describe('AddingMongoIdMiddleware', () => {
  let middleware: AddingMongoIdMiddleware;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              _id: new ObjectId(),
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+972123456789',
              address: { city: 'Tel Aviv', country: 'Israel' }
            }),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    middleware = new AddingMongoIdMiddleware(usersService);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should add MongoDB _id to the request body', async () => {
    const req = {
      body: { id: 1 },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(usersService.findOne).toHaveBeenCalledWith(1);
    expect(req.body).toEqual({
      id: 1,
      _id: expect.any(ObjectId),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+972123456789',
      address: { city: 'Tel Aviv', country: 'Israel' }
    });
    expect(next).toHaveBeenCalled();
  });
});
