import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypdate API',
      version: '1.0.0',
      description: 'API for Crypdate cryptocurrency tracking application',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            first_name: {
              type: 'string',
              description: 'User first name',
            },
            username: {
              type: 'string',
              description: 'Telegram username',
            },
          },
        },
        VerifyInitRequest: {
          type: 'object',
          required: ['initData'],
          properties: {
            initData: {
              type: 'string',
              description: 'Telegram initData string',
            },
          },
        },
        VerifyInitResponse: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            sessionToken: {
              type: 'string',
              description: 'JWT session token',
            },
            error: {
              type: 'string',
              description: 'Error message if ok is false',
            },
          },
        },
        WatchlistResponse: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
            },
            watchlist: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of token symbols',
            },
            error: {
              type: 'string',
              description: 'Error message if ok is false',
            },
          },
        },
        FollowRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: {
              type: 'string',
              description: 'Token symbol to follow',
            },
          },
        },
        FollowResponse: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
            },
            token: {
              type: 'string',
              description: 'Token symbol that was followed',
            },
            error: {
              type: 'string',
              description: 'Error message if ok is false',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./server.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
