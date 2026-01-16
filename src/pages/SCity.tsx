import { Link } from 'react-router-dom';

// Real Snoonu S City category images
const categories = [
  { 
    name: 'Events', 
    image: 'https://images.snoonu.com/ContentManagementSystem/SCity/9e8cff22-f9b8-4c78-8374-4e9b0fa12b7d_Events.png'
  },
  { 
    name: 'Leisure & Activities', 
    image: 'https://images.snoonu.com/ContentManagementSystem/SCity/eaf9a00b-478a-484b-80f3-0880c11ec9e4_Leisure.png'
  },
  { 
    name: 'Learning & Development', 
    image: 'https://images.snoonu.com/ContentManagementSystem/SCity/11f86731-b068-4512-894b-0c1682417c88_Learning.png'
  },
  { 
    name: 'Sports', 
    image: 'https://images.snoonu.com/ContentManagementSystem/SnoofunMock/b7f78fcf-2b48-46f2-b41a-a6f0228e5235_football.png'
  },
  { 
    name: 'Tours & Travel', 
    image: 'https://images.snoonu.com/ContentManagementSystem/SCity/f377cdba-01d1-488a-8672-7d7667571dbb_Travel.png'
  },
  { 
    name: 'Beauty & Wellness', 
    image: 'https://images.snoonu.com/ContentManagementSystem/SCity/c94b595a-4ed5-49ed-a46b-99b95185794a_SWellness.png'
  },
];

// Real events from Snoonu S City
const events = [
  {
    id: 1,
    title: 'Experience Qatar - Full Day Desert Adventure Experience',
    category: 'Leisure & Activities',
    date: '16 Jan',
    time: '12:00 AM',
    price: 'from 50 QR',
    image: 'https://images.snoonu.com/snoofun/2026-01/f72ebff7-e1e7-41ed-9baf-bdd51ef7eaa8_output.png',
    hasRegister: true,
  },
  {
    id: 2,
    title: 'Experience Qatar - Inland Sea Desert Picnic Experience',
    category: 'Leisure & Activities',
    date: '16 Jan',
    time: '12:00 AM',
    price: 'from 1001 QR',
    image: 'https://images.snoonu.com/snoofun/2026-01/2a510b0f-922b-4d9f-8478-15e030df4699_output.png',
    hasRegister: true,
  },
  {
    id: 3,
    title: 'Qatar Plastica Conference 2026 - When Innovation Meets Elegance',
    category: 'Learning & Development',
    date: '16 Jan',
    time: '4:00 AM',
    price: '',
    image: 'https://images.snoonu.com/snoofun/2026-01/cbeb4abe-e376-4012-8788-689e43e05b36_output.png',
    hasRegister: false,
  },
  {
    id: 4,
    title: 'Arabian Adventures - Dhow Cruise',
    category: 'Tours & Travel',
    date: '16 Jan',
    time: '5:00 AM',
    price: 'from 220 QR',
    image: 'https://images.snoonu.com/snoofun/2025-12/302299ae-8f17-4d30-94e0-0d949545ff13_output.png',
    hasRegister: true,
  },
  {
    id: 5,
    title: 'Arabian Adventures - Shahaniya Tour',
    category: 'Tours & Travel',
    date: '16 Jan',
    time: '6:00 AM',
    price: 'from 250 QR',
    image: 'https://images.snoonu.com/snoofun/2025-12/6d5b20de-9921-4ac8-bf59-e406e5c97c1e_output.png',
    hasRegister: true,
  },
  {
    id: 6,
    title: 'Experience Qatar - Fishing Trip Experience (The Pearl)',
    category: 'Leisure & Activities',
    date: '16 Jan',
    time: '6:00 AM',
    price: 'from 2000 QR',
    image: 'https://images.snoonu.com/snoofun/2026-01/d0de3e18-ed97-413f-844d-48f082e00aa0_output.png',
    hasRegister: true,
  },
  {
    id: 7,
    title: 'Arabian Adventures - Camp Rental (7 Hours)',
    category: 'Tours & Travel',
    date: '16 Jan',
    time: '6:00 AM',
    price: 'from 130 QR',
    image: 'https://images.snoonu.com/snoofun/2025-12/2bcf3d1e-6cb2-422f-b979-7b8b85642101_output.png',
    hasRegister: true,
  },
  {
    id: 8,
    title: 'Arabian Adventures - Half-Day Desert Safari',
    category: 'Tours & Travel',
    date: '16 Jan',
    time: '6:00 AM',
    price: 'from 160 QR',
    image: 'https://images.snoonu.com/snoofun/2025-12/6b0a3063-6895-4e34-ab89-a81e56aebf91_output.png',
    hasRegister: true,
  },
  {
    id: 9,
    title: 'Experience Qatar - Desert Essentials Experience (Half-Day)',
    category: 'Leisure & Activities',
    date: '16 Jan',
    time: '6:00 AM',
    price: 'from 25 QR',
    image: 'https://images.snoonu.com/snoofun/2026-01/f85a6a4d-1c4b-43ae-b717-713f62e4e96b_output.png',
    hasRegister: true,
  },
  {
    id: 10,
    title: 'Fällä – Self-Driven Solar-Powered Boat',
    category: 'Leisure & Activities',
    date: '16 Jan',
    time: '6:00 AM',
    price: 'from 240 QR',
    image: 'https://images.snoonu.com/snoofun/2025-08/17436b22-569e-4444-83ee-d84f22f46996_output.png',
    hasRegister: true,
  },
];

const filters = ['Today', 'Tomorrow', 'This week', 'This month'];

// Snoonu S logo icon for Register badge
const SnoonuIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#snoonu_svg__a)">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.128 10.667c2.552 0 4.079-1.392 4.079-3.146 0-2.713-4.489-2.442-4.489-3.363 0-.307.336-.614 1.006-.614 1.08 0 2.16.597 2.625 1.085l1.378-1.718C10.74 2.025 9.231 1.5 7.722 1.5H.727l.014.082C1.05 2.996 1.957 3.87 3.558 4.286c-.392.084-.81.28-1.107.495.552.935 2.178 1.72 3.997 2.224.99.308 1.89.5 1.89 1.004 0 .343-.372.633-.95.633-1.267 0-2.645-.778-3.204-1.357l-1.51 1.79c1.099 1.03 2.795 1.592 4.452 1.592h.002Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="snoonu_svg__a">
        <path fill="currentColor" transform="translate(.227)" d="M0 0h12v12H0z"/>
      </clipPath>
    </defs>
  </svg>
);

// Calendar icon for Date filter
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#calendar_svg__a)" fill="currentColor">
      <path d="M10.227 7.5a.952.952 0 1 0 0 1.905.952.952 0 0 0 0-1.905ZM5.941 13.214a.952.952 0 1 0 0 1.905.952.952 0 0 0 0-1.905ZM10.227 13.214a.952.952 0 1 0 0 1.905.952.952 0 0 0 0-1.905ZM13.56 14.166a.952.952 0 1 1 1.905 0 .952.952 0 0 1-1.905 0ZM4.989 8.452a.952.952 0 1 1 1.905 0 .952.952 0 0 1-1.905 0ZM14.513 7.5a.952.952 0 1 0 0 1.905.952.952 0 0 0 0-1.905ZM13.56 11.31a.952.952 0 1 1 1.905 0 .952.952 0 0 1-1.905 0ZM5.941 10.357a.952.952 0 1 0 0 1.905.952.952 0 0 0 0-1.905ZM9.275 11.31a.952.952 0 1 1 1.904 0 .952.952 0 0 1-1.904 0Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M.227 3.69A2.857 2.857 0 0 1 3.084.833H17.37a2.857 2.857 0 0 1 2.857 2.857v12.381a2.857 2.857 0 0 1-2.857 2.857H3.084a2.857 2.857 0 0 1-2.857-2.857V3.691Zm1.905 2.857c0-.526.426-.952.952-.952H17.37c.526 0 .952.426.952.952v9.524a.952.952 0 0 1-.952.953H3.084a.952.952 0 0 1-.952-.953V6.547Z"/>
    </g>
    <defs>
      <clipPath id="calendar_svg__a">
        <path fill="#fff" transform="translate(.227)" d="M0 0h20v20H0z"/>
      </clipPath>
    </defs>
  </svg>
);

// Register badge icon with S logo
const RegisterIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.227" cy="10" r="10" fill="#D90217"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M10.985 14.167c2.145 0 3.43-1.17 3.43-2.646 0-2.28-3.775-2.053-3.775-2.827 0-.259.282-.517.845-.517.91 0 1.817.502 2.208.913l1.16-1.445C13.74 5.025 12.231 4.5 10.722 4.5H5.602l.012.068c.258 1.19 1.023 1.924 2.369 2.274-.33.07-.681.236-.931.416.464.787 1.83 1.446 3.36 1.871.834.258 1.59.42 1.59.844 0 .288-.313.532-.799.532-1.065 0-2.224-.654-2.694-1.14l-1.27 1.504c.924.867 2.35 1.339 3.744 1.339h.002Z" fill="#fff"/>
  </svg>
);

export default function SCity() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center">
          <li>
            <Link to="/" className="hover:text-snoonu-red underline">Home Page</Link>
          </li>
          <li className="mx-2 text-gray-400">›</li>
          <li className="text-gray-900">S City</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-[40px] font-bold mb-8 text-gray-900">S City</h1>

      {/* Categories Carousel */}
      <div className="relative mb-8">
        {/* Navigation Arrows */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 border border-gray-100">
          <svg viewBox="0 0 13 12" fill="none" className="w-4 h-4">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.52 1.2 1.925 6l5.595 4.8 1.005-1.174L4.298 6l4.227-3.626L7.52 1.2Z" fill="currentColor"/>
          </svg>
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 border border-gray-100">
          <svg viewBox="0 0 21 20" fill="none" className="w-4 h-4">
            <path fillRule="evenodd" clipRule="evenodd" d="m7.8 2 9.325 8L7.8 18l-1.675-1.956L13.17 10 6.125 3.956 7.8 2Z" fill="currentColor"/>
          </svg>
        </button>

        {/* Categories */}
        <div className="flex gap-8 overflow-x-auto pb-2 px-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer"
            >
              <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform shadow-sm">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-center text-gray-900 max-w-[100px]">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8 flex-wrap items-center">
        {/* Date Filter with Icon */}
        <button className="px-4 py-2.5 border border-gray-200 rounded-full text-sm hover:border-gray-400 transition-colors flex items-center gap-2 bg-white">
          <CalendarIcon />
          <span className="font-medium">Date</span>
        </button>
        
        {/* Quick Filters */}
        {filters.map((filter) => (
          <button
            key={filter}
            className="px-4 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-400 transition-colors bg-white"
          >
            {filter}
          </button>
        ))}

        {/* Register Filter */}
        <button className="px-4 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-400 transition-colors flex items-center gap-2 bg-white">
          <RegisterIcon />
          <span>Register</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => (
          <a
            key={event.id}
            href="#"
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group"
          >
            {/* Event Image */}
            <div className="relative aspect-[4/3]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {event.hasRegister && (
                <span className="absolute top-3 right-3 bg-[#f3e8e9] text-snoonu-red text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1">
                  <SnoonuIcon />
                  Register
                </span>
              )}
            </div>
            
            {/* Event Content */}
            <div className="p-4">
              {/* Date and Time */}
              <p className="text-sm font-medium text-gray-900 mb-1">
                {event.date}
                <br />
                <span className="text-gray-500">{event.time}</span>
              </p>
              
              {/* Category */}
              <p className="text-xs text-gray-400 mb-2">{event.category}</p>
              
              {/* Title */}
              <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                {event.title}
              </h3>
              
              {/* Price */}
              {event.price && (
                <p className="text-xs text-gray-500">{event.price}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
