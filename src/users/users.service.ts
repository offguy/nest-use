import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { UserDTO } from 'src/DTOs/user.dto';
const fileDAL = require("../DALs/usersFileDAL");
const WsDAL = require("../DALs/usersWsDAL");

@Injectable()
export class UsersService {
    users: UserDTO[] = [];

    constructor(
        @InjectRepository(Users)
        private usersREPO: Repository<Users>
    ) {
        this.initializeData();
    }

    async initializeData() {
        const { data: wsData } = await WsDAL.getData();
        const { users: fileData } = await fileDAL.readData();
        const [...mongoData] = (await this.usersREPO.find()).map((use) => {
            return {...use}
        });
        
        this.users = fileData.map((user: any) => {
            const wsInfo = wsData.find((us : any)  => us.id == user.id);
            
            const {...per} = mongoData.find((u: any) => u.externalId == user.id);
            const {city, country} = per
            return {
                _id : per._id,
                id: user.id,
                name: wsInfo.name,
                email: wsInfo.email,
                phone: user.phone,
                address: {
                    city,
                    country
                }
            };
        });
    }

    async create(userDTO: UserDTO): Promise<UserDTO> {
        
        await WsDAL.postData({name: userDTO.name, email: userDTO.email});
        const MongoUser = this.usersREPO.create({
            externalId: userDTO.id,
            city: userDTO.address.city,
            country: userDTO.address.country
        });
        const {_id} = await this.usersREPO.save(MongoUser);
        const fileUsers = this.users.map(user => {
            return { id: user.id,
            phone: user.phone}
        })
        await fileDAL.saveData(fileUsers)
        this.users.push({_id: _id, ...userDTO});
        return userDTO;
    }

    async findAll(): Promise<UserDTO[]> {
        console.log(this.users)
        return this.users;
    }

    async findOne(id: number): Promise<UserDTO> {
        const user = this.users.find(user => user.id == id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        console.log(user)
        return user;
    }

    async update(externalId: number, userDTO: UserDTO): Promise<UserDTO> {
        // Find the user in MongoDB
        const mongoUser = await this.usersREPO.findOne({ where: { externalId } });
        if (!mongoUser) {
            throw new NotFoundException(`User with externalId ${externalId} not found`);
        }

        // Find and update the user in the in-memory array
        const index = this.users.findIndex(user => user.id == mongoUser.externalId);
        if (index == -1) {
            throw new NotFoundException(`User with externalId ${externalId} not found in memory`);
        }

        const updatedUser = { ...this.users[index], ...userDTO, id: mongoUser.externalId };
        this.users[index] = updatedUser;

        // Update the user in the database
        await this.usersREPO.update({ externalId }, { city: userDTO.address.city, country: userDTO.address.country });
        const fileUsers = this.users.map(user => {
            return { id: user.id,
            phone: user.phone}
        })
        await fileDAL.saveData(fileUsers)
        await WsDAL.putData(this.users[index]);
        console.log(updatedUser)
        return updatedUser;
    }

    async remove(externalId: number): Promise<void> {
        // Find the user in MongoDB
        const mongoUser = await this.usersREPO.findOne({ where: { externalId } });
        if (!mongoUser) {
            throw new NotFoundException(`User with externalId ${externalId} not found`);
        }

        // Find and remove the user from the in-memory array
        const index = this.users.findIndex(user => user.id == mongoUser.externalId);
        if (index === -1) {
            throw new NotFoundException(`User with externalId ${externalId} not found in memory`);
        }

        this.users.splice(index, 1);

        // Delete the user from the database
        await this.usersREPO.delete({ externalId });
        await WsDAL.deleteData(externalId)
        const fileUsers = this.users.map(user => {
            return { id: user.id,
            phone: user.phone}
        })
        await fileDAL.saveData(fileUsers)
    }
}
