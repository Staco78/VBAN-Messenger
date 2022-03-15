import React from "react";
import css from "css/components/status.module.css";


export default function Status(props: any) {


    return <div className={css[props.status]+" "+css.status}>
    </div>;
}