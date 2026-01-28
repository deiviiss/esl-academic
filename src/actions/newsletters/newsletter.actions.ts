'use server'

const mockLevels = [
  {
    id: 'level-1',
    name: 'Nursery'
  },
  {
    id: 'level-2',
    name: 'Pre-K'
  }
]


const mockNewsletters = [
  {
    id: 'nl-2025-03',
    title: 'March 2025 Newsletter',
    month: new Date('03-01-2025'),
    year: 2025,
    levels: [mockLevels[0], mockLevels[1]]
  },
  {
    id: 'nl-2025-02',
    title: 'February 2025 Newsletter',
    month: new Date('02-01-2025'),
    year: 2025,
    levels: [mockLevels[0], mockLevels[1]]
  },
  {
    id: 'nl-2025-01',
    title: 'January 2025 Newsletter',
    month: new Date('01-01-2025'),
    year: 2025,
    levels: [mockLevels[0], mockLevels[1]]
  }
]


const mockNewsletterDetail = {
  id: 'nl-2025-03',
  title: 'March 2025 Newsletter',
  month: new Date('03-01-2025'),
  year: 2025,
  forParents: [
    {
      id: 'fp-1',
      message: 'Bring crayons for Thursdays class. We will be doing a special art project.'
    },
    {
      id: 'fp-2',
      message: 'Please review and sign the permission form for our upcoming museum visit. The document is attached below and should be returned as soon as possible.',
      documentUrl: 'https://example.com/museum-permission-form.pdf'
    }
  ],

  levels: [mockLevels[0]],

  vocabularies: [
    {
      id: 'vocab-1',
      word: 'Apple',
      pronunciation: '/ˈæp.əl/',
      imageUrl: 'https://res.cloudinary.com/dhyds3mnm/image/upload/v1761364719/esl-academy/user-avatars/dcyu2yec0wcsttbbvhy3.jpg'
    },
    {
      id: 'vocab-2',
      word: 'Banana',
      pronunciation: '/bəˈnæn.ə/',
      imageUrl: 'https://res.cloudinary.com/dhyds3mnm/image/upload/v1761364719/esl-academy/user-avatars/dcyu2yec0wcsttbbvhy3.jpg'
    },
    {
      id: 'vocab-3',
      word: 'Orange',
      pronunciation: '/ˈɒr.ɪndʒ/',
      imageUrl: 'https://res.cloudinary.com/dhyds3mnm/image/upload/v1761364719/esl-academy/user-avatars/dcyu2yec0wcsttbbvhy3.jpg'
    },
    {
      id: 'vocab-4',
      word: 'Orange',
      pronunciation: '/ˈɒr.ɪndʒ/',
      imageUrl: 'https://res.cloudinary.com/dhyds3mnm/image/upload/v1761364719/esl-academy/user-avatars/dcyu2yec0wcsttbbvhy3.jpg'
    },
    {
      id: 'vocab-5',
      word: 'Orange',
      pronunciation: '/ˈɒr.ɪndʒ/',
      imageUrl: 'https://res.cloudinary.com/dhyds3mnm/image/upload/v1761364719/esl-academy/user-avatars/dcyu2yec0wcsttbbvhy3.jpg'
    },
    {
      id: 'vocab-6',
      word: 'Orange',
      pronunciation: '/ˈɒr.ɪndʒ/',
      imageUrl: 'https://res.cloudinary.com/dhyds3mnm/image/upload/v1761364719/esl-academy/user-avatars/dcyu2yec0wcsttbbvhy3.jpg'
    },
  ],

  videos: [
    {
      id: "vid_01",
      title: "Fruits",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208667/fruits_ro3evy.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_5,du_1/v1760208667/fruits_ro3evy.jpg",
    },
    {
      id: "vid_02",
      title: "Letters Sounds",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208664/letters_sound_oht6ga.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208664/letters_sound_oht6ga.jpg",
    },
    {
      id: "vid_03",
      title: "This is Time",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208666/this_is_time_acp795.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208666/this_is_time_acp795.jpg",
    },
    {
      id: "vid_04",
      title: "Sentences",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208662/sentences_use_i_like_i_want_orpgfk.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208662/sentences_use_i_like_i_want_orpgfk.jpg",
    },
    {
      id: "vid_05",
      title: "Parts of the House",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208660/parts_of_the_house_mtmva9.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208660/parts_of_the_house_mtmva9.jpg",
    },
    {
      id: "vid_06",
      title: "My Daily Routine",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208659/my_daily_routine_jpmusl.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208659/my_daily_routine_jpmusl.jpg",
    },
    {
      id: "vid_07",
      title: "Questions",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208658/questions_zr2d0c.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208658/questions_zr2d0c.jpg",
    },
    {
      id: "vid_08",
      title: "Sentences Describing Objects",
      videoUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208657/sentences_describing_objects_trzwqd.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208657/sentences_describing_objects_trzwqd.jpg",
    }
  ],

  playlist: {
    id: 'playlist-1',
    title: 'March Learning Playlist',
    links: [
      {
        id: 'pl-1',
        title: 'Fruit Song',
        url: 'https://youtube.com/watch?v=abc123'
      },
      {
        id: 'pl-2',
        title: 'Colors Song',
        url: 'https://youtube.com/watch?v=def456'
      }
    ],
    url: 'https://youtube.com/watch?v=def456'
  },

  createdAt: new Date()
}

/**
 * Fetches all newsletters associated with a specific level, ordered by year and month descending.
 */
export const getNewslettersByLevel = async (levelId: string) => {
  try {
    // const newsletters = await prisma.newsletter.findMany({
    //   where: {
    //     levels: {
    //       some: {
    //         id: levelId
    //       }
    //     }
    //   },
    //   include: {
    //     levels: true
    //   },
    //   orderBy: [
    //     { year: 'desc' },
    //     { month: 'desc' }
    //   ]
    // })

    // return newsletters
    return mockNewsletters.filter(newsletter =>
      newsletter.levels.some(level => level.id === levelId)
    )
  } catch (error) {
    console.error('Error fetching newsletters by level:', error)
    return []
  }
}

/**
 * Fetches all newsletters (for Admin), ordered by year and month descending.
 */
export const getAllNewsletters = async () => {
  try {
    // const newsletters = await prisma.newsletter.findMany({
    //   include: {
    //     levels: true
    //   },
    //   orderBy: [
    //     { year: 'desc' },
    //     { month: 'desc' }
    //   ]
    // })

    // return newsletters
    return mockNewsletters
  } catch (error) {
    console.error('Error fetching all newsletters:', error)
    return []
  }
}

/**
 * Fetches a single newsletter by ID with all its related content.
 */
export const getNewsletterById = async (id: string) => {
  try {
    // const newsletter = await prisma.newsletter.findUnique({
    //   where: { id },
    //   include: {
    //     vocabularies: true,
    //     videos: true,
    //     levels: true,
    //     forParents: true,
    //     playlist: {
    //       include: {
    //         links: true
    //       }
    //     }
    //   }
    // })

    // return newsletter
    if (id === mockNewsletterDetail.id) {
      return mockNewsletterDetail
    }

    return null
  } catch (error) {
    console.error('Error fetching newsletter by ID:', error)
    return null
  }
}
