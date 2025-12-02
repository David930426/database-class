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
  orderExpired: boolean,
  quantityLess15: boolean,
  quantity15To30: boolean,
  quantityOver30: boolean,
  searchTerm: string
): Promise<GetItem[] | null> {
  try {
    const pool = await DbConnect();
    const selectStatement = `
      SELECT InventoryId, ProductId, ProductName, ExpiredAt, SectionName, 
             StockQuantity, BranchId, BranchName, Location, IndexProductId, IndexBranchId
      FROM V_FullInventoryDetails
    `;

    let whereClause = "";
    let searchCondition = "";

    if (searchTerm && searchTerm.trim().length > 0) {
      searchCondition = `
            (
              ProductId LIKE '%' + @SearchTerm + '%' 
              OR ProductName LIKE '%' + @SearchTerm + '%' 
              OR SectionName LIKE '%' + @SearchTerm + '%' 
              OR BranchId LIKE '%' + @SearchTerm + '%' 
              OR BranchName LIKE '%' + @SearchTerm + '%' 
              OR Location LIKE '%' + @SearchTerm + '%'
            )
        `;
    }

    let quantityCondition = "";
    if (quantityOver30) {
      quantityCondition = "StockQuantity > 30";
    } else if (quantity15To30) {
      quantityCondition = "StockQuantity <= 30 AND StockQuantity > 15";
    } else if (quantityLess15) {
      quantityCondition = "StockQuantity < 15";
    }

    if (quantityCondition.length > 0 || searchCondition.length > 0) {
      whereClause = "WHERE ";

      if (quantityCondition.length > 0) {
        whereClause += quantityCondition;
      }

      if (searchCondition.length > 0) {
        if (quantityCondition.length > 0) {
          whereClause += " AND ";
        }
        whereClause += searchCondition;
      }
    }
    let orderByClause = "";
    if (orderExpired) {
      orderByClause = "ORDER BY ExpiredAt, StockQuantity DESC";
    } else if (orderQuantity) {
      orderByClause = "ORDER BY StockQuantity, ExpiredAt";
    } else {
      orderByClause = `
          ORDER BY ${
            orderProduct ? "IndexProductId" : "IndexProductId DESC"
          }, ${orderBranch ? "IndexBranchId" : "IndexBranchId DESC"}
        `;
    }

    const result = await pool
      .request()
      .input("SearchTerm", sql.NVarChar, searchTerm).query(`
        ${selectStatement}
        ${whereClause}
        ${orderByClause}
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

export async function allInventoriesNumber(): Promise<number> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .query(`SELECT COUNT(*) AS TotalInventory FROM Inventories;`);
    if (result.recordset.length > 0) {
      const count = result.recordset[0].TotalInventory;
      return count || 0;
    }
    return 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export async function totalShowInventory(
  quantityLess15: boolean,
  quantity15To30: boolean,
  quantityOver30: boolean,
  searchTerm: string
): Promise<number> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SearchTerm", sql.NVarChar, searchTerm)
      .query(`SELECT COUNT(*) AS TotalCount 
              FROM Inventories AS i INNER JOIN Products AS p   
                ON i.ProductId = p.IndexProductId 
     
              INNER JOIN Branches AS b
                ON i.BranchId = b.IndexBranchId 
                
              INNER JOIN Sections AS s 
                ON p.SectionId = s.SectionId

              -- START: Dynamic WHERE Clause (Exact copy of your filtering logic, excluding ORDER BY)
              ${
                quantityOver30
                  ? "WHERE i.Quantity > 30"
                  : quantity15To30
                  ? "WHERE i.Quantity <= 30 AND i.Quantity > 15"
                  : quantityLess15
                  ? "WHERE i.Quantity < 15"
                  : ""
              }

              ${
                quantityLess15 || quantity15To30 || quantityOver30
                  ? `
                      AND (
                        p.ProductId LIKE '%' + @SearchTerm + '%' 
                        OR p.ProductName LIKE '%' + @SearchTerm + '%' 
                        OR s.SectionName LIKE '%' + @SearchTerm + '%' 
                        OR b.BranchId LIKE '%' + @SearchTerm + '%' 
                        OR b.BranchName LIKE '%' + @SearchTerm + '%' 
                        OR b.Location LIKE '%' + @SearchTerm + '%'
                      )`
                  : `WHERE
                        p.ProductId LIKE '%' + @SearchTerm + '%' 
                        OR p.ProductName LIKE '%' + @SearchTerm + '%' 
                        OR s.SectionName LIKE '%' + @SearchTerm + '%' 
                        OR b.BranchId LIKE '%' + @SearchTerm + '%' 
                        OR b.BranchName LIKE '%' + @SearchTerm + '%' 
                        OR b.Location LIKE '%' + @SearchTerm + '%'`
              }`);
    if (result.recordset.length > 0) {
      const count = result.recordset[0].TotalCount;
      return count || 0;
    }
    return 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
