import React from "react"
import { NavLink } from "react-router-dom"

export default function Greeting(props){
    return(
        <>
            <div className='greeting'>
                <img src={props.greetingTextSrc} alt={props.greetingTextAlt} id="greetingTextImg"/>
                <h3>{props.greetingText}</h3>
                <img src={props.greetingFriesSrc} alt={props.greetingFriesAlt} id="greetingFriesImg"/>
                <NavLink to={props.greetingTo}><button>{props.greetingBtn}</button></NavLink>
            </div>

        </>
    )
}
