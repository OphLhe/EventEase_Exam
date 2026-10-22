export type CategoryId =
  | "music"
  | "sport"
  | "culture"
  | "solidarité"
  | "fêtes"
  | "réseaux professionnels";

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  categoryId: CategoryId;
  organizerId: string;
  participantIds: string[];
  volunteerIds: string[];
  volunteersNeeded: number;
  maxParticipants: number;
};

export type CategoryType = {
  id: CategoryId;
  label: string;
};

export type NewEventInput = Omit<
  EventType,
  "id" | "organizerId" | "participantIds" | "volunteerIds"
>;
