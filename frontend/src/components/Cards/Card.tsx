import React from 'react'
import { CardProps } from './CardUtils';

const Card: React.FC<CardProps> = props => {
    return (
        <div className={`card card-small ${props.class || ''}`}>
            {props.children}
        </div>
    )
};

export default Card;