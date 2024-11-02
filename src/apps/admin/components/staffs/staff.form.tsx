import AppForm from "@/components/forms/app-form"
import { useAuth } from "@/contexts/auth-provider";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { BloodGroupMappings, GenderMappings, MaritalStatusMappings, StaffTypeMappings } from "@/utils/labelToValueMappings";
import { staffFormDefaultValues, staffSchema, staffSchemaType } from "../../schemas/staff.schema";

type Props = {
    defaultValues?: Partial<staffSchemaType>;
}

export default function StaffForm(props: Props) {
    const params = useParams();

    const navigate = useNavigate();
    const { payload } = useAuth();

    const form = useForm<staffSchemaType>({
        resolver: zodResolver(staffSchema),
        defaultValues: props?.defaultValues ?? staffFormDefaultValues,
    });

    const { mutateAsync } = useAppMutation<Partial<staffSchemaType>, any>();

    async function onSubmit(values: staffSchemaType) {
        const method = !!params.id ? "patch" : "post";

        const response = await mutateAsync({
            method,
            endpoint: QueryKey.STAFFS,
            id: params.id,
            data: {
                ...getDirtyValues(values, form),
                profileImageId: values.profileImageId ?? null, 
            },
            invalidateTags: [QueryKey.STAFFS],
        });

        if (response?.data?.message) {
            navigate(`/${payload?.role}/staffs`);
        }
    }

    return (
        <AppForm schema={staffSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 @container">

                <section className="grid @7xl:grid-cols-3 gap-8">
                    <fieldset className="border border-border rounded-lg p-8 @7xl:col-span-2">
                        <legend className="px-2 text-sm">Personal Info</legend>
                        <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                            <AppForm.Text<staffSchemaType>
                                name="firstName"
                                label="First name"
                                placeholder="eg. John"
                                description="First name of the staff"
                                required
                            />

                            <AppForm.Text<staffSchemaType>
                                name="lastName"
                                label="Last name"
                                placeholder="eg. Doe"
                                description="Last name of the staff"
                                required
                            />

                            <AppForm.Select<staffSchemaType>
                                name="gender"
                                label="Gender"
                                placeholder="Select gender"
                                description="Select gender of the staff"
                                options={Object.entries(GenderMappings).map(([key, value]) => ({ label: key, value }))}
                                required
                            />

                            <AppForm.Select<staffSchemaType>
                                name="maritalStatus"
                                label="Marital Status"
                                placeholder="Select marital status"
                                description="Select martial status of the staff"
                                options={Object.entries(MaritalStatusMappings).map(([key, value]) => ({ label: key, value }))}
                                required
                            />

                            <AppForm.DatePicker<staffSchemaType>
                                name="dob"
                                label="DOB"
                                placeholder="Select date of birth"
                                description="Date of birth of the staff"
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />

                            <AppForm.Select<staffSchemaType>
                                name="bloodGroup"
                                label="Blood Group"
                                placeholder="Select blood group"
                                description="Select blood group of the staff"
                                options={Object.entries(BloodGroupMappings).map(([key, value]) => ({ label: key, value }))}
                                required
                            />

                            <AppForm.Phone<staffSchemaType>
                                name="phone"
                                label="Phone No."
                                placeholder="eg. 9xxxxxxxxxx"
                                description="Phone number of the staff"
                                required
                            />

                            <AppForm.Email<staffSchemaType>
                                name="email"
                                label="Email"
                                placeholder="eg. johndoe@gmail.com"
                                description="Email address of the staff"
                                required
                            />
                        </section>
                    </fieldset>

                    <fieldset className="border border-border rounded-lg p-8 grid place-items-center">
                        <legend className="px-2 text-sm">Profile Image</legend>
                        <AppForm.ImageUpload<staffSchemaType>
                            name="profileImageId"
                            containerClassName="border-none"
                            uploadedImageUrl={form.getValues('profileImageId') ?? null}
                        />
                    </fieldset>
                </section>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Professional Info</legend>
                    <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Number<staffSchemaType>
                            name="staffId"
                            label="Staff ID"
                            placeholder="eg. 123456"
                            description="Assign a unique ID to the staff. It will be auto generated if left blank."
                            min={1}
                        />

                        <AppForm.Select<staffSchemaType>
                            name="type"
                            label="Staff Type"
                            placeholder="Select staff type"
                            description="Type of the staff"
                            options={Object.entries(StaffTypeMappings).map(([key, value]) => ({ label: key, value }))}
                            required
                        />

                        <AppForm.Text<staffSchemaType>
                            name="qualification"
                            label="Qualification"
                            placeholder="eg. B.Tech"
                            description="Qualification of the staff"
                            required
                        />

                        <AppForm.Number<staffSchemaType>
                            name="wage"
                            label="Wage"
                            placeholder="eg. 55000"
                            description="Wage for the staff"
                            min={1}
                            required
                        />

                        <AppForm.DatePicker<staffSchemaType>
                            name="joinedDate"
                            label="Joined Date"
                            placeholder="Select date of joining"
                            description="Date of joining"
                            required
                            max={new Date().toISOString().split('T')[0]}
                        />

                        <div>
                            <AppForm.Textarea<staffSchemaType>
                                name="shortDescription"
                                label="Short Description"
                                placeholder="eg. An efficient, experienced staff"
                                description="Describe something about the staff or leave blank."
                            />
                        </div>
                    </section>
                </fieldset>

                <fieldset className="border border-border rounded-md p-8">
                    <legend className="px-2 text-sm">Bank Info</legend>
                    <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        <AppForm.Text<staffSchemaType>
                            name="bankName"
                            label="Bank Name"
                            placeholder="eg. ICICI Bank"
                            description="Bank name of the account"
                            required
                        />

                        <AppForm.Text<staffSchemaType>
                            name="accountName"
                            label="Account Name"
                            placeholder="eg. John Doe"
                            description="Name of the account"
                            required
                        />

                        <AppForm.Text<staffSchemaType>
                            name="accountNumber"
                            label="Account Number"
                            placeholder="eg. 1234567890"
                            description="Account number of the account"
                            required
                        />
                    </section>
                </fieldset>

                <section className="flex gap-4 justify-end">
                    <AppForm.Cancel>Cancel</AppForm.Cancel>
                    <AppForm.Submit>
                        {
                            !!params.id ? "Save changes" : "Add Staff"
                        }
                    </AppForm.Submit>
                </section>
            </form>
        </AppForm>
    )
}