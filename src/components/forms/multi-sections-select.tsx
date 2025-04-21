import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";

interface MultiSectionProps {
    required?: boolean;
    disabled?: boolean;
    options: {
        id: string;
        name: string;
    }[],
    description?: string;
    values: string[];
    setValues: React.Dispatch<React.SetStateAction<string[]>>;
}

export function MultiSectionSelect({ required, disabled, options, description, values, setValues }: MultiSectionProps) {
    const form = useFormContext();
    const [open, setOpen] = useState(false);


    const handleSetValue = (val: string) => {
        if (values.includes(val)) {
            values.splice(values.indexOf(val), 1);
            const updatedValues = values.filter((item) => item !== val);

            setValues(updatedValues);
            form.setValue("sectionIds", updatedValues);
        } else {
            const updatedValues = [...values, val];
            form.setValue("sectionIds", updatedValues);
            setValues(updatedValues);
        }
    }

    return (
        <FormField
            control={form.control}
            name={'sectionIds'}
            render={() => (
                <FormItem>
                    <div>
                        <FormLabel>
                            Sections
                            {required && <span className="text-red-500">*</span>}
                        </FormLabel>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild className="hover:bg-secondary/20">
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between h-max min-h-10"
                                disabled={disabled}
                            >
                                <div className="flex gap-2 justify-start flex-wrap">
                                    {values?.length ?
                                        values.map((val, i) => (
                                            <div role="button"
                                                key={i}
                                                className="px-2 py-0.5 rounded-xl border bg-secondary text-xs font-medium flex gap-1 items-center"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleSetValue(val);
                                                }}
                                            >
                                                <span>
                                                    {options.find((option) => option.id === val)?.name}
                                                </span>
                                                <X className="!size-3" />
                                            </div>
                                        ))
                                        : 'Select sections'}
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="!min-w-full p-0">
                            <Command>
                                <CommandInput placeholder="Select sections" />
                                <CommandEmpty>No section found.</CommandEmpty>
                                <CommandGroup>
                                    <CommandList>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.id}
                                                value={option.id}
                                                onSelect={() => {
                                                    handleSetValue(option.id);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        values.includes(option.id) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option.name}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                                {values.length > 0 && (
                                    <>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setValues([])
                                                }}
                                                className="justify-center text-center"
                                            >
                                                Clear Selection
                                            </CommandItem>
                                        </CommandGroup>
                                    </>
                                )}
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}