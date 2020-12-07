import express from 'express';
import { sequelize } from './sequelize';
import bodyParser from 'body-parser';
import { FeedRouter } from './controller/feeds/routes/feed.router';
import { FeedItem } from './controller/feeds/models/FeedItem';

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
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();