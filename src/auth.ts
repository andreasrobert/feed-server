import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db";

export const register = async (req: any, res: any) => {
  try {

    //find if user already exist
    const findUser = await pool.query(
      "select username from users where username = $1",
      [req.body.username]
    );
    const user = findUser.rows.length;
    if (user) {
      res.json("username already used");
      return;
    }

    //if not hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // add user to database
    const newUser = await pool.query(
      "insert into users (username,password) values ($1,$2) returning *",
      [req.body.username, hashedPassword]
    );
    res.json("user created");
  } catch (err) {
    console.log(err.meesage);
  }
};

export const login = async (req: any, res: any) => {
  try {
    console.log(req.body);

    // find username
    const findUser = await pool.query(
      "select * from users where username = $1",
      [req.body.username]
    );
    const user = findUser.rows.length;

    if (!user) {
      res.json("username doesn't exist");
      return;
    }
    console.log(findUser.rows[0].id);

    // compare inputed password and the hashed password from the database
    const validPassword = await bcrypt.compare(
      req.body.password,
      findUser.rows[0].password
    );
    if (!validPassword) {
      res.json("Incorrect Password");
      return;
    }

    // if valid give jwt token and redirect
    try {
      const token = jwt.sign(
        { id: findUser.rows[0].id },
        `${process.env.TOKEN_SECRET}`,
        { expiresIn: "15000s" }
      );
      res.json({ token: token });
    } catch (error) {
      res.status(500).send(error);
    }

    return;
  } catch (err) {
    console.log(err.meesage);
  }
};
