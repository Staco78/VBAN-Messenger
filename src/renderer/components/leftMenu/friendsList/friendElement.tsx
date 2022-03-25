import React from "react";
import css from "css/components/leftMenu/friendsList/friendElement.module.css";
import Status from "../../status";
import ProfilePicture from "../../profilePicture";
import User from "@/renderer/data/user";

export default function FriendElement(props: { user: User }) {
    return (
        <div className={css.container}>
            <div className={css.profilePictureContainer}>
                <ProfilePicture username={props.user.name} color={props.user.color} />
            </div>
            <div className={css.profileTextsContainer}>
                <div className={css.usernameContainer}>
                    <span className={css.usernameAt}>@</span>
                    {props.user.name}
                </div>
                <div title={props.user.commentary} className={css.userCommentary}>
                    {props.user.commentary}
                </div>
            </div>
            <Status status={props.user.status} />
            <div></div>
        </div>
    );
}
