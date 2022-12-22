import connection from "../database/db.js";
import { userSchema, signinSchema } from "../models/users.model.js";
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
  if (!req._body) {return res.sendStatus(422)}

  const { error } = signinSchema.validate({email, password}, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  if (email?.length === 0 || password?.length === 0) {
    return res.sendStatus(422);
  }
  try {
    const { rows } = await connection.query(
      "SELECT * FROM users WHERE email=$1;",
      [email]
    );

    if (rows.length === 0) {
      return res.sendStatus(401);
    }

    const passwordOk = bcrypt.compareSync(password, rows[0].password);
    if (!passwordOk) {
      return res.sendStatus(401);
    }
    res.locals.id = rows[0].id;
  } catch (err) {
    res.sendStatus(500);
  }

  next();
}
