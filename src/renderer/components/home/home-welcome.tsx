import React from "react";
import css from "css/components/home/home-welcome.module.css";
import Status from "@@/components/status";
import Server from "@/renderer/data/server";
import User from "@/renderer/data/user";
import ProfilePicture from "../profile-picture";

export default class HomeWelcome extends React.Component {
    declare readonly state: {
        username: string;
    };

    constructor(props: any) {
        super(props);
        this.state = { username: "" };
    }
    componentDidMount() {
        this.getUserInfos();
    }

    render() {
        return (
            <div className={css.welcomeContainer}>
                <div className={css.profilePictureContainer}>
                    <ProfilePicture username={this.state.username} color="hsl(342, 54%, 45%)" size="96px" />
                </div>
                <div className={css.welcomeTextsContainer}>
                    <div className={css.welcomeTextContainer}>Welcome</div>
                    <div className={css.usernameContainer}>{this.state.username}</div>
                </div>
            </div>
        );
    }
    getUserInfos() {
        Server.getCurrentUser().then((user: User) => {
            this.setState({
                username: user.name,
            });
        });
    }
}
