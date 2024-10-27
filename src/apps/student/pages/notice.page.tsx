
import { Button } from "@/components/ui/button";
import { useNotices } from "../components/notice/action"
import NoticeCard from "../components/notice/notice-card"
import React from "react";


const NoticePage = () => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useNotices({});

    if (isLoading) return <div>Loading....</div>
    if (!data) return <div className="text-muted-foreground text-lg  h-[50vh] text-center flex items-center justify-center">
        No Notice available
    </div>
    return (
        <div className="flex flex-col gap-3 p-4 m-auto">
            <h2 className="text-2xl font-bold">School Notice Board</h2>
            <p>Stay updated with the latest announcements and events</p>
            {data.pages.map((group, i) => (
                <React.Fragment key={i}>
                    <NoticeCard notices={group.data} />
                </React.Fragment>
            ))}


            <div className="flex items-center justify-center">
                <Button
                    variant={'secondary'}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                >
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}
                </Button>
            </div>
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>

        </div>
    )
}

export default NoticePage
