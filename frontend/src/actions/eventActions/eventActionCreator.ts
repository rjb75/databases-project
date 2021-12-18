import { Event } from "../../models/Event";
import { EVENT_CONTEXT_RESET, EVENT_CONTEXT_SET, EVENT_LIST_SET } from "./eventTypes";

export const setEventContext = (event: Event) => ({
    type: EVENT_CONTEXT_SET,
    payload: event,
});

export const setEventList = (events: Array<Event>) => ({
    type: EVENT_LIST_SET,
    payload: events,
});

export const resetEventContext = () => ({
    type: EVENT_CONTEXT_RESET,
});