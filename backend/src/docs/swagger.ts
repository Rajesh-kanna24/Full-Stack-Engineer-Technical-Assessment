export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'AI Job Portal API',
    version: '1.0.0',
    description: 'API Documentation for AI Job Portal',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local development server',
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
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Check API Health',
        responses: {
          '200': {
            description: 'Successful response',
          },
        },
      },
    },
    // Add additional paths here for full docs
  },
};
