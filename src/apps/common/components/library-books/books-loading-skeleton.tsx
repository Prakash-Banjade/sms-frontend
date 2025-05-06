import React from "react";

export default function BookSkeleton() {
    // Determine a random height for the skeleton to create visual variety
    const randomHeight = React.useMemo(() => {
        return Math.floor(Math.random() * (280 - 180) + 180);
    }, []);

    return (
        <div className="flex animate-pulse flex-col overflow-hidden rounded-lg bg-white shadow">
            <div
                className="bg-slate-200"
                style={{
                    height: `${randomHeight}px`,
                }}
            />
            <div className="p-4">
                <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mb-4 h-3 w-1/2 rounded bg-slate-200" />
                <div className="mb-2 h-4 w-full rounded bg-slate-100" />
                <div className="mb-2 h-4 w-full rounded bg-slate-100" />
                <div className="mb-4 h-4 w-2/3 rounded bg-slate-100" />
                <div className="mt-2 flex gap-2">
                    <div className="h-3 w-12 rounded bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
            </div>
        </div>
    );
};