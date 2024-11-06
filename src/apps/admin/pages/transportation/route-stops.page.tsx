import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetRouteStops } from "../../components/transportation/route-stops/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table/data-table";
import { routeStopsColumns } from "../../components/transportation/route-stops/route-stops.columns";
import RouteStopSearchFilters from "../../components/transportation/route-stops/route-stop-search-filters";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useState } from "react";
import RouteStopForm from "../../components/transportation/route-stops/route-stop.form";

export default function RouteStopsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <ContainerLayout
      title="Route Stops"
      description="All the route stops in the transport system."
      actionTrigger={
        <>
          <ResponsiveDialog
            isOpen={isAddOpen}
            setIsOpen={setIsAddOpen}
            title="Add new route stop"
            className="w-[97%] max-w-[800px]"
          >
            <RouteStopForm setIsOpen={setIsAddOpen} />
          </ResponsiveDialog>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus />
            Add New
          </Button>
        </>
      }
    >
      <RouteStopsTable />
    </ContainerLayout>
  )
}

function RouteStopsTable() {
  const [searchParams] = useSearchParams();

  const { data, isLoading } = useGetRouteStops({
    queryString: createQueryString({
      page: searchParams.get('page'),
      take: searchParams.get('take'),
      search: searchParams.get('search'),
    })
  })

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={routeStopsColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filters={<RouteStopSearchFilters />}
    />
  )
}