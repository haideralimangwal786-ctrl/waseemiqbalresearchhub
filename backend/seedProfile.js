const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('./models/Profile');
const About = require('./models/About');
const ResearchArea = require('./models/ResearchArea');
const OngoingProject = require('./models/OngoingProject');
const Publication = require('./models/Publication');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Training = require('./models/Training');
const SkillCategory = require('./models/SkillCategory');
const Award = require('./models/Award');
const ContactInfo = require('./models/ContactInfo');
const Reference = require('./models/Reference');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      console.log('Profile already exists. Deleting it...');
      await Profile.deleteMany();
    }

    const newProfile = new Profile({
      name: "Dr. Waseem Iqbal",
      title: "Postdoctoral Researcher",
      bio: "Dedicated materials scientist specializing in Metal-Organic Frameworks (MOFs) and their applications in environmental remediation and sustainable energy. With a focus on electrocatalysis, photocatalysis, and membrane technologies, my research aims to develop innovative solutions for water purification, fuel cells, and electrolysers. Committed to advancing the frontiers of materials science for a sustainable future.",
      institution: "Istituto Italiano di Tecnologia (IIT)",
      location: "Italy",
      stats: [
        { label: "Publications", value: "25+", icon: "BookOpen" },
        { label: "Citations", value: "1000+", icon: "TrendingUp" },
        { label: "Countries Visited", value: "5+", icon: "Globe" },
        { label: "Respected Awards", value: "10+", icon: "Award" }
      ],
      socialLinks: [
        { platform: "ResearchGate", url: "https://www.researchgate.net/profile/Waseem-Iqbal-11", icon: "SiResearchgate" },
        { platform: "Google Scholar", url: "https://scholar.google.com/citations?user=T2KKbmAAAAAJ&hl=it", icon: "SiGooglescholar" },
        { platform: "ORCID", url: "https://orcid.org/0000-0003-3331-509X", icon: "FaOrcid" },
        { platform: "LinkedIn", url: "https://www.linkedin.com/in/drwaseemiqbal/", icon: "FaLinkedin" }
      ],
      researchAreas: [
        "MOF Research", 
        "Water Remediation", 
        "Electrocatalysis", 
        "Membrane Science", 
        "Photocatalysis"
      ],
      cvUrl: "/Waseem CV-N.pdf",
      images: {
        profilePicture: "/profile.jpeg",
        coverBanner: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2000&q=80"
      }
    });

    await newProfile.save();
    console.log('Profile seeded successfully!');

    // Seed About Section
    const existingAbout = await About.findOne();
    if (existingAbout) {
      console.log('About section already exists. Deleting it...');
      await About.deleteMany();
    }

    const newAbout = new About({
      visionStatement: "Advancing scientific innovation to drive the global transition toward clean energy, environmental protection, and resource recovery.",
      aboutName: "Dr. Waseem Iqbal",
      aboutLocation: "IIT, Italy",
      aboutImage: "/about-profile.jpeg",
      researchFocus: [
        "As a Postdoctoral Researcher at the Center for Sustainable Future Technologies, Istituto Italiano di Tecnologia (IIT), I tackle pressing environmental and energy challenges through the synthesis of innovative materials.",
        "My expertise centers on Metal-Organic Frameworks (MOFs), Membrane Technologies, and Electrocatalysis.",
        "Currently, I am contributing to the PROMISERS European Project, developing cutting-edge polymers and membrane electrode assemblies (MEAs) for green electrolyzers."
      ],
      coreCompetencies: [
        "Advanced Material Synthesis", 
        "Electrochemical Systems", 
        "Analytical Characterization", 
        "Water Remediation"
      ],
      academicJourney: [
        {
          icon: "Globe",
          title: "Global Experience",
          subtitle: "Pak • Chn • Spa • Ita",
          description: "Multidisciplinary scientific research across international borders."
        },
        {
          icon: "GraduationCap",
          title: "Ph.D. in Materials",
          subtitle: "Univ of Calabria",
          description: "Specialized in MOF technologies under an EU-funded scholarship."
        },
        {
          icon: "Award",
          title: "High-Impact Pubs",
          subtitle: "Top-Tier Journals",
          description: "Published in ACS Catalysis, Applied Energy, and Advanced Science."
        }
      ]
    });
    
    await newAbout.save();
    console.log('About section seeded successfully!');

    // Seed Research Areas
    await ResearchArea.deleteMany();
    await ResearchArea.insertMany([
      { title: "Water Remediation", icon: "Droplets", description: "Developing MOF-based membranes and advanced filtration systems for the removal of heavy metals, antibiotics, and emerging contaminants from water resources.", colorTheme: "blue", order: 1 },
      { title: "Electrocatalysis", icon: "Zap", description: "Designing heterogeneous electrocatalysts for oxygen evolution, hydrogen evolution, water splitting, and sustainable energy conversion technologies.", colorTheme: "amber", order: 2 },
      { title: "Membrane Science", icon: "Layers", description: "Characterization and optimization of innovative polymers, membranes, and membrane electrode assemblies for electrolyzers and fuel cells.", colorTheme: "indigo", order: 3 },
      { title: "Photocatalysis", icon: "Sun", description: "Engineering carbon nitride and composite photocatalysts for CO2 reduction, environmental decontamination, and solar fuel generation.", colorTheme: "orange", order: 4 },
      { title: "MOF Research", icon: "Atom", description: "Synthesis and functionalization of Metal-Organic Frameworks (MOFs) for environmental remediation, resource recovery, and advanced separation technologies.", colorTheme: "teal", order: 5 }
    ]);
    console.log('Research Areas seeded successfully!');

    // Seed Ongoing Projects
    await OngoingProject.deleteMany();
    await OngoingProject.insertMany([
      { title: "A Systematic Review on the Application of MOF-Based Membranes Towards Wastewater Decontamination: Challenges and Opportunities", status: "Manuscript in Preparation", category: "Water Remediation", collaborators: ["Dr. Waseem Iqbal", "Teresa F. Mastropietro", "Emilio Pardo", "Donatella Armentano"], description: "A comprehensive review evaluating the current state of MOF-based membrane technologies for wastewater treatment, highlighting recent advances, limitations, challenges, and future opportunities for large-scale environmental applications.", order: 1 },
      { title: "In Situ Studies by Single-Crystal X-Ray Diffraction of Activation and Isobutane Adsorption in Breathing MIL-53 (Fe) Metal-Organic Framework", status: "Manuscript in Preparation", category: "MOF Research", collaborators: ["Percoco", "Bruno", "Mastropietro", "Iqbal", "et al."], description: "Investigating the structural behavior and adsorption mechanisms of breathing MOFs using advanced in situ single-crystal X-ray diffraction techniques to better understand framework flexibility and gas adsorption processes.", order: 2 }
    ]);
    console.log('Ongoing Projects seeded successfully!');

    // Seed Publications
    await Publication.deleteMany();
    await Publication.insertMany([
      { year: "2025", title: "Membranes Based on Metal–Organic Framework Nanostructures for Recovering Nickel, Cobalt, and Manganese Ions from Spent Lithium-Ion Batteries", journal: "ACS Applied Nano Materials", authors: "Waseem Iqbal, Amira Nour, Rosaria Bruno, Pietro Magarò, Carmine Maletta, Rosangela Elliani, Antonio Tagarelli, Teresa F. Mastropietro, Jesús Ferrando-Soria, Emilio Pardo, Donatella Armentano", category: "MOF Membranes", doi: "10.1021/acsanm.5c04698", featured: true, order: 1 },
      { year: "2025", title: "Recent advancements in designing high-performance proton exchange membrane fuel cells: A comprehensive review", journal: "Applied Energy", authors: "Saad Ahmed, Christian Beauger, Amir Zada, Waseem Iqbal, Naveed Ahmed, Muhammad Tuoqeer Anwar, Muhammad Hassan", category: "Fuel Cells", doi: "10.1016/j.apenergy.2025.125753", featured: true, order: 2 },
      { year: "In Prep", title: "A Systematic Review on the Application of MOF-based Membranes Towards Wastewater Decontamination: Challenges and Opportunities", journal: "Manuscript in preparation", authors: "Waseem Iqbal, Teresa F. Mastropietro, Emilio Pardo, Donatella Armentano", category: "Water Remediation", doi: "", featured: false, order: 3 },
      { year: "In Prep", title: "In situ Studies by SingleCrystal X-ray Diffraction of Activation and isobutane Adsorption in Breathing MIL-53 (Fe) MetalOrganic Framework", journal: "Manuscript in preparation", authors: "Rita Maria Percoco, Rosaria Bruno, Teresa F. Mastropietro, Waseem Iqbal, Pegah Hajiwand, Jesús Ferrando–Soria, Emilio Pardo, Donatella Armentano", category: "MOF Research", doi: "", featured: false, order: 4 },
      { year: "2024", title: "Lithium-Rich Oxygen Batteries with Low Metal Loading Based on Iridium Single-Atom Electrocatalysts", journal: "ACS Applied Nano Materials", authors: "Babar Shahzad, Waseem Iqbal, Nadia Batool, Zou Xilu, Yihui Li, Zewen Xu, Cheng Huang, Rana Muhammad Irfan", category: "Batteries", doi: "10.1021/acsanm.4c07185", featured: false, order: 5 },
      { year: "2024", title: "Efficient Nickel and Cobalt Recovery by Metal–Organic FrameworkBased Mixed Matrix Membranes (MMM-MOFs)", journal: "ACS Sustainable Chemistry & Engineering", authors: "Amira Nour, Waseem Iqbal, Javier Navarro-Alapont, Jesús Ferrando-Soria, Pietro Magarò, Rosangela Elliani, Antonio Tagarelli, Carmine Maletta, Teresa F Mastropietro, Emilio Pardo, Donatella Armentano", category: "Water Remediation", doi: "10.1021/acssuschemeng.4c03427", featured: true, order: 6 },
      { year: "2023", title: "State, synthesis, perspective applications, and challenges of Graphdiyne and its analogues: A review of recent research", journal: "Advances in Colloid and Interface Science", authors: "Asif Hayat, Muhammad Sohail, Sana Ben Moussa, Muhanna K Al-Muhanna, Waseem Iqbal, Zeeshan Ajmal, Saleem Raza, Yas Al-Hadeethi, Yasin Orooji", category: "Materials Science", doi: "10.1016/j.cis.2023.102969", featured: false, order: 7 },
      { year: "2023", title: "(Multivariate)-Metal–Organic Framework for Highly Efficient Antibiotic Capture from Aquatic Environmental Matrices", journal: "ACS Applied Materials & Interfaces", authors: "Cristina Negro, Hector Martinez Perez-Cejuela, Ernesto Francisco Simó-Alfonso, Waseem Iqbal, José Manuel Herrero-Martínez, Donatella Armentano, Jesus Ferrando-Soria, Emilio Pardo", category: "Water Remediation", doi: "10.1021/acsami.2c20458", featured: true, order: 8 },
      { year: "2022", title: "Electro-Synthesis of Organic Compounds with Heterogeneous Catalysis", journal: "Advanced Science", authors: "Tariq Ali, Haiyan Wang, Waseem Iqbal, Tariq Bashir, Rahim Shah, Yong Hu", category: "Catalysis", doi: "10.1002/advs.202205077", featured: false, order: 9 },
      { year: "2021", title: "Paired Electrochemical N–N Coupling Employing a Surface-Hydroxylated Ni3Fe-MOF-OH Bifunctional Electrocatalyst with Enhanced Adsorption of Nitroarenes", journal: "ACS Catalysis", authors: "Wei Qiao, Waseem Iqbal, Guangming Shang, Dan Wang, Yongwang Li, Flemming Besenbacher, Hans Niemantsverdriet, Chenglin Yan, Ren Su", category: "Electrocatalysis", doi: "10.1021/acscatal.1c03938", featured: true, order: 16 }
    ]);
    console.log('Publications seeded successfully!');

    // Seed Experience
    await Experience.deleteMany();
    await Experience.insertMany([
      { title: "Postdoctoral Researcher", organization: "Center for Sustainable Future Technologies, Istituto Italiano di Tecnologia (IIT)", location: "Italy", link: "https://www.iit.it/it/", date: "Dec 2025 – Present", type: "Full-Time", description: "Research activity within the PROMISERS European Project focused on the development and characterization of innovative polymers, membranes, and membrane electrode assemblies (MEAs) for electrolysers and fuel cells, using both conventional and operando techniques.", highlights: ["Membrane Science", "Fuel Cells", "Electrolyzers", "Materials Characterization", "Research & Development"], color: "text-blue-500" },
      { title: "Chemistry Teacher", organization: "Mangwal Science Academy", location: "Mangwal, Chakwal, Pakistan", date: "Sep 2020 – Jan 2022", type: "Full-Time", description: "During this period, I focused on teaching students at an academy in my hometown. I also pursued self-directed learning through scientific literature, online courses, and the development of research proposals in materials science and environmental chemistry.", highlights: ["Teaching", "Scientific Writing", "Mentoring", "Chemistry Education"], color: "text-indigo-500" },
      { title: "Research Assistant", organization: "School of Energy, Soochow University", location: "Suzhou, China", link: "https://eng.suda.edu.cn/", date: "Sep 2018 – Aug 2020", type: "Full-Time", description: "I was actively involved in research activities with Master's and Ph.D. students, focusing on the synthesis and characterization of heterogeneous electrocatalysts, as well as their evaluation for water splitting and the production of value-added chemicals.", highlights: ["Electrocatalysis", "Water Splitting", "Material Synthesis", "Electrochemical Analysis"], color: "text-amber-500" },
      { title: "Science Teacher", organization: "Govt Primary School Sikriala", location: "Punjab, Pakistan", date: "Feb 2018 – Aug 2018", type: "Full-Time", description: "I was involved in teaching and supervising primary school students.", highlights: ["Primary Education", "Science Teaching", "Student Supervision"], color: "text-teal-500" },
      { title: "Chemistry Lecturer", organization: "Wings Group of College Chak Baili Khan", location: "Rawalpindi, Pakistan", date: "Aug 2016 – Jan 2018", type: "Full-Time", description: "I was involved in teaching and supervising undergraduate students pursuing a bachelor’s degree.", highlights: ["Undergraduate Teaching", "Chemistry Education", "Mentorship"], color: "text-emerald-500" },
      { title: "Chemistry Lecturer", organization: "Mumtaz Foundation Education Complex", location: "Mangwal, Pakistan", date: "May 2015 – July 2016", type: "Full-Time", description: "I was involved in teaching and supervising Intermediate degree students.", highlights: ["Intermediate Education", "Chemistry Instruction"], color: "text-rose-500" }
    ]);
    console.log('Experience seeded successfully!');

    // Seed Education
    await Education.deleteMany();
    await Education.insertMany([
      { degree: "Postdoctoral Researcher", institution: "Istituto Italiano di Tecnologia (IIT), Italy", link: "https://www.fondazionescuolapatrimonio.it/campus/iit-istituto-italiano-di-tecnologia/?gad_source=1&gad_campaignid=23102816358&gbraid=0AAAAAoeQIFWL1JXoNRDykRPRyBa8p4EWH&gclid=CjwKCAjwgO7RBhBKEiwAZNP85hfFpmwEMOoFvzBoBRRXgTMDolXW9U0Kk9E9X3hVNE57VNg9Gfp7sRoCmCQQAvD_BwE", duration: "Dec 2025 - Present", description: "Conducting advanced research on innovative polymers, membranes, and membrane electrode assemblies (MEAs) for electrolyzers and fuel cells under the PROMISERS European Project.", order: 1 },
      { degree: "Ph.D. in Materials Science", institution: "University of Calabria, Italy", link: "https://www.unical.it/internazionale/intenational-students/unical-admission/", duration: "Jan 2022 - May 2025", description: "Thesis: MOF Technologies for Water Remediation. Focused on Metal-Organic Frameworks (MOFs), membrane technologies, and sustainable environmental applications.", order: 2 },
      { degree: "Research Assistant", institution: "Soochow University, China", link: "https://eng.suda.edu.cn/", duration: "Sep 2018 - Aug 2020", description: "Collaborated on the synthesis and characterization of heterogeneous electrocatalysts for water splitting and energy conversion applications.", order: 3 },
      { degree: "M.Phil. Chemistry", institution: "Hazara University, Pakistan", link: "https://lms.hu.edu.pk/", duration: "Mar 2016 - Feb 2018", description: "Research Thesis: Co₃O₄-Coated TiO₂ for Electrical Properties and Material Characterization.", order: 4 },
      { degree: "BS Chemistry", institution: "University of Gujrat, Pakistan", link: "https://uog.edu.pk/", duration: "Oct 2011 - Dec 2015", description: "Built a strong foundation in chemistry, materials science, analytical techniques, and laboratory research.", order: 5 }
    ]);
    console.log('Education seeded successfully!');

    // Seed Training
    await Training.deleteMany();
    await Training.insertMany([
      { title: "Visiting Ph.D. Researcher", institution: "Institute of Molecular Science (ICMol), University of Valencia", location: "Valencia, Spain", flag: "🇪🇸", duration: "Jul 2023 – Dec 2023", description: "Conducted collaborative research at one of Europe's leading centers for porous materials and Metal-Organic Framework (MOF) chemistry. Expanded expertise in crystallographic analysis, supramolecular chemistry, and the design of functional framework materials.", highlights: ["Advanced MOF Research", "International Collaboration", "Crystallography", "Porous Materials Science"], color: "text-amber-500" },
      { title: "Industrial Secondment", institution: "Calabra Maceri e Servizi SPA", location: "Italy", flag: "🇮🇹", duration: "Apr 2024 – Sep 2024", description: "Completed a six-month industry placement focused on waste management and environmental services. Gained practical insight into real-world sustainability challenges, environmental technologies, and applied materials processing.", highlights: ["Waste Management", "Environmental Technologies", "Industrial Research", "Sustainability Solutions"], color: "text-emerald-500" }
    ]);
    console.log('Training seeded successfully!');

    // Seed Skills
    await SkillCategory.deleteMany();
    await SkillCategory.insertMany([
      { category: "Material Synthesis Methods", icon: "FlaskConical", color: "text-blue-500", skills: ["Hydrothermal Synthesis", "Solvothermal Synthesis", "Co-precipitation Method", "Sol-Gel Method", "Microwave-Assisted Synthesis", "MOF Synthesis & Functionalization", "Nanomaterials Fabrication", "Composite Materials Development"] },
      { category: "Characterization Techniques", icon: "Microscope", color: "text-emerald-500", skills: ["SEM (Scanning Electron Microscopy)", "XRD (X-Ray Diffraction)", "FTIR Spectroscopy", "Raman Spectroscopy", "Electrochemical Workstation Analysis", "Mechanical Membrane Characterization", "Materials Performance Evaluation", "Operando Characterization Techniques"] },
      { category: "Research Specializations", icon: "Atom", color: "text-amber-500", skills: ["Metal-Organic Frameworks (MOFs)", "Water Remediation", "Electrocatalysis", "Photocatalysis", "Membrane Science", "Fuel Cells", "Electrolyzers", "Environmental Materials"] },
      { category: "Scientific Software", icon: "Laptop", color: "text-purple-500", skills: ["ChemDraw", "Origin", "Crystal Maker", "Jade 6.5", "X'Pert High Score Plus", "Mercury", "ImageJ", "Blender"] },
      { category: "Professional Tools", icon: "BarChart3", color: "text-pink-500", skills: ["Adobe Photoshop", "Adobe Illustrator", "Microsoft Office Suite", "EndNote", "Scientific Data Analysis", "Research Documentation", "Technical Writing", "Reference Management"] },
      { category: "Languages", icon: "Languages", color: "text-indigo-500", skills: ["English (Professional Fluency)", "Urdu (Native)", "Punjabi (Native)", "Chinese (Basic)", "Italian (Basic)", "French (Basic)"] }
    ]);
    console.log('Skills seeded successfully!');

    // Seed Awards
    await Award.deleteMany();
    await Award.insertMany([
      { title: "EU National Scholarship (PON) — Ph.D. Funding", organization: "European Union / University of Calabria, Italy", year: "2022 - 2024", type: "Scholarship", description: "Awarded the prestigious 37th Cycle Italian National Scholarship funded through the European Union PON Program. Supported full-time Ph.D. research in Materials Science focused on MOF technologies for water remediation.", color: "amber", isFeatured: true },
      { title: "Prime Minister's Laptop Scheme", organization: "Government of Pakistan", year: "2018", type: "Academic Award", description: "Received a laptop from the Government of Pakistan in recognition of outstanding academic performance during M.Phil. Chemistry studies at Hazara University.", color: "blue", isFeatured: false },
      { title: "Chief Minister of Punjab Laptop Scheme", organization: "Government of Punjab, Pakistan", year: "2012", type: "Academic Award", description: "Recognized for academic excellence during BS Chemistry studies at the University of Gujrat and awarded under the provincial merit-based laptop scheme.", color: "emerald", isFeatured: false },
      { title: "2nd Position — District Essay Writing Competition", organization: "Department of Education, Punjab", year: "2009", type: "Achievement", description: "Secured second place in a district-level essay writing competition, demonstrating strong analytical thinking, communication, and academic potential at an early stage.", color: "purple", isFeatured: false }
    ]);
    console.log('Awards seeded successfully!');

    // Seed Contact Info
    await ContactInfo.deleteMany();
    await ContactInfo.create({
      description1: "Interested in research collaboration, academic partnerships, scientific consulting, or multidisciplinary projects?",
      description2: "Feel free to connect regarding materials science, water remediation, membrane technologies, electrocatalysis, photocatalysis, and sustainable energy research.",
      emailPrimary: "waseem.iqbal@iit.it",
      emailPrimaryLabel: "Institutional",
      emailSecondary: "waseemiqbal065@gmail.com",
      emailSecondaryLabel: "Personal",
      phonePrimary: "+39 351 952 2522",
      phonePrimaryLabel: "Italy",
      phoneSecondary: "+33 784 676 819",
      phoneSecondaryLabel: "France",
      affiliation: "Center for Sustainable Future Technologies\nIstituto Italiano di Tecnologia (IIT)\nItaly"
    });
    console.log('Contact Info seeded successfully!');

    // Seed References
    await Reference.deleteMany();
    await Reference.insertMany([
      { name: "Prof. Donatella Armentano", position: "Full Professor", institution: "Department of Chemistry and Chemical Technologies, University of Calabria, Italy", role: "Ph.D. Supervisor", email: "donatella.armentano@unical.it", order: 1 },
      { name: "Dr. Teresa Fina Mastropietro", position: "Associate Professor", institution: "Department of Chemistry and Chemical Technologies, University of Calabria, Italy", role: "Ph.D. Co-Supervisor", email: "teresafina.mastropietro@unical.it", order: 2 },
      { name: "Dr. Wajid Rehman", position: "Associate Professor", institution: "Department of Chemistry, Hazara University, Pakistan", role: "M.Phil. Supervisor", email: "sono_waj@yahoo.com", order: 3 }
    ]);
    console.log('References seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding profile:', error);
    process.exit(1);
  }
};

seedData();
