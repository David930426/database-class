"use server";
import { DbConnect } from "@/lib/db";
import { FormState, GetSection } from "@/lib/definitions";
import { AddSectionSchema, EditSectionSchema } from "@/lib/zod";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function section(
  setSectionSearch: string
): Promise<GetSection[] | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SearchTerm", sql.NVarChar, setSectionSearch)
      .query(
        `SELECT * FROM Sections ${
          setSectionSearch &&
          `WHERE
            SectionName LIKE '%' + @SearchTerm + '%'
          `
        }`
      );
    if (result.rowsAffected[0] === 0) return null;
    return result.recordset as GetSection[];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteSection(sectionId: number) {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SectionId", sql.Int, sectionId)
      .query(`DELETE FROM Sections WHERE SectionId = @SectionId`);
    if (result.rowsAffected[0] === 0) {
      console.log("Delete inventory unsuccessfull");
    }
  } catch (err) {
    console.error(err);
  }
  revalidatePath("/product-branch");
}

export async function addSection(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = AddSectionSchema.parse(rawData);

    if (!parsedData) {
      return {
        success: false,
        message: "Failing from parsing data",
      };
    }

    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SectionName", sql.NVarChar, parsedData.sectionName)
      .query(`INSERT INTO Sections (SectionName) VALUES
        (@SectionName)`);
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

export async function oneSection(
  sectionId: number
): Promise<GetSection | null> {
  try {
    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SectionId", sql.Int, sectionId)
      .query(
        `SELECT *
        FROM Sections
        WHERE SectionId = @SectionId`
      );
    if (result.rowsAffected[0] === 0) {
      console.error("There is no data");
      return null;
    }
    return result.recordset[0] as GetSection;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function editSection(prevState: FormState, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = EditSectionSchema.parse(rawData);

    if (!parsedData) {
      return {
        success: false,
        message: "Failing from parsing data",
      };
    }

    const pool = await DbConnect();
    const result = await pool
      .request()
      .input("SectionId", sql.Int, parsedData.sectionId)
      .input("SectionName", sql.NVarChar, parsedData.sectionName)
      .query(`UPDATE Sections 
        SET SectionName = @SectionName
        WHERE SectionId = @SectionId`);
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
