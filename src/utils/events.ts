import { EventType } from "../types/eventType";

export const isRegistered = (event: EventType, userId?: string): boolean =>
  !!userId && event.participantIds.includes(userId);

export const isFull = (event: EventType): boolean =>
  event.participantIds.length >= event.maxParticipants;
