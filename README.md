# First step of all, set up .env.local

### Set session key

`SESSION_SECRET=your_secret_key`
use `openssl rand -base64 32` in terminal to get you secret key

### HOST is the Server Name from the connection dialog

`SQL_SERVER_HOST="<server your localhost>"`
**_ I am using localhost
_** Don't forget to open TCP connection and set the port to 1433

### USER is the Login name

`SQL_SERVER_USER="<server username>"`

### PASSWORD is the password you typed into the dialog

`SQL_SERVER_PASSWORD="<user password>"`

### DB is the specific database you are querying (e.g., where your Users table is)

`SQL_SERVER_DB="<The Name of Your Application's Database>"`

# Run application

### Download all depedencies

`pnpm i`

### Start by using

`pnpm run dev`

### Build pnpm

`pnpm build`

# My set up for SQL Server Database

# USER

## Set up database using sql server and table

`CREATE DATABASE DatabaseClassProject`

CREATE TABLE Users (
UserID INT IDENTITY(1,1), // automatically increasing number
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

SELECT \* FROM Users
WHERE Username = @Username

## Get User Data Query

SELECT \* FROM Users
WHERE UserID = @UserID

## Update User username and email

UPDATE Users
SET Username = @Username, Email = @Email
WHERE UserID = @UserId

## Update User password

SELECT Password
FROM Users
WHERE UserID = @userId

UPDATE Users
SET Password = @Password
WHERE UserID = @UserId

# ITEMS

## Create Table for branch store

Create Table Branches (
IndexBranchId INT IDENTITY(1,1) NOT NULL,
BranchId AS 'B' + CONVERT(NVARCHAR(10), IndexBranchId) PERSISTED,
BranchName NVARCHAR(200),
Location NVARCHAR(200),
PRIMARY KEY(IndexBranchId)
)

## Create Table for sections

CREATE TABLE Sections (
SectionId INT IDENTITY(1,1) NOT NULL,
SectionName NVARCHAR(150),
PRIMARY KEY (SectionId)
)

## Create Table for product

CREATE TABLE Products (
IndexProductId BIGINT IDENTITY(1,1) NOT NULL,
ProductId AS 'P' + CONVERT(NVARCHAR(20), IndexProductId) PERSISTED,
ProductName NVARCHAR(100) NOT NULL,
ExpiredAt DATE NOT NULL,
SectionId INT NOT NULL,
PRIMARY KEY (IndexProductId),
FOREIGN KEY (SectionId) REFERENCES Sections(SectionId) ON DELETE CASCADE
)

## Create Inventories

CREATE TABLE Inventories (
InventoryId BIGINT IDENTITY(1,1) NOT NULL,
ProductId BIGINT NOT NULL,
BranchId INT NOT NULL,
Quantity INT DEFAULT 0,
UpdatedAt DATETIME DEFAULT GETDATE(),

    PRIMARY KEY (InventoryId),
    FOREIGN KEY (ProductId) REFERENCES Products(IndexProductId) ON DELETE CASCADE,
    FOREIGN KEY (BranchId) REFERENCES Branches(IndexBranchId) ON DELETE CASCADE,

    UNIQUE(ProductId, BranchId)

)

## Create view Inventories

CREATE VIEW V_FullInventoryDetails AS
SELECT
i.InventoryId,
p.IndexProductId,
b.IndexBranchId,

    p.ProductId,
    b.BranchId,
    p.ProductName,
    p.ExpiredAt,
    p.SectionId,
    i.Quantity AS StockQuantity,
    s.SectionName,
    b.BranchName,
    b.Location

FROM
Inventories AS i
INNER JOIN Products AS p ON i.ProductId = p.IndexProductId
INNER JOIN Branches AS b ON i.BranchId = b.IndexBranchId
INNER JOIN Sections AS s ON p.SectionId = s.SectionId;

## Create procedures for deleting Product

CREATE PROCEDURE SP_DeleteProduct
@IndexProductId BIGINT
AS
BEGIN
SET NOCOUNT ON;

    DELETE FROM Products
    WHERE IndexProductId = @IndexProductId;

    IF @@ROWCOUNT = 0
    BEGIN
        THROW 50000, 'Product not found or deletion failed.', 1;
        RETURN;
    END

END;

## Create procedures for updating Inventories

CREATE PROCEDURE SP_UpdateInventoryRecord
    @InventoryId BIGINT,
    @ProductId BIGINT,
    @BranchId INT,
    @NewQuantity INT
AS
BEGIN

    UPDATE Inventories
    SET 
        ProductId = @ProductId,
        BranchId = @BranchId,
        Quantity = @NewQuantity,
        UpdatedAt = GETDATE()
    WHERE 
        InventoryId = @InventoryId;

END
