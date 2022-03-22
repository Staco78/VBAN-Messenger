import { ChannelType, DbChannel } from "@/typings/channels";
import assert from "assert";
import db from "./db";

namespace channels {
    export function init() {
        db.init();
    }

    export function find(id: bigint): DbChannel | null {
        return db.find(id);
    }

    export function add(id: bigint, users: bigint[], isGroupChannel = false) {
        db.add({ id, users, type: isGroupChannel ? ChannelType.Group : ChannelType.DM });
    }

    export function getDM(id: bigint): DbChannel {
        let channel = db.find(id);
        if (!channel) {
            channel = { id, users: [], type: ChannelType.DM };
            db.add(channel);
        }
        assert(channel.type == ChannelType.DM);
        return channel;
    }
}

export default channels;
