import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...')

  // 1️⃣ Create Users
  const user = await prisma.user.upsert({
    where: { email: 'arthur@example.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'arthur@example.com',
      username: 'arthurpinheiro',
      passwordHash: 'hashed_password_here',
      fullName: 'Arthur Pinheiro',
      avatarUrl: 'https://i.pravatar.cc/150?u=arthur',
    },
  })

  console.log('👤 User created:', user.username)

  // 2️⃣ Create Clothing Items
  const clothingItems = await prisma.clothingItem.createMany({
    data: [
      {
        id: randomUUID(),
        userId: user.id,
        name: 'White T-Shirt',
        category: 'Shirts',
        color: 'White',
        colors: ['White'],
        brand: 'Uniqlo',
        size: 'M',
        season: 'Summer',
        material: 'Cotton',
        imageUrl: 'https://example.com/images/white-tshirt.jpg',
        tags: ['casual', 'basic'],
      },
      {
        id: randomUUID(),
        userId: user.id,
        name: 'Blue Jeans',
        category: 'Pants',
        color: 'Blue',
        colors: ['Blue'],
        brand: 'Levi’s',
        size: '32',
        season: 'AllSeason',
        material: 'Denim',
        imageUrl: 'https://example.com/images/blue-jeans.jpg',
        tags: ['casual', 'denim'],
      },
      {
        id: randomUUID(),
        userId: user.id,
        name: 'Leather Jacket',
        category: 'Jackets',
        color: 'Black',
        colors: ['Black'],
        brand: 'Zara',
        size: 'M',
        season: 'Fall',
        material: 'Leather',
        imageUrl: 'https://example.com/images/leather-jacket.jpg',
        tags: ['cool', 'night-out'],
      },
      {
        id: randomUUID(),
        userId: user.id,
        name: 'Sneakers',
        category: 'Shoes',
        color: 'White',
        colors: ['White'],
        brand: 'Nike',
        size: '42',
        season: 'AllSeason',
        material: 'Synthetic',
        imageUrl: 'https://example.com/images/sneakers.jpg',
        tags: ['sporty', 'casual'],
      },
    ],
  })

  console.log(`👕 Created ${clothingItems.count} clothing items`)

  // 3️⃣ Create Outfits
  const allItems = await prisma.clothingItem.findMany({
    where: { userId: user.id },
  })

  const jeans = allItems.find((i) => i.name === 'Blue Jeans')
  const tshirt = allItems.find((i) => i.name === 'White T-Shirt')
  const sneakers = allItems.find((i) => i.name === 'Sneakers')
  const jacket = allItems.find((i) => i.name === 'Leather Jacket')

  const outfit = await prisma.outfit.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      name: 'Casual Street Style',
      description: 'Simple white tee with jeans and sneakers for a comfy look.',
      imageUrl: 'https://example.com/images/outfit1.jpg',
      season: 'AllSeason',
      outfitItems: {
        create: [
          { clothingItemId: tshirt!.id },
          { clothingItemId: jeans!.id },
          { clothingItemId: sneakers!.id },
        ],
      },
    },
  })

  const fallOutfit = await prisma.outfit.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      name: 'Fall Night Out',
      description: 'Leather jacket with jeans and sneakers for cool evenings.',
      imageUrl: 'https://example.com/images/outfit2.jpg',
      season: 'Fall',
      outfitItems: {
        create: [
          { clothingItemId: jacket!.id },
          { clothingItemId: jeans!.id },
          { clothingItemId: sneakers!.id },
        ],
      },
    },
  })

  console.log(`🧥 Created outfits: ${outfit.name}, ${fallOutfit.name}`)

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })