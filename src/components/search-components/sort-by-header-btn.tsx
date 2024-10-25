import { ArrowUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

type Props = {
    label: string;
    value: string | undefined;
}

export default function SortbyHeaderBtn({ value, label }: Props) {
    const { setSearchParams } = useCustomSearchParams();

    return (
        <Button
            variant="ghost"
            onClick={() => setSearchParams("sortBy", value)}
            className='-ml-5'
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}