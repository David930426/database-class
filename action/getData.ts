"use server";
import { DbConnect } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import sql from "mssql";
import { GetItem, GetSection } from "@/lib/definitions";
import { GetBranches, GetProducts } from "@/lib/definitions";

export async function getDataUser() {
  const cookie = (await cookies()).get("session")?.value;
  const decrypted = await decrypt(cookie);

  const userId = decrypted?.userId;

  try {
    const pool = await DbConnect();

    const data = await pool.request().input("UserID", sql.Int, userId)
      .query(`SELECT * FROM Users
            WHERE UserID = @UserID`);

    const userSet = data.recordset[0];

    const sendData = {
      ...userSet,
      Password: userSet.Password.toString("base64"),
    };

    return sendData || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getDataItem(
  orderProduct: boolean,
  orderBranch: boolean,
  orderQuantity: boolean,
  orderExpired: boolean
): Promise<GetItem[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool.request().query(`
      SELECT i.InventoryId, p.ProductId, p.ProductName, p.ExpiredAt, s.SectionName, i.Quantity, b.BranchId, b.BranchName, b.Location 
      
      FROM Inventories AS i INNER JOIN Products AS p ON i.ProductId = p.IndexProductId 
        
      INNER JOIN Branches AS b
        ON i.BranchId = b.IndexBranchId 
        
      INNER JOIN Sections AS s 
        ON p.SectionId = s.SectionId
      
      ${
        orderExpired
          ? "ORDER BY p.ExpiredAt, i.Quantity DESC"
          : orderQuantity
          ? "ORDER BY i.Quantity, p.ExpiredAt"
          : `
      ORDER BY ${orderProduct ? "p.ProductId" : "p.ProductId DESC"}, ${
              orderBranch ? "b.BranchId" : "b.BranchId DESC"
            }`
      };
        `);
    return result.recordset as GetItem[];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getProduct(): Promise<GetProducts[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .query(`SELECT ProductId, ProductName FROM Products`);
    return result.recordset as GetProducts[];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getBranch(): Promise<GetBranches[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .query(`SELECT BranchId, BranchName FROM Branches`);
    return result.recordset as GetBranches[];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getSection(): Promise<GetSection[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .query(`SELECT SectionId, SectionName FROM Sections`);
    return result.recordset as GetSection[];
  } catch (err) {
    console.error(err);
    return null;
  }
}