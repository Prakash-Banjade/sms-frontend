import { ArrowUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useState } from 'react';

type Props = {
    label: string;
    value: string | undefined;
}

enum Order {
    ASC = "ASC",
    DESC = "DESC",
}

export default function SortbyHeaderBtn({ value, label }: Props) {
    const { setSearchParams } = useCustomSearchParams();
    const [order, setOrder] = useState<Order | undefined>(Order.ASC);

    const cycleSortOrder = () => {
        setOrder(prevOrder => {
            if (prevOrder === Order.ASC) return Order.DESC;
            if (prevOrder === Order.DESC) return undefined;
            return Order.ASC;
        });
        setSearchParams("sortBy", value);
        setSearchParams("order", order);
    }

    return (
        <Button
            variant="ghost"
            onClick={cycleSortOrder}
            className='-ml-5'
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}