import { and, asc, eq, isNull, sql } from 'drizzle-orm'
import { db } from '../index'
import { organizationMembers } from '../schema/organizationMembers'
import type { UserType } from '../schema/users'
import { users } from '../schema/users'

export function getAllDoctors(orgId: string) {
  return db
    .select({
      id: users.supabaseId,
      fullname: sql`CONCAT_WS(' ', ${users.firstName}, ${users.middleName}, ${users.lastName})`,
    })
    .from(users)
    .innerJoin(organizationMembers, eq(organizationMembers.userId, users.id))
    .where(
      and(
        eq(organizationMembers.orgId, orgId),
        eq(organizationMembers.role, 'doctor'),
        isNull(organizationMembers.deletedAt),
        isNull(users.deletedAt),
      ),
    )
    .orderBy(asc(users.createdAt))
}

export function update(supabaseId: string, userInfo: UserType) {
  return db
    .update(users)
    .set({
      position: userInfo.position,
      email: userInfo.email,
      birthdate: userInfo.birthdate,
      licenseNumber: userInfo.licenseNumber,
      designationArea: userInfo.designationArea,
      updatedAt: sql`NOW()`,
    })
    .where(and(eq(users.supabaseId, supabaseId), isNull(users.deletedAt)))
}
