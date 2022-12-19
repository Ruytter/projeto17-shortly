import  connection  from "../database/db.js";
import { userSchema } from "../models/users.model.js";
import bcrypt from "bcrypt";

export function userSchemaValidation(req, res, next) {
  const user = req.body;

  const { error } = userSchema.validate(user, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  res.locals.user = user;

  next();
}

export async function signInBodyValidation(req, res, next) {
  const { email, password } = req.body;
  try {
    const { rows } = await connection.query(
      "SELECT * FROM users WHERE email=$1;",
      [email]
    );

    if (rows.length === 0) {
      res.sendStatus(401);
    }

    const passwordOk = bcrypt.compareSync(password, rows[0].password);
    if (!passwordOk) {
      return res.sendStatus(401);
    }
    res.locals.id = rows[0].id ;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}

export async function authRoutesValidation(req, res, next) {
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

    if (session.rows.length !== 0) {
      return res.sendStatus(401);
    }

    const user = await connection.query(
      "SELECT * FROM users WHERE id=$1;",
      [session.rows[0]._id]
    );

    res.locals.user = user;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
