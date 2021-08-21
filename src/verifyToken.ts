import jwt from 'jsonwebtoken';
import cookie from "cookie";


export default function (req:any, res:any, next:any) {
    // console.log("hello")
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies.token;  

    if(!token){
        return 
        // res.status(401).send("Access Denied");
    }

    try{
        // console.log("try")
        const verified = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
        req.user = verified;
        // console.log(verified)
        // res.json(verified);
        res.locals.user = verified
        next();
    } catch(error){
        res.json({ result: false });
    }
};