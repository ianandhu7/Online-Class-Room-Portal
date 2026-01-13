import React from 'react';

const Card = ({ children, className = '', title, footer, onClick }) => {
    return (
        <div className={`card ${className}`} onClick={onClick}>
            {title && <div className="card-header"><h3>{title}</h3></div>}
            <div className="card-body">{children}</div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

export default Card;
