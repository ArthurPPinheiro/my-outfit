import { Season } from "@prisma/client";

export class Outfit {
    private id: string;
    private userId: string
    private name: string;
    private description?: string;
    private imageUrl?: string;
    private season?: Season;
    private isFavorite: boolean;
    private createdAt: Date;
    private updatedAt: Date;


}