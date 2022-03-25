import React from "react";
import css from "css/components/profilePicture.module.css";

export default function ProfilePicture(props: { color: string; username: string; size?: string }) {
    return (
        <div
            className={css.profilePictureContainer}
            style={{
                backgroundColor: props.color,
                width: props.size ?? "",
                height: props.size ?? "",
            }}>
            <div
                className={css.textedProfilePicture}
                style={{
                    fontSize: `calc(${props.size ?? "48px"} * 0.6)`,
                }}>
                {props.username.substring(0, 1)}
            </div>
        </div>
    );
}
