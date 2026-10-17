export type MeditationStatus = "draft" | "published";

export interface WeeklyMeditation {
  id: string;
  title: string;
  greeting?: string;
  scripture_reference: string;
  scripture_text: string;
  declaration: string;
  week_date?: string;
  status: MeditationStatus;
  is_active: boolean;
  author_id?: string | null;
  created_at: string;
  updated_at: string;
}
