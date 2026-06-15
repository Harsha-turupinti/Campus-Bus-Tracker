// Student profile for the logged-in student
// Boards at JNTU, heading to Vardhaman College of Engineering

export const studentProfile = {
  id: 'VCE-2024-1847',
  name: 'Harsh Sharma',
  email: 'harsh@vardhaman.org',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  section: 'CSE-A',
  rollNo: '21881A0547',

  // Transport assignment
  assignedBusId: 'b1',
  assignedRouteId: 'r1',
  boardingPointId: 's2',     // JNTU
  collegeStopId: 's14',      // Vardhaman College of Engineering

  // Schedule
  morningPickup: '07:55 AM',
  collegeArrival: '09:15 AM',
  eveningDeparture: '04:30 PM',
  eveningDrop: '06:00 PM',

  // Pass details
  passType: 'Annual Bus Pass',
  passNo: 'VCE-BP-2024-0547',
  passExpiry: '2027-05-31',
  passStatus: 'Active',
  amountPaid: '₹35,000',
}

// Enriched driver profiles
export const driverProfiles = {
  'b1': {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    license: 'TS-0920110054321',
    experience: '12 years',
    rating: 4.8,
    totalTrips: 4250,
    languages: 'Telugu, Hindi, English',
  },
  'b2': {
    name: 'Suresh Reddy',
    phone: '+91 91234 56780',
    license: 'TS-1120130012345',
    experience: '8 years',
    rating: 4.6,
    totalTrips: 2890,
    languages: 'Telugu, Hindi',
  },
  'b3': {
    name: 'Mohammed Irfan',
    phone: '+91 87654 32109',
    license: 'TS-0720140067890',
    experience: '10 years',
    rating: 4.9,
    totalTrips: 3710,
    languages: 'Telugu, Hindi, Urdu',
  },
}

// Today's commute timeline for the student (JNTU boarding)
export const commuteTimeline = [
  { time: '07:30 AM', event: 'Bus VCE-12 departed from Miyapur', status: 'completed', icon: 'depot' },
  { time: '07:55 AM', event: 'Arriving at JNTU — Your Boarding Point', status: 'current', icon: 'boarding' },
  { time: '08:05 AM', event: 'Expected at KPHB', status: 'upcoming', icon: 'stop' },
  { time: '08:12 AM', event: 'Expected at Kukatpally', status: 'upcoming', icon: 'stop' },
  { time: '08:22 AM', event: 'Expected at Moosapet', status: 'upcoming', icon: 'stop' },
  { time: '08:30 AM', event: 'Expected at Bharat Nagar', status: 'upcoming', icon: 'stop' },
  { time: '08:38 AM', event: 'Expected at Ameerpet', status: 'upcoming', icon: 'stop' },
  { time: '08:45 AM', event: 'Expected at Punjagutta', status: 'upcoming', icon: 'stop' },
  { time: '08:50 AM', event: 'Expected at Khairatabad', status: 'upcoming', icon: 'stop' },
  { time: '08:55 AM', event: 'Expected at Lakdikapul', status: 'upcoming', icon: 'stop' },
  { time: '09:00 AM', event: 'Expected at Mehdipatnam', status: 'upcoming', icon: 'stop' },
  { time: '09:08 AM', event: 'Expected at Aramghar', status: 'upcoming', icon: 'stop' },
  { time: '09:18 AM', event: 'Expected at Shamshabad', status: 'upcoming', icon: 'stop' },
  { time: '09:30 AM', event: 'Arrival at Vardhaman College of Engineering', status: 'upcoming', icon: 'college' },
]
