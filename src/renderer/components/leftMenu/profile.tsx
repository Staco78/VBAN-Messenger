import React from "react";
import css from "css/components/leftMenu/profile.module.css";
import Status from "@@/components/status";
import Server from "@/renderer/data/server";
import User from "@/renderer/data/user";
import ProfilePicture from "../profilePicture";

export default class Profile extends React.Component {
    declare readonly state: {
        username: string;
        status: number;
        commentary: string;
    };

    constructor(props: any) {
        super(props);
        this.state = { username: "", status: 0, commentary: "" };
    }
    componentDidMount() {
        this.getUserInfos();
    }

    render() {
        return (
            <div className={css.profileContainer}>
                <div className={css.profilePictureContainer}>
                    <ProfilePicture username={this.state.username} color="hsl(342, 54%, 45%)" />
                </div>
                <div className={css.profileTextsContainer}>
                    <div className={css.usernameContainer}>
                        <span className={css.usernameAt}>@</span>
                        {this.state.username}
                    </div>
                    <div title={this.state.commentary} className={css.userCommentary}>
                        {this.state.commentary}
                    </div>
                </div>
                <Status status={this.state.status} />
                <div></div>
            </div>
        );
    }
    getUserInfos() {
        Server.getCurrentUser().then((user: User) => {
            this.setState({
                username: user.name,
                status: 1,
                commentary: "Eh hop ! Factorio furtif",
            });
        });
    }
}
