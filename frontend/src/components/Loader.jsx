import React from 'react';

export default function Loader() {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Our AI is analyzing your profile... This may take a moment.</p>
        </div>
    );
}