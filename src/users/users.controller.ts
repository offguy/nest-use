import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, ParseIntPipe, UsePipes, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from '../DTOs/user.dto';
import { UsersCustomPipe } from '../users-custom-pipe/users-custom-pipe.pipe';
import { MessageInterceptor } from '../message/message.interceptor';
import { ModefyDataInterceptor } from '../modefy-data/modefy-data.interceptor';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    @UsePipes(UsersCustomPipe)
    @UseInterceptors(new MessageInterceptor())
    async create(@Body() userDTO: UserDTO): Promise<UserDTO> {
        return this.usersService.create(userDTO);
    }

    @Get()
    @UseInterceptors(new ModefyDataInterceptor())
    @UseInterceptors(new MessageInterceptor())
    async findAll(): Promise<UserDTO[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @UseInterceptors(new MessageInterceptor())
    @UseInterceptors(new ModefyDataInterceptor())
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        return this.usersService.findOne(id);
    }

    @Put(':externalId')
    @UseInterceptors(new MessageInterceptor())
    async update(@Param('externalId', ParseIntPipe) externalId: number, @Body() userDTO: UserDTO): Promise<UserDTO> {
        return this.usersService.update(externalId, userDTO);
    }

    @Delete(':externalId')
    @UseInterceptors(new MessageInterceptor())
    async remove(@Param('externalId', ParseIntPipe) externalId: number): Promise<void> {
        return this.usersService.remove(externalId)
    }
}
