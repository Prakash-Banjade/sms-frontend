import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BookCategoryForm from "../../components/library/books-category/book-category-form"
import CategoriesList from "../../components/library/books-category/categories-list"
import { Progress } from "@/components/ui/progress"

type Props = {}

const books = [
    { id: '1', title: 'To Kill a Mockingbird', author: 'Harper Lee', available: 3, category: 'Fiction' },
    { id: '2', title: '1984', author: 'George Orwell', available: 2, category: 'Science Fiction' },
    { id: '3', title: 'Pride and Prejudice', author: 'Jane Austen', available: 1, category: 'Romance' },
    { id: '4', title: 'The Catcher in the Rye', author: 'J.D. Salinger', available: 4, category: 'Fiction' },
    { id: '5', title: 'To the Lighthouse', author: 'Virginia Woolf', available: 2, category: 'Modernist' },
]

export default function BookCategoriesPage({ }: Props) {
    const bookCategories = [...new Set(books.map(book => book.category))]
    const booksByCategory = bookCategories.map(category => ({
        category,
        count: books.filter(book => book.category === category).length
    }))

    return (
        <section className="">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-20">
                <section className="flex flex-col gap-20">
                    <section className="">
                        <section className='space-y-2 mb-5'>
                            <h1 className="text-2xl font-bold">Add New Category</h1>
                            {/* <p className="text-muted-foreground">Add a new dormitory by filling out the form below.</p> */}
                        </section>
                        <BookCategoryForm />
                    </section>

                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle>Book Categories</CardTitle>
                                <CardDescription>Distribution of books by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {booksByCategory.map(({ category, count }) => (
                                        <div key={category}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span>{category}</span>
                                                <span className="font-bold">{count}</span>
                                            </div>
                                            <Progress value={(count / books.length) * 100} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
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