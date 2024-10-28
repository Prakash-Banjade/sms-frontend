import BookCategoryForm from "../../components/library/books-category/book-category-form"
import CategoriesList from "../../components/library/books-category/categories-list"

type Props = {}

export default function BookCategoriesPage({ }: Props) {
    return (
        <section className="">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-20">
                <section className="">
                    <section className='space-y-2 mb-5'>
                        <h1 className="text-2xl font-bold">Add New Category</h1>
                        {/* <p className="text-muted-foreground">Add a new dormitory by filling out the form below.</p> */}
                    </section>
                    <BookCategoryForm />
                </section>

                <section className="col-span-2">
                    <section className='space-y-3 mb-5'>
                        <h1 className="text-2xl font-bold">Categories List</h1>
                    </section>
                    <CategoriesList />
                </section>
            </div>
        </section>
    )
}