import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TCreateLiveClassSchema } from "./create-live-class-form"
import AppForm from "@/components/forms/app-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default function FinalDetailsStep() {
    const form = useFormContext<TCreateLiveClassSchema>()

    return (
        <div className="space-y-6">
            <AppForm.Text<TCreateLiveClassSchema>
                name="title"
                label="Title"
                placeholder="Enter class title"
                required
            />
            <AppForm.Textarea<TCreateLiveClassSchema>
                name="description"
                label="Description"
                placeholder="Enter class description"
            />

            <FormField
                control={form.control}
                name="startImmediately"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Class start</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={val => {
                                    field.onChange(val === "true")
                                }}
                                defaultValue={field.value ? "true" : "false"}
                                className="flex flex-col space-y-1"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="true" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Start Immediately
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="false" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Schedule Class
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {
                !form.watch("startImmediately") && <FormField
                    control={form.control}
                    name="scheduleDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Schedule Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="datetime-local"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            }
        </div>
    )
}

