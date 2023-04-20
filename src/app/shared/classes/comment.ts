import { User } from "./user";

export class Comment {
    id: number;
    content: string;
    rating: number;
    user: User
}