export default function AttendanceStatusIndicators() {
    return (
        <p className='flex items-center gap-2 text-sm justify-center'>
            <span className='flex items-center gap-1'>
                <span className='size-3 rounded-full bg-success'></span> Present
            </span>
            <span className='flex items-center gap-1'>
                <span className='size-3 rounded-full bg-destructive'></span> Absent
            </span>
            <span className='flex items-center gap-1'>
                <span className='size-3 rounded-full bg-info'></span> Late
            </span>
            <span className='flex items-center gap-1'>
                <span className='size-3 rounded-full bg-warning'></span> Leave
            </span>
        </p>
    )
}