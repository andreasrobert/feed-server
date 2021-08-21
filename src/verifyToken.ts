import jwt from 'jsonwebtoken';
import cookie from "cookie";


export default function (req:any, res:any, next:any) {
    console.log(req.headers)
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    
    if(typeof req?.headers?.cookie !== "string" ){
        throw new Error("token is not a string")
        return 
        // res.status(401).send("Access Denied");
    }
    


    const cookies = cookie.parse(req?.headers?.cookie);
    const token = cookies?.token;  

    if(!token){
        return
    }

    if(typeof token !== "string" ){
        throw new Error("token is not a string")
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