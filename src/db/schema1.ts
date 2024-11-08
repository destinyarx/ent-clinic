import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const expensesTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  category_other: text('category_other').notNull(),
  expense_date: timestamp('expense_date').notNull(),
  description: text('description'),
  created_by: integer('created_by').notNull(),
  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at'),
  deleted_at: timestamp('deleted_at'),
});

export const testTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: text('name'),
  created_at: timestamp('created_at').notNull(),
});

// export const usersTable = pgTable('users_table', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   age: integer('age').notNull(),
//   email: text('email').notNull().unique(),
// });

// export const postsTable = pgTable('posts_table', {
//   id: serial('id').primaryKey(),
//   title: text('title').notNull(),
//   content: text('content').notNull(),
//   userId: integer('user_id')
//     .notNull()
//     .references(() => usersTable.id, { onDelete: 'cascade' }),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at')
//     .notNull()
//     .$onUpdate(() => new Date()),
// });

export type InsertExpenses = typeof expensesTable.$inferInsert;
export type SelectExpenses = typeof expensesTable.$inferSelect;

export type InsertTest = typeof testTable.$inferInsert;
export type SelectTest = typeof testTable.$inferSelect;
