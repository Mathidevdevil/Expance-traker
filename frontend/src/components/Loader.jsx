import React from 'react';

const Loader = ({ className }) => {
    return (
        <img
            src="/logo.png"
            alt="Loading..."
            className={`animate-spin ${className}`}
        />
    );
};

export default Loader;
