import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { CardContent, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from 'lucide-react'
import { guardianFormFieldsDefaultValues, studentSchemaType } from '../../schemas/student.schema'
import { AppFormSelect } from '@/components/forms/select'
import { GuardianRelationMappings } from '@/utils/labelToValueMappings'
import { AppFormText } from '@/components/forms/app-form-text'
import { AppFormPhone } from '@/components/forms/app-form-phone'
import { AppFormEmail } from '@/components/forms/app-form-email'
import { AppCheckbox } from '@/components/forms/app-form-checkbox'

export default function GuardiansFields() {
    const form = useFormContext<studentSchemaType>();

    const { fields, append, remove } = useFieldArray({
        name: "guardians",
        control: form.control,
    })

    return (
        <div>
            <section className='space-y-8 mb-5'>
                {fields.map((field, index) => (
                    <section key={field.id}>
                        <CardTitle className="text-base font-semibold mb-2">Guardian {index + 1}</CardTitle>
                        <CardContent className='p-0'>
                            <section className="grid @7xl:grid-cols-4 @5xl:grid-cols-3 @3xl:grid-cols-2 grid-cols-1 gap-6">
                                <AppFormText
                                    name={`guardians.${index}.firstName`}
                                    label="First Name"
                                    placeholder="eg. John"
                                    required
                                    description="First name of the guardian"
                                />
                                <AppFormText
                                    name={`guardians.${index}.lastName`}
                                    label="Last Name"
                                    placeholder="eg. Doe"
                                    required
                                    description="Last name of the guardian"
                                />
                                <AppFormSelect
                                    name={`guardians.${index}.relation`}
                                    label="Relation"
                                    placeholder="Select relation"
                                    description="Select the relation of the guardian"
                                    options={Object.entries(GuardianRelationMappings).map(([label, value]) => ({ label, value }))}
                                    required
                                />
                                <AppFormPhone
                                    name={`guardians.${index}.phone`}
                                    label="Phone"
                                    placeholder="eg. 1234567890"
                                    required
                                    description="Phone number of the guardian"
                                />
                                <AppFormEmail
                                    name={`guardians.${index}.email`}
                                    label="Email"
                                    placeholder="eg. johndoe@gmail.com"
                                    description="Email of the guardian"
                                />
                                <AppFormText
                                    name={`guardians.${index}.address`}
                                    label="Address"
                                    placeholder="eg. Butwal, Punjab, India"
                                    required
                                    description="Address of the guardian"
                                />
                                <AppFormText
                                    name={`guardians.${index}.occupation`}
                                    label="Occupation"
                                    placeholder="eg. Teacher"
                                    required
                                    description="Occupation of the guardian"
                                />
                                <AppCheckbox
                                    name={`guardians.${index}.receiveNotification`}
                                    label="Receive Notification"
                                    description="Receive notifications for the student"
                                />
                            </section>

                            <section className='mt-3'>
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove Guardian
                                    </Button>
                                )}
                            </section>
                        </CardContent>
                    </section>
                ))}
            </section>
            {
                fields.length < 3 && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => append(guardianFormFieldsDefaultValues)}
                    >
                        <Plus /> Add Another Guardian
                    </Button>
                )
            }
        </div>
    )
}