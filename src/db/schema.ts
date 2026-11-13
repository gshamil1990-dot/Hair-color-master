import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const hairPassports = pgTable('hair_passports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  clientName: text('client_name').notNull(),
  hairType: text('hair_type').notNull(),
  hairConcern: text('hair_concern').notNull(),
  hairLength: text('hair_length').notNull(),
  salonRitual: text('salon_ritual').notNull(),
  careName: text('care_name').notNull(),
  shampoo: text('shampoo').notNull(),
  treatmentMask: text('treatment_mask').notNull(),
  leaveInCare: text('leave_in_care').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const bookingRequests = pgTable('booking_requests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  serviceTitle: text('service_title').notNull(),
  serviceCategory: text('service_category').notNull(),
  servicePrice: text('service_price').notNull(),
  wearTime: text('wear_time'),
  contactChannel: text('contact_channel').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  hairPassports: many(hairPassports),
  bookingRequests: many(bookingRequests),
}));

export const hairPassportsRelations = relations(hairPassports, ({ one }) => ({
  user: one(users, {
    fields: [hairPassports.userId],
    references: [users.id],
  }),
}));

export const bookingRequestsRelations = relations(bookingRequests, ({ one }) => ({
  user: one(users, {
    fields: [bookingRequests.userId],
    references: [users.id],
  }),
}));
