export interface DbMessage {
    id: bigint;
    channel: bigint;
    author: bigint;
    content: string;
    timestamp: number;
}
