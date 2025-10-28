"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([] as any[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.toString().replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getDisplayText = (specialties: string[], index: number) => {
    const specialtiesText = specialties.join(", ");
    const isExpanded = expandedRows.has(index);
    const shouldTruncate = specialtiesText.length > 50;
    const displayText = shouldTruncate && !isExpanded
      ? specialtiesText.slice(0, 50) + "..."
      : specialtiesText;

    return { displayText, shouldTruncate, isExpanded };
  };

  useEffect(() => {
    console.log("fetching advocates...");
    const fetchAdvocates = async () => {
      try {
        const response = await fetch("/api/advocates");
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      }
    };

    fetchAdvocates();
  }, []);

  const onChange = (event: any) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    console.log("filtering advocates...");
    const filtered = advocates.filter((advocate: any) => {
      return (
        advocate.firstName.includes(searchValue) ||
        advocate.lastName.includes(searchValue) ||
        advocate.city.includes(searchValue) ||
        advocate.degree.includes(searchValue) ||
        advocate.specialties.includes(searchValue) ||
        advocate.yearsOfExperience.toString().includes(searchValue)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const onClick = () => {
    console.log(advocates);
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Solace Advocates</h1>

      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="flex gap-3 items-center">
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Search by name, city, degree, specialty..."
              value={searchTerm}
              onChange={onChange}
            />
            <button
              onClick={onClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Search
            </button>
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Searching for: <span className="font-medium text-gray-900">{searchTerm}</span>
            </p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years of Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdvocates.map((advocate, index) => {
              const { displayText, shouldTruncate, isExpanded } = getDisplayText(advocate.specialties, index);

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.degree}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      {displayText}
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleRow(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advocate.yearsOfExperience}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPhoneNumber(advocate.phoneNumber)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
