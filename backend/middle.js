import jwt from "jsonwebtoken";
//just for learning purpose i made secret key here
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