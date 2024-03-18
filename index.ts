import express, { Express } from 'express';
import { bootstrap } from './src/index.router'; // Assuming the extension of the file is .ts
const app :Express = express();
const port: number | string | undefined = process.env.PORT;

bootstrap(app, express);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
