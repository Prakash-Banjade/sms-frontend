import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Calendar, Download, FileText, User } from "lucide-react"
import { useGetLibraryBook } from "../../components/library/data-access"
import { useParams } from "react-router-dom"
import { isUndefined } from "lodash"
import ImageWithPlaceholder from "@/components/image-with-placeholder"
import { getImageUrl } from "@/lib/utils"

export default function SingleLibraryBookPage() {
    const params = useParams();

    const { data: book, isLoading } = useGetLibraryBook({ id: params.id! })

    if (isLoading) return <div>Loading...</div>;

    if (!book) return <div>Book not found</div>;

    return (
        <div className="container mx-auto @container">
            <div className="grid @4xl:grid-cols-3 grid-cols-1 gap-8">
                {/* Book Cover */}
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="aspect-[3/4] relative rounded-md overflow-hidden border">
                                <ImageWithPlaceholder
                                    alt={book.bookName}
                                    src={book.coverImage?.url || "/lib_book_placeholder.png"}
                                    placeholderSrc={getImageUrl(book.coverImage?.url, "q=2&w=50")}
                                    className="object-contain w-full"
                                />
                            </div>
                            <div className="mt-4 space-y-2">
                                {
                                    !isUndefined(book.copiesCount) && !isUndefined(book.issuedCount) && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Total Copies:</span>
                                                <span className="text-sm">{book.copiesCount}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Available:</span>
                                                <span className="text-sm">{book.copiesCount - book.issuedCount}</span>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Book Details */}
                <div className="md:col-span-2">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl md:text-3xl">{book.bookName}</CardTitle>
                                    <CardDescription className="mt-2 flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        By {book.publisherName}
                                    </CardDescription>
                                </div>
                                <Badge>{book.category.name}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">Code: {book.bookCode}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">Published: {book.publicationYear}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">{book.description}</p>
                                </div>

                                <Separator className="my-4" />

                                <div>
                                    <h3 className="font-medium mb-2">Digital Attachments</h3>
                                    {book.documents.length > 0 ? (
                                        <div className="space-y-2">
                                            {book.documents.map((attachment, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                                    <div className="flex items-start">
                                                        <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium">{attachment.originalName}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {attachment.format} • {(attachment.size / 1024).toFixed(2)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" download>
                                                            <Download />
                                                            Download
                                                        </a>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No digital attachments available</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="text-xs text-muted-foreground">ISBN: {book.id}</div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
