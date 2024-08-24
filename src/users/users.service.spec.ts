import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserDTO } from '../DTOs/user.dto';
import { AddingMongoIdMiddleware } from '../adding-mongo-id/adding-mongo-id.middleware';
import { ObjectId } from 'mongodb';

describe('AddingMongoIdMiddleware', () => {
  let middleware: AddingMongoIdMiddleware;
  let usersService: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn().mockResolvedValue([
        {
          _id: new ObjectId(),
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+972123456789',
          address: { city: 'Tel Aviv', country: 'Israel' }
        },
        {
          _id: new ObjectId(),
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+972987654321',
          address: { city: 'Haifa', country: 'Israel' }
        },
        {
          _id: new ObjectId(),
          id: 3,
          name: 'Alice Brown',
          email: 'alice@example.com',
          phone: '+972555555555',
          address: { city: 'Jerusalem', country: 'Israel' }
        }
      ])
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddingMongoIdMiddleware,
        { provide: UsersService, useValue: mockUsersService }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    middleware = module.get<AddingMongoIdMiddleware>(AddingMongoIdMiddleware);
  });

  it('get users', async () => {
    const users: UserDTO[] = await usersService.findAll();
    expect(users.length).toEqual(3);

  });
});
