import { Conversation } from "./types/Conversation";
import { Friend } from "./types/Friend";
import { PinnedMessage } from "./types/Message";

export const conversations: Conversation[] = [
	{
		id: '1',
		name: 'Beef Wellington',
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Beef_Wellington_%285317710650%29.jpg/450px-Beef_Wellington_%285317710650%29.jpg',
		lastMessage: 'Hey, will ya eat me?',
		time: '2 phút',
	},
	{
		id: '2',
		name: 'Leonardo da Vinci',
		avatar: 'https://www.hollywoodreporter.com/wp-content/uploads/2024/11/Portrait-of-Leonardo-da-Vinci-2.jpg?w=1200&h=674&crop=1',
		lastMessage: 'Hey, how are you?',
		time: '2 phút',
	},
	{
		id: '3',
		name: 'Bò',
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Limousinedeface.JPG/450px-Limousinedeface.JPG',
		lastMessage: 'Mooooooooo...',
		time: '10 phút',
	},
	{
		id: '4',
		name: 'Cát trên Sao Hoả',
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/480px-OSIRIS_Mars_true_color.jpg',
		lastMessage: 'Hạt bụi nào hoá kiếp thân tôi...',
		time: '1 giờ',
	},
	{
		id: '5',
		name: 'Einstein',
		lastMessage: 'E=mc^2 remember?',
		avatar: 'https://sohanews.sohacdn.com/160588918557773824/2022/1/16/albert-einstein-16423329346181127465252.jpg',
		time: '5 giờ',
	},
	{
		id: '6',
		name: 'Elon Musk',
		lastMessage: 'Got it, thanks!',
		avatar: 'https://cdnmedia.baotintuc.vn/Upload/G5r0l6AdtRt8AnPUeQGMA/files/2024/12/2712/2712-elonmusk.jpg',
		time: '6 giờ',
	},
	{
		id: '7',
		name: 'Luffy',
		lastMessage: 'I will be the Pirate King!',
		avatar: 'https://preview.redd.it/yc40cow4tr691.png?auto=webp&s=0634e4b596dec75e35a2e138eac1ee075ffdd910',
		time: '6 giờ',
	},
	{
		id: '8',
		name: 'Cristiano Ronaldo',
		lastMessage: 'See you then!',
		avatar: 'https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA',
		time: '7 giờ',
	},
	{
		id: '9',
		name: 'Trực Tiếp Game',
		lastMessage: 'Hê lô ae hé hé hé heee',
		avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_kt-sUf4kFDrZ4iaFcyK4EHwVz-jlvQBwjZSA6hQ9ogPEg=s900-c-k-c0x00ffffff-no-rj',
		time: '1 ngày',
	},
	{
		id: '10',
		name: 'Cát trên Sao Hoả',
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/480px-OSIRIS_Mars_true_color.jpg',
		lastMessage: 'Hạt bụi nào hoá kiếp thân tôi...',
		time: '1 giờ',
	},
	{
		id: '11',
		name: 'Einstein',
		lastMessage: 'E=mc^2 remember?',
		avatar: 'https://sohanews.sohacdn.com/160588918557773824/2022/1/16/albert-einstein-16423329346181127465252.jpg',
		time: '5 giờ',
	},
	{
		id: '12',
		name: 'Elon Musk',
		lastMessage: 'Got it, thanks!',
		avatar: 'https://cdnmedia.baotintuc.vn/Upload/G5r0l6AdtRt8AnPUeQGMA/files/2024/12/2712/2712-elonmusk.jpg',
		time: '6 giờ',
	},
	{
		id: '13',
		name: 'Luffy',
		lastMessage: 'I will be the Pirate King!',
		avatar: 'https://preview.redd.it/yc40cow4tr691.png?auto=webp&s=0634e4b596dec75e35a2e138eac1ee075ffdd910',
		time: '6 giờ',
	},
	{
		id: '14',
		name: 'Cristiano Ronaldo',
		lastMessage: 'See you then!',
		avatar: 'https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA',
		time: '7 giờ',
	},
	{
		id: '15',
		name: 'Trực Tiếp Game',
		lastMessage: 'Hê lô ae hé hé hé heee',
		avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_kt-sUf4kFDrZ4iaFcyK4EHwVz-jlvQBwjZSA6hQ9ogPEg=s900-c-k-c0x00ffffff-no-rj',
		time: '1 ngày',
	},
	{
		id: '16',
		name: 'Cát trên Sao Hoả',
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/480px-OSIRIS_Mars_true_color.jpg',
		lastMessage: 'Hạt bụi nào hoá kiếp thân tôi...',
		time: '1 giờ',
	},
	{
		id: '17',
		name: 'Einstein',
		lastMessage: 'E=mc^2 remember?',
		avatar: 'https://sohanews.sohacdn.com/160588918557773824/2022/1/16/albert-einstein-16423329346181127465252.jpg',
		time: '5 giờ',
	},
	{
		id: '18',
		name: 'Elon Musk',
		lastMessage: 'Got it, thanks!',
		avatar: 'https://cdnmedia.baotintuc.vn/Upload/G5r0l6AdtRt8AnPUeQGMA/files/2024/12/2712/2712-elonmusk.jpg',
		time: '6 giờ',
	},
	{
		id: '19',
		name: 'Luffy',
		lastMessage: 'I will be the Pirate King!',
		avatar: 'https://preview.redd.it/yc40cow4tr691.png?auto=webp&s=0634e4b596dec75e35a2e138eac1ee075ffdd910',
		time: '6 giờ',
	},
	{
		id: '20',
		name: 'Cristiano Ronaldo',
		lastMessage: 'See you then!',
		avatar: 'https://lh3.googleusercontent.com/proxy/tm1RJoA6rodhWBKMGRfzeR74pIbdxub44suRwIU0sEoJmhWqKL6fdcu2dam9sX15_HKYaodIjV_63KdvKVR9OIxN6tq9hL2NsGJMDSjwdOowrZrKnJWaCT2AC3HI6KjJyAkf0S9y6wBzJVzblA',
		time: '7 giờ',
	},
];


export const linkUrls = [
	'https://images.unsplash.com/photo-1601758003122-53c40e686a17',
	'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
	'https://images.unsplash.com/photo-1521747116042-5a810fda9664',
	'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
	'https://images.unsplash.com/photo-1517841905240-472988babdf9',
	'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0',
	'https://images.unsplash.com/photo-1521336575822-7a5f1f1963d5',
	'https://images.unsplash.com/photo-1552058544-f2b08422138a',
	'https://images.unsplash.com/photo-1520719627573-5e2c1a6610f0',
	'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
	'https://images.unsplash.com/photo-1524275809401-f5e7b22c3a96',
	'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
	'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb',
	'https://images.unsplash.com/photo-1540202404-4ea44af5a6c0',
	'https://images.unsplash.com/photo-1519337265831-281ec6cc8514',
	'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8',
	'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8',
	'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
	'https://images.unsplash.com/photo-1516534775068-ba3e7458af70',
	'https://images.unsplash.com/photo-1504826260979-242151ee45b7',
  ];
  
  export const friendsData: Friend[] = [
    {
        id: "1",
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        mutualFriends: 5,
    },
    {
        id: "2",
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        mutualFriends: 8,
    },
    {
        id: "3",
        name: "Michael Johnson",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        mutualFriends: 12,
    },
    {
        id: "4",
        name: "Emily Davis",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        mutualFriends: 7,
    },
    {
        id: "5",
        name: "Chris Wilson",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        mutualFriends: 3,
    },
    {
        id: "6",
        name: "Olivia Brown",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
        mutualFriends: 10,
    },
    {
        id: "7",
        name: "Daniel White",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
        mutualFriends: 6,
    },
    {
        id: "8",
        name: "Sophia Martinez",
        avatar: "https://randomuser.me/api/portraits/women/8.jpg",
        mutualFriends: 4,
    },
    {
        id: "9",
        name: "James Taylor",
        avatar: "https://randomuser.me/api/portraits/men/9.jpg",
        mutualFriends: 9,
    },
    {
        id: "10",
        name: "Isabella Anderson",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
        mutualFriends: 11,
    },
];



export const pinnedMessagesData: PinnedMessage[] = [
    {
      id: '1',
	  user: 'Alice',
      name: 'Alice',
	  avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
      message: 'Remember the meeting at 10 AM tomorrow.',
      timestamp: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
	  user: 'Bob',
      name: 'Bob',
	  avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      message: 'Deadline for project submission is next Friday.Deadline for project submission is next Friday.Deadline for project submission is next Friday.Deadline for project submission is next Friday.Deadline for project submission is next Friday.Deadline for project submission is next Friday.Deadline for project submission is next Friday.Deadline for project submission is next Friday.Deadline for project submission is next Friday.',
      timestamp: '2024-01-02T15:30:00Z'
    },
    {
      id: '3',
	  user: 'Charlie',
      name: 'Charlie',
	  avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      message: 'Happy New Year everyone!',
      timestamp: '2024-01-01T00:00:00Z'
    },
	
    {
		id: '4',
		user: 'Charlie',
		name: 'Charlie',
		avatar: "https://randomuser.me/api/portraits/women/4.jpg",
		message: 'Happy New Year everyone!',
		timestamp: '2024-01-01T00:00:00Z'
	  }
];




