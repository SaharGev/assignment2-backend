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
  Security,
  Query
} from "tsoa";

interface CommentBody {
  content: string;
  postId: string;
}

@Route("comments")
@Tags("Comments")
export class CommentsTsoaController extends Controller {

  // GET /comments?postId=...
  @Get("/")
  public async getCommentsByPostId(@Query() postId: string) {
    return []; 
  }

  // GET /comments/{id}
  @Get("{id}")
  public async getCommentById(@Path() id: string) {
    return {}; 
  }

  // POST /comments 
  @Security("jwt")
  @Post("/")
  public async createComment(@Body() body: CommentBody) {
    return { message: "Comment created" };
  }

  // PUT /comments/{id} 
  @Security("jwt")
  @Put("{id}")
  public async updateComment(@Path() id: string, @Body() body: CommentBody) {
    return { message: "Comment updated" };
  }

  // DELETE /comments/{id} 
  @Security("jwt")
  @Delete("{id}")
  public async deleteComment(@Path() id: string) {
    return { message: "Comment deleted" };
  }
}
