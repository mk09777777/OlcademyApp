export const mockEvents = [
    {
      id: '1',
      title: 'Summer Music Festival',
      date: 'July 15, 2025',
      startTime: '4:00 PM',
      endTime: '11:00 PM',
      location: 'Riverside Park Amphitheater',
      status: 'active',
      type: 'show',
      image: require('../assets/images/music.jpg'),
      attendees: 1248,
      dateTime: "2025-03-15T10:00:00Z", // Event Date
      registrationDate: "2025-03-01T23:59:59Z",
      description: 'Experience the ultimate summer music festival featuring top artists across multiple genres.',
      isLive: true,
      performers: [
        { id: 1, name: 'Lunar Echo', genre: 'Alternative Rock' },
        { id: 2, name: 'DJ Solstice', genre: 'Electronic' },
      ],
      schedule: [
        { time: '4:00 PM', title: 'Gates Open', description: 'Early access to food court' },
        { time: '5:30 PM', title: 'Opening Acts', description: 'Local bands perform' },
      ]
    },

    {
      id:'2',
      title: 'Rock Concert: Thunder Strike',
      category: 'concert',
      date: 'October 25, 2025',
      startTime: '9:00 AM',
      endTime: '6:00 PM',
      location: 'Metropolitan Convention Center',
      status: 'past',
      type: 'conference',
      image: require('../assets/images/music.jpg'),
      attendees: 850,
      dateTime: "2025-03-15T10:00:00Z", // Event Date
      registrationDate: "2025-03-01T23:59:59Z",
      description: 'Join industry leaders for a day of innovation and networking in the tech world.',
      isLive: false,
      performers: [
        { id: 5, name: 'Chef Maria Garcia', genre: 'Modern Cuisine' },
        { id: 6, name: 'Sommelier Jack Wright', genre: 'Wine Tasting' },
      ],
      schedule: [
        { time: '9:00 AM', title: 'Registration', description: 'Check-in and breakfast' },
        { time: '10:00 AM', title: 'Keynote', description: 'Live cooking demonstration' },
      ]
    },
    {
      id: '3',
      title: 'Food & Wine Festival',
      date: 'September 5, 2025',
      startTime: '12:00 PM',
      endTime: '8:00 PM',
      location: 'Downtown Food District',
      status: 'past',
      type: 'festival',
      attendees: 2000,
      image: require('../assets/images/concert.jpg'),
      dateTime: "2025-03-15T10:00:00Z", // Event Date
      registrationDate: "2025-03-01T23:59:59Z",
      description: 'Savor the finest cuisine and wines from top local restaurants and wineries.',
      isLive: false,
      performers: [
        { id: 5, name: 'Chef Maria Garcia', genre: 'Modern Cuisine' },
        { id: 6, name: 'Sommelier Jack Wright', genre: 'Wine Tasting' },
      ],
      schedule: [
        { time: '12:00 PM', title: 'Festival Opens', description: 'All venues begin serving' },
        { time: '2:00 PM', title: 'Cooking Demo', description: 'Live cooking demonstration' },
      ]
    },
    {
      id: '7',
      title: 'New Year Comedy Night',
      date: 'December 31, 2025',
      startTime: '8:00 PM',
      endTime: '1:00 AM',
      location: 'Laugh Factory Theater',
      status: 'upcoming',
      type: 'show',
      image: require('../assets/images/concert.jpg'),
      attendees: 600,
      dateTime: "2025-12-31T20:00:00Z",
      registrationDate: "2025-11-30T23:59:59Z",
      description: 'Ring in the new year with top comedians and special surprise guests.',
      isLive: false,
      performers: [
        { id: 13, name: 'Mike Johnson', genre: 'Stand-up Comedy' },
        { id: 14, name: 'Sarah Lewis', genre: 'Improv Comedy' },
      ],
      schedule: [
        { time: '8:00 PM', title: 'Doors Open', description: 'Seating begins' },
        { time: '9:00 PM', title: 'Show Starts', description: 'Opening act' },
        { time: '12:00 AM', title: 'New Year Countdown', description: 'Celebration' },
      ]
    }
  ];
  