import  connection  from "../database/db.js";
import { nanoid } from 'nanoid'

export async function urlValidation(req, res, next) {
  const { url } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }
  
  const session = await connection.query(
    "SELECT * FROM sessions WHERE token=$1;",
    [token]
  );

  if (session.rows.length === 0) {
    return res.sendStatus(401);
  }

  const shortenedUrls = {
    userId: session.rows[0].userId,
    shortUrl: nanoid(8),
    url,
    visitCount: 0
  }

  res.locals.shortenedUrls = shortenedUrls;

  next();
}

export async function idValidation(req, res, next) {
  const { id } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  const session = await connection.query(
    'SELECT "userId" FROM sessions WHERE token=$1;',
    [token]
  );

  const shortenedUrl = await connection.query (
    'SELECT "userId" FROM "shortenedUrls" WHERE "id"=$1',
    [id]
  );
  if (session.rows.length === 0 || session.rows[0]?.userId !== shortenedUrl.rows[0]?.userId ) {
    return res.sendStatus(401);
  }

  if (shortenedUrl.rows.length === 0){
    return res.sendStatus(404);
  }

  res.locals.id = id;

  next();
}