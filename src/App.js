import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';

// Icons (simplified versions)
const Search = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MapPin = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Phone = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Users = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const School = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const App = () => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // โหลดข้อมูลจากไฟล์ Excel
  useEffect(() => {
    const loadData = async () => {
      try {
        // แก้ไขให้ทำงานกับ GitHub Pages
        const response = await fetch('./DMC671.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // ปรับแต่งข้อมูลให้เหมาะสม
        const processedData = jsonData.map((row, index) => ({
          id: index + 1,
          schoolId: row['โรงเรียน'],
          name: row['ชื่อโรงเรียน'],
          province: row['ชื่อจังหวัด'],
          district: row['ชื่ออำเภอ'],
          subdistrict: row['ชื่อตำบล'],
          phone: row['โทรศัพท์'],
          type: row['ประเภท'],
          region: row['ภาค'],
          totalStudents: row['รวมนักเรียน'] || 0,
          totalRooms: row['รวมห้อง'] || 0,
          primary: (row['ป.1'] || 0) + (row['ป.2'] || 0) + (row['ป.3'] || 0) + (row['ป.4'] || 0) + (row['ป.5'] || 0) + (row['ป.6'] || 0),
          secondary: (row['ม.1'] || 0) + (row['ม.2'] || 0) + (row['ม.3'] || 0),
          highSchool: (row['ม.4'] || 0) + (row['ม.5'] || 0) + (row['ม.6'] || 0),
        }));

        setSchools(processedData);
        setFilteredSchools(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ฟังก์ชันค้นหา
  useEffect(() => {
    let filtered = schools;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(school =>
        school.name?.toLowerCase().includes(term) ||
        school.province?.toLowerCase().includes(term) ||
        school.district?.toLowerCase().includes(term) ||
        school.subdistrict?.toLowerCase().includes(term)
      );
    }

    setFilteredSchools(filtered);
    setCurrentPage(1);
  }, [searchTerm, schools]);

  // Pagination
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const currentSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <School />
              <h1 className="text-3xl font-bold text-gray-900">ระบบฐานข้อมูลโรงเรียนไทย</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {schools.length.toLocaleString()} โรงเรียน
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative mb-4">
            <Search />
            <input
              type="text"
              placeholder="ค้นหาชื่อโรงเรียน, จังหวัด, อำเภอ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          <div className="text-sm text-gray-600">
            แสดงผล {filteredSchools.length.toLocaleString()} โรงเรียนจากทั้งหมด {schools.length.toLocaleString()} โรงเรียน
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {currentSchools.map((school) => (
            <div key={school.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {school.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0">
                    {school.type}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin />
                    <span className="ml-2">{school.subdistrict}, {school.district}, {school.province}</span>
                  </div>
                  {school.phone && (
                    <div className="flex items-center">
                      <Phone />
                      <span className="ml-2">{school.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users />
                    <span className="ml-2">{school.totalStudents?.toLocaleString()} นักเรียน ({school.totalRooms} ห้อง)</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSchool(school)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ก่อนหน้า
            </button>
            
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedSchool.name}</h2>
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>รหัสโรงเรียน:</strong> {selectedSchool.schoolId}</p>
                <p><strong>ประเภท:</strong> {selectedSchool.type}</p>
                <p><strong>ที่อยู่:</strong> {selectedSchool.subdistrict}, {selectedSchool.district}, {selectedSchool.province}</p>
                <p><strong>จำนวนนักเรียนรวม:</strong> {selectedSchool.totalStudents?.toLocaleString()} คน</p>
                <p><strong>ห้องเรียน:</strong> {selectedSchool.totalRooms} ห้อง</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
