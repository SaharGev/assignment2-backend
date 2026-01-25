import { Body, Controller, Post, Route, Tags } from "tsoa";

type RegisterBody = { email: string; password: string; name: string };
type LoginBody = { email: string; password: string };

@Route("auth")
@Tags("Auth")
export class AuthTsoaController extends Controller {
  @Post("register")
  public async register(@Body() body: RegisterBody): Promise<{ message: string }> {
    return { message: "ok" };
  }

  @Post("login")
  public async login(@Body() body: LoginBody): Promise<{ message: string }> {
    return { message: "ok" };
  }
}
