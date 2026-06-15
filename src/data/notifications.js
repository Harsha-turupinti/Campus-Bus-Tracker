// Realistic notifications for the VCE bus tracking system

export const notifications = [
  {
    id: 'n1',
    type: 'delay',
    title: 'Bus VCE-12 Delayed',
    body: 'Your bus is delayed by 10 minutes due to heavy traffic near Ameerpet junction.',
    time: '5 min ago',
    route: 'r1',
    severity: 'high',
    read: false
  },
  {
    id: 'n2',
    type: 'update',
    title: 'Bus Departed from Kukatpally',
    body: 'VCE-12 has departed from Kukatpally stop. Next stop: Moosapet.',
    time: '12 min ago',
    route: 'r1',
    severity: 'low',
    read: false
  },
  {
    id: 'n3',
    type: 'arrival',
    title: 'Arriving at JNTU in 5 minutes',
    body: 'Your bus VCE-12 will arrive at JNTU boarding point in approximately 5 minutes. Please be ready.',
    time: '2 min ago',
    route: 'r1',
    severity: 'medium',
    read: false
  },
  {
    id: 'n4',
    type: 'schedule',
    title: 'Morning Schedule Update',
    body: 'Due to Hyderabad Metro construction near Ameerpet, buses may take alternate route via Jubilee Hills.',
    time: '1 hr ago',
    route: 'r1',
    severity: 'medium',
    read: false
  },
  {
    id: 'n5',
    type: 'delay',
    title: 'VCE-07 Running Late',
    body: 'Bus VCE-07 on Miyapur route is delayed by 15 minutes near Mehdipatnam due to waterlogging.',
    time: '20 min ago',
    route: 'r1',
    severity: 'high',
    read: false
  },
  {
    id: 'n6',
    type: 'update',
    title: 'VCE-03 Departed',
    body: 'Secunderabad route bus VCE-03 has departed from Secunderabad Station on schedule.',
    time: '30 min ago',
    route: 'r2',
    severity: 'low',
    read: true
  },
  {
    id: 'n7',
    type: 'alert',
    title: 'Weather Advisory',
    body: 'Heavy rain expected in Shamshabad area. Buses may experience 10-15 minute delays on arrival at VCE campus.',
    time: '45 min ago',
    route: null,
    severity: 'medium',
    read: false
  },
  {
    id: 'n8',
    type: 'maintenance',
    title: 'Bus VCE-09 Under Maintenance',
    body: 'LB Nagar route bus VCE-09 is under maintenance. VCE-15 is covering the route today.',
    time: '2 hrs ago',
    route: 'r3',
    severity: 'low',
    read: true
  },
  {
    id: 'n9',
    type: 'update',
    title: 'VCE-12 Reached Aramghar',
    body: 'Your evening return bus VCE-12 has reached Aramghar. Expected at college pickup point by 04:25 PM.',
    time: '3 hrs ago',
    route: 'r1',
    severity: 'low',
    read: true
  },
  {
    id: 'n10',
    type: 'schedule',
    title: 'Saturday Schedule',
    body: 'Reminder: Saturday buses operate on reduced schedule. Only 2 buses per route. First departure at 08:00 AM.',
    time: '1 day ago',
    route: null,
    severity: 'low',
    read: true
  }
]
