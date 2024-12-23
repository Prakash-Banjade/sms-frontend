import AppForm from "@/components/forms/app-form"
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { teacherFormDefaultValues, teacherSchema, teacherSchemaType } from "../../schemas/teacher.schema";
import { BloodGroupMappings, GenderMappings, MaritalStatusMappings } from "@/utils/labelToValueMappings";
import { useEffect } from "react";
import { EmployeeAllowanceFormFields } from "../finance-system/salary-management/salary-structures/salary-structure.form";

type Props = {
    defaultValues?: Partial<teacherSchemaType>;
}

export default function TeacherForm(props: Props) {
    const params = useParams();

    const navigate = useNavigate();

    const form = useForm<teacherSchemaType>({
        resolver: zodResolver(teacherSchema),
        defaultValues: props?.defaultValues ?? teacherFormDefaultValues,
    });

    const { mutateAsync, error } = useAppMutation<Partial<teacherSchemaType>, any>();

    async function onSubmit(values: teacherSchemaType) {
        // validating basic salary manually because, it is not required in update but required in create
        if (!params.id && !values.basicSalary) {
            form.setError("basicSalary", { message: "Basic salary is required" });
            form.setFocus("basicSalary");
        }

        const method = !!params.id ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.TEACHERS,
            id: params.id,
            data: {
                ...getDirtyValues(values, form),
                profileImageId: values.profileImageId ?? null,
            },
            invalidateTags: [QueryKey.TEACHERS],
        });

        if (response?.data?.message) {
            console.log(response.data)
            navigate(`/admin/teachers`);
        }
    }

    useEffect(() => { // show error directly in form field if send by server
        const errObj = (error as any)?.response?.data?.message;
        if (!!errObj?.field) {
            form.setError(errObj.field, { message: errObj?.message });
            form.setFocus(errObj.field);
        }
    }, [error])

    return (
        <AppForm schema={teacherSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 @container">

                <section className="grid @7xl:grid-cols-3 gap-8">
                    <fieldset className="border border-border rounded-lg p-8 @7xl:col-span-2">
                        <legend className="px-2 text-sm">Personal Info</legend>
                        <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                            <AppForm.Text<teacherSchemaType>
                                name="firstName"
                                label="First name"
                                placeholder="eg. John"
                                description="First name of the teacher"
                                required
                            />

                            <AppForm.Text<teacherSchemaType>
                                name="lastName"
                                label="Last name"
                                placeholder="eg. Doe"
                                description="Last name of the teacher"
                                required
                            />

                            <AppForm.Select<teacherSchemaType>
                                name="gender"
                                label="Gender"
                                placeholder="Select gender"
                                description="Select gender of the teacher"
                                options={Object.entries(GenderMappings).map(([key, value]) => ({ label: key, value }))}
                                required
                            />

                            <AppForm.Select<teacherSchemaType>
                                name="maritalStatus"
                                label="Marital Status"
                                placeholder="Select marital status"
                                description="Select martial status of the teacher"
                                options={Object.entries(MaritalStatusMappings).map(([key, value]) => ({ label: key, value }))}
                                required
                            />

                            <AppForm.DatePicker<teacherSchemaType>
                                name="dob"
                                label="DOB"
                                placeholder="Select date of birth"
                                description="Date of birth of the teacher"
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />

                            <AppForm.Select<teacherSchemaType>
                                name="bloodGroup"
                                label="Blood Group"
                                placeholder="Select blood group"
                                description="Select blood group of the teacher"
                                options={Object.entries(BloodGroupMappings).map(([key, value]) => ({ label: key, value }))}
                                required
                            />

                            <AppForm.Phone<teacherSchemaType>
                                name="phone"
                                label="Phone No."
                                placeholder="eg. +9xx xxxxxxxxxx"
                                description="Phone number of the teacher"
                                required
                            />

                            <AppForm.Email<teacherSchemaType>
                                name="email"
                                label="Email"
                                placeholder="eg. johndoe@gmail.com"
                                description="Email address of the teacher"
                                required
                            />
                        </section>
                    </fieldset>

                    <fieldset className="border border-border rounded-lg p-8 grid place-items-center">
                        <legend className="px-2 text-sm">Profile Image</legend>
                        <AppForm.ImageUpload<teacherSchemaType>
                            name="profileImageId"
                            containerClassName="border-none"
                            uploadedImageUrl={form.getValues('profileImageId') ?? null}
                            imageQuery="w=200&q=70"
                        />
                    </fieldset>
                </section>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Professional Info</legend>
                    <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Text<teacherSchemaType>
                            name="qualification"
                            label="Qualification"
                            placeholder="eg. B.Tech"
                            description="Qualification of the teacher"
                            required
                        />

                        <AppForm.DatePicker<teacherSchemaType>
                            name="joinedDate"
                            label="Joined Date"
                            placeholder="Select date of joining"
                            description="Date of joining"
                            required
                            max={new Date().toISOString().split('T')[0]}
                        />

                        {
                            !params.id && (
                                <>
                                    <AppForm.Number<teacherSchemaType>
                                        name="basicSalary"
                                        label="Basic Salary"
                                        placeholder="eg. 55000"
                                        description="Basic salary of the teacher"
                                        min={1}
                                        required
                                    />

                                    <EmployeeAllowanceFormFields />
                                </>
                            )
                        }

                    </section>
                </fieldset>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Bank Info</legend>
                    <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Text<teacherSchemaType>
                            name="bankName"
                            label="Bank Name"
                            placeholder="eg. ICICI Bank"
                            description="Bank name of the account"
                            required
                        />

                        <AppForm.Text<teacherSchemaType>
                            name="accountName"
                            label="Account Name"
                            placeholder="eg. John Doe"
                            description="Name of the account"
                            required
                        />

                        <AppForm.Text<teacherSchemaType>
                            name="accountNumber"
                            label="Account Number"
                            placeholder="eg. 1234567890"
                            description="Account number of the account"
                            required
                        />
                    </section>
                </fieldset>

                <div>
                    <AppForm.Textarea<teacherSchemaType>
                        name="shortDescription"
                        label="Short Description"
                        placeholder="eg. An efficient, experienced teacher"
                        description="Describe something about the teacher or leave blank."
                    />
                </div>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel action={() => navigate('/admin/teachers')}>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!params.id ? "Save changes" : "Add Teacher"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
};