import { DbConnect } from "@/lib/db";
import sql from "mssql";

// Assuming 'username', 'email', and 'password' are validated and available
export async function insertUser(
  username: string,
  email: string,
  password: string
) {
  // Convert the hash string to a Buffer for VARBINARY storage in SQL Server
  const hashBuffer = Buffer.from(password, "utf8");

  try {
    const pool = await DbConnect();

    // 2. EXECUTE SECURE INSERT QUERY
    const result = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .input("Email", sql.NVarChar, email)
      // Use the Buffer for the VARBINARY column
      .input("Password", sql.VarBinary, hashBuffer).query(`
                INSERT INTO Users (Username, Email, Password)
                VALUES (@Username, @Email, @Password);
            `);

    console.log("User successfully inserted.");
    return result;
  } catch (error) {
    console.error("Failed to insert user into database:", error);
    throw error;
  }
}
