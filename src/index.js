import dotenv from "dotenv";
dotenv.config({ path: './.env' })
// require('dotenv').config({path: './env'})

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants"

import {app} from './app.js'

import express from "express";


import connectDB from "./db/index.js"
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MOngo DB connection failed !!! ", err)
    })










/*
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        app.on("error", () => {
            console.log("ERR: ", error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.error("ERROR : ", error)
        throw error
    }
})()
*/
