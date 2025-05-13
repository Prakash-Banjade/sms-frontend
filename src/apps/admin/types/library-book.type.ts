import { TMeta } from "../../../types/global.type";

export type TLibraryBook = {
    id: string,
    createdAt: string,
    bookCode: string,
    bookName: string,
    publisherName: string,
    description: string | null,
    publicationYear: number,
    copiesCount?: number,
    issuedCount?: number;
    category: {
        id: string,
        name: string,
    },
    documents: {
        id: string,
        url: string,
        originalName: string,
        size: number,
        format: string,
    }[],
    coverImage: {
        id: string,
        url: string,
        originalName: string,
    } | null
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
    memberId: number,
    memberName: string,
    fine: number;
    paidAt: string | null;
    renewals: string;
}

export type TLibraryBookTransactionsResponse = {
    data: TLibraryBookTransaction[],
    meta: TMeta;
}

export type TStudentTransaction = {
    id: string,
    dueDate: string,
    returnedAt: string | null,
    renewals: string,
    createdAt: string,
    bookName: string,
    bookCode: string,
    fine: number,
}

export type TStudentTransactionsResponse = {
    data: TStudentTransaction[],
    meta: TMeta;
}

export type TLibraryOverviewCount = {
    booksCount: number,
    transactionCount: number,
    issuedCount: number,
    overdueCount: number,
    membersCount: number,
    issuedMembersCount: number,
    topBooks: {
        bookId: string,
        bookName: string,
        transactionCount: string
    }[]
}

export type TUnpaidTransaction = {
    id: string,
    bookName: string,
    fine: number,
    dueDate: string,
    returnedAt: string
    createdAt: string
}

/**
|--------------------------------------------------
| student view type
|--------------------------------------------------
*/
export type TSt_TrasactionCount = {
    issuedCount: number,
    overdueCount: number,
    totalCount: number,
}