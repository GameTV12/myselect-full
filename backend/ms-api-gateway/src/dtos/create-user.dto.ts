import {
    IsDate,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsStrongPassword,
    Length,
    MaxLength
} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 80)
    nickname: string

    @IsNotEmpty()
    @IsString()
    @Length(2, 30)
    linkNickname: string

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    email: string

    @IsNotEmpty()
    @IsString()
    @Length(6, 40)
    password: string

    @IsOptional()
    @IsString()
    @MaxLength(400)
    photo: string = 'https://i.pinimg.com/564x/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg'

    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    firstName: string

    @IsOptional()
    @IsString()
    @MaxLength(80)
    lastName: string

    @IsNotEmpty()
    @IsInt()
    birthday: number
}