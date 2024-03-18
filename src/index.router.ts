import path from "path";
import { config } from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import userRoutes from "./modules/user/user.routes";
import companyRoutes from "./modules/company/company.routes";
import jobRoutes from "./modules/job/job.routes";
import { globalErrorHandler } from './utils/errorHandling';
import { dbConnection } from "../DB/dbconnections";

config({ path: path.resolve("config/.env") });


const app: Express = express();

export const bootstrap = (app, express) => {
    app.use(express.json());
    app.use("/user", userRoutes);
    app.use("/company", companyRoutes);
    app.use("/job", jobRoutes);
    app.use('*', (req: Request, res: Response, next: NextFunction) => res.json({ msg: `${req.originalUrl} is invalid url!` }));
    dbConnection();
    app.use(globalErrorHandler);
};

const port: number | string | undefined = process.env.PORT;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
