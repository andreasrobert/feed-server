import express from "express";
import { login, register } from "./auth";
import { pool } from "./db";
import verifyToken from "./verifyToken";

const router = express.Router();

router.get("/", (_, res) => {
  res.send("hello there");
});

//create user
router.post("/register", register);

//login
router.post("/login", login);

router.post("/test", verifyToken);

//create post
router.post("/post", verifyToken, async (req: any, res) => {
  try {
    const newPost = await pool.query(
      "insert into posts (title,body,creator_id,created_at) values ($1,$2,$3,current_timestamp) returning *",
      [req.body.title, req.body.body, req.user.id]
    );
    res.json(newPost.rows[0]);
    // res.send("got it.");
  } catch (err) {
    console.log(err.meesage);
  }
});

//get posts
router.post("/posts", async (req: any, res) => {
  try {
    let allPosts = await pool.query(
      "select u.username, p.id, p.title, p.body, p.created_at from posts p inner join users u on u.id = p.creator_id order by p.id desc"
    );
    if (req.body.sort === "Most Upvotes") {
      allPosts = await pool.query(
        "select u.username, p.id, p.title, p.body, p.created_at , count(po.post_id) from posts p inner join users u on u.id = p.creator_id full outer join points po on po.post_id = p.id group by u.username, p.id, p.title, p.body, p.created_at order by count(po.post_id) desc"
      );
    }

    if (req.body.sort === "Most Comments") {
      allPosts = await pool.query(
        "select u.username, p.id, p.title, p.body, p.created_at , count(c.post_id) from posts p inner join users u on u.id = p.creator_id full outer join comments c on c.post_id = p.id group by u.username, p.id, p.title, p.body, p.created_at order by count(c.post_id) desc"
      );
    }

    if (req.body.sort === "Least Comments") {
      allPosts = await pool.query(
        "select u.username, p.id, p.title, p.body, p.created_at , count(c.post_id) from posts p inner join users u on u.id = p.creator_id full outer join comments c on c.post_id = p.id group by u.username, p.id, p.title, p.body, p.created_at order by count(c.post_id), p.id asc"
      );
    }
    res.json(allPosts.rows);
  } catch (err) {
    console.log(err.meesage);
  }
});

//get single post ? why not use post for everything?
router.post("/postpage", async (req: any, res) => {
  try {
    // console.log(req.user.id)
    const post = await pool.query(
      "select u.username, p.id, p.title, p.body, p.created_at from posts p inner join users u on u.id = p.creator_id where p.id=$1",
      [req.body.post_id]
    );
    res.json(post.rows[0]);
  } catch (err) {
    console.log(err.meesage);
  }
});

//create comment
router.post("/newcomment", verifyToken, async (req: any, res) => {
  try {
    console.log("id= "+", post_id= "+req.body.post_id+",  comment= "+req.body.comment)
    const newPost = await pool.query(
      "insert into comments (comment,post_id,user_id) values ($1,$2,$3) returning *",
      [req.body.comment, req.body.post_id, req.user.id]
    );
    res.json(newPost.rows[0]);
    // res.send("got it.");
  } catch (err) {
    console.log(err.meesage);
  }
});

//get comments
router.post("/comments", async (req, res) => {
  try {
    const allComments = await pool.query(
      "select u.username, c.id, c.comment, c.created_at  from comments c inner join users u on u.id = c.user_id where post_id=$1 order by id asc",
      [req.body.post_id]
    );
    res.json(allComments.rows);
  } catch (err) {
    console.log(err.meesage);
  }
});

//count comments
router.get("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allPoints = await pool.query(
      "select count(*) from comments where post_id =$1",
      [id]
    );
    res.json(allPoints.rows);
  } catch (err) {
    console.log(err.meesage);
  }
});

//add points
router.post("/points", verifyToken, async (req: any, res) => {
  try {
    console.log(req.body);
    const addPoint = await pool.query(
      "insert into points (user_id,post_id) values ($1,$2) returning *",
      [req.user.id, req.body.post_id]
    );
    res.json(addPoint.rows[0]);
    // res.send("got it.");
  } catch (err) {
    console.log(err.meesage);
  }
});

//get points
router.get("/points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allPoints = await pool.query(
      "select count(*) from points where post_id =$1",
      [id]
    );
    res.json(allPoints.rows);
  } catch (err) {
    console.log(err.meesage);
  }
});

//delete points
router.post("/point", verifyToken, async (req: any, res) => {
  try {
    console.log(req.body);
    const addPoint = await pool.query(
      "delete from points where user_id =$1 and post_id = $2",
      [req.user.id, req.body.post_id]
    );
    res.json("Points was deleted");
  } catch (err) {
    console.log(err.meesage);
  }
});

//check points for user
router.post("/checkPoint", verifyToken, async (req: any, res) => {
  try {
    // console.log(req.body)
    const addPoint = await pool.query(
      "select exists(select 1 from points where user_id =$1 and post_id = $2)",
      [req.user.id, req.body.post_id]
    );
    res.json(addPoint.rows[0].exists);
  } catch (err) {
    console.log(err.meesage);
  }
});

export default router;
