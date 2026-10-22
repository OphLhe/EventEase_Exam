import { createContext, ReactNode, useEffect, useState } from "react";
import { EventType, NewEventInput } from "../types/eventType";
import { seedEvents } from "../storage/seed";
import { getJSON, setJSON } from "../storage/storage";
import { STORAGE_KEYS } from "../storage/storageKeys";
import { useAuth } from "../hooks/useAuth";
import { canCreateEvent, canManageEvent } from "../utils/permission";
import { isFull } from "../utils/events";
import { Text } from "react-native";

type EventsContextValue = {
  events: EventType[];
  isLoading: boolean;
  createEvent: (input: NewEventInput) => Promise<boolean>;
  updateEvent: (id: string, input: NewEventInput) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  toggleRegistered: (eventId: string) => Promise<boolean>;
};

export const EventsContext = createContext<EventsContextValue | undefined>(
  undefined,
);

const EventsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const init = async () => {
    try {
      await seedEvents();
      const stored = (await getJSON<EventType[]>(STORAGE_KEYS.EVENTS)) ?? [];
      setEvents(stored);
    } catch (error) {
      console.error("Erreur de chargement des évènements", error);
    } finally {
      setIsLoading(false);
    }
  };

  const persist = async (updated: EventType[]) => {
    setEvents(updated);
    await setJSON(STORAGE_KEYS.EVENTS, updated);
  };

  const createEvent = async (input: NewEventInput) => {
    if (!user || !canCreateEvent(user.role)) return false;

    const newEvent: EventType = {
      ...input,
      title: input.title.trim(),
      id: `e${Date.now()}`,
      organizerId: user.id,
      participantIds: [],
      volunteerIds: [],
    };
    await persist([...events, newEvent]);
    return true;
  };

  const updateEvent = async (id: string, input: NewEventInput) => {
    const target = events.find((e) => e.id === id);
    if (!target || !canManageEvent(user, target)) return false;
    if (input.maxParticipants < target.participantIds.length) return false;

    const updated = events.map((e) =>
      e.id === id ? { ...e, ...input, title: input.title.trim() } : e,
    );
    await persist(updated);
    return true;
  };

  const deleteEvent = async (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target || !canManageEvent(user, target)) return false;
    await persist(events.filter((e) => e.id !== id));
    return true;
  };

  useEffect(() => {
    init();
  }, []);

  const toggleRegistered = async (eventId: string) => {
    if (!user) return false;

    const target = events.find((e) => e.id === eventId);
    if (!target) return false;

    const already = target.participantIds.includes(user.id);
    if (!already && isFull(target)) return false;

    const updated = events.map((e) =>
      e.id !== eventId
        ? e
        : {
            ...e,
            participantIds: already
              ? e.participantIds.filter((id) => id !== user.id)
              : [...e.participantIds, user.id],
          },
    );
    await persist(updated);
    return true;
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        createEvent,
        updateEvent,
        deleteEvent,
        toggleRegistered,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export default EventsProvider;
