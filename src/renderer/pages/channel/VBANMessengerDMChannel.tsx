import TopBar from "@/renderer/components/channel/topBar";
import Server from "@/renderer/data/server";
import User from "@/renderer/data/user";
import React from "react";
import { useParams } from "react-router-dom";

export default function VBAN_MessengerDMChannel() {
    let { userId } = useParams();
    if (!userId) return <div>Error : Wrong User ID</div>;
    return <VBANMessengerDMChannel userId={BigInt(userId ?? 0)} />;
}
class VBANMessengerDMChannel extends React.Component {
    declare readonly props: {
        userId: bigint;
    };
    declare readonly state: {
        user?: User;
    };
    constructor(props: { userId: bigint }) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.getUser();
    }
    componentDidUpdate(prevProps: { userId: bigint }) {
        if (prevProps != this.props) {
            this.getUser();
        }
    }
    render() {
        if (this.state.user) {
            return (
                <div>
                    <div>
                        <TopBar user={this.state.user} />
                    </div>
                    <div>{/*Messages History*/}</div>
                    <div>{/*Text Input*/}</div>
                </div>
            );
        } else {
            return <div />;
        }
    }
    async getUser() {
        switch (this.props.userId) {
            case 1n: {
                this.setState({
                    user: new User({
                        userComment: '"Je suce la vie" - Piripe, Décembre 2021',
                        id: 1n,
                        status: 1,
                        userName: "Piripe",
                        connectionInfos: {
                            address: "127.0.0.1",
                            port: 6980,
                        },
                        GPSPosition: "fr-FR",
                        applicationName: "VBAN-Messenger",
                        bitFeature: 0,
                        bitFeatureExt: 0,
                        bitType: 0,
                        deviceName: "Computer",
                        isVBAN_M_User: true,
                        langCode: "fr-FR",
                        manufacturerName: "Yo",
                        maxRate: 0,
                        minRate: 0,
                        preferedRate: 0,
                        userPosition: "",
                        version: 0,
                    }),
                });
                break;
            }
            case 2n: {
                this.setState({
                    user: new User({
                        userComment: "Don't panic i'm just overclocked ಠ ᴥ ಠ",
                        id: 2n,
                        status: 2,
                        userName: "enzomtp",
                        connectionInfos: {
                            address: "127.0.0.1",
                            port: 6980,
                        },
                        GPSPosition: "fr-FR",
                        applicationName: "VBAN-Messenger",
                        bitFeature: 0,
                        bitFeatureExt: 0,
                        bitType: 0,
                        deviceName: "Computer",
                        isVBAN_M_User: true,
                        langCode: "fr-FR",
                        manufacturerName: "Yo",
                        maxRate: 0,
                        minRate: 0,
                        preferedRate: 0,
                        userPosition: "",
                        version: 0,
                    }),
                });
                break;
            }
            case 3n: {
                this.setState({
                    user: new User({
                        userComment: '"Je suis tellement hétéro que si j\'étais une fille, je serais lesbienne."',
                        id: 3n,
                        status: 3,
                        userName: "Vincent",
                        connectionInfos: {
                            address: "127.0.0.1",
                            port: 6980,
                        },
                        GPSPosition: "fr-FR",
                        applicationName: "VBAN-Messenger",
                        bitFeature: 0,
                        bitFeatureExt: 0,
                        bitType: 0,
                        deviceName: "Computer",
                        isVBAN_M_User: true,
                        langCode: "fr-FR",
                        manufacturerName: "Yo",
                        maxRate: 0,
                        minRate: 0,
                        preferedRate: 0,
                        userPosition: "",
                        version: 0,
                    }),
                });
                break;
            }
        }
    }
}
