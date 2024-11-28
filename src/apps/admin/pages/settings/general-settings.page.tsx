import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useForm } from "react-hook-form";
import { generalSettingsDefaultValues, generalSettingsFormSchema, TGeneralSettingsFormType } from "../../schemas/general-settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppMutation } from "@/hooks/useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";
import { getDirtyValues } from "@/utils/get-dirty-values";
import AppForm from "@/components/forms/app-form";
import { useGetGeneralSettings } from "../../components/settings/data-access";
import GeneralSettingsFormFields from "../../components/settings/general-settings-form-fields";
import { createQueryString } from "@/utils/create-query-string";

export default function GeneralSettingsPage() {
    const { data, isLoading } = useGetGeneralSettings({
        queryString: createQueryString({
            settings: 'all'
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <GeneralSettingsForm defaultValues={data} />
    )
}

function GeneralSettingsForm({ defaultValues }: { defaultValues?: Partial<TGeneralSettingsFormType> }) {
    const form = useForm<TGeneralSettingsFormType>({
        resolver: zodResolver(generalSettingsFormSchema),
        defaultValues: defaultValues ?? generalSettingsDefaultValues,
    })

    const { mutateAsync } = useAppMutation<Partial<TGeneralSettingsFormType>, any>();

    async function onSubmit(values: TGeneralSettingsFormType) {
        await mutateAsync({
            method: 'patch',
            endpoint: QueryKey.GENERAL_SETTINGS,
            data: getDirtyValues(values, form),
            invalidateTags: [QueryKey.GENERAL_SETTINGS],
        });
    };

    return (
        <AppForm schema={generalSettingsFormSchema} form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 @container">
                <ContainerLayout
                    title="General Settings"
                    description="Find all your school management settings here"
                    actionTrigger={<AppForm.Submit disabled={Object.values(form.formState.dirtyFields)?.length === 0}>Update Changes</AppForm.Submit>}
                >
                    <GeneralSettingsFormFields />
                </ContainerLayout>
            </form>
        </AppForm>
    )
}