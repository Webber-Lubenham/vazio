import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Vazio API',
    description: 'API para sistema de monitoramento de localização',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        role: { type: 'string', enum: ['RESPONSIBLE', 'DEPENDENT'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    Location: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    },
    Error: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'string' }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/*.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc); 