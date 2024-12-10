export type User = {
    id: number;
    username: string;
    password: string;
    roles: string;
    googleId?: string;
};
export type Post = {
    id: number;
    title: string;
    content: string;
    user: User;
};