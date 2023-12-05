import express, { Request, Response } from "express";
import { logger } from "../utils/logger";
import { insertLogIntoDB } from "../utils/db";

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


export const logHandler = router;
