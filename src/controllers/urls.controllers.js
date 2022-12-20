import  connection  from "../database/db.js";

export async function urlShorter(req, res) {
  const { userId, shortUrl, url } = res.locals.shortenedUrls;

   try {

    await connection.query(
      'INSERT INTO "shortenedUrls" ("userId", "shortUrl", url) VALUES ($1, $2, $3)',
      [userId, shortUrl, url]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function getUrlById(req, res) {
  const { id } = req.params
  try {
    const { rows } = await connection.query (
      'SELECT id, "shortUrl", url FROM "shortenedUrls" WHERE id=$1',
      [id]
    );
      console.log(rows[0])
    res.status(200).send(rows[0])
  } catch (err){
    res.status(404).send(err.message)
  }
}

  export async function openUrl(req, res) {
    const { shortUrl } = req.params
  try {
    const { rows } = await connection.query (
      'SELECT url FROM "shortenedUrls" WHERE "shortUrl"=$1',
      [shortUrl]
    );
    res.redirect(rows[0].url)
  } catch (err){
    res.status(404).send(err.message)
  }
  }

export async function removeUrlById(req, res) {
  const id = res.locals.id;
  console.log(id)
  try {
    await connection.query (
      'DELETE FROM "shortenedUrls" WHERE "id"=$1',
      [id]
    );
    
      res.sendStatus(204)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}