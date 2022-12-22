import connection from "../database/db.js";

export async function urlShorter(req, res) {
  const { userId, shortUrl, url, visitCount } = res.locals.shortenedUrls;

  try {
    await connection.query(
      'INSERT INTO "shortenedUrls" ("userId", "shortUrl", url, "visitCount") VALUES ($1, $2, $3, $4)',
      [userId, shortUrl, url, visitCount]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function getUrlById(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await connection.query(
      'SELECT id, "shortUrl", url FROM "shortenedUrls" WHERE id=$1',
      [id]
    );

    if (rows.length === 0) {
      return res.sendStatus(404);
    }
    res.status(200).send(rows[0]);
  } catch (err) {
    res.status(404).send(err.message);
  }
}

export async function openUrl(req, res) {
  const { shortUrl } = req.params;
  try {
    const { rows } = await connection.query(
      'SELECT url, "visitCount" FROM "shortenedUrls" WHERE "shortUrl"=$1',
      [shortUrl]
    );

    await connection.query(
      'UPDate "shortenedUrls" SET "visitCount"=$1 WHERE "shortUrl"=$2',
      [rows[0]?.visitCount + 1, shortUrl]
    );

    res.redirect(rows[0].url);
  } catch (err) {
    res.status(404).send(err.message);
  }
}

export async function removeUrlById(req, res) {
  const id = res.locals.id;

  try {
    await connection.query('DELETE FROM "shortenedUrls" WHERE "id"=$1', [id]);

    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
}
