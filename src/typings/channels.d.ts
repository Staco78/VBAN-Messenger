export const enum ChannelType {
    DM = 0,
    Group = 1,
}

export interface DbChannel {
    id: bigint;
    users: bigint[];
    type: ChannelType;
}
