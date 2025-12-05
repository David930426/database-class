"use server";
import { DbConnect } from "@/lib/db";
import { FormState } from "@/lib/definitions";
import { AddInventorySchema } from "@/lib/zod";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addInventory(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = AddInventorySchema.parse(rawData);

    if (!parsedData) {
      return {
        success: false,
        message: "Parsed is not succeed",
      };
    }

    const pool = await DbConnect();
    const searchProductIndexId = await pool
      .request()
      .input("ProductId", sql.NVarChar, parsedData.product) // SEARCH THE PRODUCT FOR INVENTORY INSERTION
      .query(
        `SELECT IndexProductId FROM Products WHERE ProductId = @ProductId`
      );
    const searchBranchIndexId = await pool
      .request()
      .input("BranchId", sql.NVarChar, parsedData.branch)
      .query(`SELECT IndexBranchId FROM Branches WHERE BranchId = @BranchId`); // SEARCH THE BRANCH FOR INVENTORY INSERTION

    if (!searchProductIndexId || !searchBranchIndexId) {
      return {
        success: false,
        message: "Can not search the Index Id of product or branch",
      };
    }

    const result = await pool
      .request()
      .input(
        "ProductId",
        sql.BigInt,
        searchProductIndexId.recordset[0].IndexProductId
      )
      .input(
        "BranchId",
        sql.Int,
        searchBranchIndexId.recordset[0].IndexBranchId
      )
      .input("Quantity", sql.Int, parsedData.quantity)  // INSERT VALUES
      .query(`INSERT INTO Inventories (ProductId, BranchId, Quantity) 
        VALUES (@ProductId, @BranchId, @Quantity)`);

    if (!result) {
      return {
        success: false,
        message: "Can not update your file",
      };
    }
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
  revalidatePath("/");
  redirect("/");
  return {
    success: true,
  };
}
