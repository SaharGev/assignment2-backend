import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Tags,
  Path,
  Body,
  Security
} from "tsoa";

interface UserBody {
  name: string;
  email: string;
  password?: string;
}

@Route("users")
@Tags("Users")
@Security("jwt") 
export class UsersTsoaController extends Controller {

  // POST /users
  @Post("/")
  public async createUser(@Body() body: UserBody) {
    return { message: "User created" };
  }

  // GET /users
  @Get("/")
  public async getAllUsers() {
    return []; 
  }

  // GET /users/{id}
  @Get("{id}")
  public async getUserById(@Path() id: string) {
    return {}; 
  }

  // PUT /users/{id}
  @Put("{id}")
  public async updateUser(@Path() id: string, @Body() body: UserBody) {
    return { message: "User updated" };
  }

  // DELETE /users/{id}
  @Delete("{id}")
  public async deleteUser(@Path() id: string) {
    return { message: "User deleted" };
  }
}
