const createServer = require("./src/server/server");

const app = createServer();
app.listen(3000, async () => {
  console.log("Server listening on port 3000");
});
