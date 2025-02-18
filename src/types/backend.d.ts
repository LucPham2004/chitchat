export interface ApiResponse<T> {
     code: number;
     message: string;
     result?: T;
}

export interface Page<T> {
     content: T[]; 
     totalElements: number;
     totalPages: number;
     number: number;
     size: number;
}

export interface User {
     id?: string;
     email: string;
     username: string;
     password?: string;
     firstName: string;
     lastName: string;
     phone: string;
     dob: string;
     gender: string;
     location: string;
     bio: string;
     role?: {
          id: string;
          name: string;
     }
     createdBy?: string;
     isDeleted?: boolean;
     deletedAt?: boolean | null;
     createdAt?: string;
     updatedAt?: string;
}

export interface GetAccount extends Omit<Account, "access_token"> { }

export interface Account {
     access_token: string | undefined;
     user: {
          id: string;
          email: string;
          username: string;
          firstName: string;
          lastName?: string;
          avatarUrl?: string;
          location?: string;
          bio?: string;
          authorities: {
               id: string;
               authority: string;
          }
     }
}
