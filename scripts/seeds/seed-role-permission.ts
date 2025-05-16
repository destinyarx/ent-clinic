// scripts/seeds/index.ts
import 'dotenv/config'; 
import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';

import { permissions }  from '@/src/db/schema/permissions';
import { rolePermissions } from '@/src/db/schema/rolePermissions';

async function main() {
    const db = drizzle(process.env.DATABASE_URL!);
    
    const schema = {
        permissions,
        rolePermissions,
    };

    await seed(db, schema)
        .refine((f) => ({
        permissions: {
            count: 6,
            columns: {
                name: f.valuesFromArray({
                    values: [
                        'viewAllPatient',
                        'managePatientInfo',
                        'manageAppointments',
                        'manageVitals',
                        'manageQueue',
                        'manageDiagnosis',
                    ],
                }),
                description: f.valuesFromArray({
                    values: [
                        'View all registered patients in the system',
                        'View, add, modify, and delete patient records including personal and medical info',
                        'Create, view, update, or cancel patient appointments',
                        'Record and monitor vital signs such as blood pressure, temperature, and pulse',
                        'Manage the patient queue for consultations and procedures',
                        'Add and manage medical diagnoses, including notes and ICD-10 classification',   
                    ],
                }),
            },
        },
        rolePermissions: {
            count: 7,
            columns: {
                role: f.valuesFromArray({
                    values: [
                    'attendant',
                    'attendant',
                    'attendant',
                    'attendant',
                    'attendant',

                    'doctor',
                    'doctor',
                    ],
                }),
                permissionId: f.valuesFromArray({
                    values: [
                        // attendant permission (permissions.id)
                        1,
                        2,
                        3,
                        4,
                        5,

                        // doctors permission
                        4,
                        6,
                    ],
                }),
            },
        },
        }));
}

main().catch(console.error);
