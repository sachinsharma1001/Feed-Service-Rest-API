import { Router, Request, Response, NextFunction } from 'express';
import { FeedItem } from '../models/FeedItem';
import * as jwt from 'jsonwebtoken';
import * as AWS from '../../../aws';
import { config } from '../../../config/config';

const router: Router = Router();

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }

    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2){
        return res.status(401).send({ message: 'Malformed token.' });
    }
    
    const token = token_bearer[1];
    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
}

// Get all feed items
router.get('/feed', requireAuth, async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
        if(item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
});

//Add an endpoint to GET a specific resource by Primary Key
router.get('/feed/:id', requireAuth, async (req: Request, res: Response) => {
    let { id } = req.params; 
    if(!id) {
        res.status(400).send('Id is required');
    }
    const feeds = await FeedItem.findByPk(id);
    res.status(200).send(feeds);
})

// update a specific resource
router.patch('/feed/:id', requireAuth, async (req: Request, res: Response) => {   
    res.send(500).send("not implemented")
});


// Get a signed url to put a new item in the bucket
router.get('/feed/signed-url/:fileName', requireAuth, async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/feed', requireAuth, async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }
    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
        caption: caption,
        url: fileName
    });

    const saved_item = await item.save();
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;