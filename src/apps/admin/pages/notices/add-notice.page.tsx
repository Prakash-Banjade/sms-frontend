import ContainerLayout from "@/components/page-layouts/container-layout"
import NoticeForm from "../../components/notices/notice.form"

type Props = {}

export default function AddNoticePage({ }: Props) {
    return (
        <ContainerLayout
            title="Add Notice"
            description="Add a new notice to your school management system."
        >
            <NoticeForm />
        </ContainerLayout>
    )
}