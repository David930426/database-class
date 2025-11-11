import sql, { config, ConnectionPool } from "mssql";

// declare the config for  database
const configDb: config = {
  user: process.env.SQL_SERVER_USER,
  password: process.env.SQL_SERVER_PASSWORD,
  server: process.env.SQL_SERVER_HOST as string,
  database: process.env.SQL_SERVER_DB,
  options: {
    trustServerCertificate: true,
  },
};

let pool: ConnectionPool | undefined;

export const DbConnect = async(): Promise<ConnectionPool> => {
    try {
        // check if there is any connection
        if(pool instanceof ConnectionPool && pool.connected) {
            return pool;
        }
        // if there is a fail connection, then close it
        if(pool) {
            console.log("Connection has been found, but disconnected, try to close it...")
            await pool.close();
        }
        // make a new connection and return it for the promise
        console.log("Making new connection...")
        pool = await sql.connect(configDb);

        console.log("Success connect to database")
        return pool;
    }
    //catch the error
    catch(err) {
        const error = err as Error
        console.error("Connection to database is fail: ", error.message);

        throw new Error(`Failed to connect database ${error.message}`)
    }
}

// make a const async funct to let database connection can be closed
export const DbClose = async(): Promise<void> => {
    if (pool) {
        try {
            pool.close();
            pool = undefined;
            console.log("Connection has been closed")
        }
        catch(err) {
            const error = err as Error;
            console.error("SQL can not be closed: ", error.message);
        }
    }
}