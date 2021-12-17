export interface Event {
    id: string,
    name: string
};

export interface DatabaseEvent {
    Id: string,
    Name: string
}

export function formatEvent(event: DatabaseEvent):Event {
    return {
        id: event.Id,
        name: event.Name
    }
}

export function formatEvents(events: DatabaseEvent[]):Event[] {
    return events.map((e) => {return {
        id: e.Id,
        name: e.Name
    }})
}