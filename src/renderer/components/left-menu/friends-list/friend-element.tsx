import React from "react";
import css from "css/components/left-menu/friends-list/friend-element.module.css"
import Status from "../../status";
import ProfilePicture from "../../profile-picture";

export default function FriendElement(props: {user: {
    address: string;
    color: string;
    commentary: string;
    id: bigint;
    port: number;
    status: number;
    username: string;
}}) {
    return <div className={css.container}>
    <div className={css.profilePictureContainer}>
        <ProfilePicture username={props.user.username} color={props.user.color} />
    </div>
    <div className={css.profileTextsContainer}>
        <div className={css.usernameContainer}>
            <span className={css.usernameAt}>@</span>
            {props.user.username}
        </div>
        <div title={props.user.commentary} className={css.userCommentary}>
        {props.user.commentary}
        </div>
    </div>
    <Status status={props.user.status} />
    <div></div>
    </div>;
}
