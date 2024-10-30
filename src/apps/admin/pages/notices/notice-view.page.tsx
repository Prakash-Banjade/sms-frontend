import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useGetNotice } from "../../components/notices/action"
import { TSingleNotice } from "@/types/notice.type";
import NoticeForm from "../../components/notices/notice.form";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Button } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Pencil } from "lucide-react";
import { TooltipWrapper } from "@/components/ui/tooltip";

type Props = {}

export default function NoticeViewPage({ }: Props) {
  const params = useParams();
  const navigate = useNavigate();

  if (!params.id) navigate('/admin/notices');

  return (
    <div className="container mx-auto">
      <NoticeView id={params.id!} />
    </div>
  )
}

function NoticeView({ id }: { id: string }) {
  const { searchParams, setSearchParams } = useCustomSearchParams();

  const { data, isLoading } = useGetNotice({
    id,
  })

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <Navigate to="/admin/notices" />;

  return searchParams.get('edit') === 'true'
    ? <NoticeEdit notice={data} />
    : <section className="lg:prose-lg prose max-w-[1000px] dark:prose-invert mx-auto relative pt-12">
      <h1>{data?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data?.description ?? '' }} />

      {/* action */}
      <div className="absolute top-0 right-0">
        <TooltipWrapper label={'Edit notice'}>
          <Button variant={'outline'} size={'icon'} onClick={() => setSearchParams('edit', 'true')}>
            <span className="sr-only">Edit</span>
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipWrapper>
      </div>
    </section>
}

function NoticeEdit({ notice }: { notice: TSingleNotice }) {
  return (
    <ContainerLayout title="Edit notice">
      <NoticeForm
        noticeId={notice.id}
        defaultValues={{
          title: notice.title,
          description: notice.description
        }}
      />
    </ContainerLayout>
  )
}