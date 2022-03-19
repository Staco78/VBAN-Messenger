import React from "react";
import css from "css/components/left-menu/profile.module.css";
import Status from "@@/components/status";
import Server from "@/renderer/data/server";
import User from "@/renderer/data/user";
import ProfilePicture from "../profile-picture";


export default class Profile extends React.Component {
declare readonly state: {username: string, status: number, commentary: string}

constructor(props: any) {
    super(props);
    this.state = {username: "", status:0, commentary:""}
    this.getUserInfos();
}

render() {
    return <div className={css.profileContainer}>
        <div className={css.profilePictureContainer}>
            <ProfilePicture username={this.state.username} color="#ac5670"/>
        </div>
        <div className={css.profileTextsContainer}>
            <div className={css.usernameContainer}>
                <span className={css.usernameAt}>@</span>{this.state.username}
            </div>
            <div title={this.state.commentary} className={css.userCommentary}>
                {this.state.commentary}
            </div>
        </div>
        <Status status={this.state.status}/>
        <div>

        </div>
    </div>;
}
getUserInfos() {
  Server.getCurrentUser().then((user:User) => {
    this.setState({username:user.name,status:1,commentary:"Wesh ma gueule, bien ou quoi le sang ?"});
  });
}
}