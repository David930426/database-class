"use server";
import { DbConnect } from "@/lib/db";
import { Branches, FormState } from "@/lib/definitions";
import { AddBranchSchema, EditBranchSchema } from "@/lib/zod";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function branch(
  branchSorted: boolean,
  setBranchSearch: string
): Promise<Branches[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SearchTerm", sql.NVarChar, setBranchSearch).query(`
        SELECT * FROM Branches
        ${
          setBranchSearch &&
          `WHERE 
            BranchId LIKE '%' + @SearchTerm + '%' 
            OR BranchName LIKE '%' + @SearchTerm + '%' 
            OR Location LIKE '%' + @SearchTerm + '%'
          `
        }
        ORDER BY 
        ${branchSorted ? "IndexBranchId" : "IndexBranchId DESC"}
        `);
    if (result.rowsAffected[0] === 0) {
      console.log("Fetch data succesfully");
    }
    return result.recordset as Branches[];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteBranch(indexBranchId: number) {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("IndexBranchId", sql.BigInt, indexBranchId)
      .query(`DELETE FROM Branches WHERE IndexBranchId = @IndexBranchId`);
    if (result.rowsAffected[0] === 0) {
      console.log("Delete inventory unsuccessfull");
    }
  } catch (err) {
    console.error(err);
  }
  revalidatePath("/product-branch");
}

export async function addBranch(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = AddBranchSchema.parse(rawData);

    if (!parsedData) {
      return {
        success: false,
        message: "Failing from parsing data",
      };
    }

    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("BranchName", sql.NVarChar, parsedData.branchName)
      .input("Location", sql.NVarChar, parsedData.branchLocation)
      .query(`INSERT INTO Branches (BranchName, Location) VALUES
        (@BranchName, @Location)`);
    if (!result) {
      return {
        success: false,
        message: "Error from database",
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

export async function oneBranch(
  indexBranchId: number
): Promise<Branches | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("IndexBranchId", sql.Int, indexBranchId)
      .query(
        `SELECT *
        FROM Branches
        WHERE IndexBranchId = @IndexBranchId`
      );
    if (result.rowsAffected[0] === 0) {
      console.error("There is no data");
      return null;
    }
    return result.recordset[0] as Branches;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function editBranch(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = EditBranchSchema.parse(rawData);

    if (!parsedData) {
      return {
        success: false,
        message: "Failing from parsing data",
      };
    }

    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("IndexBranchId", sql.Int, parsedData.indexBranchId)
      .input("BranchName", sql.NVarChar, parsedData.branchName)
      .input("Location", sql.NVarChar, parsedData.branchLocation)
      .query(`UPDATE Branches 
        SET BranchName = @BranchName, Location = @Location
        WHERE IndexBranchId = @IndexBranchId`);
    if (!result) {
      return {
        success: false,
        message: "Error from database",
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
