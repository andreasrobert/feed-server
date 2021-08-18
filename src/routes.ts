import express from 'express';
import { login, register } from './auth';
import { pool } from './db';

const router = express.Router();

router.get('/', (_,res) =>{
    res.send("hello there");
})

//create user
router.post("/register", register)

//login
router.post("/login", login)


// router.post("/register", async (req, res)=>{
//     try{
//         console.log(req.body)
//         const newUser = await pool.query("insert into users (username,password) values ($1,$2) returning *", [req.body.username, req.body.password]);
//         res.json(newUser.rows[0])
//         // res.send("got it.");
//     }catch(err){
//         console.log(err.meesage)
//     }
// })


//create post
router.post("/post", async (req, res)=>{
    try{
        console.log(req.body)
        const newPost = await pool.query("insert into posts (title,body,creator_id) values ($1,$2,$3) returning *", [req.body.title, req.body.body, req.body.creator_id]);
        res.json(newPost.rows[0])
        // res.send("got it.");
    }catch(err){
        console.log(err.meesage)
    }
})


//get posts
router.get("/post", async (_req, res)=>{
    try{
        const allPosts = await pool.query("select * from posts");
        res.json(allPosts.rows);
    }catch(err){
        console.log(err.meesage)
    }
})


//create comment
router.post("/comment", async (req, res)=>{
    try{
        console.log(req.body)
        const newPost = await pool.query("insert into comments (comment,post_id,user_id) values ($1,$2,$3) returning *", [req.body.comment, req.body.post_id, req.body.user_id]);
        res.json(newPost.rows[0])
        // res.send("got it.");
    }catch(err){
        console.log(err.meesage)
    }
})


//get comments
router.get("/comment", async (req, res)=>{
    try{
        const allComments = await pool.query("select * from comments where post_id =$1",[req.body.post_id]);
        res.json(allComments.rows);
    }catch(err){
        console.log(err.meesage)
    }
})




//add points
router.post("/points", async (req, res)=>{
    try{
        console.log(req.body)
        const addPoint = await pool.query("insert into points (user_id,post_id) values ($1,$2) returning *", [req.body.user_id, req.body.post_id]);
        res.json(addPoint.rows[0])
        // res.send("got it.");
    }catch(err){
        console.log(err.meesage)
    }
})

//get points
router.get("/points/:id", async (req, res)=>{
    try{
        const { id } = req.params;
        const allPoints = await pool.query("select count(*) from points where post_id =$1",[id]);
        res.json(allPoints.rows);
    }catch(err){
        console.log(err.meesage)
    }
})

//delete points
router.post("/point", async (req, res)=>{
    try{
        console.log(req.body)
        const addPoint = await pool.query("delete from points where user_id =$1 and post_id = $2", [req.body.user_id, req.body.post_id]);
        res.json("Points was deleted");
    }catch(err){
        console.log(err.meesage)
    }
})


export default router;
