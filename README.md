# First step of all, set up .env.local

### Set session key
`SESSION_SECRET=your_secret_key`
use `openssl rand -base64 32` in terminal to get you secret key

### HOST is the Server Name from the connection dialog
`SQL_SERVER_HOST="<server your localhost>"`
*** I am using localhost
*** Don't forget to open TCP connection and set the port to 1433

### USER is the Login name
`SQL_SERVER_USER="<server username>"`

### PASSWORD is the password you typed into the dialog
`SQL_SERVER_PASSWORD="<user password>"`

### DB is the specific database you are querying (e.g., where your Users table is)
`SQL_SERVER_DB="<The Name of Your Application's Database>"`

## Set up database using sql server and table
`CREATE DATABASE DatabaseClassProject`

CREATE TABLE Users (
    UserID INT IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password VARBINARY(MAX) NOT NULL, // set up for hashing password
    CreatedAt DATETIME DEFAULT GETDATE()
    PRIMARY KEY (UserID)
);`

## Create User Query
INSERT INTO Users (Username, Email, Password)
VALUES (@Username, @Email, @Password)

## Login User Query
SELECT * FROM Users
WHERE Username = @Username


# Run application
### Download all depedencies
`pnpm i`

### Start by using 
`pnpm run dev`

### Build pnpm
`pnpm build`