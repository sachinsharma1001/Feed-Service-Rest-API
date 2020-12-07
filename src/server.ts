import express from 'express';
import { sequelize } from './sequelize';
import bodyParser from 'body-parser';
import { FeedRouter } from './controller/feeds/routes/feed.router';
import { FeedItem } from './controller/feeds/models/FeedItem';
const { v4: uuidv4 } = require('uuid');

(async () => {
  await sequelize.addModels([FeedItem]);
  await sequelize.sync();

  const app = express();
  const port = 8080; // default port to listen
  
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use('/api/v0/', FeedRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v0/" );
  } );
  
  app.get( "/health", async ( req, res ) => {
    let pid = uuidv4();
    console.log( new Date().toLocaleString() + `: ${pid} - Checking database connection...`);
    try {
      await sequelize.authenticate();
      console.log( new Date().toLocaleString() + `: ${pid} - Database Connection has been established successfully`);
      return res.status(200).send({ message: new Date().toLocaleString() + `: ${pid} - Connection has been established successfully.` });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return res.status(400).send({ message: `Unable to connect to the database: ${error}` });
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();