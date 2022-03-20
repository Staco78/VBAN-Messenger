import React from "react";
import { useParams } from "react-router-dom";

export default function VBAN_MessengerDMChannel() {
    let { userId } = useParams();

    return <div>[Channel : {userId}]</div>;
}
