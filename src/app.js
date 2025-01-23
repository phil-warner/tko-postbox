import express from 'express';
import router from './routers/app.js';
import { config } from './config/app.js';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();

app.set('view engine', 'ejs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.resolve(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: 31557600000 // 1 year
}));

app.use(router);


app.listen(config.port, function () {
  console.log(`tko-postbox listening on port ${config.port}`);
})
