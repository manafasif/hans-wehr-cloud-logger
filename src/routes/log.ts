import express, { Request, Response } from "express";
import { logger } from "../utils/logger";
import { insertLogIntoDB } from "../utils/db";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


const router = express.Router();

const VALID_ORIGINS = ["frontend", "api"]

const VALID_LEVELS = ["info", "debug", "error"]


export interface Log {
    origin: string;
    level: string;
    subject: string | undefined;
    message: string | undefined;
}

// returns true if given log is a valid log object
function isValidLog(log: any): log is Log {
    return (
        typeof log === 'object' &&
        typeof log['origin'] === 'string' &&
        VALID_ORIGINS.includes(log['origin']) &&
        typeof log['level'] === 'string' &&
        VALID_LEVELS.includes(log['level'])
    );
}


router.post("/", (req: Request, res: Response) => {
    const log: Log = req.body

    if (!isValidLog(log)) {
        res.status(400).send('Error: Invalid log format');
        return;
    }

    insertLogIntoDB(log);

    res.send("Successfully inserted log")
})



const UPTIME_CHECK_INTERVAL = process.env.UPTIME_CHECK_INTERVAL || 60000; // Default: 1 minute


const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

logger.info(EMAIL_USERNAME)
logger.info(EMAIL_PASSWORD)

if (!EMAIL_USERNAME || !EMAIL_PASSWORD) {
    logger.error("database: Error: No EMAIL Credentials");
    throw new Error("Error: No Email Credentials found. Check the .env file");
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USERNAME, // Replace with your Gmail email
        pass: EMAIL_PASSWORD, // Replace with your Gmail password or an app-specific password
    },
});

const EMAIL_LIST = ["manaf.asif12@gmail.com"];


async function checkUptime() {
    try {
        const response = await fetch('https://api.hanswehr.com/root?root=qtl');
        if (response.status === 200) {
            logger.info('Uptime check passed. Endpoint is up.');
        } else {
            logger.error('Uptime check failed. Endpoint is down.');
            // Trigger another workflow or take necessary actions on failure

            const subject = "API DOWN";

            const mailOptions = {
                from: EMAIL_USERNAME, // Replace with your Gmail email
                to: EMAIL_LIST.join(", "),
                subject,
                text: subject,
            };

            await transporter.sendMail(mailOptions);
        }
    } catch (error) {
        logger.error(`Error checking uptime: ${error.message}`);
        // Trigger another workflow or take necessary actions on failure
    }
}

export const logHandler = router;
