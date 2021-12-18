import { RootState } from "../../store";

export const selectEventContext = (state: RootState) => state.event.event;
export const selectEventList = (state: RootState) => state.event.list;