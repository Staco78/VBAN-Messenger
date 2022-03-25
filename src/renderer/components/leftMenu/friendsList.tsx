import React from "react";
import css from "css/components/leftMenu/friendsList.module.css";
import FriendElement from "./friendsList/friendElement";
import Server from "@/renderer/data/server";
import User from "@/renderer/data/user";
import { Link } from "react-router-dom";

export default class FriendsList extends React.Component {
    declare readonly state: {
        users: User[];
    };

    constructor(props: any) {
        super(props);
        this.state = { users: [] };
    }
    componentDidMount() {
        this.getUsers();
    }

    render() {
        return (
            <div className={css.friendsListContainer}>
                {this.state.users.map(user => (
                    <Link to={`/channel/user/${user.id.toString()}`} key={user.id.toString()}><FriendElement user={user} /></Link>
                ))}
            </div>
        );
    }
    getUsers() {
        this.setState({
            users: [
                {
                    address: "127.0.0.1",
                    color: `hsl(${Math.random() * 360}, 54%, 45%)`,
                    commentary: '"Je suce la vie" - Piripe, Décembre 2021',
                    id: 1,
                    port: 1,
                    status: 1,
                    name: "Piripe",
                },
                {
                    address: "127.0.0.1",
                    color: `hsl(${Math.random() * 360}, 54%, 45%)`,
                    commentary: "Don't panic i'm just overclocked ಠ ᴥ ಠ",
                    id: 2,
                    port: 2,
                    status: 2,
                    name: "enzomtp",
                },
                {
                    address: "127.0.0.1",
                    color: `hsl(${Math.random() * 360}, 54%, 45%)`,
                    commentary: '"Je suis tellement hétéro que si j\'étais une fille, je serais lesbienne."',
                    id: 3,
                    port: 3,
                    status: 3,
                    name: "Vincent",
                },
            ],
        });
        // Server.getAllUsers().then(users => {
        //     console.log(users);
        //     this.setState({users});
        // })
    }
}
