import React from "react";
import css from "css/components/profile-picture.module.css";


export default function ProfilePicture(props: {color: string, username:string,size?:string}) {
    return <div className={css.profilePictureContainer} style={{backgroundColor:props.color, width:(props.size ?? ""), height:(props.size ?? "")}}>
                <div className={css.textedProfilePicture}>
                {props.username.substring(0,1)}
                </div>
            </div>;
}