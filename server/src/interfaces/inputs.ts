export interface RegisterInput {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginInput {
    username: string;
    email: string;
    password: string;
}

export interface PostInput {
    text: string;
    tags: string[];
}

export interface CommentInput {
    body: string;
}