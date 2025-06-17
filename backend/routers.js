import express from "express";
import jwt from "jsonwebtoken";
import { authent } from "./controllers/authent.js";
import bcrypt from "bcrypt";
import middle from "./middle.js";
import { messages } from "./controllers/message.js";
import { io } from "./index.js";
const router = express.Router();
import cloudinary from "./index.js";
import multer from "multer";
import fs from 'fs';
const secretKey = "Tarnvir"; //just for learning purpose i made secret key here

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!password || !email) {
            return res.status(400).send("Fill the full form!");
        }

        const use = await authent.findOne({ email });
        if (use) {
            res.status(409).send("please log in");
        }
        const passkey = await bcrypt.hash(password, 5);

        await authent.create({ email, password: passkey });

        res.status(200).send("Successfully registered");

    } catch (error) {
        console.log(error)
        res.status(500).send("An error occurred while processing your request.");
    }
});

router.post('/log', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Fill the full form!");
        }

        const user = await authent.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(409).send("Password does not match!");
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, secretKey);
        res.status(200).send({ token, userId: user._id });

    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

router.post('/message', middle, async (req, res) => {
    try {
        const { message, to } = req.body;
        const { userr } = req;
        if (!message) {
            return res.status(400).send("send something");
        }
        const newMessage=await messages.create({ to, from: userr.userId, message });
        console.log(newMessage);
        io.emit("newMessage",newMessage);
        res.status(200).send({ message: "success", userid: userr.userId });

    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

//working

const upload = multer({ dest: '../uploads/' }); // Temporary folder

router.post('/photoSend', middle, upload.single('file'), async (req, res) => {
  try {
    const { to } = req.body;
    const file = req?.file;
    const { userr } = req;

    if (!file) {
      return res.status(400).send("Photo is not given!");
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary error", cloudinaryResponse.error || "Unknown Cloudinary Error");
      return res.status(500).send("Cloudinary upload failed.");
    }

    // Create new message with photo
    const newMessage = await messages.create({
      to,
      from: userr.userId,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    console.log(newMessage);

    // Optional: io.emit("newMessage", newMessage);

    // Remove file after upload
    fs.unlinkSync(file.path);

    res.status(200).send({ message: "success", userid: userr.userId, photoUrl: cloudinaryResponse.secure_url });

  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

//deleteMe
// router.post('/photoSend', middle, async (req, res) => {
//     try {
//         const { to } = req.body;
//         const {file} = req.file;
//         const { userr } = req;
//         if (!file) {
//             return res.status(400).send("photo is not given!");
//         }

//         const cloudinaryResponse = await cloudinary.uploader.upload(file.tempFilePath);
//         if(!cloudinaryResponse || cloudinaryResponse.error){
//             console.error("Cloudinary error",cloudinaryResponse.error || "Unknown Cloudinary Error");
//         }
//         const newMessage=await messages.create({ to, from: userr.userId,  photo: {
//             public_id: cloudinaryResponse.public_id,
//             url: cloudinaryResponse.secure_url,} 
//         });
//         console.log(newMessage);
//         // io.emit("newMessage",newMessage);
//         res.status(200).send({ message: "success", userid: userr.userId });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("An error occurred while processing your request.");
//     }
// });

router.get('/allemails', async (req, res) => {
    try {
        const name = await authent.find();
        res.status(200).send({ name });
    }
    catch (error) {
        res.status(500).send("An error occurred while processing your request.");
    }
});

router.get('/allmessages', middle, async (req, res) => {
    try {
        const { userr } = req;
        const { to } = req.query;

        const messagesList = await messages.find({
            $or: [
                { from: userr.userId, to: to },
                { from: to, to: userr.userId }
            ]
        });


        res.status(200).send({ messagesList });
    }
    catch (error) {
        res.status(500).send("An error occurred while processing your request.");
    }
});

export default router;