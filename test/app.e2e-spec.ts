import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/users/users.service';
import { ObjectId } from 'mongodb';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get<UsersService>(UsersService);
    await app.init();
  });

  it('/users (POST) - should return 201 when creating a new user', async () => {
    const newUser = {
      id: 3,
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+972555555555',
      address: { city: 'Jerusalem', country: 'Israel' },
    };

    // Mocking the UsersService to return null for findAll (meaning the ID doesn't exist)
    jest.spyOn(usersService, 'findAll').mockResolvedValue([]);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toEqual(newUser);
  });

  it('/users (POST) - should return 409 if the id already exists', async () => {
    const existingUser = {
      id: 1,
      _id: new ObjectId(),
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+972123456789',
      address: { city: 'Tel Aviv', country: 'Israel' },
    };

    // Mocking the UsersService to return a list containing the existing user
    jest.spyOn(usersService, 'findAll').mockResolvedValue([existingUser]);

    await request(app.getHttpServer())
      .post('/users')
      .send(existingUser)
      .expect(409);
  });

  it('/users/:id (PUT) - should return 200 and update the user with MongoDB _id', async () => {
    const updatedUser = {
      id: 1,
      name: 'Leanne Graham Updated',
      email: 'leanne.updated@example.com',
      phone: '052-6666666',
      address: { city: 'Lisbon', country: 'Portugal' },
    };

    // Mocking the UsersService to return a user when findOne is called
    jest.spyOn(usersService, 'findOne').mockResolvedValue({
      _id: new ObjectId("6692c81ec36f8431f7e2b4e9"),
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      phone: '052-5555',
      address: { city: 'Lisbon', country: 'Portugal' }
    });

    const response = await request(app.getHttpServer())
      .put('/users/1')
      .send(updatedUser)
      .expect(200);

    expect(response.body).toEqual({
      ...updatedUser,
      _id: "6692c81ec36f8431f7e2b4e9", // The MongoDB _id should be added by the middleware
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
