"use server";
import { ProductAuditLog } from "@/lib/definitions";
import { DbConnect } from "@/lib/db";

export async function getProductAuditLog(): Promise<ProductAuditLog[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool.request().query(`
            SELECT 
                AuditID, 
                IndexProductId, 
                OldProductName, 
                NewProductName, 
                OldSectionId, 
                NewSectionId, 
                ChangeDate, 
                ActionType 
            FROM 
                ProductAudit 
            ORDER BY 
                ChangeDate DESC;
        `);
    return result.recordset as ProductAuditLog[];
  } catch (err) {
    console.error("Error fetching product audit log:", err);
    return null;
  }
}
