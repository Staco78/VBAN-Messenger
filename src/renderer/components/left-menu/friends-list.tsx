import React from "react";
import css from "css/components/left-menu/friends-list.module.css";
import FriendElement from "./friends-list/friend-element";

export default class FriendsList extends React.Component {
    declare readonly state: {
        users: {
            address: string;
            color: string;
            commentary: string;
            id: bigint;
            port: number;
            status: number;
            username: string;
        }[];
    };

    constructor(props: any) {
        super(props);
        this.state = { users: [] };
    }
    componentDidMount() {
        this.getUsers();
    }

    render() {
        return <div className={css.friendsListContainer}>
            {
                this.state.users.map(user => <FriendElement key={user.id.toString()} user={user}/>)
            }
        </div>;
    }
    getUsers() {
        this.setState({
            users: [
                {
                    address: "127.0.0.1",
                    color: `hsl(${Math.random() * 360}, 54%, 45%)`,
                    commentary: "\"Je suce la vie\" - Piripe, Décembre 2021",
                    id: 1,
                    port: 1,
                    status: 1,
                    username: "Piripe",
                },
                {
                    address: "127.0.0.1",
                    color: `hsl(${Math.random() * 360}, 54%, 45%)`,
                    commentary: "Don't panic i'm just overclocked ಠ ᴥ ಠ",
                    id: 2,
                    port: 2,
                    status: 2,
                    username: "enzomtp",
                },
                {
                    address: "127.0.0.1",
                    color: `hsl(${Math.random() * 360}, 54%, 45%)`,
                    commentary: "\"Je suis tellement hétéro que si j'étais une fille, je serais lesbienne.\"",
                    id: 3,
                    port: 3,
                    status: 3,
                    username: "Vincent",
                },
            ],
        });
    }
}
