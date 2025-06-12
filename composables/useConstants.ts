export const useConstants = () => {
    const visitTypes = [
        { value: "admit",         name: "Admit",        color: "bg-green-400",    description: "Inpatient admission for ENT care." },
        { value: "emergency",     name: "Emergency",    color: "bg-red-400",      description: "Immediate care for acute ENT issues." },
        { value: "appointment",   name: "Appointment",  color: "bg-blue-400",     description: "Scheduled visit for consultation or checkup." },
        { value: "follow_up",     name: "Follow-up",    color: "bg-orange-400",   description: "Return visit after previous consultation or surgery." },
        { value: "walk_in",       name: "Walk-in",      color: "bg-teal-400",     description: "Unscheduled visit for minor ENT concerns." },
        { value: "referral",      name: "Referral",     color: "bg-purple-400",   description: "Patient referred by another provider." },
        { value: "teleconsult",   name: "Teleconsult",  color: "bg-cyan-400",     description: "Remote consultation for ENT evaluation." },
        { value: "surgical_case", name: "Surgical Case",color: "bg-brown-400",    description: "Pre-op or post-op surgical evaluation." },
        { value: "diagnostic",    name: "Diagnostic",   color: "bg-gray-400",     description: "Visit for ENT tests like audiometry or scope." },
        { value: "screening",     name: "Screening",    color: "bg-lime-400",     description: "Routine hearing or throat health check." },
        { value: "preventive",    name: "Preventive",   color: "bg-olive-400",    description: "ENT advice for prevention and wellness." }
    ];

    const anatomicalCategories = [
        { value: 'eye', name: 'Eye', icon: '' },
        { value: 'ear', name: 'Ear', icon: '' },
        { value: 'nose', name: 'Nose', icon: '' },
        { value: 'throat', name: 'Throat', icon: '' },
        { value: 'mixed', name: 'Mixed', icon: '' }
    ]
      
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

    return { visitTypes, anatomicalCategories, allergies }
}