import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { UserDTO } from '../DTOs/user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class UsersCustomPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: UserDTO, metadata: ArgumentMetadata) {
    const userExists = await this.usersService.findAll();

    if (userExists.some((u: UserDTO) => u.id === value.id)) {
      throw new HttpException(`ID ${value.id} already exists`, HttpStatus.CONFLICT);
    }

    return value;
  }
}
