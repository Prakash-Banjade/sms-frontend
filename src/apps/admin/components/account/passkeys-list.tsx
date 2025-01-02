import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TooltipWrapper } from "@/components/ui/tooltip"
import { KeyRound, Pencil, Trash2 } from "lucide-react"
import React from "react"

const devices = [
    {
        id: "1",
        name: "Predator Laptop",
        addedDate: "Sep 29, 2024",
        lastUsed: "Sep 29, 2024"
    },
    {
        id: "2",
        name: "Right Thumb",
        addedDate: "Sep 29, 2024",
        lastUsed: "last week",
    }
]

export default function PassKeysList() {
    return (
        <div className="space-y-px mt-6 border rounded-md overflow-hidden">
            {devices.map((device, ind) => (
                <React.Fragment key={device.id}>
                    <div className="flex items-center justify-between p-4 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <KeyRound className="size-6" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium ">
                                        {device.name}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    Added on {device.addedDate} | Last used {device.lastUsed}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <TooltipWrapper label="Edit passkey nickname" contentClassName="text-xs font-medium">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    <Pencil />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </TooltipWrapper>
                            <TooltipWrapper label="Remove this passkey" contentClassName="text-xs font-medium">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                >
                                    <Trash2 />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </TooltipWrapper>
                        </div>
                    </div>

                    {
                        ind !== devices.length - 1 && (
                            <Separator />
                        )
                    }
                </React.Fragment>
            ))}
        </div>
    )
}