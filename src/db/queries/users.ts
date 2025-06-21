import { asc, and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../index';

import type { UserType } from '../schema/users';
import { users } from '../schema/users';

export async function getAllDoctors() {
    return await db
    .select({
      id: users.supabaseId,
      fullname: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`,
    })
    .from(users)
    .where(
      and(
        // eq(users.role, 'doctor'), 
        isNull(users.deletedAt)
      )
    )
    .orderBy(asc(users.createdAt));
}

export function update(userInfo: UserType) {
  return db
        .update(users)
        .set({ 
            role: userInfo.role,
            position: userInfo.position,
            email: userInfo.email,
            birthdate: userInfo.birthdate,
            licenseNumber: userInfo.licenseNumber,
            designationArea: userInfo.designationArea
        })
        .where(eq(users.supabaseId, userInfo.id));
}