import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MyFeeStatistics } from "../../pages/my-fees.page";

export default function MyFeesStatisticsCard() {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>My Fees</CardTitle>
                <CardDescription>Your school fee statistics</CardDescription>
            </CardHeader>
            <CardContent>
                <MyFeeStatistics />
            </CardContent>
        </Card>
    )
}