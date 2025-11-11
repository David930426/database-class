# First step of all, set up .env.local
## .env.local

## HOST is the Server Name from the connection dialog
SQL_SERVER_HOST="<server your localhost>"

## USER is the Login name
SQL_SERVER_USER="<server username>"

## PASSWORD is the password you typed into the dialog
SQL_SERVER_PASSWORD="<user password>"

## DB is the specific database you are querying (e.g., where your Users table is)
SQL_SERVER_DB="<The Name of Your Application's Database>"

# Set up database using sql server and table
CREATE DATABASE DatabaseClassProject

CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password VARBINARY(MAX) NOT NULL, // set up for hashing password
    CreatedAt DATETIME DEFAULT GETDATE()
);



# Run application
by using pnpm run dev

or

pnpm build