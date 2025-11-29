import React from "react";  

const PageLayout = ({ className = "", ...props }) => { 
    return (
        <div className={`user-page ${className}`} {...props}>
            <h2>User Page</h2>
        </div>
    );
};
export default PageLayout;