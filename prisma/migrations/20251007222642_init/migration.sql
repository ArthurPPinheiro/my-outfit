-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Shirts', 'Hoodies', 'Caps', 'Accessories', 'Shoes', 'Pants', 'Jackets', 'Shorts');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('Spring', 'Summer', 'Fall', 'Winter', 'All-Season');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothing_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "subcategory" TEXT,
    "brand" TEXT,
    "color" TEXT,
    "colors" TEXT[],
    "size" TEXT,
    "season" "Season",
    "material" TEXT,
    "purchase_date" DATE,
    "purchase_price" DECIMAL(10,2),
    "image_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clothing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "season" "Season",
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_items" (
    "id" TEXT NOT NULL,
    "outfit_id" TEXT NOT NULL,
    "clothing_item_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "clothing_items_user_id_idx" ON "clothing_items"("user_id");

-- CreateIndex
CREATE INDEX "clothing_items_category_idx" ON "clothing_items"("category");

-- CreateIndex
CREATE INDEX "clothing_items_season_idx" ON "clothing_items"("season");

-- CreateIndex
CREATE INDEX "outfits_user_id_idx" ON "outfits"("user_id");

-- CreateIndex
CREATE INDEX "outfits_season_idx" ON "outfits"("season");

-- CreateIndex
CREATE INDEX "outfit_items_outfit_id_idx" ON "outfit_items"("outfit_id");

-- CreateIndex
CREATE INDEX "outfit_items_clothing_item_id_idx" ON "outfit_items"("clothing_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_items_outfit_id_clothing_item_id_key" ON "outfit_items"("outfit_id", "clothing_item_id");

-- AddForeignKey
ALTER TABLE "clothing_items" ADD CONSTRAINT "clothing_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "clothing_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
