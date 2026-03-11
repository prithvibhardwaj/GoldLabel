export interface MedicationRecord {
  id: string;
  name: string;
  dosage: {
    amount: number;
    unit: string;
  };
  timing: {
    morning: boolean;
    noon: boolean;
    night: boolean;
  };
  withFood: boolean | null; // null = no instruction, true = with food, false = without food
  instructions: string;
  scannedAt: Date;
  imageUrl?: string;
}

export interface DosageStatus {
  medicationId: string;
  time: 'morning' | 'noon' | 'night';
  taken: boolean;
  scheduledTime: string;
}
