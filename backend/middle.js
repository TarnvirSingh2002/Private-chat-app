import jwt from "jsonwebtoken";
const secretKey="Tarnvir";
const middle=(req,res,next)=>{
    try {
        const tok=req.header("auth-token");
        const decorder= jwt.verify(tok,secretKey);
        req.userr=decorder;
        console.log(decorder);
        next();
    } catch (error) {
        console.log(error)
    }

}
export default middle 