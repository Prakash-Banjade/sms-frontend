import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

type Props = {
    refetch: () => void;
    isRefetching: boolean;
    onRefetch?: () => void;
}

export default function RefreshBtn({ isRefetching, refetch, onRefetch }: Props) {

    return (
        <Button
            onClick={() => {
                refetch()
                onRefetch?.()
            }}
            type="button"
            size={'sm'}
            variant={'outline'}
            disabled={isRefetching}
            className="w-fit"
        >

            <RefreshCcw className={cn(isRefetching && 'animate-spin')} />
            Refresh
        </Button>
    )
}