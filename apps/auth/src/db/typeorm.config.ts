import User from "../entity/user.entity";

export const typeormConfig = (): any => {
  console.log({
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    entities: [User],
  });
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    entities: [User]
  };
};
