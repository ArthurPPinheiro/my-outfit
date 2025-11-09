export class CreateClothingDto {
    userId: string;
    name: string
    category: string;
    subcategory?: string;
    brand?: string;
    color?: string;
    colors: string[];
    size?: string;
    season?: string;
    material?: string;
    purchaseDate?: Date;
    purchasePrice?: number;
    imageUrl: string;
    thumbnailUrl?: string;
    description?: string;
    tags: string[];
    isFavorite: boolean;
}
