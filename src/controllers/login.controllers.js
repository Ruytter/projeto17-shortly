import  connection  from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function signUp(req, res) {
  const user = res.locals.user;
  const passwordHash = bcrypt.hashSync(user.password, 10);

  try {
    const { rows } = await connection.query(
      "SELECT * FROM users WHERE email=$1;",
      [user.email]
    );

    if (rows.length !== 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      'INSERT INTO users (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4)',
      [user.name, user.email, passwordHash, passwordHash]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function signIn(req, res) {
  const id = res.locals.id;
  try {
    const { rows } = await connection.query(
      'SELECT * FROM sessions WHERE "userId"=$1', [id] 
    )
    if (rows.length !== 0){
      return res.status(200).send(rows[0].token)
    }
    const token = uuidV4();
    await connection.query(
      'INSERT INTO sessions ("userId", token) VALUES ($1, $2)',
      [id , token]
    );
      res.status(200).send(token)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
