import { UsersService } from './../users/users.service';
import { UsersCustomPipe } from './users-custom-pipe.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentMetadata, HttpException } from '@nestjs/common';
import { UserDTO } from '../DTOs/user.dto';
import { ObjectId } from 'mongodb';

describe('UsersCustomPipe', () => {
  let usersService: UsersService;
  let usersCustomPipe: UsersCustomPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: 1, _id: new ObjectId(), name: 'John Doe', email: 'john@example.com', phone: '+972123456789', address: { city: 'Tel Aviv', country: 'Israel' } },
              { id: 2, _id: new ObjectId(), name: 'Jane Smith', email: 'jane@example.com', phone: '+972987654321', address: { city: 'Haifa', country: 'Israel' } }
            ]),
          },
        },
        UsersCustomPipe,
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersCustomPipe = module.get<UsersCustomPipe>(UsersCustomPipe);
  });

  it('should be defined', () => {
    expect(usersCustomPipe).toBeDefined();
  });

  it('should pass if the id does not exist', async () => {
    const newUser: UserDTO = {
      id: 3,
      _id: new ObjectId(),
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+972555555555',
      address: { city: 'Jerusalem', country: 'Israel' }
    };

    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: UserDTO,
      data: '',
    };

    await expect(usersCustomPipe.transform(newUser, metadata)).resolves.toEqual(newUser);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('should throw an error if the id already exists', async () => {
    const existingUser: UserDTO = {
      id: 1,
      _id: new ObjectId(),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+972123456789',
      address: { city: 'Tel Aviv', country: 'Israel' }
    };

    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: UserDTO,
      data: '',
    };

    await expect(usersCustomPipe.transform(existingUser, metadata)).rejects.toThrow(HttpException);
    expect(usersService.findAll).toHaveBeenCalled();
  });
});
