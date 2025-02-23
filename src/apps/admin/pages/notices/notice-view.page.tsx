import { Navigate, useParams } from "react-router-dom"
import { useGetNotice } from "../../components/notices/action"
import { TSingleNotice } from "@/types/notice.type";
import NoticeForm from "../../components/notices/notice.form";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { Button } from "@/components/ui/button";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Calendar, Pencil } from "lucide-react";
import { TooltipWrapper } from "@/components/ui/tooltip";
import DOMPurify from 'dompurify';
import { formatDate } from "@/utils/format-date";
import { useAuth } from "@/contexts/auth-provider";

export default function NoticeViewPage() {
  const params = useParams();

  return (
    <div className="container mx-auto">
      <NoticeView id={params.id!} />
    </div>
  )
}

function NoticeView({ id }: { id: string }) {
  const { payload } = useAuth();
  const { searchParams, setSearchParams } = useCustomSearchParams();

  const { data, isLoading } = useGetNotice({
    id,
    options: { enabled: !!id }
  })

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <Navigate to={`/${payload?.role}/notices`} />;

  return searchParams.get('edit') === 'true'
    ? <NoticeEdit notice={data} />
    : (
      <section className="lg:prose-lg prose max-w-[1000px] dark:prose-invert mx-auto relative">
        <time className="flex items-center gap-1" dateTime={data.createdAt}>
          <Calendar size={18} />
          {formatDate({ date: new Date(data?.createdAt) })}
        </time>
        <h1 className="pt-5">{data?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.description) ?? '' }} />

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
    )
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