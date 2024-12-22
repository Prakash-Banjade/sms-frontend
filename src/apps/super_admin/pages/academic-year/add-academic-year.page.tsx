import { AlertCircle } from 'lucide-react'
import AcademicYearForm from '../../components/academic-year/academic-year-form'
import ContainerLayout from '@/components/aside-layout.tsx/container-layout'

export default function AddAcademicYear() {

    return (
        <ContainerLayout
            title="Add Academic Year"
            description="Add a new academic year to your school management system."
        >
            <p
                className='text-warning bg-warning/10 px-2 py-1 rounded-md flex items-center gap-2 w-fit'
                role='alert'
            >
                <AlertCircle size={18} />
                Once you create a new academic year, your management session will be upgraded and you can't work on previous academic years.
            </p>
            <AcademicYearForm />
        </ContainerLayout>
    )
}