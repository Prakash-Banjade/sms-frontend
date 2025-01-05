import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { cn } from "@/lib/utils";
import { z } from "zod";
import PersonalInfo from "../../components/settings/personal-info";
import PasswordAndAuthentication from "../../components/settings/password-and-authentication";
import SessionDevices from "../../components/settings/session-devices";

const tabsObj = [
  {
    name: 'personal-info',
    label: 'Personal Info',
    content: <PersonalInfo />,
  },
  {
    name: 'password-and-authentication',
    label: 'Password and Authentication',
    content: <PasswordAndAuthentication />,
  },
  {
    name: 'device-activity',
    label: 'Your Devices',
    content: <SessionDevices />,
  }
]

const tabsSchema = z.enum(["personal-info", "password-and-authentication", "device-activity"]);

export default function SettingsPage() {
  const { searchParams, setSearchParams } = useCustomSearchParams();

  const { success, data } = tabsSchema.safeParse(searchParams.get('tab') || tabsObj[0].name);


  return (
    <ContainerLayout
      title="Settings"
      description="Manage your account settings."
    >
      <Tabs value={success ? data : tabsObj[0].name} className="w-full">
        <div className="flex gap-20">
          <nav>
            <TabsList className="flex flex-col justify-start gap-4 h-full bg-transparent">
              {
                tabsObj.map(tab => (
                  <TabsTrigger
                    className={cn(
                      "capitalize !w-full !block text-left !text-foreground py-2.5 hover:underline rounded-lg pr-20",
                      tab.name === data && "!bg-secondary hover:no-underline"
                    )}
                    key={tab.name}
                    value={tab.name}
                    onClick={() => setSearchParams('tab', tab.name)}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))
              }
            </TabsList>
          </nav>

          <div className="w-full max-w-[800px]">
            {
              tabsObj.map(tab => (
                <TabsContent
                  className="!min-w-full"
                  key={tab.name}
                  value={tab.name}
                >
                  {tab.content}
                </TabsContent>
              ))
            }
          </div>
        </div>
      </Tabs>
    </ContainerLayout>
  )
}