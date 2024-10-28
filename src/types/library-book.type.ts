import { TMeta } from "./global.type";

export type TLibraryBook = {
    id: string,
    createdAt: string,
    bookCode: string,
    bookName: string,
    publisherName: string,
    description: string | null,
    publicationYear: number,
    copiesCount: number,
    issuedCount: number;
    category: {
        id: string,
        name: string,
    }
}

export type TLibraryBookesResponse = {
    data: TLibraryBook[],
    meta: TMeta;
}

export type TBookCategory = {
    id: string,
    name: string,
    booksCount: number;
}

export type TBookCategoryesResponse = {
    data: TBookCategory[],
    meta: TMeta;
}

export type TLibraryBookTransaction = {
    id: string,
    dueDate: string,
    bookName: string,
    bookCode: string,
    returnedAt: string | null,
    createdAt: string,
    studentId: number,
    studentName: string,
    parentClassName: string | null,
    classRoomName: string,
}

export type TLibraryBookTransactionsResponse = {
    data: TLibraryBookTransaction[],
    meta: TMeta;
}