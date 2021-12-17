import { Stream } from "./StreamUtils"

export interface DatabaseSession {
    Session_number: string,
    Location: string,
    Start_time: string,
    Duration_minutes: number,
    Description: string,
    Title: string
}

export interface Session {
    uuid: string,
    location: string,
    start: string,
    duration: number,
    description: string,
    title: string
}

export interface SessionsProps {
    sessions: Session[]
}

export interface SessionProps {
    session: Session
}

export function formatSessions(data: DatabaseSession[]): Session[] {
    if(data !== null) {
        return data.map(e => {
            return {
                uuid: e.Session_number,
                location: e.Location,
                start: e.Start_time,
                duration: e.Duration_minutes,
                description: e.Description,
                title: e.Title
            }
        })
    } else {
        return []
    } 
}