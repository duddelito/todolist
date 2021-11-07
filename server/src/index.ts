
// https://learn.coderslang.com/0021-nodejs-require-is-not-defined-error/

import express, {Request,Response,Application} from 'express';
import cors from 'cors';
import * as fs from "fs";

import todosRoutes from './routes/todos.js';

const PORT = process.env.PORT || 3001;

const app:Application = express();
const crossDomain  = cors();
app.use(crossDomain);

app.use(express.json());

app.use('/todo', todosRoutes );


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
