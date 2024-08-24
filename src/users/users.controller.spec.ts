import { ObjectId } from 'mongodb';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service'); // Automatically mocks the entire UsersService

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    usersService.findAll.mockResolvedValue([
      {
        _id: new ObjectId("6692c81ec36f8431f7e2b4e9"),
        id: 1,
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        phone: '052-5555',
        address: { city: 'Lisbon', country: 'Portugal' }
      },
      {
        _id: new ObjectId("6692c801c36f8431f7e2b4e8"),
        id: 2,
        name: 'Ervin Howell',
        email: 'Shanna@melissa.tv',
        phone: '052-4444',
        address: { city: 'Haifa', country: 'Israel' }
      },
      {
        _id: new ObjectId("66b252f58eae68532fafe062"),
        id: 3,
        name: 'Clementine Bauch',
        email: 'Nathan@yesenia.net',
        phone: '052-3333333',
        address: { city: 'Amsterdam', country: 'Netherlands' }
      }
    ]);

    const users = await controller.findAll();
    expect(users.length).toBe(3);
    expect(users[0].name).toBe('Leanne Graham');
  });

  it('should return a single user', async () => {
    usersService.findOne.mockResolvedValue( {
      _id: new ObjectId("6692c81ec36f8431f7e2b4e9"),
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      phone: '052-5555',
      address: { city: 'Lisbon', country: 'Portugal' }
    });

    const user = await controller.findOne(1);
    expect(user.name).toBe('Leanne Graham');
  });
});