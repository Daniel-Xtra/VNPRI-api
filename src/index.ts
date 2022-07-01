import app from "./app";

import { Server } from "http";
import { PORT } from "./config";
import { logger } from "./utils/logger";
// import { createServer } from "https";

// import * as fs from "fs";

const port = PORT || 5000;
// const port2 = PORT2;

const httpServer = new Server(app);
// const server = createServer("", app);

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

// server.listen(PORT2, (err) => {
//   if (err) {
//     return logger.error(err);
//   }

//   return logger.info(`https Server is listening on port: ${port2}`);
// });

// new SocketController(httpServer).startSocket();
// new SocketController(server).startSocket();
