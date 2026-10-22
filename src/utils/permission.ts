import { EventType } from "../types/eventType";
import { Role, User } from "../types/userType";

const EVENT_CREATORS: Role[] = ["admin", "member"];

export const canCreateEvent = (role?: Role): boolean =>
  !!role && EVENT_CREATORS.includes(role);

export const canManageEvent = (user: User | null, event: EventType): boolean =>
  !!user && canCreateEvent(user.role) && event.organizerId === user.id;
