import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsPhoneNumber, IsString, Length } from "class-validator";
import { ObjectId } from "mongodb";

export class UserDTO
{
    _id : ObjectId;

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    name: string;

    @IsEmail()
    email : string;
    
    @IsPhoneNumber("IL")
    phone : string;

    @IsObject()
    address : {city: string, country : string}
}