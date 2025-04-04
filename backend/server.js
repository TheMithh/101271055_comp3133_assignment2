const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
require('dotenv').config();

async function startServer() {
  connectDB();
  
  // Create Express app
  const app = express();
  
  // Configure CORS for all routes
  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'https://101271055-comp3133-assignment2-968jw4z1-gabriel-pais-projects.vercel.app',
        'https://101271055-comp3133-assignment2.vercel.app',
        'http://localhost:4200'
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        console.log('Origin not allowed by CORS:', origin);
        callback(null, true); // Allow all origins for debugging
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight']
  }));

  // Handle OPTIONS requests explicitly
  app.options('*', cors());
  
  // Add debugging middleware
  app.use((req, res, next) => {
    console.log(`Request from origin: ${req.headers.origin}`);
    console.log(`Request method: ${req.method}`);
    next();
  });
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ auth: req.headers.authorization }),
    introspection: true,
    playground: true
  });

  // Start the Apollo Server
  await server.start();
  
  // Apply Apollo middleware to Express
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We're handling CORS with express middleware
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
    console.log(`CORS enabled for multiple origins including Vercel deployments`);
  });
}

// Start the server and catch any errors
startServer().catch(err => {
  console.error('Error starting server:', err);
});