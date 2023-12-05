import {DataSource} from "typeorm";
import {typeormConfig} from "../db/typeorm.config";
import {Logger} from "@nestjs/common";

export const dataSource = new DataSource(typeormConfig())

dataSource.initialize()
    .then(() => {
        Logger.verbose("Connected to Postgres successfully")
    })
    .catch((err) => {
        Logger.error(`Error while connecting to Postgres: ${err}`)
    })