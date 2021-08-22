import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function (req: any, res: any, next: any) {
  const cookies = cookie.parse(req.headers.cookies);
  const token = cookies.token;

  if (!token) {
    return;
  }

  try {
    const verified = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    req.user = verified;
    res.locals.user = verified;
    next();
  } catch (error) {
    res.json({ result: false });
  }
}
