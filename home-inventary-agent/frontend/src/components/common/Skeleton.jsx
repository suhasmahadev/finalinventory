import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={clsx("animate-pulse rounded-md bg-brown-900/10", className)}
            {...props}
        />
    );
};

export { Skeleton };
