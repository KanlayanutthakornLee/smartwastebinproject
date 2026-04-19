import "./config/db.js"; // แค่นี้พอ

import app from "./app.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`SERVER STARTED on port ${port}`);
});