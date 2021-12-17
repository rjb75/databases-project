import { Event } from "../../models/Event";
import { EVENT_CONTEXT_RESET, EVENT_CONTEXT_SET } from "./eventTypes";

export const setEventContext = (event: Event) => ({
    type: EVENT_CONTEXT_SET,
    payload: event,
});

export const resetEventContext = () => ({
    type: EVENT_CONTEXT_RESET,
});