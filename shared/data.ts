export const artistsData = [
  {
    id: 1,
    name: "Mila",
    slug: "mila",
    bio: "Specializing in fine line work and delicate botanicals",
    specialties: ["Fine Line", "Botanicals", "Minimalist"],
    profileImage: "https://images.unsplash.com/photo-1542717309-4256ee08c548",
    instagram: "@mila.ink",
    experience: "8 years",
    style: "Contemporary minimalism with a focus on natural elements",
    portfolioItems: [
      {
        id: 1,
        artistId: 1,
        imageUrl: "https://images.unsplash.com/photo-1542717309-4256ee08c549",
        title: "Botanical Sleeve",
        description: "Delicate floral arrangement with fine line work",
        createdAt: new Date("2024-01-15")
      },
      {
        id: 2,
        artistId: 1,
        imageUrl: "https://images.unsplash.com/photo-1542717309-4256ee08c550",
        title: "Minimalist Geometric",
        description: "Abstract geometric patterns with subtle shading",
        createdAt: new Date("2024-02-01")
      }
    ]
  },
  {
    id: 2,
    name: "Yi",
    slug: "yi",
    bio: "Master of traditional Asian art and contemporary fusion",
    specialties: ["Traditional Asian", "Contemporary", "Color Work"],
    profileImage: "https://images.unsplash.com/photo-1542717309-4256ee08c551",
    instagram: "@yi.tattoo",
    experience: "12 years",
    style: "Fusion of traditional Asian artistry with modern techniques",
    portfolioItems: [
      {
        id: 3,
        artistId: 2,
        imageUrl: "https://images.unsplash.com/photo-1542717309-4256ee08c552",
        title: "Dragon Sleeve",
        description: "Traditional Asian dragon with modern color work",
        createdAt: new Date("2024-01-20")
      },
      {
        id: 4,
        artistId: 2,
        imageUrl: "https://images.unsplash.com/photo-1542717309-4256ee08c553",
        title: "Koi Fish Back Piece",
        description: "Large scale traditional meets contemporary",
        createdAt: new Date("2024-02-05")
      }
    ]
  }
];