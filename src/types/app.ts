export interface UserData {
  initialWeight: number | null;
  currentWeight: number | null;
  streak: number;
  lastCheckIn: string | null;
  weightHistory: WeightEntry[];
  routineChecks: RoutineCheck[];
  name: string;
  startDate: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface RoutineCheck {
  id: string;
  label: string;
  completed: boolean;
}

export const defaultRoutineItems: Omit<RoutineCheck, 'completed'>[] = [
  { id: 'water', label: 'Beber 2L de água' },
  { id: 'method', label: 'Seguir o método' },
  { id: 'sleep', label: 'Dormir bem (7-8h)' },
  { id: 'walk', label: 'Caminhar 20 min' },
  { id: 'avoid', label: 'Evitar exageros' },
];
