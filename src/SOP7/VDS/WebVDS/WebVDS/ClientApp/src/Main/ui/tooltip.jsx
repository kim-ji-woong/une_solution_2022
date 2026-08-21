import React from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ show, children, top, left, className }) => {
    const portalTarget = document.getElementById("tooltip-area");
    
    if (!show) return null;
    return createPortal(<span className={`${className}`} style={{ top: `${top}` + 'px', left: `${left}` + 'px' }}>{children}</span>, portalTarget);
};

export default Portal;