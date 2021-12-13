import React from 'react'
import { CardProps } from './CardUtils';
import './Card.scss'

const Card: React.FC<CardProps> = props => {
    return (
        <div className={`card card-${props.size || 'small'} ${props.class || ''}`} key={props.key || ''} >
            {props.children}
        </div>
    )
};

export default Card;