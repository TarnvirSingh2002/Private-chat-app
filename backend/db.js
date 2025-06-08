import mongoose from'mongoose'// It is used to make connection with database

export const db = () => {
    mongoose.connect("mongodb://localhost:27017/deletechat")
        .then(() => console.log('DB connected successfully'))
        .catch(() => {
            console.log('DB connection failed');
        })
};
