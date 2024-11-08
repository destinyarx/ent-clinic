import { pgTable, foreignKey, bigserial, smallint, timestamp, bigint, text, check, date, varchar, integer, index, boolean, serial, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const saleProducts = pgTable("sale_products", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	salesId: smallint("sales_id").notNull(),
	productId: smallint("product_id").notNull(),
	quantity: smallint().notNull(),
	salePrice: smallint("sale_price").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
	return {
		saleProductsProductIdForeign: foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "sale_products_product_id_foreign"
		}),
		saleProductsSalesIdForeign: foreignKey({
			columns: [table.salesId],
			foreignColumns: [sales.id],
			name: "sale_products_sales_id_foreign"
		}),
	}
});

export const testing = pgTable("testing", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "testing_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text(),
	new_column: text(),
});

export const deliveries = pgTable("deliveries", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	customerId: smallint("customer_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	scheduleId: bigint("schedule_id", { mode: "number" }),
	createdBy: smallint("created_by").notNull(),
	targetDate: date("target_date"),
	nextDeliveryDate: date("next_delivery_date"),
	price: smallint(),
	totalQty: smallint("total_qty").notNull(),
	status: varchar({ length: 255 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	remarks: varchar({ length: 100 }),
}, (table) => {
	return {
		deliveriesCreatedByForeign: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "deliveries_created_by_foreign"
		}).onDelete("cascade"),
		deliveriesCustomerIdForeign: foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "deliveries_customer_id_foreign"
		}).onDelete("cascade"),
		deliveriesScheduleIdFkey: foreignKey({
			columns: [table.scheduleId],
			foreignColumns: [deliverySchedules.id],
			name: "deliveries_schedule_id_fkey"
		}),
		deliveriesStatusCheck: check("deliveries_status_check", sql`(status)::text = ANY (ARRAY[('0'::character varying)::text, ('1'::character varying)::text])`),
	}
});

export const deliveryHistory = pgTable("delivery_history", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	scheduleId: smallint("schedule_id").notNull(),
	status: varchar({ length: 10 }).notNull(),
	notes: varchar({ length: 35 }),
	createdBy: smallint("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	customerId: smallint("customer_id").notNull(),
}, (table) => {
	return {
		deliveryHistoryCreatedByForeign: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "delivery_history_created_by_foreign"
		}).onDelete("cascade"),
		deliveryHistoryCustomerIdForeign: foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "delivery_history_customer_id_foreign"
		}).onDelete("cascade"),
		deliveryHistoryScheduleIdForeign: foreignKey({
			columns: [table.scheduleId],
			foreignColumns: [deliverySchedules.id],
			name: "delivery_history_schedule_id_foreign"
		}).onDelete("cascade"),
	}
});

export const cacheLocks = pgTable("cache_locks", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	owner: varchar({ length: 255 }).notNull(),
	expiration: integer().notNull(),
});

export const jobBatches = pgTable("job_batches", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	totalJobs: integer("total_jobs").notNull(),
	pendingJobs: integer("pending_jobs").notNull(),
	failedJobs: integer("failed_jobs").notNull(),
	failedJobIds: text("failed_job_ids").notNull(),
	options: text(),
	cancelledAt: integer("cancelled_at"),
	createdAt: integer("created_at").notNull(),
	finishedAt: integer("finished_at"),
});

export const deliveryProducts = pgTable("delivery_products", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: varchar({ length: 50 }).notNull(),
	description: varchar({ length: 50 }).notNull(),
	productCode: varchar("product_code", { length: 20 }).notNull(),
	price: smallint().notNull(),
	qty: smallint().notNull(),
	unlimitedStock: boolean("unlimited_stock").notNull(),
	createdBy: smallint("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => {
	return {
		createdByIdx: index().using("btree", table.createdBy.asc().nullsLast()),
		deliveryProductsCreatedByForeign: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "delivery_products_created_by_foreign"
		}).onDelete("cascade"),
	}
});

export const deliverySchedules = pgTable("delivery_schedules", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	customerId: smallint("customer_id").notNull(),
	status: varchar({ length: 255 }).default('1').notNull(),
	notes: varchar({ length: 100 }),
	frequencyType: varchar("frequency_type", { length: 20 }).notNull(),
	createdBy: smallint("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	slimQty: smallint("slim_qty"),
	roundQty: smallint("round_qty"),
	exactDate: timestamp("exact_date", { mode: 'string' }),
}, (table) => {
	return {
		deliverySchedulesCreatedByForeign: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "delivery_schedules_created_by_foreign"
		}).onDelete("cascade"),
		deliverySchedulesCustomerIdForeign: foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "delivery_schedules_customer_id_foreign"
		}).onDelete("cascade"),
		deliverySchedulesStatusCheck: check("delivery_schedules_status_check", sql`(status)::text = ANY (ARRAY[('0'::character varying)::text, ('1'::character varying)::text])`),
	}
});

export const migrations = pgTable("migrations", {
	id: serial().primaryKey().notNull(),
	migration: varchar({ length: 255 }).notNull(),
	batch: integer().notNull(),
});

export const users = pgTable("users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
	password: varchar({ length: 255 }).notNull(),
	rememberToken: varchar("remember_token", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	email: varchar({ length: 50 }),
	socmedLink: varchar("socmed_link", { length: 100 }),
	contactNumber: smallint("contact_number"),
	isActivated: boolean("is_activated").default(false).notNull(),
}, (table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.username),
	}
});

export const sessions = pgTable("sessions", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	payload: text().notNull(),
	lastActivity: integer("last_activity").notNull(),
}, (table) => {
	return {
		lastActivityIdx: index().using("btree", table.lastActivity.asc().nullsLast()),
		userIdIdx: index().using("btree", table.userId.asc().nullsLast()),
	}
});

export const sales = pgTable("sales", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	customerId: smallint("customer_id"),
	deliverHistoryId: smallint("deliver_history_id"),
	createdBy: smallint("created_by").notNull(),
	total: smallint().notNull(),
	qty: smallint().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	customerName: varchar("customer_name", { length: 100 }),
	remarks: varchar({ length: 100 }),
}, (table) => {
	return {
		salesCreatedByForeign: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "sales_created_by_foreign"
		}).onDelete("cascade"),
		salesCustomerIdForeign: foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "sales_customer_id_foreign"
		}).onDelete("cascade"),
		salesDeliverHistoryIdForeign: foreignKey({
			columns: [table.deliverHistoryId],
			foreignColumns: [deliveryHistory.id],
			name: "sales_deliver_history_id_foreign"
		}).onDelete("cascade"),
	}
});

export const jobs = pgTable("jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	queue: varchar({ length: 255 }).notNull(),
	payload: text().notNull(),
	attempts: smallint().notNull(),
	reservedAt: integer("reserved_at"),
	availableAt: integer("available_at").notNull(),
	createdAt: integer("created_at").notNull(),
}, (table) => {
	return {
		queueIdx: index().using("btree", table.queue.asc().nullsLast()),
	}
});

export const address = pgTable("address", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	customerId: smallint("customer_id").notNull(),
	description: varchar({ length: 50 }),
	unitNumber: varchar("unit_number", { length: 35 }),
	street: varchar({ length: 35 }),
	barangay: varchar({ length: 35 }),
	municipality: varchar({ length: 35 }),
	province: varchar({ length: 35 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => {
	return {
		addressCustomerIdForeign: foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "address_customer_id_foreign"
		}).onDelete("cascade"),
	}
});

export const cache = pgTable("cache", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	value: text().notNull(),
	expiration: integer().notNull(),
});

export const customers = pgTable("customers", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 35 }).notNull(),
	cellphoneNumber: varchar("cellphone_number", { length: 13 }),
	email: varchar({ length: 75 }),
	messengerName: varchar("messenger_name", { length: 50 }),
	status: varchar({ length: 255 }).default('1').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdBy: bigint("created_by", { mode: "number" }),
}, (table) => {
	return {
		customersCreatedByFkey: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "customers_created_by_fkey"
		}),
		customersStatusCheck: check("customers_status_check", sql`(status)::text = ANY (ARRAY[('0'::character varying)::text, ('1'::character varying)::text])`),
	}
});

export const failedJobs = pgTable("failed_jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: varchar({ length: 255 }).notNull(),
	connection: text().notNull(),
	queue: text().notNull(),
	payload: text().notNull(),
	exception: text().notNull(),
	failedAt: timestamp("failed_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		failedJobsUuidUnique: unique("failed_jobs_uuid_unique").on(table.uuid),
	}
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
	email: varchar({ length: 255 }).primaryKey().notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
});

export const products = pgTable("products", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	description: varchar({ length: 50 }).notNull(),
	price: smallint().notNull(),
	qty: smallint().notNull(),
	createdBy: smallint("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	title: varchar({ length: 50 }),
	isDelivery: boolean("is_delivery").default(false),
	isUnlimitedStock: boolean("is_unlimited_stock").default(false),
}, (table) => {
	return {
		productsCreatedByForeign: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "products_created_by_foreign"
		}).onDelete("cascade"),
	}
});

export const expenses = pgTable("expenses", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	category: varchar({ length: 50 }).notNull(),
	expenseDate: date("expense_date").notNull(),
	description: varchar({ length: 100 }),
	createdBy: smallint("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	price: smallint(),
	categoryOther: text("category_other"),
}, (table) => {
	return {
		expenseDateIdx: index().using("btree", table.expenseDate.asc().nullsLast()),
		expensesCreatedByForeign: foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "expenses_created_by_foreign"
		}).onDelete("cascade"),
	}
});
