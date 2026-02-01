import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Tags,
  Path,
  Security,
  Query
} from "tsoa";

interface PostBody {
  title: string;
  content: string;
}

@Route("post")
@Tags("Post")
export class PostsTsoaController extends Controller {

  // GET /post
  @Get("/")
  public async getAllPosts() {
    return []; 
  }

  // GET /post/{id}
  @Get("{id}")
  public async getPostById(@Path() id: string) {
    return {}; 
  }

  // GET /post/{postId}/comments
  @Get("{postId}/comments")
  public async getCommentsByPostId(@Path() postId: string) {
    return []; 
  }

  // POST /post
  @Security("jwt")
  @Post("/")
  public async createNewPost(@Body() body: PostBody) {
    return { message: "Post created" };
  }

  // PUT /post/{id} 
  @Security("jwt")
  @Put("{id}")
  public async updatePost(@Path() id: string, @Body() body: PostBody) {
    return { message: "Post updated" };
  }

  // DELETE /post/{id} 
  @Security("jwt")
  @Delete("{id}")
  public async deletePost(@Path() id: string) {
    return { message: "Post deleted" };
  }
}
