import { Season } from "@prisma/client";
import { CreateClothingDto } from "src/clothes/dto/create-clothing.dto";

export class CreateOutfitDto {
    userId: string
    name: string;
    description?: string;
    imageUrl?: string;
    season?: Season;
    isFavorite: boolean;
    clothingItemIds?: string[];

    clothes?: CreateClothingDto[];
}
