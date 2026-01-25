"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Assignment 2 Backend API',
            version: '1.0.0',
            description: 'A RESTful API for managing posts and comments with user authentication',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT Bearer token',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['email', 'password', 'name'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            description: 'User name',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'User password (hashed)',
                            example: 'password123',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                        },
                    },
                },
                Post: {
                    type: 'object',
                    required: ['title', 'content'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Post ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439012',
                        },
                        title: {
                            type: 'string',
                            description: 'Post title',
                            example: 'My First Post',
                        },
                        content: {
                            type: 'string',
                            description: 'Post content',
                            example: 'This is the content of my post',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID of the user who created the post',
                            example: '507f1f77bcf86cd799439011',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Comment: {
                    type: 'object',
                    required: ['content', 'postId'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Comment ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439013',
                        },
                        content: {
                            type: 'string',
                            description: 'Comment content',
                            example: 'Great post!',
                        },
                        postId: {
                            type: 'string',
                            description: 'ID of the post being commented on',
                            example: '507f1f77bcf86cd799439012',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID of the user who wrote the comment',
                            example: '507f1f77bcf86cd799439011',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'User password',
                            example: 'password123',
                        },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password', 'name'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            description: 'User password (minimum 6 characters)',
                            example: 'password123',
                        },
                        name: {
                            type: 'string',
                            description: 'User name',
                            example: 'John Doe',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        accessToken: {
                            type: 'string',
                            description: 'JWT access token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'JWT refresh token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                RefreshTokenRequest: {
                    type: 'object',
                    required: ['refreshToken'],
                    properties: {
                        refreshToken: {
                            type: 'string',
                            description: 'JWT refresh token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'An error occurred',
                        },
                        status: {
                            type: 'number',
                            description: 'HTTP status code',
                            example: 400,
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints',
            },
            {
                name: 'Users',
                description: 'User management endpoints',
            },
            {
                name: 'Posts',
                description: 'Post management endpoints',
            },
            {
                name: 'Comments',
                description: 'Comment management endpoints',
            },
        ],
    },
    apis: [],
};
const manualPaths = {
    '/auth/register': {
        post: {
            tags: ['Authentication'],
            summary: 'Register a new user',
            description: 'Create a new user account with email, password, and name',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/RegisterRequest' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'User registered successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                400: { description: 'Invalid input data' },
                409: { description: 'User already exists' },
                500: { description: 'Server error' }
            }
        }
    },
    '/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'Login user',
            description: 'Authenticate user and return JWT tokens',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoginRequest' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    accessToken: { type: 'string' },
                                    refreshToken: { type: 'string' },
                                    user: { $ref: '#/components/schemas/User' }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Invalid credentials' },
                500: { description: 'Server error' }
            }
        }
    },
    '/auth/refresh': {
        post: {
            tags: ['Authentication'],
            summary: 'Refresh access token',
            description: 'Generate a new access token using refresh token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/RefreshTokenRequest' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Token refreshed successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthResponse' }
                        }
                    }
                },
                401: { description: 'Invalid refresh token' },
                500: { description: 'Server error' }
            }
        }
    },
    '/auth/logout': {
        post: {
            tags: ['Authentication'],
            summary: 'Logout user',
            description: 'Logout the current user',
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: 'Logout successful' },
                401: { description: 'Unauthorized' },
                500: { description: 'Server error' }
            }
        }
    },
    '/users': {
        get: {
            tags: ['Users'],
            summary: 'Get all users',
            description: 'Retrieve all users (admin only)',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'List of users',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/User' }
                            }
                        }
                    }
                },
                401: { description: 'Unauthorized' },
                500: { description: 'Server error' }
            }
        },
        post: {
            tags: ['Users'],
            summary: 'Create a new user',
            description: 'Create a new user (admin only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name', 'email', 'password'],
                            properties: {
                                name: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                password: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'User created successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                500: { description: 'Server error' }
            }
        }
    },
    '/users/{id}': {
        get: {
            tags: ['Users'],
            summary: 'Get user by ID',
            description: 'Retrieve a specific user by ID',
            security: [{ bearerAuth: [] }],
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'User ID'
                }],
            responses: {
                200: {
                    description: 'User details',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                401: { description: 'Unauthorized' },
                404: { description: 'User not found' },
                500: { description: 'Server error' }
            }
        },
        put: {
            tags: ['Users'],
            summary: 'Update a user',
            description: 'Update user information',
            security: [{ bearerAuth: [] }],
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'User ID'
                }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                email: { type: 'string', format: 'email' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'User updated successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                404: { description: 'User not found' },
                500: { description: 'Server error' }
            }
        },
        delete: {
            tags: ['Users'],
            summary: 'Delete a user',
            description: 'Delete a user account',
            security: [{ bearerAuth: [] }],
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'User ID'
                }],
            responses: {
                200: { description: 'User deleted successfully' },
                401: { description: 'Unauthorized' },
                404: { description: 'User not found' },
                500: { description: 'Server error' }
            }
        }
    },
    '/post': {
        get: {
            tags: ['Posts'],
            summary: 'Get all posts',
            description: 'Retrieve all posts',
            responses: {
                200: {
                    description: 'List of posts',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Post' }
                            }
                        }
                    }
                },
                500: { description: 'Server error' }
            }
        },
        post: {
            tags: ['Posts'],
            summary: 'Create a new post',
            description: 'Create a new post (authenticated users only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['title', 'content'],
                            properties: {
                                title: { type: 'string' },
                                content: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Post created successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Post' }
                        }
                    }
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                500: { description: 'Server error' }
            }
        }
    },
    '/post/{id}': {
        get: {
            tags: ['Posts'],
            summary: 'Get post by ID',
            description: 'Retrieve a specific post by ID',
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Post ID'
                }],
            responses: {
                200: {
                    description: 'Post details',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Post' }
                        }
                    }
                },
                404: { description: 'Post not found' },
                500: { description: 'Server error' }
            }
        },
        put: {
            tags: ['Posts'],
            summary: 'Update a post',
            description: 'Update post content (author only)',
            security: [{ bearerAuth: [] }],
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Post ID'
                }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                content: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Post updated successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Post' }
                        }
                    }
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Not the post author' },
                404: { description: 'Post not found' },
                500: { description: 'Server error' }
            }
        },
        delete: {
            tags: ['Posts'],
            summary: 'Delete a post',
            description: 'Delete a post (author only)',
            security: [{ bearerAuth: [] }],
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Post ID'
                }],
            responses: {
                200: { description: 'Post deleted successfully' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Not the post author' },
                404: { description: 'Post not found' },
                500: { description: 'Server error' }
            }
        }
    },
    '/post/{postId}/comments': {
        get: {
            tags: ['Posts'],
            summary: 'Get all comments for a post',
            description: 'Retrieve all comments for a specific post',
            parameters: [{
                    name: 'postId',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Post ID'
                }],
            responses: {
                200: {
                    description: 'List of comments',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Comment' }
                            }
                        }
                    }
                },
                404: { description: 'Post not found' },
                500: { description: 'Server error' }
            }
        }
    },
    '/comments': {
        get: {
            tags: ['Comments'],
            summary: 'Get comments by post ID',
            description: 'Retrieve all comments for a post (query parameter)',
            parameters: [{
                    name: 'postId',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Post ID to filter comments'
                }],
            responses: {
                200: {
                    description: 'List of comments',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Comment' }
                            }
                        }
                    }
                },
                400: { description: 'Bad request - missing postId' },
                500: { description: 'Server error' }
            }
        },
        post: {
            tags: ['Comments'],
            summary: 'Create a new comment',
            description: 'Create a new comment on a post',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['content', 'postId'],
                            properties: {
                                content: { type: 'string' },
                                postId: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Comment created successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Comment' }
                        }
                    }
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                500: { description: 'Server error' }
            }
        }
    },
    '/comments/{id}': {
        get: {
            tags: ['Comments'],
            summary: 'Get comment by ID',
            description: 'Retrieve a specific comment by ID',
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Comment ID'
                }],
            responses: {
                200: {
                    description: 'Comment details',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Comment' }
                        }
                    }
                },
                404: { description: 'Comment not found' },
                500: { description: 'Server error' }
            }
        },
        put: {
            tags: ['Comments'],
            summary: 'Update a comment',
            description: 'Update comment content (author only)',
            security: [{ bearerAuth: [] }],
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Comment ID'
                }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                content: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Comment updated successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Comment' }
                        }
                    }
                },
                400: { description: 'Bad request' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Not the comment author' },
                404: { description: 'Comment not found' },
                500: { description: 'Server error' }
            }
        },
        delete: {
            tags: ['Comments'],
            summary: 'Delete a comment',
            description: 'Delete a comment (author only)',
            security: [{ bearerAuth: [] }],
            parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Comment ID'
                }],
            responses: {
                200: { description: 'Comment deleted successfully' },
                401: { description: 'Unauthorized' },
                403: { description: 'Forbidden - Not the comment author' },
                404: { description: 'Comment not found' },
                500: { description: 'Server error' }
            }
        }
    }
};
const completeOptions = {
    definition: {
        openapi: '3.0.0',
        info: options.definition.info,
        servers: options.definition.servers,
        components: options.definition.components,
        tags: options.definition.tags,
        paths: manualPaths
    },
    apis: []
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(completeOptions);
exports.swaggerSpec = swaggerSpec;
//# sourceMappingURL=swagger.js.map