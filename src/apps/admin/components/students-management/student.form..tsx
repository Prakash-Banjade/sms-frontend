import AppForm from "@/components/forms/app-form"
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { BloodGroupMappings, GenderMappings, ReligionMappings } from "@/utils/labelToValueMappings";
import { studentFormDefaultValues, studentSchema, studentSchemaType } from "../../schemas/student.schema";
import { createQueryString } from "@/utils/create-query-string";
import { EClassType } from "@/types/global.type";
import { useEffect } from "react";
import GuardiansFields from "./guardians-form-fields";

type Props = {
    defaultValues?: Partial<studentSchemaType>;
}

export default function StudentForm(props: Props) {
    const params = useParams();

    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<studentSchemaType>({
        resolver: zodResolver(studentSchema),
        defaultValues: props?.defaultValues ?? studentFormDefaultValues,
    });

    const { mutateAsync } = useAppMutation<Partial<studentSchemaType>, any>();

    async function onSubmit(values: studentSchemaType) {
        const method = !!params.id ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.STUDENTS,
            id: params.id,
            data: {
                ...getDirtyValues(values, form),
                classRoomId: values.sectionId ?? values.classRoomId, // should have to send the section Id as classRoomId
            },
            invalidateTags: [QueryKey.STUDENTS],
        });

        if (response?.data?.message) {
            navigate(`/${payload?.role}/students`);
        }
    }

    useEffect(() => {
        form.setValue("sectionId", undefined)
    }, [form.watch("classRoomId")])

    return (
        <AppForm schema={studentSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                <fieldset className="border border-border rounded-lg p-8">
                    <legend className="px-2 text-sm">Personal Info</legend>
                    <section className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Text<studentSchemaType>
                            name="firstName"
                            label="First name"
                            placeholder="eg. John"
                            description="First name of the student"
                            required
                        />

                        <AppForm.Text<studentSchemaType>
                            name="lastName"
                            label="Last name"
                            placeholder="eg. Doe"
                            description="Last name of the student"
                            required
                        />

                        <AppForm.Select<studentSchemaType>
                            name="gender"
                            label="Gender"
                            placeholder="Select gender"
                            description="Select gender of the student"
                            options={Object.entries(GenderMappings).map(([key, value]) => ({ label: key, value }))}
                            required
                        />

                        <AppForm.DatePicker<studentSchemaType>
                            name="dob"
                            label="DOB"
                            placeholder="Select date of birth"
                            description="Date of birth of the student"
                            required
                        />

                        <AppForm.Select<studentSchemaType>
                            name="religion"
                            label="Religion"
                            placeholder="Select religion"
                            description="Select religion of the student"
                            options={Object.entries(ReligionMappings).map(([key, value]) => ({ label: key, value }))}
                        />

                        <AppForm.Text<studentSchemaType>
                            name="caste"
                            label="Caste"
                            placeholder="eg. Chhetri"
                            description="Caste of the student"
                        />

                        <AppForm.Select<studentSchemaType>
                            name="bloodGroup"
                            label="Blood Group"
                            placeholder="Select blood group"
                            description="Select blood group of the student"
                            options={Object.entries(BloodGroupMappings).map(([key, value]) => ({ label: key, value }))}
                            required
                        />

                        <AppForm.Phone<studentSchemaType>
                            name="phone"
                            label="Phone No."
                            placeholder="eg. 9xxxxxxxxxx"
                            description="Phone number assiciated with the student"
                            required
                        />

                        <AppForm.Email<studentSchemaType>
                            name="email"
                            label="Email"
                            placeholder="eg. johndoe@gmail.com"
                            description="Email address of the student"
                            required
                        />

                        <AppForm.Checkbox<studentSchemaType>
                            name="isPhysicallyChallenged"
                            label="Is Physically Challenged"
                            description="Is the student physically challenged?"
                        />
                    </section>
                </fieldset>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Academic Info</legend>
                    <section className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        {
                            !params.id && <>
                                <AppForm.DynamicSelect<studentSchemaType>
                                    name="classRoomId"
                                    label="Class room"
                                    placeholder="Select class room"
                                    description="Select the class room"
                                    fetchOptions={{
                                        endpoint: QueryKey.CLASSES,
                                        queryKey: [QueryKey.CLASSES],
                                        queryString: 'page=1&take=50',
                                    }}
                                    labelKey={'name'}
                                    required
                                />

                                <AppForm.DynamicSelect<studentSchemaType>
                                    name="sectionId"
                                    fetchOptions={{
                                        endpoint: QueryKey.CLASSES,
                                        queryKey: [QueryKey.CLASSES, form.watch('classRoomId')],
                                        queryString: createQueryString({
                                            parentClassId: form.watch('classRoomId'),
                                            classType: EClassType.SECTION,
                                            take: 20,
                                        }),
                                    }}
                                    labelKey="name"
                                    label="Section"
                                    description="Select the section"
                                    placeholder="Select section"
                                    disableOnNoOption
                                    required
                                />
                            </>
                        }

                        <AppForm.Number<studentSchemaType>
                            name="rollNo"
                            label="Roll No"
                            placeholder="eg. 10"
                            description="Roll no of the student"
                            min={1}
                            required
                        />

                        {
                            !params?.id && <AppForm.DatePicker<studentSchemaType> // don't allow to edit the admission date
                                name="admissionDate"
                                label="Admission Date"
                                placeholder="Select admission date"
                                description="Select the admission date"
                                required
                            />
                        }

                        <AppForm.DynamicSelect<studentSchemaType>
                            name="dormitoryRoomId"
                            label="Dormitory room"
                            placeholder="Select dormitory room"
                            description="Select the dormitory room. Skip if not applicable."
                            fetchOptions={{
                                endpoint: QueryKey.DORMITORY_ROOMS,
                                queryKey: [QueryKey.DORMITORY_ROOMS],
                                queryString: 'skipPagination=true',
                            }}
                            labelKey={'roomNumber'}
                        />

                    </section>
                </fieldset>

                <fieldset className="border border-border rounded-lg p-8">
                    <legend className="px-2 text-sm">Address</legend>
                    <section className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Text<studentSchemaType>
                            name="permanentAddress"
                            label="Permanent Address"
                            placeholder="eg. Butwal, Punjab, India"
                            description="Permanent Address of the student"
                            required
                        />
                        <AppForm.Text<studentSchemaType>
                            name="currentAddress"
                            label="Current Address"
                            placeholder="eg. Bhairahawa, Punjab, India"
                            description="Current Address of the student"
                            required
                        />
                    </section>
                </fieldset>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Guardian Details</legend>
                    <GuardiansFields />
                </fieldset>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Document Details</legend>
                    <section className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Text<studentSchemaType>
                            name="nationalIdCardNo"
                            label="National ID Card No"
                            placeholder="eg. 1234567890"
                            description="National ID Card No of the student"
                            required
                        />

                        <AppForm.Text<studentSchemaType>
                            name="birthCertificateNumber"
                            label="Birth Certificate Number"
                            placeholder="eg. 1234567890"
                            description="Birth Certificate Number of the student"
                            required
                        />

                        <AppForm.Text<studentSchemaType>
                            name="additionalNotes"
                            label="Additional Notes"
                            placeholder="eg. Note"
                            description="Additional notes of the student"
                        />
                    </section>
                </fieldset>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Bank Info</legend>
                    <section className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Text<studentSchemaType>
                            name="bankName"
                            label="Bank Name"
                            placeholder="eg. ICICI Bank"
                            description="Bank name of the account. If not leave blank."
                        />

                        <AppForm.Text<studentSchemaType>
                            name="bankAccountNumber"
                            label="Account Number"
                            placeholder="eg. 1234567890"
                            description="Account number of the account. If not leave blank."
                        />

                        <AppForm.Text<studentSchemaType>
                            name="ifscCode"
                            label="IFSC Code"
                            placeholder="eg. 1234567890"
                            description="IFSC code of the bank. If not leave blank."
                        />
                    </section>
                </fieldset>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Previous School Info</legend>
                    <section className="flex flex-col gap-6">
                        <AppForm.Text<studentSchemaType>
                            name="previousSchoolName"
                            label="Previous School Name"
                            placeholder="eg. St. Xavier's School"
                            description="Name of the previous school"
                        />

                        <AppForm.Textarea<studentSchemaType>
                            name="previousSchoolDetails"
                            label="Previous School Details"
                            placeholder="eg. School started in 1990"
                            description="Details of the previous school"
                        />
                    </section>
                </fieldset>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!params.id ? "Save changes" : "Submit"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}