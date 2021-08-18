import express from 'express';

const router = express.Router();

router.get('/', (_,res) =>{
    res.send("hello there");
})


export default router;
