import express, { Request, Response } from "express";
import { logger } from "../utils/logger";
import { getFeedbackByRoot, getRecentFeeedback, insertFeedback } from "../utils/db";

export interface Feedback {
  type: string;
  name: string | undefined;
  email: string | undefined;
  root: string;
  message: string | undefined;
}

export const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const body: Feedback = req.body
  if (!("root" in body)) {
    logger.info("Recieved bad feedback request");
    res.status(400).send("Sorry, there is no root field");
  } else if (!("message" in body)) {
    logger.info("Recieved bad feedback request");
    res.status(400).send("Sorry, there is no message field");
  } else if (!("type" in body)) {
    logger.info("Recieved bad feedback request");
    res.status(400).send("Sorry, there is no message field");
  }
  else {
    logger.info("Recieved feedback request", body["message"]);
    insertFeedback(body);
    res.send("Thank you for your feedback, it has been processed");
  }
})

// get's 10 most recent feedback requests
router.get("/recent", async (_req: Request, res: Response) => {
  let feedback = await getRecentFeeedback()
  res.send(feedback)
})

router.get("/root/:root", async (req: Request, res: Response) => {
  let feedback = await getFeedbackByRoot(req.params["root"])
  console.log("feedback");
  logger.info(feedback);
  res.send(feedback)
})

export const feedbackHandler = router;
