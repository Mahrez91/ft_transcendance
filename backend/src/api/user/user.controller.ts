import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UpdateUsersAfterGameDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import axios from 'axios';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController
{
	@Inject(UserService)
	private readonly service: UserService;

	@Get()
	public getUsers(): Promise<User[]>
	{
		return this.service.getUsers();
	}

	@Get('all')
	public getUsersWithDefault(): Promise<User[]>
	{
		return this.service.getUsersWithDefault();
	}

	@Get(':id')
	public getUser(@Param('id', ParseIntPipe) id: number): Promise<User>
	{
		return this.service.getUser(id);
	}

	//@Post()
	//public createUser(@Body() body: CreateUserDto): Promise<User> {
	//  return this.service.createUser(body);
	//}

	@Post()
	public async getToken(@Body() data: any)
	{
		console.log(data.token);
		const response: any = await axios.post("https://api.intra.42.fr/oauth/token", {
			client_id: "cbd1064bd58ef5065a103fbd35e3b251f506b89d0f101660714907581d0c9bd9",
			//client_id: "d99b55c8716eb674d3a78116832e8a2bb2085c6706e5195a4f91f66a3739939b",
			client_secret: "CLIENT_SECRET",
			grant_type: "authorization_code",
			code: data.token,
			redirect_uri: "http://localhost:3001/login"
		})
			.catch(error => console.log(error))
		console.log(response.data.access_token);
		return this.service.createUser(response.data);
	}

	// tmp add user
	@Post('name/:name')
	public tmpCreateUser(@Param('name') name: string)
	{
		return this.service.tmpCreateUser({ name: name });
	}

	@Get('name/:name')
	public tmpGetUser(@Param('name') name: string)
	{
		return this.service.getUserByName(name);
	}

	@Put(':id')
	public updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: any)
	{
		return this.service.updateUser(id, data.updateUserDto);
	}

	@Post('match')
	public updateUsersAfterGame(@Body() data: UpdateUsersAfterGameDto)
	{
		return this.service.updateUsersAfterGame(data);
	}

	@Put('pp/:id')
	@UseInterceptors(FileInterceptor('file'))
	public async uploadFile(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Body() data: any)
	{
		console.log(id);
		console.log(file);
		console.log(file.originalname);
		console.log(data);
		console.log("finish");

		return await this.service.putPP(id, file.originalname, file.buffer);
	}
}
