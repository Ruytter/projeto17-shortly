import  connection  from "../database/db.js";

export async function getMe(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }
  
   try {
    const session = await connection.query(
        "SELECT * FROM sessions WHERE token=$1;",
        [token]
      );

      const user = await connection.query(
        'SELECT u.id, u.name, SUM(s."visitCount") AS "visitCount" FROM users u JOIN "shortenedUrls" s ON u.id = s."userId" WHERE u.id=$1 GROUP BY u.id',[session.rows[0].userId]
      );
    const shortenedUrls = await connection.query(
        'SELECT id, "shortUrl", url, "visitCount" FROM "shortenedUrls" WHERE "userId"=$1',[session.rows[0].userId]
      );
      
      const me = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        visitCount: user.rows[0].visitCount,
        shortenedUrls: shortenedUrls.rows
      }
    res.status(200).send(me);
  } catch (err) {
    res.status(500).send(err.message);
  }
}


export async function getRanking(req, res) {
  console.log(req)
  try {
    const { rows }= await connection.query(
        'SELECT u.id, u.name, COUNT(s.url) AS "linksCount", SUM(s."visitCount") AS "visitCount" FROM users u JOIN "shortenedUrls" s ON u.id = s."userId" GROUP BY u.id ORDER BY "visitCount" DESC LIMIT 10'
      );
    res.status(200).send(rows)
  } catch (err){
    res.status(404).send(err.message)
  }
}
