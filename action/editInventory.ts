"use server";
import { DbConnect } from "@/lib/db";
import { FormState, GetInventory } from "@/lib/definitions";
import { EditInventorySchema } from "@/lib/zod";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function searchInventory(inventoryId: number) {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("InventoryId", sql.BigInt, inventoryId)
      .query(`SELECT * FROM Inventories WHERE InventoryId = @InventoryId`);
    return result.recordset[0] as GetInventory;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function editInventory(
  prevState: FormState | undefined,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = EditInventorySchema.parse(rawData);
    if (!parsedData) {
      return {
        success: false,
        message: "Parsed is not succeed",
      };
    }

    const pool = await DbConnect();

    const searchProductIndexId = await pool
      .request()
      .input("ProductId", sql.NVarChar, parsedData.product)
      .query(
        `SELECT IndexProductId FROM Products WHERE ProductId = @ProductId`
      );
    const searchBranchIndexId = await pool
      .request()
      .input("BranchId", sql.NVarChar, parsedData.branch)
      .query(`SELECT IndexBranchId FROM Branches WHERE BranchId = @BranchId`);

    if (!searchProductIndexId || !searchBranchIndexId) {
      return {
        success: false,
        message: "Can not search the Index Id of product or branch",
      };
    }

    const result = pool
      .request()
      .input("InventoryId", sql.BigInt, parsedData.inventoryId)
      .input("ProductId", sql.BigInt, searchProductIndexId.recordset[0].IndexProductId)
      .input("BranchId", sql.Int, searchBranchIndexId.recordset[0].IndexBranchId)
      .input("NewQuantity", sql.Int, parsedData.quantity);

    await result.execute("SP_UpdateInventoryRecord");
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

export async function deleteInventory(inventoryId: number) {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("InventoryId", sql.BigInt, inventoryId)
      .query(`DELETE FROM Inventories WHERE InventoryId = @InventoryId`);
    if (result.rowsAffected[0] === 0) {
      console.log("Delete inventory unsuccessfull");
    }
  } catch (err) {
    console.error(err);
  }
  revalidatePath("/");
}
