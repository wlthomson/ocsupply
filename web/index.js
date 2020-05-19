import Express from "express";
import Path from "path";

const PORT = 4001;
const MESSAGE = `
\#####################################################\n
🥳🥳🥳 Server started @ http://localhost:${PORT} 🥳🥳🥳\n
#####################################################`;

const app = new Express();

app.use(Express.static(Path.join(__dirname, "client", "build")));
app.get("/", (_, res) =>
  res.sendFile(Path.join(__dirname, "client", "build", "index.html"))
);
app.listen(PORT, () => console.log(MESSAGE));
