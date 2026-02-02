import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import { complaintAPI } from '../api';

export default function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: 'pending',
    priority: 'medium',
    assignedDepartment: 'roads',
    resolutionNotes: '',
  });

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'department_officer')) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [statsRes, complaintsRes] = await Promise.all([
        complaintAPI.getStats(),
        complaintAPI.getComplaints({ limit: 100 }),
      ]);
      setStats(statsRes.data.stats);
      setComplaints(complaintsRes.data.complaints);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateComplaint = async () => {
    try {
      await complaintAPI.updateStatus(selectedComplaint._id, updateData);
      setSelectedComplaint(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update complaint:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'department_officer')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 text-sm">Total Complaints</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalComplaints}</p>
            </div>
            <div className="bg-yellow-100 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-blue-100 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-green-100 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 text-sm">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="bg-red-100 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        )}

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-900">All Complaints</h2>
          </div>

          {loadingData ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Loading complaints...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Citizen</th>
                    <th className="px-6 py-3 text-left">Issue</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-mono">{complaint.complaintId}</td>
                      <td className="px-6 py-3 text-sm">{complaint.citizen.name}</td>
                      <td className="px-6 py-3 text-sm capitalize">
                        {complaint.issueType.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-3 text-sm">{complaint.location.address}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {complaint.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setUpdateData({
                              status: complaint.status,
                              priority: complaint.priority,
                              assignedDepartment: complaint.assignedDepartment || 'roads',
                              resolutionNotes: complaint.resolutionNotes || '',
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-900">Update Complaint</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-600 hover:text-gray-900 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                  <select
                    value={updateData.priority}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Assigned Department
                  </label>
                  <select
                    value={updateData.assignedDepartment}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, assignedDepartment: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="roads">Roads</option>
                    <option value="water">Water</option>
                    <option value="electricity">Electricity</option>
                    <option value="sanitation">Sanitation</option>
                    <option value="public_safety">Public Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Resolution Notes
                  </label>
                  <textarea
                    value={updateData.resolutionNotes}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, resolutionNotes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                  />
                </div>

                <button
                  onClick={handleUpdateComplaint}
                  className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition font-semibold"
                >
                  Update Complaint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
