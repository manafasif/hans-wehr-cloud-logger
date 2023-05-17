import express from "express";
import { logger } from "../utils/logger";
import { lookupRoot } from "../utils/db";

const RESPONSE_VERS = "1.0";

// This is the router for the noun route
export const router = express.Router();

async function retrieveNoun(word : string) {
  return
}

// app.get("/noun", (req, res) => {
//   console.log("NOUN: ", JSON.stringify(req.query));
//   if (!req.query.noun) {
//     return res.send(`No noun provided`);
//   }
//   retrieveNoun(req.query.noun).then((data) => {
//     if (typeof data === "string") {
//       return res.send(data);
//     }
//     res.json({
//       message: "success",
//       data: data,
//     });
//   });
// });

// app.put("/noun", (req, res) => {
//   const noun = req.body;
//   if (!noun || !noun.word) {
//     console.log("No noun provided");
//     return res.status(400).send(`No noun provided`);
//   }
//   if (!noun.definition) {
//     console.log("No definition provided");
//     return res.status(400).send(`No definition provided`);
//   }
//   if (!noun.root) {
//     console.log("No root provided");
//     return res.status(400).send(`No root provided`);
//   }
//   if (!noun.id) {
//     console.log("No id provided");
//     return res.status(400).send(`No id provided`);
//   }

//   console.log("PUT NOUN: ", JSON.stringify(req.body));

//   var params = {
//     TableName: "hans_wehr_DB",
//     Item: {
//       WordID: noun.id,
//       Word: noun.word,
//       IsRoot: 0,
//       Root: noun.root,
//       Definition: {
//         Definition: noun.definition,
//       },
//     },
//   };

//   const command = new PutCommand(params);
//   ddbDocClient.send(command).then((data) => {
//     console.log("Success", data);
//     res.send("Success");
//   });
// });

export const nounHandler = router;
