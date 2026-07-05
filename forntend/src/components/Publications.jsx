import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, ExternalLink, Quote, Award, Microscope, Search, Filter } from 'lucide-react';
import { getSectionData } from '../services/api';
import 'animate.css';

const filters = [
  "All",
  "MOF Membranes",
  "Water Remediation",
  "Electrocatalysis",
  "Photocatalysis",
  "Fuel Cells",
  "Materials Science",
  "Catalysis",
];

const Publications = () => {
  const [publicationsData, setPublicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSectionData('publications');
        data.sort((a, b) => a.order - b.order);
        setPublicationsData(data);
      } catch (error) {
        console.error("Failed to load publications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: FileText, label: `${publicationsData.length}+`, desc: "Publications" },
    { icon: Award, label: "6+", desc: "High-Impact Journals" },
    { icon: Quote, label: "1000+", desc: "Citations" },
    { icon: Microscope, label: "5", desc: "Research Domains" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredPublications = publicationsData.filter((pub) => {
    const matchesFilter = activeFilter === "All" || pub.category === activeFilter;
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full relative z-10 animate__animated animate__fadeIn">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform duration-300 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-xl">{stat.label}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 animate__animated animate__fadeInUp">
          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <input
              type="text"
              placeholder="Search publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPublications.map((pub, index) => (
            <div 
              key={index}
              className={`group bg-white dark:bg-gray-800/90 backdrop-blur-xl p-6 lg:p-8 rounded-[2rem] border ${
                pub.featured 
                  ? 'border-blue-200 dark:border-blue-900/50 shadow-blue-900/5' 
                  : 'border-gray-100 dark:border-gray-700/50'
              } shadow-xl shadow-gray-200/20 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative flex flex-col`}
            >
              {/* Subtle Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>

              {pub.featured && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-md shadow-orange-500/20">
                    <Award className="w-3 h-3" />
                    Featured
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-sm">
                  {pub.year}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-gray-700/50 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-sm">
                  {pub.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 relative z-10 line-clamp-3">
                {pub.title}
              </h3>

              <div className="mt-auto relative z-10">
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2" title={pub.authors}>
                  <span className="text-gray-900 dark:text-gray-200 font-semibold">{pub.authors}</span>
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-sm italic font-semibold mb-6 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 opacity-70" />
                  {pub.journal}
                </p>

                <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 dark:border-gray-700/50 pt-6">
                  {pub.paperUrl && (
                    <a 
                      href={pub.paperUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Paper
                    </a>
                  )}
                  {pub.doi && (
                    <>
                      <a 
                        href={`https://doi.org/${pub.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
                          pub.paperUrl 
                            ? "bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700"
                            : "bg-slate-900 dark:bg-white text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-blue-500/20"
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {pub.paperUrl ? "View Publisher" : "View Paper"}
                      </a>
                      <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-mono font-medium border border-gray-100 dark:border-gray-800">
                        DOI: {pub.doi}
                      </span>
                    </>
                  )}
                  {!pub.paperUrl && !pub.doi && (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-sm font-bold border border-amber-200 dark:border-amber-800/50">
                      Manuscript in Preparation
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}

          {filteredPublications.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No publications found matching your search.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default Publications;
