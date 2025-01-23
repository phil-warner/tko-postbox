const express = require('express');
const app = express();
const router = require('./routers/app');
const config = require('./config/app');

app.set('view engine', 'ejs');
app.use(router);


app.listen(config.port, function () {
  console.log(`tko-postbox listening on port ${config.port}`);
})
