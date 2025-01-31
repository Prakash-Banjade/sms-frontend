import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { z } from "zod";
import PersonalInfo from "../../components/settings/personal-info";
import PasswordAndAuthentication from "../../components/settings/password-and-authentication";
import SessionDevices from "../../components/settings/session-devices";
import SettingTabs from "../../components/settings/setting-tabs";
import { useMemo } from "react";
import Appearance from "../../components/settings/appearance/appearance";

export const settignsTabs = [
  {
    id: 0,
    name: 'personal-info',
    label: 'My Info',
    content: <PersonalInfo />,
  },
  {
    id: 1,
    name: 'appearance',
    label: 'Appearance',
    content: <Appearance />,
  },
  {
    id: 2,
    name: 'password-and-authentication',
    label: 'Password and Authentication',
    content: <PasswordAndAuthentication />,
  },
  {
    id: 3,
    name: 'device-activity',
    label: 'Your Devices',
    content: <SessionDevices />,
  }
]

const tabsSchema = z.enum(["personal-info", "appearance", "password-and-authentication", "device-activity"]);

export default function SettingsPage() {
  const { searchParams, setSearchParams } = useCustomSearchParams();

  const activeTab: typeof settignsTabs[0]['id'] = useMemo(() => {
    const defaultTab = settignsTabs[0].id;
    const { success, data } = tabsSchema.safeParse(searchParams.get('tab') || settignsTabs[0].name);

    if (!success) {
      setSearchParams('tab', settignsTabs[0].name);
      return defaultTab;
    }

    return settignsTabs.find(tab => tab.name === data)?.id ?? defaultTab;
  }, [searchParams]);

  return (
    <ContainerLayout
      title="Settings"
      description="Manage your account settings."
    >

      <section className="max-w-full overflow-x-auto">
        <SettingTabs defaultActive={activeTab} />
      </section>

      <div className="max-w-screen-lg w-full mx-auto">
        {
          settignsTabs.find(tab => tab.id === activeTab)?.content
        }
      </div>
    </ContainerLayout>
  )
}