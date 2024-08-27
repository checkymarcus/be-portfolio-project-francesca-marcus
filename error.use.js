const app = require("./server/app");
const { serverErrorHandler } = require("./error-handling");

app.use(serverErrorHandler);
