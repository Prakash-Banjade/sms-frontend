export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    USER = 'user',
    TEACHER = 'teacher',
    GUARDIAN = 'guardian',
    ACCOUNTANT = 'accountant',
    RECEPTIONIST = 'receptionist',
    STUDENT = 'student',
    LIBRARIAN = 'librarian',
    STAFF = 'staff',
}

export type TCurrentUser = {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    role: Role,
    createdAt: string,
    updatedAt: string,
}

export type TMeta = {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };