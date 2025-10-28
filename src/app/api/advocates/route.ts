import db from "../../../db";
import { advocates } from "../../../db/schema";
// import { advocateData } from "../../../db/seed/advocates";
import { or, ilike, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  // Search parameter
  const search = searchParams.get("search") || "";

  // Build WHERE condition if search is provided
  const whereClause = search
    ? or(
        ilike(advocates.firstName, `%${search}%`),
        ilike(advocates.lastName, `%${search}%`),
        ilike(advocates.city, `%${search}%`),
        ilike(advocates.degree, `%${search}%`),
        sql`${advocates.specialties}::text ILIKE ${`%${search}%`}`,
        sql`CAST(${advocates.phoneNumber} AS TEXT) ILIKE ${`%${search}%`}`,
        sql`CAST(${advocates.yearsOfExperience} AS TEXT) ILIKE ${`%${search}%`}`
      )
    : undefined;

  // Execute query with pagination
  const query = whereClause
    ? db.select().from(advocates).where(whereClause).limit(limit).offset(offset)
    : db.select().from(advocates).limit(limit).offset(offset);

  const data = await query;

  // Get total count for pagination metadata
  const countQuery = whereClause
    ? db
        .select({ total: sql<number>`count(*)::int` })
        .from(advocates)
        .where(whereClause)
    : db.select({ total: sql<number>`count(*)::int` }).from(advocates);

  const totalCountResult = await countQuery;

  const total = totalCountResult[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return Response.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
}
