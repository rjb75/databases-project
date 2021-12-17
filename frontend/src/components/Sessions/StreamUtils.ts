import { DatabaseSession, formatSessions, Session } from "./SessionUtils"


export interface Stream {
    uuid: string,
    title: string,
    sessions: Session[]
}

export interface DatabaseStream {
    Stream_id: string,
    Title: string,
    Sessions: DatabaseSession[]
}


export interface StreamsProps {
    streams: Stream[]
}

export interface StreamProps {
    stream: Stream
}

export function formatStreams(data: DatabaseStream[]): Stream[] {
    return data.map(e => {
        return {
            title: e.Title,
            uuid: e.Stream_id,
            sessions: formatSessions(e.Sessions)
        }
    })
}