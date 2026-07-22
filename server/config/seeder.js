const Department = require('../models/Department');
const Project = require('../models/Project');
const Tender = require('../models/Tender');
const News = require('../models/News');
const slugify = require('slugify');

const seedDatabase = async () => {
  try {
    // 1. Seed & Update Departments
    const departmentsToSeed = [
      {
        code: 'CED',
        name: 'Civil Engineering Department',
        description: 'Focuses on the design, structural analysis, foundation works, and main structure construction of all buildings, bridges, and highway concrete components.',
        headName: 'Dr. Ramesh Nair',
        headDesignation: 'Chief Engineer (Civil)',
        headPhoto: 'assets/images/officer_ramesh.png',
        icon: 'construction',
        color: '#003580',
        order: 1,
        services: ['Structural Analysis', 'High-Rise RCC Design', 'Soil/Geotechnical Testing', 'Foundation Engineering']
      },
      {
        code: 'HPD',
        name: 'Highways & Pavement Works',
        description: 'Dedicated to earthwork excavation, sub-base preparation, asphalt mixtures, concrete pavements, highway toll integration, and traffic safety systems.',
        headName: 'Sanjay Deshmukh',
        headDesignation: 'Executive Engineer (Highways)',
        headPhoto: 'assets/images/officer_sanjay.png',
        icon: 'add_road',
        color: '#C9A227',
        order: 2,
        services: ['Flexible/Asphalt Pavements', 'Rigid Concrete Roads', 'Drainage Design', 'Toll Plaza Infrastructure']
      },
      {
        code: 'EED',
        name: 'Electrical & Electrification',
        description: 'Handles high-voltage substation integration, street lighting, smart grids, solar power installations, and indoor electrical routing for multi-story blocks.',
        headName: 'Amit Trivedi',
        headDesignation: 'Superintending Engineer (Elec.)',
        headPhoto: 'assets/images/officer_amit.png',
        icon: 'bolt',
        color: '#138808',
        order: 3,
        services: ['Sub-Station Erection', 'Underground HT/LT Ducting', 'Solar Grid Engineering', 'Smart Lighting Networks']
      },
      {
        code: 'QAD',
        name: 'Quality Assurance & Control',
        description: 'Maintains field and lab-testing check routines for concrete cube compression, material purity, compaction densities, and full ISO quality compliance audits.',
        headName: 'K. R. Rao',
        headDesignation: 'Director of QA & Safety',
        headPhoto: 'assets/images/officer_rao.png',
        icon: 'verified',
        color: '#01579B',
        order: 4,
        services: ['Concrete Compression Audits', 'NDT Non-Destructive Testing', 'Material Chemical Verification', 'ISO Compliance Auditing']
      }
    ];

    let seededDepts = [];
    for (const d of departmentsToSeed) {
      const doc = await Department.findOneAndUpdate(
        { code: d.code },
        { $set: d },
        { upsert: true, new: true }
      );
      seededDepts.push(doc);
    }
    console.log('✅ Seeder: 4 Departments updated/upserted with rich information');

    // 2. Seed Projects
    const projCount = await Project.countDocuments();
    if (projCount === 0 && seededDepts.length > 0) {
      const projectsData = [
        {
          title: 'Mumbai Coastal Highway Project',
          category: 'Road',
          status: 'Running',
          location: 'Mumbai, Maharashtra',
          progress: 65,
          budget: 'Rs. 450 Cr',
          budgetValue: 450000000,
          area: '29.2 km',
          duration: '36 Months',
          clientName: 'MSRDC (Govt of Maharashtra)',
          startDate: new Date('2023-01-15'),
          expectedEndDate: new Date('2025-12-15'),
          governmentOrderNo: 'MSRDC/2022/HW-4091',
          tenderNo: 'TND-2022-MUM-09',
          description: 'Design and construction of 29.2 km coastal highway link including high-speed lanes, toll systems, storm drainage, pre-stressed flyover sections, and safety barricading. Built to handle heavy oceanic winds and salinity.',
          features: ['8 High-Speed Lanes', 'Marine-Grade Concrete', 'Integrated Toll Plaza', 'Anti-Saline Coating', 'Seawall Protection'],
          isFeatured: true,
          department: seededDepts[1]._id
        },
        {
          title: 'Integrated Government Secretariat Building',
          category: 'Government',
          status: 'Completed',
          location: 'New Delhi, Delhi NCR',
          progress: 100,
          budget: 'Rs. 180 Cr',
          budgetValue: 180000000,
          area: '120,000 sq.ft',
          duration: '24 Months',
          clientName: 'CPWD (Central Public Works Department)',
          startDate: new Date('2022-03-01'),
          completionDate: new Date('2024-03-01'),
          governmentOrderNo: 'CPWD/DEL/BLD-0921',
          tenderNo: 'CPWD-T-2021-088',
          description: 'Construction of a premium, state-of-the-art office building complex for central administrative ministries. Built using local materials, highly energy-efficient parameters, and advanced fire-safety structures.',
          features: ['Green Building Certified', 'Seismic Zone 5 Resistant', '100% Solar Powered', 'Centralized HVAC System', 'VDF Flooring'],
          isFeatured: true,
          department: seededDepts[0]._id
        },
        {
          title: 'Ganga River Mega-Bridge Link',
          category: 'Bridge',
          status: 'Running',
          location: 'Patna, Bihar',
          progress: 35,
          budget: 'Rs. 720 Cr',
          budgetValue: 720000000,
          area: '4.5 km',
          duration: '48 Months',
          clientName: 'NHAI (National Highways Authority of India)',
          startDate: new Date('2023-08-01'),
          expectedEndDate: new Date('2027-08-01'),
          governmentOrderNo: 'NHAI/BR/BRG-012',
          tenderNo: 'NH-BR-2023-04',
          description: 'Construction of a 4.5 km long, four-lane pre-stressed box girder bridge over the River Ganga. Designed with deep well foundations to survive strong currents and flooding.',
          features: ['Well Foundation (45m Depth)', 'Pre-Stressed Box Girders', 'Four Lanes with Footpath', 'River Navigation Span'],
          isFeatured: true,
          department: seededDepts[1]._id
        }
      ];

      for (const p of projectsData) {
        p.slug = slugify(p.title, { lower: true, strict: true }) + '-' + Date.now();
        await Project.create(p);
      }
      console.log('✅ Seeder: 3 Projects seeded');
    }

    // 3. Seed Tenders
    const tenderCount = await Tender.countDocuments();
    if (tenderCount === 0 && seededDepts.length > 0) {
      await Tender.create([
        {
          tenderNo: 'TB/MUM/HW-092/2025',
          title: 'Asphalt Pavement Relaying & Stormwater Drainage link on NH-48 sector 4',
          department: seededDepts[1]._id,
          departmentName: 'NHAI / Road Works',
          category: 'Works',
          estimatedValue: 'Rs. 45.20 Cr',
          bidSubmissionDate: new Date('2025-08-30'),
          status: 'Active',
        },
        {
          tenderNo: 'TB/DEL/SEC-102/2025',
          title: 'Electrical wiring and smart lighting ducting for central secretariat blocks 4-6',
          department: seededDepts[2]._id,
          departmentName: 'CPWD / Electrical Division',
          category: 'Works',
          estimatedValue: 'Rs. 12.80 Cr',
          bidSubmissionDate: new Date('2025-09-15'),
          status: 'Active',
        }
      ]);
      console.log('✅ Seeder: 2 Tenders seeded');
    }

    // 4. Seed News
    const newsCount = await News.countDocuments();
    if (newsCount < 5) {
      await News.deleteMany({}); // Reset to ensure 5 fresh items are present
      const newsData = [
        {
          title: 'Tarun Builders wins National Construction Award 2024',
          excerpt: 'The Ministry of Infrastructure and Housing presented Tarun Builders with the prestigious Quality Excellence Award in highway engineering.',
          content: '<p>Tarun Builders has won the National Construction Excellence Award for 2024 in recognized safety, structural durability, and innovative highway engineering models. The award was handed over by the Union Minister in New Delhi.</p>',
          category: 'Award',
          isPublished: true,
          publishedAt: new Date('2024-11-20'),
          views: 310
        },
        {
          title: 'New Tender Floated for Smart City Phase II Utility Integration',
          excerpt: 'Official invites and bidding schedules for underground electricity and optical fiber routing ducts across western zones.',
          content: '<p>A major development in the municipal sector: Tarun Builders is releasing plans and inviting qualifications for joint ventures on underground multi-duct ducting. Bidding submissions are scheduled to open early next quarter.</p>',
          category: 'GovtNotification',
          isPublished: true,
          publishedAt: new Date('2025-07-15'),
          views: 180
        },
        {
          title: 'Company achieves ISO 14001:2015 Environmental Certification',
          excerpt: 'A landmark audit confirms full ecological compliance across all active urban sewage and highway structures.',
          content: '<p>Tarun Builders has officially been awarded the ISO 14001:2015 Environmental Management System certification. This certification validates our eco-friendly design principles, reduced material waste, and minimized carbon footprints across all heavy bridge and highway sites.</p>',
          category: 'Announcement',
          isPublished: true,
          publishedAt: new Date('2024-08-01'),
          views: 245
        },
        {
          title: 'Mumbai Coastal Link Project Phase 1 Bridge Deck Complete',
          excerpt: 'Pre-stressed box girders successfully placed on marine piers 14 through 20 ahead of monsoon schedule.',
          content: '<p>We are proud to announce the milestone deck completion of the Mumbai Coastal Link bridge segment. Our engineering crews successfully launched the final pre-cast segment, ensuring structural safety parameters were met well ahead of the heavy tidal waves season.</p>',
          category: 'PressRelease',
          isPublished: true,
          publishedAt: new Date('2025-06-10'),
          views: 412
        },
        {
          title: 'Safety Milestone: 5 Million Safe Man-Hours on Pune Metro Work',
          excerpt: 'Recognition certificate awarded by Pune Metro Rail Corporation for zero accident frequency rate.',
          content: '<p>Tarun Builders has reached an outstanding milestone of 5,000,000 continuous safe man-hours on the Pune Metro elevated tracks. Safety at work remains our highest structural priority, supported by daily drills, protective gear compliance, and active safety audits.</p>',
          category: 'Announcement',
          isPublished: true,
          publishedAt: new Date('2025-04-05'),
          views: 198
        }
      ];
      for (const n of newsData) {
        n.slug = slugify(n.title, { lower: true, strict: true }) + '-' + Date.now();
        await News.create(n);
      }
      console.log('✅ Seeder: 5 News items seeded');
    }

    // 5. Seed Gallery
    const Gallery = require('../models/Gallery');
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.create([
        {
          title: 'National Highway NH-44 Paving',
          category: 'Construction',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
          caption: 'Phase 2 highway surface work in progress, Haryana stretch.',
          isPublished: true,
          isFeatured: true,
          order: 1
        },
        {
          title: 'CPWD Office Complex — Completed',
          category: 'Completed',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
          caption: 'Fully completed CPWD administrative office, New Delhi.',
          isPublished: true,
          isFeatured: false,
          order: 2
        },
        {
          title: 'Tarun Builders HQ — Corporate Office',
          category: 'Office',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80',
          caption: 'Our Mumbai headquarters with modern facilities.',
          isPublished: true,
          isFeatured: false,
          order: 3
        },
        {
          title: 'National Construction Excellence Award 2024',
          category: 'Awards',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80',
          caption: 'Receiving the Ministry of Road Transport Award, New Delhi.',
          isPublished: true,
          isFeatured: true,
          order: 4
        },
        {
          title: 'Pune Metro — Elevated Pillars',
          category: 'Projects',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=600&q=80',
          caption: 'Elevated metro pillar construction, Pune stretch.',
          isPublished: true,
          isFeatured: false,
          order: 5
        },
        {
          title: 'Ganga Bridge Well Foundation',
          category: 'Construction',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80',
          caption: 'Bridge foundation drilling works, Varanasi bypass.',
          isPublished: true,
          isFeatured: false,
          order: 6
        }
      ]);
      console.log('✅ Seeder: 6 Gallery items seeded');
    }

    // 6. Seed Careers
    const Career = require('../models/Career');
    const careerCount = await Career.countDocuments();
    if (careerCount === 0) {
      await Career.create([
        {
          title: 'Senior Civil Engineer (Highways)',
          department: 'Highways Division',
          location: 'Mumbai, MH',
          type: 'Full-time',
          experience: '8-10 Years',
          qualification: 'B.Tech / M.Tech in Civil Engineering',
          salary: 'Rs. 12 - 15 LPA',
          vacancies: 2,
          description: 'Supervision and technical control of asphalt/rigid pavement highways. Experience in well foundation bridges and flyovers is highly preferred.',
          responsibilities: [
            'Supervise on-site structural works for highway pavements.',
            'Review drawings, bills of quantities, and structural designs.',
            'Coordinate with CPWD / NHAI government representatives for quality approvals.'
          ],
          requirements: [
            'B.Tech or M.Tech in Civil Engineering.',
            'Min 8 years experience in highway/pavement construction.',
            'Familiarity with IRC standards and quality tests.'
          ],
          lastDate: new Date('2026-12-31'),
          isActive: true
        },
        {
          title: 'Site Safety Supervisor',
          department: 'Quality & Safety',
          location: 'Pune, MH',
          type: 'Full-time',
          experience: '3-5 Years',
          qualification: 'Diploma in Civil / HSE Certificate',
          salary: 'Rs. 4.5 - 6 LPA',
          vacancies: 4,
          description: 'Implementing and monitoring strict safety compliance parameters across elevated metro station sites. Audits daily safety drills.',
          responsibilities: [
            'Ensure 100% PPE compliance for all lab and site workers.',
            'Conduct safety induction drills and daily toolbox talks.',
            'Report accident frequency rates and perform hazard analysis audits.'
          ],
          requirements: [
            'Diploma in Civil Engineering or equivalent.',
            'HSE / NEBOSH certificate is mandatory.',
            'Min 3 years experience in infrastructure site safety.'
          ],
          lastDate: new Date('2026-12-31'),
          isActive: true
        }
      ]);
      console.log('✅ Seeder: 2 Career items seeded');
    }
  } catch (err) {
    console.error('❌ Seeder Error:', err.message);
  }
};

module.exports = seedDatabase;
