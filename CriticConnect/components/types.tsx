export type User = {
    id: number;
    username: string;
    password: string;
    roles: string;
    
    given_name?: string;
    verified_email?: boolean;
    name?: string;
    family_name?: string;
    hd?: string;
};
export type Post = {
    id: number;
    title: string;
    content: string;
    user: User;
};