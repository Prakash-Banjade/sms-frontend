import LibraryStatistics from "../components/library/library-stat"


const StudentLibraryDetailsPage = () => {
    return (
        <div className="mx-auto container flex flex-col gap-6">
            <h2 className="text-lg font-semibold">My Library</h2>
            <LibraryStatistics />
        </div>
    )
}

export default StudentLibraryDetailsPage
