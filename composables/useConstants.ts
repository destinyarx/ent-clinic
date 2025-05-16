export const useConstants = () => {
    const visitTypes = () => {
        return [
            { value: "admit", name: "Admit", description: "Inpatient admission for ENT care." },
            { value: "emergency", name: "Emergency", description: "Immediate care for acute ENT issues." },
            { value: "appointment", name: "Appointment", description: "Scheduled visit for consultation or checkup." },
            { value: "follow_up", name: "Follow-up", description: "Return visit after previous consultation or surgery." },
            { value: "walk_in", name: "Walk-in", description: "Unscheduled visit for minor ENT concerns." },
            { value: "referral", name: "Referral", description: "Patient referred by another provider." },
            { value: "teleconsult", name: "Teleconsult", description: "Remote consultation for ENT evaluation." },
            { value: "surgical_case", name: "Surgical Case", description: "Pre-op or post-op surgical evaluation." },
            { value: "diagnostic", name: "Diagnostic", description: "Visit for ENT tests like audiometry or scope." },
            { value: "screening", name: "Screening", description: "Routine hearing or throat health check." },
            { value: "preventive", name: "Preventive", description: "ENT advice for prevention and wellness." }
          ];
    };

    const allergies = () => {
        return [
            'Peanuts', 
            'Shellfish', 
            'Dust', 
            'Pollen', 
            'Penicillin', 
            'Eggs', 
            'Milk', 
            'Soy', 
            'Wheat', 
            'Latex', 
            'Mold', 
            'Bee stings'
        ];
    }

    return { visitTypes, allergies }
}