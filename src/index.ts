import app from "./app";

import { Server } from "http";
import { PORT } from "./config";
import { logger } from "./utils/logger";

// import * as fs from "fs";

// const httpsOptions = {
//     key: fs.readFileSync("api_mypaddiapp_com.key"),
//     cert: fs.readFileSync("api_mypaddiapp_com.crt"),
//     ca: fs.readFileSync("api_mypaddiapp_com.ca-bundle"),
// };
const port = PORT || 5000;

const httpServer = new Server(app);

// app.use((req, res, next) => {
//     console.log(req.headers, "what is it?", req.protocol, req.url);
//     if (req.protocol === "http") {
//         res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
// });

httpServer.listen(PORT, (err) => {
  if (err) {
    return logger.error(err);
  }

  return logger.info(`http Server is listening on port: ${port}`);
});

// new SocketController(httpServer).startSocket();
// new SocketController(server).startSocket();
