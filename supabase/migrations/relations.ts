import { relations } from "drizzle-orm/relations";
import { products, saleProducts, sales, users, deliveries, customers, deliverySchedules, deliveryHistory, deliveryProducts, address, expenses } from "./schema";

export const saleProductsRelations = relations(saleProducts, ({one}) => ({
	product: one(products, {
		fields: [saleProducts.productId],
		references: [products.id]
	}),
	sale: one(sales, {
		fields: [saleProducts.salesId],
		references: [sales.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	saleProducts: many(saleProducts),
	user: one(users, {
		fields: [products.createdBy],
		references: [users.id]
	}),
}));

export const salesRelations = relations(sales, ({one, many}) => ({
	saleProducts: many(saleProducts),
	user: one(users, {
		fields: [sales.createdBy],
		references: [users.id]
	}),
	customer: one(customers, {
		fields: [sales.customerId],
		references: [customers.id]
	}),
	deliveryHistory: one(deliveryHistory, {
		fields: [sales.deliverHistoryId],
		references: [deliveryHistory.id]
	}),
}));

export const deliveriesRelations = relations(deliveries, ({one}) => ({
	user: one(users, {
		fields: [deliveries.createdBy],
		references: [users.id]
	}),
	customer: one(customers, {
		fields: [deliveries.customerId],
		references: [customers.id]
	}),
	deliverySchedule: one(deliverySchedules, {
		fields: [deliveries.scheduleId],
		references: [deliverySchedules.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	deliveries: many(deliveries),
	deliveryHistories: many(deliveryHistory),
	deliveryProducts: many(deliveryProducts),
	deliverySchedules: many(deliverySchedules),
	sales: many(sales),
	customers: many(customers),
	products: many(products),
	expenses: many(expenses),
}));

export const customersRelations = relations(customers, ({one, many}) => ({
	deliveries: many(deliveries),
	deliveryHistories: many(deliveryHistory),
	deliverySchedules: many(deliverySchedules),
	sales: many(sales),
	addresses: many(address),
	user: one(users, {
		fields: [customers.createdBy],
		references: [users.id]
	}),
}));

export const deliverySchedulesRelations = relations(deliverySchedules, ({one, many}) => ({
	deliveries: many(deliveries),
	deliveryHistories: many(deliveryHistory),
	user: one(users, {
		fields: [deliverySchedules.createdBy],
		references: [users.id]
	}),
	customer: one(customers, {
		fields: [deliverySchedules.customerId],
		references: [customers.id]
	}),
}));

export const deliveryHistoryRelations = relations(deliveryHistory, ({one, many}) => ({
	user: one(users, {
		fields: [deliveryHistory.createdBy],
		references: [users.id]
	}),
	customer: one(customers, {
		fields: [deliveryHistory.customerId],
		references: [customers.id]
	}),
	deliverySchedule: one(deliverySchedules, {
		fields: [deliveryHistory.scheduleId],
		references: [deliverySchedules.id]
	}),
	sales: many(sales),
}));

export const deliveryProductsRelations = relations(deliveryProducts, ({one}) => ({
	user: one(users, {
		fields: [deliveryProducts.createdBy],
		references: [users.id]
	}),
}));

export const addressRelations = relations(address, ({one}) => ({
	customer: one(customers, {
		fields: [address.customerId],
		references: [customers.id]
	}),
}));

export const expensesRelations = relations(expenses, ({one}) => ({
	user: one(users, {
		fields: [expenses.createdBy],
		references: [users.id]
	}),
}));