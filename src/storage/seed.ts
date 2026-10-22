import users from "../data/user.json";
import events from "../data/events.json";
import { EventType } from "../types/eventType";
import { User } from "../types/userType";
import { getJSON, setJSON } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export async function seedUsers(): Promise<void> {
  const existingUser = await getJSON<User[]>(STORAGE_KEYS.USERS);
  if (existingUser === null) {
    await setJSON(STORAGE_KEYS.USERS, users as User[]);
  }
}

export async function seedEvents(): Promise<void> {
  const existingEvent = await getJSON<EventType[]>(STORAGE_KEYS.EVENTS);
  if (existingEvent === null) {
    await setJSON(STORAGE_KEYS.EVENTS, events as unknown as EventType[]);
  }
}
