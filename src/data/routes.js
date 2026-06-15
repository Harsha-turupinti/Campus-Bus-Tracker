// Hyderabad → Vardhaman College of Engineering routes
// Real GPS coordinates along the Miyapur->Shamshabad corridor

export const routes = [
  {
    id: 'r1',
    name: 'Miyapur -> VCE',
    description: 'Main corridor from Miyapur through Hyderabad city center to Vardhaman College of Engineering, Shamshabad.',
    estimatedTime: '90 min',
    activeBuses: 3,
    frequency: 'Every 20 min',
    color: '#06b6d4',
    stops: [
      { id: 's1',  name: 'Miyapur',           lat: 17.4969, lng: 78.3548 },
      { id: 's2',  name: 'JNTU',              lat: 17.4932, lng: 78.3914 },
      { id: 's3',  name: 'KPHB',              lat: 17.4849, lng: 78.3990 },
      { id: 's4',  name: 'Kukatpally',        lat: 17.4947, lng: 78.3996 },
      { id: 's5',  name: 'Moosapet',          lat: 17.4687, lng: 78.4272 },
      { id: 's6',  name: 'Bharat Nagar',      lat: 17.4510, lng: 78.4380 },
      { id: 's7',  name: 'Ameerpet',          lat: 17.4375, lng: 78.4483 },
      { id: 's8',  name: 'Punjagutta',        lat: 17.4283, lng: 78.4510 },
      { id: 's9',  name: 'Khairatabad',       lat: 17.4156, lng: 78.4606 },
      { id: 's10', name: 'Lakdikapul',        lat: 17.4035, lng: 78.4699 },
      { id: 's11', name: 'Mehdipatnam',       lat: 17.3950, lng: 78.4422 },
      { id: 's12', name: 'Aramghar',          lat: 17.3559, lng: 78.4526 },
      { id: 's13', name: 'Shamshabad',        lat: 17.2543, lng: 78.4290 },
      { id: 's14', name: 'Vardhaman College of Engineering', lat: 17.2546, lng: 78.3070 }
    ]
  },
  {
    id: 'r2',
    name: 'Secunderabad -> VCE',
    description: 'Northern route via Secunderabad, Begumpet, and Nampally to Vardhaman College.',
    estimatedTime: '85 min',
    activeBuses: 2,
    frequency: 'Every 25 min',
    color: '#10b981',
    stops: [
      { id: 's15', name: 'Secunderabad Station',   lat: 17.4344, lng: 78.5013 },
      { id: 's16', name: 'Paradise',               lat: 17.4404, lng: 78.4841 },
      { id: 's17', name: 'Begumpet',               lat: 17.4399, lng: 78.4640 },
      { id: 's18', name: 'Nampally',               lat: 17.3920, lng: 78.4720 },
      { id: 's19', name: 'Mehdipatnam',             lat: 17.3950, lng: 78.4422 },
      { id: 's20', name: 'Attapur',                lat: 17.3719, lng: 78.4295 },
      { id: 's21', name: 'Aramghar',               lat: 17.3559, lng: 78.4526 },
      { id: 's22', name: 'Vardhaman College of Engineering', lat: 17.2546, lng: 78.3070 }
    ]
  },
  {
    id: 'r3',
    name: 'LB Nagar -> VCE',
    description: 'Eastern route from LB Nagar via Dilsukhnagar and Koti.',
    estimatedTime: '80 min',
    activeBuses: 2,
    frequency: 'Every 30 min',
    color: '#f59e0b',
    stops: [
      { id: 's23', name: 'LB Nagar',         lat: 17.3462, lng: 78.5525 },
      { id: 's24', name: 'Dilsukhnagar',     lat: 17.3688, lng: 78.5247 },
      { id: 's25', name: 'Koti',             lat: 17.3861, lng: 78.4849 },
      { id: 's26', name: 'Nampally',         lat: 17.3920, lng: 78.4720 },
      { id: 's27', name: 'Mehdipatnam',      lat: 17.3950, lng: 78.4422 },
      { id: 's28', name: 'Shamshabad',       lat: 17.2543, lng: 78.4290 },
      { id: 's29', name: 'Vardhaman College of Engineering', lat: 17.2546, lng: 78.3070 }
    ]
  },
  {
    id: 'r4',
    name: 'Shaikpet -> VCE',
    description: 'Western route via Shaikpet, Manikonda, and Narsingi to Vardhaman College.',
    estimatedTime: '65 min',
    activeBuses: 1,
    frequency: 'Every 40 min',
    color: '#8b5cf6',
    stops: [
      { id: 's30', name: 'Shaikpet',         lat: 17.3980, lng: 78.3965 },
      { id: 's31', name: 'Manikonda',        lat: 17.3995, lng: 78.3850 },
      { id: 's32', name: 'Narsingi',         lat: 17.3768, lng: 78.3512 },
      { id: 's33', name: 'Shamshabad',       lat: 17.2543, lng: 78.4290 },
      { id: 's34', name: 'Vardhaman College of Engineering', lat: 17.2546, lng: 78.3070 }
    ]
  }
]
