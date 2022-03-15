import React from "react";
import css from "css/components/left-menu/profile.module.css";
import Status from "@@/components/status";


export default function Profile(props: any) {


    return <div className={css.profileContainer}>
        <div className={css.profilePictureContainer}>
            {/*Profile Picture*/}
        </div>
        <div className={css.profileTextsContainer}>
            <div className={css.usernameContainer}>
                <span className={css.usernameAt}>@</span>Piripe
            </div>
            <div className={css.userCommentary}>
                Je vais super bien en sah
            </div>
        </div>
        <Status status="online"/>
        <div>

        </div>
    </div>;
}