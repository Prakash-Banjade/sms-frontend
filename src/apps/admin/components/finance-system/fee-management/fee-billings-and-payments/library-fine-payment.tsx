import { TFeeStudent } from "@/types/finance-system/fee-management.types";

type Props = {
    feeStudent: TFeeStudent['student'];
}

export default function LibraryFinePayment({ feeStudent }: Props) {
    return (
        <div>{feeStudent.name}</div>
    )
}