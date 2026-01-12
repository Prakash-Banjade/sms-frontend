import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Printer } from "lucide-react"
import { TeacherIdCard } from "./teacher-id-card"
import { useReactToPrint } from "react-to-print"
import { useRef } from "react"
import { TSingleTeacherDetail } from "@/apps/admin/types/teacher.type"

export default function TeacherIdCardContainer({ teacher }: { teacher: TSingleTeacherDetail }) {
    const idCardRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: idCardRef,
    });

    return (
        <div className="space-y-8">
            {/* ID Card Preview */}
            <Card className="p-8 bg-card/50 backdrop-blur-xs border-2">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <CardTitle>ID Card Preview</CardTitle>
                        <div className="flex gap-3">
                            <Button onClick={() => handlePrint()} className="no-print gap-2 bg-primary hover:bg-primary/90">
                                <Printer className="w-4 h-4" />
                                Print ID Card
                            </Button>
                        </div>
                    </div>

                    {/* Card Display */}
                    <div className="flex justify-center">
                        <TeacherIdCard ref={idCardRef} teacher={teacher} />
                    </div>
                </div>
            </Card>

            {/* Instructions */}
            <Card className="p-6 bg-muted/30 no-print">
                <h3 className="text-lg font-semibold text-foreground mb-3">Printing Instructions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">1.</span>
                        <span>Click the "Print ID Card" button to open the print dialog</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">2.</span>
                        <span>Set paper size to 3.375" × 2.125" (standard CR80 ID card size) or use appropriate card stock</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">3.</span>
                        <span>Ensure "Background graphics" is enabled in print settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">4.</span>
                        <span>For best results, use a professional ID card printer or print on card stock and laminate</span>
                    </li>
                </ul>
            </Card>
        </div>
    )
}
