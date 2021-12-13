export interface Stream {
    uuid: string,
    title: string,
    event: string
}

export interface DatabaseStream {
    Stream_number: string,
    Title: string,
    Event_id: string
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
            uuid: e.Stream_number,
            event: e.Event_id
        }
    })
}