// import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
// import { db } from '../index';

// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'
// const client = postgres(process.env.DATABASE_URL)
// const db = drizzle({ client });

import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';

// import { drizzle } from 'drizzle-orm/postgres-js'
// const db = drizzle(process.env.DATABASE_URL);
import { testing, products } from '../schema';

export async function getExpenseById(id: number) {
  return 'BWAHAHA';
  
    return db
      .select({
        id: products.id.toString,
        title: products.title,
        description: products.description,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(eq(products.price, 35));

      // const result = await db.select().from(products);
      // return result;
  }