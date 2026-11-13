import { db } from './index.ts';
import { users, hairPassports, bookingRequests } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string | null) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to upsert user:', error);
    throw new Error('Failed to synchronize user profile.', { cause: error });
  }
}

export async function getUserHairPassports(uid: string) {
  try {
    const rows = await db
      .select({
        id: hairPassports.id,
        clientName: hairPassports.clientName,
        hairType: hairPassports.hairType,
        hairConcern: hairPassports.hairConcern,
        hairLength: hairPassports.hairLength,
        salonRitual: hairPassports.salonRitual,
        careName: hairPassports.careName,
        shampoo: hairPassports.shampoo,
        treatmentMask: hairPassports.treatmentMask,
        leaveInCare: hairPassports.leaveInCare,
        createdAt: hairPassports.createdAt,
      })
      .from(hairPassports)
      .innerJoin(users, eq(hairPassports.userId, users.id))
      .where(eq(users.uid, uid))
      .orderBy(desc(hairPassports.createdAt))
      .limit(10);

    return rows;
  } catch (error) {
    console.error('Failed to query hair passports:', error);
    throw new Error('Could not load saved hair passports.', { cause: error });
  }
}

export interface SaveHairPassportInput {
  clientName: string;
  hairType: string;
  hairConcern: string;
  hairLength: string;
  salonRitual: string;
  careName: string;
  shampoo: string;
  treatmentMask: string;
  leaveInCare: string;
}

export async function saveUserHairPassport(
  uid: string,
  email: string,
  displayName: string | null | undefined,
  input: SaveHairPassportInput
) {
  try {
    const userRecord = await getOrCreateUser(uid, email, displayName);
    const inserted = await db
      .insert(hairPassports)
      .values({
        userId: userRecord.id,
        clientName: input.clientName,
        hairType: input.hairType,
        hairConcern: input.hairConcern,
        hairLength: input.hairLength,
        salonRitual: input.salonRitual,
        careName: input.careName,
        shampoo: input.shampoo,
        treatmentMask: input.treatmentMask,
        leaveInCare: input.leaveInCare,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to save hair passport:', error);
    throw new Error('Could not save hair passport.', { cause: error });
  }
}

export async function getUserBookingRequests(uid: string) {
  try {
    const rows = await db
      .select({
        id: bookingRequests.id,
        serviceTitle: bookingRequests.serviceTitle,
        serviceCategory: bookingRequests.serviceCategory,
        servicePrice: bookingRequests.servicePrice,
        wearTime: bookingRequests.wearTime,
        contactChannel: bookingRequests.contactChannel,
        createdAt: bookingRequests.createdAt,
      })
      .from(bookingRequests)
      .innerJoin(users, eq(bookingRequests.userId, users.id))
      .where(eq(users.uid, uid))
      .orderBy(desc(bookingRequests.createdAt))
      .limit(20);

    return rows;
  } catch (error) {
    console.error('Failed to query booking history:', error);
    throw new Error('Could not load booking history.', { cause: error });
  }
}

export interface SaveBookingRequestInput {
  serviceTitle: string;
  serviceCategory: string;
  servicePrice: string;
  wearTime?: string | null;
  contactChannel: string;
}

export async function saveUserBookingRequest(
  uid: string,
  email: string,
  displayName: string | null | undefined,
  input: SaveBookingRequestInput
) {
  try {
    const userRecord = await getOrCreateUser(uid, email, displayName);
    const inserted = await db
      .insert(bookingRequests)
      .values({
        userId: userRecord.id,
        serviceTitle: input.serviceTitle,
        serviceCategory: input.serviceCategory,
        servicePrice: input.servicePrice,
        wearTime: input.wearTime || null,
        contactChannel: input.contactChannel,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to save booking request:', error);
    throw new Error('Could not save booking request.', { cause: error });
  }
}
