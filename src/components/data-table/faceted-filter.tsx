import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { CheckIcon, PlusCircle } from "lucide-react"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"

interface Option {
    label: string
    value: string;
    count?: number;
}

interface FacetedFilterProps {
    title: string
    searchKey: string;
    options: Option[]
}

export function FacetedFilter({
    title,
    searchKey,
    options,
}: FacetedFilterProps) {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const selectedStatus = searchParams.get(searchKey)?.split(',') ?? [];

    const selectedValues = new Set(options.filter((option) => selectedStatus.includes(option.value))?.map((option) => option.value))

    const handleSelectStatus = (value: string) => {
        if (selectedStatus.includes(value)) {
            selectedStatus.splice(selectedStatus.indexOf(value), 1)
        } else {
            selectedStatus.push(value)
        }
        setSearchParams(searchKey, selectedStatus.join(','))
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="mr-2 size-4" />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal capitalize"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[12.5rem] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList className="max-h-full">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value)

                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelectStatus(option.value)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className="size-4" aria-hidden="true" />
                                        </div>
                                        <span className="capitalize">{option.label}</span>
                                        {option.count && (
                                            <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                                                {option.count}
                                            </span>
                                        )}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => setSearchParams(searchKey, undefined)}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}