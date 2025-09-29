/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
// import { envVars } from "./app/config/env";
import dotenv from "dotenv";
import { prisma } from "./config/db";



let server: Server;

dotenv.config();
async function connectToDB() {
  try {
    await prisma.$connect()
    console.log("*** DB connection successfull!!")
  } catch (error) {
    console.log("*** DB connection failed!")
    console.log(error);
    process.exit(1);
  }
}
const startServer = async () => {
    try {
          await connectToDB()
        // await mongoose.connect(process.env.DB_URL!)

        // console.log("Successfully Connected to MongoDB!!");

        server = app.listen(process.env.PORT, () => {
            console.log(`Server is listening to port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await startServer()
     
})()

process.on("SIGTERM", () => {
    console.log("SIGTERM signal received... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

