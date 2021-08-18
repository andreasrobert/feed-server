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
      console.log("exist");
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
    res.status(200).send("user created");
  } catch (err) {
    console.log(err.meesage);
  }
};

export const login = async (req: any, res: any) => {
  try {
    // find username
    const findUser = await pool.query(
      "select * from users where username = $1",
      [req.body.username]
    );
    const user = findUser.rows.length;

    if (!user) {
    //   console.log("dont exist");
      res.json("username doesn't exist");
      return;
    }


    // compare inputed password and the hashed password from the database
    const validPassword = await bcrypt.compare(req.body.password, findUser.rows[0].password);
    if(!validPassword){
        return res.status(400).send("Incorrect Password");
    }

    // console.log("valid?")
    // if valid give jwt token and redirect
    try{
        const token = jwt.sign({id: req.body.username}, `${process.env.TOKEN_SECRET}` ,{ expiresIn: '500s' });
        res.json({ token: token });
    } catch(error){
        res.status(500).send(error);
    }

    return;



  } catch (err) {
    console.log(err.meesage);
  }
};
