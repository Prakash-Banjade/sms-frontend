import AppForm from "@/components/forms/app-form"
import { TGeneralSettingsFormType } from "../../schemas/general-settings.schema";

export default function GeneralSettingsFormFields() {
    return (
        <section className="@container">
            <section className="grid @xl:grid-cols-2 gap-12 grid-cols-1">
                <section className="space-y-4">
                    <h3 className="uppercase font-bold text-xs text-muted-foreground">System settings</h3>
                    <div className="flex flex-col gap-4">
                        <AppForm.Text<TGeneralSettingsFormType>
                            name="currency"
                            label="Currency"
                            placeholder={`e.g. NPR`}
                            description="Currency for the system"
                            required
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="uppercase font-bold text-xs text-muted-foreground">library settings</h3>
                    <div className="flex flex-col gap-4">
                        <AppForm.Number<TGeneralSettingsFormType>
                            name="libraryFine"
                            label="Library Fine"
                            placeholder={`e.g. 200`}
                            description="Library fine per day of overdue books"
                            required
                        />
                    </div>
                </section>

            </section>
        </section>
    )
}