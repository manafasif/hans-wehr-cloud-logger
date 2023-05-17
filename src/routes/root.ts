import express from "express";
import { logger } from "../utils/logger";
import { lookupRoot } from "../utils/db";

const RESPONSE_VERS = "1.0";

// This is the router for the root route
const router = express.Router();

async function retrieveAllWordsWithRoot(root : string) {
  //   let collection = await db.collection("definitions");

  // perform the lookup
  //   const results = collection.find({ root: root }).hint("rootsIndex");
  const results = await lookupRoot(root);
  let response = [];

  for await (const doc of results) {
    console.log(doc);

    let form_definitions = [];

    // process the forms
    for (let index in doc.forms) {
      const word = doc.forms[index];
      console.log(JSON.stringify(word));

      const simplified_def = {
        id: word.id,
        text: word.text,
        form: word.form,
        transliteration: word.transliteration,
        translation: {
          id: word.translation.id,
          text: word.translation.text,
          short: word.translation.short,
        },
      };

      form_definitions.push(simplified_def);
    }

    var noun_definitions = [];
    // process the nouns
    for (let index in doc.nouns) {
      const word = doc.nouns[index];

      const simplified_def = {
        id: word.id,
        text: word.text,
        transliteration: word.transliteration,
        plural: word.plural,
        translation: {
          id: word.translation.id,
          text: word.translation.text,
          short: word.translation.short,
        },
      };
      noun_definitions.push(simplified_def);
    }

    const entry = {
      word: root,
      rootInfo: doc.forms[0].root,
      definitions: form_definitions,
      nouns: noun_definitions,
      responseVersion: RESPONSE_VERS,
    };

    response.push(entry);
  }

  return response;
}

// root lookup route
router.get("/", (req, res) => {
  logger.debug("ROOT: ", JSON.stringify(req.query));
  if (!req.query.root) {
    return res.send(`No root provided`);
  }

  retrieveAllWordsWithRoot(req.query.root as string).then((data) => {
    if (typeof data === "string") {
      return res.send(data);
    }
    logger.log("info", `Looked up root ${req.query.root}`);
    res.json({
      message: "success",
      data: data,
    });
  });
});

// app.put("/root", (req, res) => {
//   const noun = req.body;
//   if (!noun || !noun.word) {
//     console.log("No root provided");
//     return res.status(400).send(`No root provided`);
//   }
//   if (!noun.definitions || noun.definitions.length == 0) {
//     console.log("No definitions provided");
//     return res.status(400).send(`No definitions provided`);
//   }
//   if (!noun.id) {
//     console.log("No id provided");
//     return res.status(400).send(`No id provided`);
//   }

//   console.log("PUT ROOT: ", JSON.stringify(req.body));

//   forms = {};
//   order = [];
//   for (const [key, value] of Object.entries(noun.definitions)) {
//     order.push(key);
//     forms[key] = value;
//   }

//   var params = {
//     TableName: "hans_wehr_DB",
//     Item: {
//       WordID: noun.id,
//       Word: noun.word,
//       IsRoot: 1,
//       Root: noun.word,
//       Definition: {
//         Order: order,
//         Forms: forms,
//       },
//     },
//   };

//   const command = new PutCommand(params);
//   ddbDocClient.send(command).then((data) => {
//     logger.log("info", `Updated entry for root ${noun.word}`);
//     console.log("Success", data);
//     res.send("Success");
//   });
// });

export const rootHandler = router;
