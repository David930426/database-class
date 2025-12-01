"use server";
import { DbConnect } from "@/lib/db";
import { EditProducts, FormState, Products } from "@/lib/definitions";
import { AddProductSchema, EditProductSchema } from "@/lib/zod";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function product(
  expiredOrder: boolean,
  productOrder: boolean,
  setProductSearch: string
): Promise<Products[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SearchTerm", sql.NVarChar, setProductSearch)
      .query(
        `SELECT p.IndexProductId, p.ProductId, p.ProductName, p.ExpiredAt, p.SectionId, s.SectionName 
        FROM Products AS p INNER JOIN Sections AS s ON p.SectionId = s.SectionId
        ${
          setProductSearch &&
          `WHERE
            p.ProductId LIKE '%' + @SearchTerm + '%' 
            OR p.ProductName LIKE '%' + @SearchTerm + '%' 
            OR s.SectionName LIKE '%' + @SearchTerm + '%'
          `
        }
        ORDER BY 
        ${expiredOrder ? "p.ExpiredAt, " : ""}
        ${productOrder ? "p.IndexProductId" : "p.IndexProductId DESC"}
        `
      );
    if (result.rowsAffected[0] === 0) {
      console.error("There is no data");
      return null;
    }
    return result.recordset as Products[];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function totalProduct(): Promise<number> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .query(`SELECT COUNT(*) AS TotalProducts FROM Products;`);
    if (result.recordset.length > 0) {
      const count = result.recordset[0].TotalProducts;
      return count || 0;
    }
    return 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export async function totalShowProduct(
  setProductSearch: string
): Promise<number> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SearchTerm", sql.NVarChar, setProductSearch)
      .query(`SELECT COUNT(*) AS TotalCount 
          FROM Products AS p INNER JOIN Sections AS s ON p.SectionId = s.SectionId
          ${
            setProductSearch
              ? `WHERE
                p.ProductId LIKE '%' + @SearchTerm + '%' 
                OR p.ProductName LIKE '%' + @SearchTerm + '%' 
                OR s.SectionName LIKE '%' + @SearchTerm + '%'
                `
              : ""
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

export async function addProduct(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = AddProductSchema.parse(rawData);
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("ProductName", sql.NVarChar, parsedData.productName)
      .input("ExpiredAt", sql.Date, parsedData.expiredAt)
      .input("SectionId", sql.Int, parsedData.sectionId)
      .query(`INSERT INTO Products (ProductName, ExpiredAt, SectionId)
        VALUES (@ProductName, @ExpiredAt, @SectionId)`);
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        message: "Can not input data to database",
      };
    }
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
  revalidatePath("/product-branch");
  redirect("/product-branch");
  return {
    success: true,
  };
}

export async function OneProduct(
  indexProductId: number
): Promise<EditProducts | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("IndexProductId", sql.BigInt, indexProductId)
      .query(
        `SELECT IndexProductId, ProductId, ProductName, ExpiredAt, SectionId
        FROM Products
        WHERE IndexProductId = @IndexProductId`
      );
    if (result.rowsAffected[0] === 0) {
      console.error("There is no data");
      return null;
    }
    return result.recordset[0] as EditProducts;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function editProduct(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = EditProductSchema.parse(rawData);
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("IndexProductId", sql.BigInt, parsedData.indexProductId)
      .input("ProductName", sql.NVarChar, parsedData.productName)
      .input("ExpiredAt", sql.Date, parsedData.expiredAt)
      .input("SectionId", sql.Int, parsedData.sectionId).query(`UPDATE Products 
        SET ProductName = @ProductName, ExpiredAt = @ExpiredAt, SectionId = @SectionId
        WHERE IndexProductId = @IndexProductId`);
    if (result.rowsAffected[0] === 0) {
      return {
        success: false,
        message: "Can not input data to database",
      };
    }
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
  revalidatePath("/product-branch");
  redirect("/product-branch");
  return {
    success: true,
  };
}

export async function deleteProduct(indexProductId: number) {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("IndexProductId", sql.BigInt, indexProductId)
      .query(`DELETE FROM Products WHERE IndexProductId = @IndexProductId`);
    if (result.rowsAffected[0] === 0) {
      console.log("Delete inventory unsuccessfull");
    }
  } catch (err) {
    console.error(err);
  }
  revalidatePath("/product-branch");
}
