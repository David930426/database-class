"use server";
import { DbConnect } from "@/lib/db";
import { GetBranches, GetProducts, GetSection } from "@/lib/definitions";

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
