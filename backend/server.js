const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

async function startServer() {
  const app = express();
  
  // Apply CORS middleware
  app.use(cors({
    origin: ['https://101271055-comp3133-assignment2-968jw4z1-gabriel-pais-projects.vercel.app', 'https://101271055-comp3133-assignment2.vercel.app', 'http://localhost:4200'],
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight']
  }));
  
  // Add pre-flight OPTIONS handling
  app.options('*', cors());
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ auth: req.headers.authorization }),
    introspection: true,
    playground: true
  });

  await server.start();
  server.applyMiddleware({ app, cors: false }); // cors is already applied above
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
    console.log(`CORS enabled for: ${JSON.stringify(['https://101271055-comp3133-assignment2-968jw4z1-gabriel-pais-projects.vercel.app', 'https://101271055-comp3133-assignment2.vercel.app', 'http://localhost:4200'])}`);
  });
}

startServer();