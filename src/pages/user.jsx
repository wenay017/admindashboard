// // // // import React, { useEffect, useState } from 'react';
// // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // import API from '../services/api';
// // // // import { FaTrash, FaEdit, FaEye, FaLaptop, FaChevronDown, FaChevronUp, FaSearch, FaPlus, FaCheck } from 'react-icons/fa';
// // // // import '../styles/UserManagement.css';

// // // // const UserManagement = () => {
// // // //     const [users, setUsers] = useState([]);
// // // //     const [filteredUsers, setFilteredUsers] = useState([]);
// // // //     const [statusFilter, setStatusFilter] = useState('all');
// // // //     const [searchQuery, setSearchQuery] = useState('');
// // // //     const [formData, setFormData] = useState({
// // // //         email: '',
// // // //         new_email: '',
// // // //         password: '',
// // // //         client_name: '',
// // // //         mobile_no: '',
// // // //         lat_long: '',
// // // //         activation_date: '',
// // // //         expiring_date: '',
// // // //         address: '',
// // // //         role: '',
// // // //     });
// // // //     const [editingUserEmail, setEditingUserEmail] = useState(null);
// // // //     const [viewUser, setViewUser] = useState(null);
// // // //     const [devicesView, setDevicesView] = useState(null);
// // // //     const [allDevices, setAllDevices] = useState([]);
// // // //     const [deviceStatuses, setDeviceStatuses] = useState({});
// // // //     const [editingDevices, setEditingDevices] = useState([]);
// // // //     const [devicesModified, setDevicesModified] = useState(false);
// // // //     const [error, setError] = useState('');
// // // //     const [isFormExpanded, setIsFormExpanded] = useState(false);
// // // //     const [showAvailableDevices, setShowAvailableDevices] = useState(false);
// // // //     const [selectedAvailableDevices, setSelectedAvailableDevices] = useState([]);
// // // //     const [loadingDevices, setLoadingDevices] = useState(false);
// // // //     const [isAssigningDevices, setIsAssigningDevices] = useState(false);
// // // //     const [selectedDeviceName, setSelectedDeviceName] = useState('');
// // // //     const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
// // // //     const [deviceTypes] = useState({
// // // //         'flow-meter': 'Flow Meter',
// // // //         'pressure-sensor': 'Pressure Sensor',
// // // //         'Piezometer': 'Piezometer',
// // // //         'water-quality': 'Water Quality Sensor',
// // // //         'others': 'Other Device'
// // // //     });

// // // //     // New state for adding a device
// // // //     const [addNewDeviceData, setAddNewDeviceData] = useState({
// // // //         device_id: '',
// // // //         device_name: ''
// // // //     });
// // // //     const [showAddNewDeviceForm, setShowAddNewDeviceForm] = useState(false);

// // // //     const loadUsers = async () => {
// // // //         try {
// // // //             const response = await API.get('/users');
// // // //             setUsers(response.data);
// // // //             setFilteredUsers(response.data);
// // // //         } catch (error) {
// // // //             console.error('Error fetching users:', error);
// // // //             setError('Failed to load users. Please try again.');
// // // //         }
// // // //     };

// // // //     const loadAllDevices = async () => {
// // // //         try {
// // // //             setLoadingDevices(true);
// // // //             const response = await API.get('/sensor-data');

// // // //             const sensorData = response.data.data || [];
// // // //             const uniqueDevices = [];
// // // //             const deviceIds = new Set();
// // // //             const statusMap = {};
// // // //             const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

// // // //             sensorData.forEach(device => {
// // // //                 if (!deviceIds.has(device.device_id)) {
// // // //                     deviceIds.add(device.device_id);
// // // //                     uniqueDevices.push({
// // // //                         device_id: device.device_id,
// // // //                         device_name: device.device_type || 'unknown',
// // // //                         last_seen: device.createdAt
// // // //                     });
// // // //                 }

// // // //                 const deviceTime = new Date(device.createdAt);
// // // //                 if (!statusMap[device.device_id] || deviceTime > new Date(statusMap[device.device_id].last_seen)) {
// // // //                     statusMap[device.device_id] = {
// // // //                         status: deviceTime > oneHourAgo ? 'online' : 'offline',
// // // //                         last_seen: device.createdAt
// // // //                     };
// // // //                 }
// // // //             });

// // // //             setAllDevices(uniqueDevices);

// // // //             const uiStatusMap = {};
// // // //             Object.keys(statusMap).forEach(deviceId => {
// // // //                 uiStatusMap[deviceId] = statusMap[deviceId].status;
// // // //             });
// // // //             setDeviceStatuses(uiStatusMap);

// // // //         } catch (error) {
// // // //             console.error("Error loading devices:", error);
// // // //             setError("Failed to load devices. Please try again.");
// // // //         } finally {
// // // //             setLoadingDevices(false);
// // // //         }
// // // //     };

// // // //     useEffect(() => {
// // // //         loadUsers();
// // // //         loadAllDevices();
// // // //     }, []);

// // // //     useEffect(() => {
// // // //         const filtered = users.filter(user => {
// // // //             const isActive = new Date(user.expiring_date) >= new Date();
// // // //             const statusMatch =
// // // //                 statusFilter === 'all' ||
// // // //                 (statusFilter === 'active' && isActive) ||
// // // //                 (statusFilter === 'suspended' && !isActive);

// // // //             const searchMatch =
// // // //                 searchQuery === '' ||
// // // //                 user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // //                 user.client_name.toLowerCase().includes(searchQuery.toLowerCase());

// // // //             return statusMatch && searchMatch;
// // // //         });

// // // //         setFilteredUsers(filtered);
// // // //     }, [users, statusFilter, searchQuery]);

// // // //     const handleInputChange = (e) => {
// // // //         const { name, value } = e.target;
// // // //         setFormData(prev => ({ ...prev, [name]: value }));
// // // //         setError('');
// // // //     };

// // // //     const validateForm = () => {
// // // //         const { email, new_email, password, client_name, mobile_no, lat_long, activation_date, expiring_date, address, role } = formData;
// // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // //         const phoneRegex = /^\d{10}$/;

// // // //         if (editingUserEmail) {
// // // //             if (!editingUserEmail || !emailRegex.test(editingUserEmail)) return 'Invalid current email.';
// // // //         } else {
// // // //             if (!email || !emailRegex.test(email)) return 'Please enter a valid email.';
// // // //         }

// // // //         if (new_email && !emailRegex.test(new_email)) return 'Please enter a valid new email.';
// // // //         if (!editingUserEmail && (!password || password.length < 6)) return 'Password must be at least 6 characters.';
// // // //         if (!client_name.trim()) return 'Client name is required.';
// // // //         if (!mobile_no || !phoneRegex.test(mobile_no)) return 'Enter a valid 10-digit mobile number.';
// // // //         if (!lat_long.trim()) return 'Lat/Long is required.';
// // // //         if (!activation_date) return 'Activation date is required.';
// // // //         if (!expiring_date) return 'Expiring date is required.';
// // // //         if (!address.trim()) return 'Address is required.';
// // // //         if (!role) return 'Please select a role.';
// // // //         return '';
// // // //     };

// // // //     const handleFormSubmit = async (e) => {
// // // //         e.preventDefault();
// // // //         const validationError = validateForm();
// // // //         if (validationError) {
// // // //             setError(validationError);
// // // //             return;
// // // //         }

// // // //         try {
// // // //             if (editingUserEmail) {
// // // //                 const payload = {
// // // //                     ...formData,
// // // //                     email: editingUserEmail,
// // // //                 };

// // // //                 if (!payload.password) delete payload.password;
// // // //                 if (!payload.new_email) delete payload.new_email;

// // // //                 await API.put('/user', payload);
// // // //                 setEditingUserEmail(null);
// // // //             } else {
// // // //                 await API.post('/users', formData);
// // // //             }

// // // //             resetForm();
// // // //             loadUsers();
// // // //         } catch (error) {
// // // //             console.error('Error submitting form:', error);
// // // //             setError(error.response?.data?.message || 'Failed to submit form. Please try again.');
// // // //         }
// // // //     };

// // // //     const resetForm = () => {
// // // //         setFormData({
// // // //             email: '',
// // // //             new_email: '',
// // // //             password: '',
// // // //             client_name: '',
// // // //             mobile_no: '',
// // // //             lat_long: '',
// // // //             activation_date: '',
// // // //             expiring_date: '',
// // // //             address: '',
// // // //             role: '',
// // // //         });
// // // //         setEditingUserEmail(null);
// // // //         setError('');
// // // //         setIsFormExpanded(false);
// // // //     };

// // // //     const handleDeleteUser = async (email) => {
// // // //         if (window.confirm('Are you sure you want to delete this user?')) {
// // // //             try {
// // // //                 await API.delete(`/user?email=${encodeURIComponent(email)}`);
// // // //                 loadUsers();
// // // //             } catch (error) {
// // // //                 console.error('Error deleting user:', error);
// // // //                 setError('Failed to delete user. Please try again.');
// // // //             }
// // // //         }
// // // //     };

// // // //     const handleEditUser = (user) => {
// // // //         setFormData({
// // // //             email: '',
// // // //             new_email: '',
// // // //             password: '',
// // // //             client_name: user.client_name,
// // // //             mobile_no: user.mobile_no,
// // // //             lat_long: user.lat_long,
// // // //             activation_date: user.activation_date?.slice(0, 10),
// // // //             expiring_date: user.expiring_date?.slice(0, 10),
// // // //             address: user.address,
// // // //             role: user.role,
// // // //         });
// // // //         setEditingUserEmail(user.email);
// // // //         setIsFormExpanded(true);
// // // //     };

// // // //     const handleViewUser = async (user) => {
// // // //         try {
// // // //             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
// // // //             setViewUser(res.data);
// // // //         } catch (err) {
// // // //             console.error('Error viewing user:', err);
// // // //             setError('Failed to load user details. Please try again.');
// // // //         }
// // // //     };

// // // //     const handleViewDevices = async (user) => {
// // // //         try {
// // // //             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
// // // //             setDevicesView(res.data);
// // // //             setEditingDevices(res.data.devices || []);
// // // //             setDevicesModified(false);
// // // //             setSelectedAvailableDevices([]);
// // // //             setSelectedDeviceName('');
// // // //             // Reset new device form states when viewing devices
// // // //             setAddNewDeviceData({ device_id: '', device_name: '' });
// // // //             setShowAddNewDeviceForm(false);
// // // //         } catch (err) {
// // // //             console.error('Error viewing devices:', err);
// // // //             setError('Failed to load user devices. Please try again.');
// // // //         }
// // // //     };

// // // //     const handleShowAvailableDevices = () => {
// // // //         setShowAvailableDevices(true);
// // // //         setSelectedAvailableDevices([]);
// // // //         setSelectedDeviceName('');
// // // //         setDeviceSearchQuery('');
// // // //         // Hide "add new device" form when opening available devices list
// // // //         setShowAddNewDeviceForm(false);
// // // //         setAddNewDeviceData({ device_id: '', device_name: '' });
// // // //     };

// // // //     const toggleDeviceSelection = (deviceId) => {
// // // //         setSelectedAvailableDevices(prev =>
// // // //             prev.includes(deviceId)
// // // //                 ? prev.filter(id => id !== deviceId)
// // // //                 : [...prev, deviceId]
// // // //         );
// // // //     };

// // // //     const handleDeviceAssignment = async (device, assign = true) => {
// // // //         try {
// // // //             const response = await fetch('http://13.201.156.32:5000/api/assign-devices', {
// // // //                 method: 'POST',
// // // //                 headers: {
// // // //                     'Content-Type': 'application/json',
// // // //                 },
// // // //                 body: JSON.stringify({
// // // //                     email: devicesView.email,
// // // //                     devices: [{
// // // //                         device_id: device.device_id,
// // // //                         device_name: device.device_name // Use device.device_name for assignment
// // // //                     }],
// // // //                     unassign: !assign
// // // //                 })
// // // //             });

// // // //             if (!response.ok) {
// // // //                 throw new Error(`HTTP error! status: ${response.status}`);
// // // //             }

// // // //             const data = await response.json();

// // // //             if (assign && data.message === "Devices assigned successfully") {
// // // //                 const assignedDevice = data.results.find(r => r.device_id === device.device_id);
// // // //                 if (assignedDevice && assignedDevice.status === "assigned successfully") {
// // // //                     return true;
// // // //                 }
// // // //             } else if (!assign && data.message === "Devices unassigned successfully") {
// // // //                 const unassignedDevice = data.results.find(r => r.device_id === device.device_id);
// // // //                 if (unassignedDevice && unassignedDevice.status === "unassigned") {
// // // //                     return true;
// // // //                 }
// // // //             } else if (data.message === "No devices were assigned" &&
// // // //                 data.results?.[0]?.status === "already assigned to this user") {
// // // //                 return true;
// // // //             }

// // // //             throw new Error(data.message || 'Device assignment failed');
// // // //         } catch (error) {
// // // //             console.error('Error assigning/unassigning device:', error);
// // // //             setError(`Failed to ${assign ? 'assign' : 'unassign'} device: ${error.message}`);
// // // //             return false;
// // // //         }
// // // //     };

// // // //     const addSelectedDevices = async () => {
// // // //         if (!selectedDeviceName) {
// // // //             setError('Please select a device type before assigning');
// // // //             return;
// // // //         }

// // // //         setIsAssigningDevices(true);
// // // //         setError('');
// // // //         try {
// // // //             const devicesToAdd = allDevices
// // // //                 .filter(device => selectedAvailableDevices.includes(device.device_id))
// // // //                 .filter(device => !editingDevices.some(d => d.device_id === device.device_id))
// // // //                 .map(device => ({
// // // //                     ...device,
// // // //                     device_name: selectedDeviceName
// // // //                 }));

// // // //             let allSuccess = true;

// // // //             for (const device of devicesToAdd) {
// // // //                 const success = await handleDeviceAssignment(device, true);
// // // //                 if (!success) {
// // // //                     allSuccess = false;
// // // //                     break;
// // // //                 }
// // // //             }

// // // //             if (allSuccess && devicesToAdd.length > 0) {
// // // //                 setEditingDevices(prev => [...prev, ...devicesToAdd]);
// // // //                 setDevicesModified(true);
// // // //                 setShowAvailableDevices(false);
// // // //             } else if (!allSuccess) {
// // // //                 setError('Failed to assign some devices. Please try again.');
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error adding devices:', error);
// // // //             setError('Failed to add devices. Please try again.');
// // // //         } finally {
// // // //             setIsAssigningDevices(false);
// // // //         }
// // // //     };

// // // //     const removeDevice = async (deviceId) => {
// // // //         setError('');
// // // //         const deviceToRemove = editingDevices.find(d => d.device_id === deviceId);
// // // //         if (!deviceToRemove) return;

// // // //         try {
// // // //             const success = await handleDeviceAssignment(deviceToRemove, false);
// // // //             if (success) {
// // // //                 setEditingDevices(prev => {
// // // //                     const newDevices = prev.filter(d => d.device_id !== deviceId);
// // // //                     setDevicesModified(newDevices.length !== prev.length);
// // // //                     return newDevices;
// // // //                 });
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error removing device:', error);
// // // //             setError('Failed to remove device. Please try again.');
// // // //         }
// // // //     };

// // // //     const saveDevices = async () => {
// // // //         setError('');
// // // //         try {
// // // //             const currentRes = await API.get(`/user?email=${encodeURIComponent(devicesView.email)}`);
// // // //             const currentDevices = currentRes.data.devices || [];

// // // //             const devicesToAdd = editingDevices.filter(ed =>
// // // //                 !currentDevices.some(cd => cd.device_id === ed.device_id)
// // // //             );

// // // //             const devicesToRemove = currentDevices.filter(cd =>
// // // //                 !editingDevices.some(ed => ed.device_id === cd.device_id)
// // // //             );

// // // //             for (const device of devicesToAdd) {
// // // //                 await handleDeviceAssignment(device, true);
// // // //             }

// // // //             for (const device of devicesToRemove) {
// // // //                 await handleDeviceAssignment(device, false);
// // // //             }

// // // //             loadUsers();
// // // //             setDevicesView(null);
// // // //             setEditingDevices([]);
// // // //             setDevicesModified(false);
// // // //         } catch (error) {
// // // //             console.error('Error saving device assignments:', error);
// // // //             setError('Failed to save device assignments. Please try again.');
// // // //         }
// // // //     };

// // // //     const availableDevices = allDevices.filter(device =>
// // // //         !editingDevices.some(d => d.device_id === device.device_id)
// // // //     );

// // // //     const filteredAvailableDevices = availableDevices.filter(device =>
// // // //         device.device_id.toLowerCase().includes(deviceSearchQuery.toLowerCase())
// // // //     );

// // // //     const getDeviceDisplayName = (deviceName) => {
// // // //         return deviceTypes[deviceName] || deviceName;
// // // //     };

// // // //     // Handlers for adding a new device
// // // //     const handleNewDeviceInputChange = (e) => {
// // // //         const { name, value } = e.target;
// // // //         setAddNewDeviceData(prev => ({ ...prev, [name]: value }));
// // // //         setError('');
// // // //     };

// // // //     const handleAddDeviceClick = () => {
// // // //         setShowAddNewDeviceForm(prev => !prev);
// // // //         setAddNewDeviceData({ device_id: '', device_name: '' }); // Reset form when toggling
// // // //         setError('');
// // // //     };

// // // //     const handleAddNewDevice = async () => {
// // // //         if (!addNewDeviceData.device_id.trim()) {
// // // //             setError('Please enter a Device ID.');
// // // //             return;
// // // //         }
// // // //         if (!addNewDeviceData.device_name) {
// // // //             setError('Please select a Device Type.');
// // // //             return;
// // // //         }

// // // //         setError('');
// // // //         setIsAssigningDevices(true); // Reusing this for general device operations

// // // //         try {
// // // //             // 1. Create the new device (if it doesn't exist)
// // // //             const deviceCreationPayload = {
// // // //                 device_id: addNewDeviceData.device_id,
// // // //                 device_type: addNewDeviceData.device_name,
// // // //             };

// // // //             // Check if device already exists in allDevices before attempting to create
// // // //             const deviceExists = allDevices.some(d => d.device_id === addNewDeviceData.device_id);

// // // //             if (!deviceExists) {
// // // //                 await API.post('/sensor-data', deviceCreationPayload);
// // // //                 // If successful, add it to allDevices and update deviceStatuses immediately
// // // //                 setAllDevices(prev => [...prev, {
// // // //                     device_id: addNewDeviceData.device_id,
// // // //                     device_name: addNewDeviceData.device_name,
// // // //                     last_seen: new Date().toISOString() // Set a current timestamp
// // // //                 }]);
// // // //                 setDeviceStatuses(prev => ({ ...prev, [addNewDeviceData.device_id]: 'offline' })); // New device starts offline
// // // //             }

// // // //             // 2. Assign the device to the user
// // // //             const assignmentSuccess = await handleDeviceAssignment({
// // // //                 device_id: addNewDeviceData.device_id,
// // // //                 device_name: addNewDeviceData.device_name
// // // //             }, true);

// // // //             if (assignmentSuccess) {
// // // //                 // Add to editingDevices if assignment was successful
// // // //                 setEditingDevices(prev => {
// // // //                     if (!prev.some(d => d.device_id === addNewDeviceData.device_id)) {
// // // //                         return [...prev, { device_id: addNewDeviceData.device_id, device_name: addNewDeviceData.device_name }];
// // // //                     }
// // // //                     return prev;
// // // //                 });
// // // //                 setDevicesModified(true);
// // // //                 setAddNewDeviceData({ device_id: '', device_name: '' });
// // // //                 setShowAddNewDeviceForm(false);
// // // //                 setShowAvailableDevices(false); // Close available devices popup after adding
// // // //             } else {
// // // //                 setError('Failed to assign the new device.');
// // // //             }

// // // //         } catch (err) {
// // // //             console.error('Error adding new device or assigning it:', err);
// // // //             setError(err.response?.data?.message || 'Failed to add and assign new device. It might already exist.');
// // // //         } finally {
// // // //             setIsAssigningDevices(false);
// // // //         }
// // // //     };

// // // //     return (
// // // //         <motion.div
// // // //             className="user-management"
// // // //             initial="hidden"
// // // //             animate="visible"
// // // //             variants={{
// // // //                 hidden: { opacity: 0 },
// // // //                 visible: {
// // // //                     opacity: 1,
// // // //                     transition: {
// // // //                         staggerChildren: 0.1,
// // // //                         when: "beforeChildren"
// // // //                     }
// // // //                 }
// // // //             }}
// // // //         >
// // // //             <motion.h2 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // // //                 User Management
// // // //             </motion.h2>

// // // //             <motion.div className="search-container" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // // //                 <div className="search-bar">
// // // //                     <FaSearch className="search-icon" />
// // // //                     <input
// // // //                         type="text"
// // // //                         placeholder="Search by email or name..."
// // // //                         value={searchQuery}
// // // //                         onChange={(e) => setSearchQuery(e.target.value)}
// // // //                     />
// // // //                 </div>
// // // //             </motion.div>

// // // //             <motion.div
// // // //                 className={`form-container ${isFormExpanded ? 'expanded' : ''}`}
// // // //                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
// // // //             >
// // // //                 <div
// // // //                     className="form-header"
// // // //                     onClick={() => setIsFormExpanded(!isFormExpanded)}
// // // //                 >
// // // //                     <h3>{editingUserEmail ? 'Edit User' : 'Add New User'}</h3>
// // // //                     {isFormExpanded ? <FaChevronUp /> : <FaChevronDown />}
// // // //                 </div>

// // // //                 <AnimatePresence>
// // // //                     {isFormExpanded && (
// // // //                         <motion.form
// // // //                             onSubmit={handleFormSubmit}
// // // //                             className={`user-form ${editingUserEmail ? 'update-form' : ''}`}
// // // //                             variants={{
// // // //                                 hidden: { height: 0, opacity: 0 },
// // // //                                 visible: {
// // // //                                     height: 'auto',
// // // //                                     opacity: 1,
// // // //                                     transition: {
// // // //                                         duration: 0.3
// // // //                                     }
// // // //                                 },
// // // //                                 exit: { height: 0, opacity: 0 }
// // // //                             }}
// // // //                             initial="hidden"
// // // //                             animate="visible"
// // // //                             exit="exit"
// // // //                         >
// // // //                             {editingUserEmail && (
// // // //                                 <div className="input-group">
// // // //                                     <label>Current Email</label>
// // // //                                     <div className="email-display">{editingUserEmail}</div>
// // // //                                 </div>
// // // //                             )}

// // // //                             {Object.entries(formData).map(([key, value]) => {
// // // //                                 if (key === '_id') return null;
// // // //                                 if (key === 'email' && editingUserEmail) return null;
// // // //                                 if (key === 'new_email' && !editingUserEmail) return null;

// // // //                                 if (key === 'role') {
// // // //                                     return (
// // // //                                         <div className="input-group" key={key}>
// // // //                                             <label>Role</label>
// // // //                                             <select
// // // //                                                 name={key}
// // // //                                                 value={value}
// // // //                                                 onChange={handleInputChange}
// // // //                                                 required
// // // //                                             >
// // // //                                                 <option value="">Select Role</option>
// // // //                                                 <option value="superadmin">Super Admin</option>
// // // //                                                 <option value="subadmin">Sub Admin</option>
// // // //                                                 <option value="user">User</option>
// // // //                                             </select>
// // // //                                         </div>
// // // //                                     );
// // // //                                 }

// // // //                                 return (
// // // //                                     <div className="input-group" key={key}>
// // // //                                         <label>
// // // //                                             {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
// // // //                                             {['password', 'activation_date', 'expiring_date'].includes(key) && ' *'}
// // // //                                         </label>
// // // //                                         <input
// // // //                                             type={key === 'password' ? 'password' : key.includes('date') ? 'date' : 'text'}
// // // //                                             name={key}
// // // //                                             value={value}
// // // //                                             onChange={handleInputChange}
// // // //                                             required={!['password', 'new_email'].includes(key) && !(key === 'email' && editingUserEmail)}
// // // //                                             disabled={key === 'email' && editingUserEmail !== null}
// // // //                                             placeholder={key === 'email' && editingUserEmail ? '' : undefined}
// // // //                                         />
// // // //                                     </div>
// // // //                                 );
// // // //                             })}

// // // //                             <div className="form-buttons">
// // // //                                 <button type="submit">
// // // //                                     {editingUserEmail ? 'Update User' : 'Add User'}
// // // //                                 </button>
// // // //                                 {editingUserEmail && (
// // // //                                     <button
// // // //                                         type="button"
// // // //                                         onClick={resetForm}
// // // //                                         className="cancel-button"
// // // //                                     >
// // // //                                         Cancel
// // // //                                     </button>
// // // //                                 )}
// // // //                             </div>
// // // //                         </motion.form>
// // // //                     )}
// // // //                 </AnimatePresence>
// // // //             </motion.div>

// // // //             {error && (
// // // //                 <motion.div
// // // //                     className="error-message"
// // // //                     initial={{ opacity: 0 }}
// // // //                     animate={{ opacity: 1 }}
// // // //                     exit={{ opacity: 0 }}
// // // //                 >
// // // //                     {error}
// // // //                 </motion.div>
// // // //             )}

// // // //             <motion.div className="filter-controls" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // // //                 <label>Status Filter: </label>
// // // //                 <select
// // // //                     value={statusFilter}
// // // //                     onChange={(e) => setStatusFilter(e.target.value)}
// // // //                     className="filter-select"
// // // //                 >
// // // //                     <option value="all">All Users</option>
// // // //                     <option value="active">Active Users</option>
// // // //                     <option value="suspended">Suspended Users</option>
// // // //                 </select>
// // // //             </motion.div>

// // // //             <motion.div className="user-table" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // // //                 <table>
// // // //                     <thead>
// // // //                         <tr>
// // // //                             <th>Email</th>
// // // //                             <th>Client</th>
// // // //                             <th>Mobile</th>
// // // //                             <th>Role</th>
// // // //                             <th>Status</th>
// // // //                             <th>Actions</th>
// // // //                         </tr>
// // // //                     </thead>
// // // //                     <tbody>
// // // //                         {filteredUsers.map((user, index) => (
// // // //                             <motion.tr
// // // //                                 key={user.email}
// // // //                                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
// // // //                                 initial="hidden"
// // // //                                 animate="visible"
// // // //                                 transition={{ delay: index * 0.05 }}
// // // //                             >
// // // //                                 <td>{user.email}</td>
// // // //                                 <td>{user.client_name}</td>
// // // //                                 <td>{user.mobile_no}</td>
// // // //                                 <td>{user.role}</td>
// // // //                                 <td>
// // // //                                     <span
// // // //                                         className={`status-indicator ${new Date(user.expiring_date) >= new Date() ? 'active' : 'suspended'}`}
// // // //                                         title={new Date(user.expiring_date) >= new Date() ? 'Active' : 'Suspended'}
// // // //                                     ></span>
// // // //                                 </td>
// // // //                                 <td className="actions">
// // // //                                     <button onClick={() => handleEditUser(user)} title="Edit">
// // // //                                         <FaEdit />
// // // //                                     </button>
// // // //                                     <button onClick={() => handleViewUser(user)} title="View">
// // // //                                         <FaEye />
// // // //                                     </button>
// // // //                                     <button onClick={() => handleViewDevices(user)} title="Devices">
// // // //                                         <FaLaptop />
// // // //                                     </button>
// // // //                                     <button
// // // //                                         onClick={() => handleDeleteUser(user.email)}
// // // //                                         className="delete-button"
// // // //                                         title="Delete"
// // // //                                     >
// // // //                                         <FaTrash />
// // // //                                     </button>
// // // //                                 </td>
// // // //                             </motion.tr>
// // // //                         ))}
// // // //                     </tbody>
// // // //                 </table>
// // // //             </motion.div>

// // // //             <AnimatePresence>
// // // //                 {viewUser && (
// // // //                     <motion.div
// // // //                         className="user-detail-popup"
// // // //                         initial={{ opacity: 0 }}
// // // //                         animate={{ opacity: 1 }}
// // // //                         exit={{ opacity: 0 }}
// // // //                     >
// // // //                         <h3>User Details</h3>
// // // //                         <div className="user-details-grid">
// // // //                             <div><strong>Email:</strong> {viewUser.email}</div>
// // // //                             <div><strong>Password:</strong> {viewUser.password || '(hidden)'}</div>
// // // //                             <div><strong>Client Name:</strong> {viewUser.client_name}</div>
// // // //                             <div><strong>Mobile No:</strong> {viewUser.mobile_no}</div>
// // // //                             <div><strong>Lat/Long:</strong> {viewUser.lat_long}</div>
// // // //                             <div><strong>Activation Date:</strong> {viewUser.activation_date?.slice(0, 10)}</div>
// // // //                             <div><strong>Expiring Date:</strong> {viewUser.expiring_date?.slice(0, 10)}</div>
// // // //                             <div><strong>Address:</strong> {viewUser.address}</div>
// // // //                             <div><strong>Role:</strong> {viewUser.role}</div>
// // // //                             <div><strong>Devices:</strong>
// // // //                                 {viewUser.devices?.length > 0 ? (
// // // //                                     <ul>
// // // //                                         {viewUser.devices.map(device => (
// // // //                                             <li key={device.device_id}>
// // // //                                                 {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// // // //                                             </li>
// // // //                                         ))}
// // // //                                     </ul>
// // // //                                 ) : 'No devices assigned'}
// // // //                             </div>
// // // //                         </div>
// // // //                         <button onClick={() => setViewUser(null)}>Close</button>
// // // //                     </motion.div>
// // // //                 )}
// // // //             </AnimatePresence>

// // // //             <AnimatePresence>
// // // //                 {devicesView && (
// // // //                     <motion.div
// // // //                         className="devices-popup"
// // // //                         initial={{ opacity: 0 }}
// // // //                         animate={{ opacity: 1 }}
// // // //                         exit={{ opacity: 0 }}
// // // //                     >
// // // //                         <h3>Manage Devices for {devicesView.email}</h3>

// // // //                         <div className="device-assignment">
// // // //                             <button
// // // //                                 onClick={handleShowAvailableDevices}
// // // //                                 className="view-devices-button"
// // // //                                 disabled={loadingDevices}
// // // //                             >
// // // //                                 <FaPlus /> {loadingDevices ? 'Loading Devices...' : 'View Available Devices'}
// // // //                             </button>

// // // //                             <div className="assigned-devices-list">
// // // //                                 <h4>Assigned Devices:</h4>
// // // //                                 {editingDevices.length > 0 ? (
// // // //                                     <ul>
// // // //                                         {editingDevices.map(device => (
// // // //                                             <li key={device.device_id}>
// // // //                                                 <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
// // // //                                                     {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// // // //                                                 </span>
// // // //                                                 <button
// // // //                                                     onClick={() => removeDevice(device.device_id)}
// // // //                                                     className="remove-device-button"
// // // //                                                 >
// // // //                                                     Remove
// // // //                                                 </button>
// // // //                                             </li>
// // // //                                         ))}
// // // //                                     </ul>
// // // //                                 ) : (
// // // //                                     <p>No devices assigned</p>
// // // //                                 )}
// // // //                             </div>
// // // //                         </div>

// // // //                         <div className="device-popup-buttons">
// // // //                             {devicesModified && (
// // // //                                 <button onClick={saveDevices} className="save-button">
// // // //                                     Save Changes
// // // //                                 </button>
// // // //                             )}
// // // //                             <button
// // // //                                 onClick={() => {
// // // //                                     setDevicesView(null);
// // // //                                     setEditingDevices([]);
// // // //                                     setDevicesModified(false);
// // // //                                 }}
// // // //                                 className="cancel-button"
// // // //                             >
// // // //                                 Cancel
// // // //                             </button>
// // // //                         </div>
// // // //                     </motion.div>
// // // //                 )}
// // // //             </AnimatePresence>

// // // //             <AnimatePresence>
// // // //                 {showAvailableDevices && (
// // // //                     <motion.div
// // // //                         className="available-devices-popup"
// // // //                         initial={{ opacity: 0 }}
// // // //                         animate={{ opacity: 1 }}
// // // //                         exit={{ opacity: 0 }}
// // // //                     >
// // // //                         <div className="available-devices-content">
// // // //                             <h3>Available Devices ({filteredAvailableDevices.length})</h3>

// // // //                             <div className="device-search-container">
// // // //                                 <div className="search-bar">
// // // //                                     <FaSearch className="search-icon" />
// // // //                                     <input
// // // //                                         type="text"
// // // //                                         placeholder="Search by device ID..."
// // // //                                         value={deviceSearchQuery}
// // // //                                         onChange={(e) => setDeviceSearchQuery(e.target.value)}
// // // //                                     />
// // // //                                 </div>
// // // //                             </div>

// // // //                             <div className="device-name-selection">
// // // //                                 <label>Device Type for Selected:</label>
// // // //                                 <select
// // // //                                     value={selectedDeviceName}
// // // //                                     onChange={(e) => setSelectedDeviceName(e.target.value)}
// // // //                                     required
// // // //                                 >
// // // //                                     <option value="">Select Device Type</option>
// // // //                                     {Object.entries(deviceTypes).map(([value, label]) => (
// // // //                                         <option key={value} value={value}>{label}</option>
// // // //                                     ))}
// // // //                                 </select>
// // // //                             </div>

// // // //                             <div className="devices-list-container">
// // // //                                 {filteredAvailableDevices.length > 0 ? (
// // // //                                     <ul className="available-devices-list">
// // // //                                         {filteredAvailableDevices.map(device => (
// // // //                                             <li
// // // //                                                 key={device.device_id}
// // // //                                                 className={`device-item ${selectedAvailableDevices.includes(device.device_id) ? 'selected' : ''}`}
// // // //                                                 onClick={() => toggleDeviceSelection(device.device_id)}
// // // //                                             >
// // // //                                                 <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
// // // //                                                     {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// // // //                                                 </span>
// // // //                                                 {selectedAvailableDevices.includes(device.device_id) && (
// // // //                                                     <FaCheck className="selection-check" />
// // // //                                                 )}
// // // //                                             </li>
// // // //                                         ))}
// // // //                                     </ul>
// // // //                                 ) : (
// // // //                                     <p>No available devices found</p>
// // // //                                 )}
// // // //                             </div>

// // // //                             <div className="available-devices-buttons">
// // // //                                 <button
// // // //                                     onClick={addSelectedDevices}
// // // //                                     disabled={selectedAvailableDevices.length === 0 || isAssigningDevices || !selectedDeviceName}
// // // //                                     className="add-devices-button"
// // // //                                 >
// // // //                                     {isAssigningDevices ? 'Assigning...' : 'Add Selected Devices'}
// // // //                                 </button>
// // // //                                 <button
// // // //                                     onClick={handleAddDeviceClick}
// // // //                                     className="add-new-device-toggle-button"
// // // //                                 >
// // // //                                     {showAddNewDeviceForm ? 'Hide Add Device Form' : 'Add New Device'}
// // // //                                 </button>
// // // //                                 <button
// // // //                                     onClick={() => setShowAvailableDevices(false)}
// // // //                                     className="cancel-button"
// // // //                                 >
// // // //                                     Close
// // // //                                 </button>
// // // //                             </div>

// // // //                             <AnimatePresence>
// // // //                                 {showAddNewDeviceForm && (
// // // //                                     <motion.div
// // // //                                         className="add-new-device-form"
// // // //                                         initial={{ opacity: 0, height: 0 }}
// // // //                                         animate={{ opacity: 1, height: 'auto' }}
// // // //                                         exit={{ opacity: 0, height: 0 }}
// // // //                                         transition={{ duration: 0.3 }}
// // // //                                     >
// // // //                                         <h4>Add New Device</h4>
// // // //                                         <div className="input-group">
// // // //                                             <label>Device ID:</label>
// // // //                                             <input
// // // //                                                 type="text"
// // // //                                                 name="device_id"
// // // //                                                 value={addNewDeviceData.device_id}
// // // //                                                 onChange={handleNewDeviceInputChange}
// // // //                                                 placeholder="Enter new device ID"
// // // //                                             />
// // // //                                         </div>
// // // //                                         <div className="input-group">
// // // //                                             <label>Device Type:</label>
// // // //                                             <select
// // // //                                                 name="device_name"
// // // //                                                 value={addNewDeviceData.device_name}
// // // //                                                 onChange={handleNewDeviceInputChange}
// // // //                                                 required
// // // //                                             >
// // // //                                                 <option value="">Select Device Type</option>
// // // //                                                 {Object.entries(deviceTypes).map(([value, label]) => (
// // // //                                                     <option key={value} value={value}>{label}</option>
// // // //                                                 ))}
// // // //                                             </select>
// // // //                                         </div>
// // // //                                         <button
// // // //                                             onClick={handleAddNewDevice}
// // // //                                             disabled={isAssigningDevices || !addNewDeviceData.device_id.trim() || !addNewDeviceData.device_name}
// // // //                                             className="add-new-device-to-user-button"
// // // //                                         >
// // // //                                             {isAssigningDevices ? 'Adding...' : 'Add Device to User'}
// // // //                                         </button>
// // // //                                     </motion.div>
// // // //                                 )}
// // // //                             </AnimatePresence>
// // // //                         </div>
// // // //                     </motion.div>
// // // //                 )}
// // // //             </AnimatePresence>
// // // //         </motion.div>
// // // //     );
// // // // };

// // // // export default UserManagement;
// // // import React, { useEffect, useState } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import API from '../services/api';
// // // import { FaTrash, FaEdit, FaEye, FaLaptop, FaChevronDown, FaChevronUp, FaSearch, FaPlus, FaCheck } from 'react-icons/fa';
// // // import '../styles/UserManagement.css';

// // // const UserManagement = () => {
// // //     const [users, setUsers] = useState([]);
// // //     const [filteredUsers, setFilteredUsers] = useState([]);
// // //     const [statusFilter, setStatusFilter] = useState('all');
// // //     const [searchQuery, setSearchQuery] = useState('');
// // //     const [formData, setFormData] = useState({
// // //         email: '',
// // //         new_email: '',
// // //         password: '',
// // //         client_name: '',
// // //         mobile_no: '',
// // //         lat_long: '',
// // //         activation_date: '',
// // //         expiring_date: '',
// // //         address: '',
// // //         role: '',
// // //     });
// // //     const [editingUserEmail, setEditingUserEmail] = useState(null);
// // //     const [viewUser, setViewUser] = useState(null);
// // //     const [devicesView, setDevicesView] = useState(null);
// // //     const [allDevices, setAllDevices] = useState([]);
// // //     const [deviceStatuses, setDeviceStatuses] = useState({});
// // //     const [editingDevices, setEditingDevices] = useState([]);
// // //     const [devicesModified, setDevicesModified] = useState(false);
// // //     const [error, setError] = useState('');
// // //     const [isFormExpanded, setIsFormExpanded] = useState(false);
// // //     const [showAvailableDevices, setShowAvailableDevices] = useState(false);
// // //     const [selectedAvailableDevices, setSelectedAvailableDevices] = useState([]);
// // //     const [loadingDevices, setLoadingDevices] = useState(false);
// // //     const [isAssigningDevices, setIsAssigningDevices] = useState(false);
// // //     const [selectedDeviceName, setSelectedDeviceName] = useState('');
// // //     const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
// // //     const [deviceTypes] = useState({
// // //         'flow-meter': 'Flow Meter',
// // //         'pressure-sensor': 'Pressure Sensor',
// // //         'Piezometer': 'Piezometer',
// // //         'water-quality': 'Water Quality Sensor',
// // //         'others': 'Other Device'
// // //     });

// // //     const [addNewDeviceData, setAddNewDeviceData] = useState({
// // //         device_id: '',
// // //         device_name: '',
// // //         device_location: '',
// // //         device_site_name: ''
// // //     });
// // //     const [showAddNewDeviceForm, setShowAddNewDeviceForm] = useState(false);

// // //     const loadUsers = async () => {
// // //         try {
// // //             const response = await API.get('/users');
// // //             setUsers(response.data);
// // //             setFilteredUsers(response.data);
// // //         } catch (error) {
// // //             console.error('Error fetching users:', error);
// // //             setError('Failed to load users. Please try again.');
// // //         }
// // //     };

// // //     const loadAllDevices = async () => {
// // //         try {
// // //             setLoadingDevices(true);
// // //             const response = await API.get('/sensor-data');

// // //             const sensorData = response.data.data || [];
// // //             const uniqueDevices = [];
// // //             const deviceIds = new Set();
// // //             const statusMap = {};
// // //             const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

// // //             sensorData.forEach(device => {
// // //                 if (!deviceIds.has(device.device_id)) {
// // //                     deviceIds.add(device.device_id);
// // //                     uniqueDevices.push({
// // //                         device_id: device.device_id,
// // //                         device_name: device.device_type || 'unknown',
// // //                         device_location: device.device_location || '',
// // //                         device_site_name: device.device_site_name || '',
// // //                         last_seen: device.createdAt
// // //                     });
// // //                 }

// // //                 const deviceTime = new Date(device.createdAt);
// // //                 if (!statusMap[device.device_id] || deviceTime > new Date(statusMap[device.device_id].last_seen)) {
// // //                     statusMap[device.device_id] = {
// // //                         status: deviceTime > oneHourAgo ? 'online' : 'offline',
// // //                         last_seen: device.createdAt
// // //                     };
// // //                 }
// // //             });

// // //             setAllDevices(uniqueDevices);

// // //             const uiStatusMap = {};
// // //             Object.keys(statusMap).forEach(deviceId => {
// // //                 uiStatusMap[deviceId] = statusMap[deviceId].status;
// // //             });
// // //             setDeviceStatuses(uiStatusMap);

// // //         } catch (error) {
// // //             console.error("Error loading devices:", error);
// // //             setError("Failed to load devices. Please try again.");
// // //         } finally {
// // //             setLoadingDevices(false);
// // //         }
// // //     };

// // //     useEffect(() => {
// // //         loadUsers();
// // //         loadAllDevices();
// // //     }, []);

// // //     useEffect(() => {
// // //         const filtered = users.filter(user => {
// // //             const isActive = new Date(user.expiring_date) >= new Date();
// // //             const statusMatch =
// // //                 statusFilter === 'all' ||
// // //                 (statusFilter === 'active' && isActive) ||
// // //                 (statusFilter === 'suspended' && !isActive);

// // //             const searchMatch =
// // //                 searchQuery === '' ||
// // //                 user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //                 user.client_name.toLowerCase().includes(searchQuery.toLowerCase());

// // //             return statusMatch && searchMatch;
// // //         });

// // //         setFilteredUsers(filtered);
// // //     }, [users, statusFilter, searchQuery]);

// // //     const handleInputChange = (e) => {
// // //         const { name, value } = e.target;
// // //         setFormData(prev => ({ ...prev, [name]: value }));
// // //         setError('');
// // //     };

// // //     const validateForm = () => {
// // //         const { email, new_email, password, client_name, mobile_no, lat_long, activation_date, expiring_date, address, role } = formData;
// // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //         const phoneRegex = /^\d{10}$/;

// // //         if (editingUserEmail) {
// // //             if (!editingUserEmail || !emailRegex.test(editingUserEmail)) return 'Invalid current email.';
// // //         } else {
// // //             if (!email || !emailRegex.test(email)) return 'Please enter a valid email.';
// // //         }

// // //         if (new_email && !emailRegex.test(new_email)) return 'Please enter a valid new email.';
// // //         if (!editingUserEmail && (!password || password.length < 6)) return 'Password must be at least 6 characters.';
// // //         if (!client_name.trim()) return 'Client name is required.';
// // //         if (!mobile_no || !phoneRegex.test(mobile_no)) return 'Enter a valid 10-digit mobile number.';
// // //         if (!lat_long.trim()) return 'Lat/Long is required.';
// // //         if (!activation_date) return 'Activation date is required.';
// // //         if (!expiring_date) return 'Expiring date is required.';
// // //         if (!address.trim()) return 'Address is required.';
// // //         if (!role) return 'Please select a role.';
// // //         return '';
// // //     };

// // //     const handleFormSubmit = async (e) => {
// // //         e.preventDefault();
// // //         const validationError = validateForm();
// // //         if (validationError) {
// // //             setError(validationError);
// // //             return;
// // //         }

// // //         try {
// // //             if (editingUserEmail) {
// // //                 const payload = {
// // //                     ...formData,
// // //                     email: editingUserEmail,
// // //                 };

// // //                 if (!payload.password) delete payload.password;
// // //                 if (!payload.new_email) delete payload.new_email;

// // //                 await API.put('/user', payload);
// // //                 setEditingUserEmail(null);
// // //             } else {
// // //                 await API.post('/users', formData);
// // //             }

// // //             resetForm();
// // //             loadUsers();
// // //         } catch (error) {
// // //             console.error('Error submitting form:', error);
// // //             setError(error.response?.data?.message || 'Failed to submit form. Please try again.');
// // //         }
// // //     };

// // //     const resetForm = () => {
// // //         setFormData({
// // //             email: '',
// // //             new_email: '',
// // //             password: '',
// // //             client_name: '',
// // //             mobile_no: '',
// // //             lat_long: '',
// // //             activation_date: '',
// // //             expiring_date: '',
// // //             address: '',
// // //             role: '',
// // //         });
// // //         setEditingUserEmail(null);
// // //         setError('');
// // //         setIsFormExpanded(false);
// // //     };

// // //     const handleDeleteUser = async (email) => {
// // //         if (window.confirm('Are you sure you want to delete this user?')) {
// // //             try {
// // //                 await API.delete(`/user?email=${encodeURIComponent(email)}`);
// // //                 loadUsers();
// // //             } catch (error) {
// // //                 console.error('Error deleting user:', error);
// // //                 setError('Failed to delete user. Please try again.');
// // //             }
// // //         }
// // //     };

// // //     const handleEditUser = (user) => {
// // //         setFormData({
// // //             email: '',
// // //             new_email: '',
// // //             password: '',
// // //             client_name: user.client_name,
// // //             mobile_no: user.mobile_no,
// // //             lat_long: user.lat_long,
// // //             activation_date: user.activation_date?.slice(0, 10),
// // //             expiring_date: user.expiring_date?.slice(0, 10),
// // //             address: user.address,
// // //             role: user.role,
// // //         });
// // //         setEditingUserEmail(user.email);
// // //         setIsFormExpanded(true);
// // //     };

// // //     const handleViewUser = async (user) => {
// // //         try {
// // //             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
// // //             setViewUser(res.data);
// // //         } catch (err) {
// // //             console.error('Error viewing user:', err);
// // //             setError('Failed to load user details. Please try again.');
// // //         }
// // //     };

// // //     const handleViewDevices = async (user) => {
// // //         try {
// // //             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
// // //             setDevicesView(res.data);
// // //             setEditingDevices(res.data.devices || []);
// // //             setDevicesModified(false);
// // //             setSelectedAvailableDevices([]);
// // //             setSelectedDeviceName('');
// // //             setAddNewDeviceData({ device_id: '', device_name: '', device_location: '', device_site_name: '' });
// // //             setShowAddNewDeviceForm(false);
// // //         } catch (err) {
// // //             console.error('Error viewing devices:', err);
// // //             setError('Failed to load user devices. Please try again.');
// // //         }
// // //     };

// // //     const handleShowAvailableDevices = () => {
// // //         setShowAvailableDevices(true);
// // //         setSelectedAvailableDevices([]);
// // //         setSelectedDeviceName('');
// // //         setDeviceSearchQuery('');
// // //         setShowAddNewDeviceForm(false);
// // //         setAddNewDeviceData({ device_id: '', device_name: '', device_location: '', device_site_name: '' });
// // //     };

// // //     const toggleDeviceSelection = (deviceId) => {
// // //         setSelectedAvailableDevices(prev =>
// // //             prev.includes(deviceId)
// // //                 ? prev.filter(id => id !== deviceId)
// // //                 : [...prev, deviceId]
// // //         );
// // //     };

// // //     const handleDeviceAssignment = async (device, assign = true) => {
// // //         try {
// // //             const response = await fetch('http://13.201.156.32:5000/api/assign-devices', {
// // //                 method: 'POST',
// // //                 headers: {
// // //                     'Content-Type': 'application/json',
// // //                 },
// // //                 body: JSON.stringify({
// // //                     email: devicesView.email,
// // //                     devices: [{
// // //                         device_id: device.device_id,
// // //                         device_name: device.device_name,
// // //                         device_location: device.device_location || '',
// // //                         device_site_name: device.device_site_name || ''
// // //                     }],
// // //                     unassign: !assign
// // //                 })
// // //             });

// // //             if (!response.ok) {
// // //                 throw new Error(`HTTP error! status: ${response.status}`);
// // //             }

// // //             const data = await response.json();

// // //             if (assign && data.message === "Devices assigned successfully") {
// // //                 const assignedDevice = data.results.find(r => r.device_id === device.device_id);
// // //                 if (assignedDevice && assignedDevice.status === "assigned successfully") {
// // //                     return true;
// // //                 }
// // //             } else if (!assign && data.message === "Devices unassigned successfully") {
// // //                 const unassignedDevice = data.results.find(r => r.device_id === device.device_id);
// // //                 if (unassignedDevice && unassignedDevice.status === "unassigned") {
// // //                     return true;
// // //                 }
// // //             } else if (data.message === "No devices were assigned" &&
// // //                 data.results?.[0]?.status === "already assigned to this user") {
// // //                 return true;
// // //             }

// // //             throw new Error(data.message || 'Device assignment failed');
// // //         } catch (error) {
// // //             console.error('Error assigning/unassigning device:', error);
// // //             setError(`Failed to ${assign ? 'assign' : 'unassign'} device: ${error.message}`);
// // //             return false;
// // //         }
// // //     };

// // //     const addSelectedDevices = async () => {
// // //         if (!selectedDeviceName) {
// // //             setError('Please select a device type before assigning');
// // //             return;
// // //         }

// // //         setIsAssigningDevices(true);
// // //         setError('');
// // //         try {
// // //             const devicesToAdd = allDevices
// // //                 .filter(device => selectedAvailableDevices.includes(device.device_id))
// // //                 .filter(device => !editingDevices.some(d => d.device_id === device.device_id))
// // //                 .map(device => ({
// // //                     ...device,
// // //                     device_name: selectedDeviceName
// // //                 }));

// // //             let allSuccess = true;

// // //             for (const device of devicesToAdd) {
// // //                 const success = await handleDeviceAssignment(device, true);
// // //                 if (!success) {
// // //                     allSuccess = false;
// // //                     break;
// // //                 }
// // //             }

// // //             if (allSuccess && devicesToAdd.length > 0) {
// // //                 setEditingDevices(prev => [...prev, ...devicesToAdd]);
// // //                 setDevicesModified(true);
// // //                 setShowAvailableDevices(false);
// // //             } else if (!allSuccess) {
// // //                 setError('Failed to assign some devices. Please try again.');
// // //             }
// // //         } catch (error) {
// // //             console.error('Error adding devices:', error);
// // //             setError('Failed to add devices. Please try again.');
// // //         } finally {
// // //             setIsAssigningDevices(false);
// // //         }
// // //     };

// // //     const removeDevice = async (deviceId) => {
// // //         setError('');
// // //         const deviceToRemove = editingDevices.find(d => d.device_id === deviceId);
// // //         if (!deviceToRemove) return;

// // //         try {
// // //             const success = await handleDeviceAssignment(deviceToRemove, false);
// // //             if (success) {
// // //                 setEditingDevices(prev => {
// // //                     const newDevices = prev.filter(d => d.device_id !== deviceId);
// // //                     setDevicesModified(newDevices.length !== prev.length);
// // //                     return newDevices;
// // //                 });
// // //             }
// // //         } catch (error) {
// // //             console.error('Error removing device:', error);
// // //             setError('Failed to remove device. Please try again.');
// // //         }
// // //     };

// // //     const saveDevices = async () => {
// // //         setError('');
// // //         try {
// // //             const currentRes = await API.get(`/user?email=${encodeURIComponent(devicesView.email)}`);
// // //             const currentDevices = currentRes.data.devices || [];

// // //             const devicesToAdd = editingDevices.filter(ed =>
// // //                 !currentDevices.some(cd => cd.device_id === ed.device_id)
// // //             );

// // //             const devicesToRemove = currentDevices.filter(cd =>
// // //                 !editingDevices.some(ed => ed.device_id === cd.device_id)
// // //             );

// // //             for (const device of devicesToAdd) {
// // //                 await handleDeviceAssignment(device, true);
// // //             }

// // //             for (const device of devicesToRemove) {
// // //                 await handleDeviceAssignment(device, false);
// // //             }

// // //             loadUsers();
// // //             setDevicesView(null);
// // //             setEditingDevices([]);
// // //             setDevicesModified(false);
// // //         } catch (error) {
// // //             console.error('Error saving device assignments:', error);
// // //             setError('Failed to save device assignments. Please try again.');
// // //         }
// // //     };

// // //     const availableDevices = allDevices.filter(device =>
// // //         !editingDevices.some(d => d.device_id === device.device_id)
// // //     );

// // //     const filteredAvailableDevices = availableDevices.filter(device =>
// // //         device.device_id.toLowerCase().includes(deviceSearchQuery.toLowerCase())
// // //     );

// // //     const getDeviceDisplayName = (deviceName) => {
// // //         return deviceTypes[deviceName] || deviceName;
// // //     };

// // //     const handleNewDeviceInputChange = (e) => {
// // //         const { name, value } = e.target;
// // //         setAddNewDeviceData(prev => ({ ...prev, [name]: value }));
// // //         setError('');
// // //     };

// // //     const handleAddDeviceClick = () => {
// // //         setShowAddNewDeviceForm(prev => !prev);
// // //         setAddNewDeviceData({ device_id: '', device_name: '', device_location: '', device_site_name: '' });
// // //         setError('');
// // //     };

// // //     const handleAddNewDevice = async () => {
// // //         if (!addNewDeviceData.device_id.trim()) {
// // //             setError('Please enter a Device ID.');
// // //             return;
// // //         }
// // //         if (!addNewDeviceData.device_name) {
// // //             setError('Please select a Device Type.');
// // //             return;
// // //         }

// // //         setError('');
// // //         setIsAssigningDevices(true);

// // //         try {
// // //             const deviceCreationPayload = {
// // //                 device_id: addNewDeviceData.device_id,
// // //                 device_type: addNewDeviceData.device_name,
// // //             };

// // //             const deviceExists = allDevices.some(d => d.device_id === addNewDeviceData.device_id);

// // //             if (!deviceExists) {
// // //                 await API.post('/sensor-data', deviceCreationPayload);
// // //                 setAllDevices(prev => [...prev, {
// // //                     device_id: addNewDeviceData.device_id,
// // //                     device_name: addNewDeviceData.device_name,
// // //                     device_location: addNewDeviceData.device_location,
// // //                     device_site_name: addNewDeviceData.device_site_name,
// // //                     last_seen: new Date().toISOString()
// // //                 }]);
// // //                 setDeviceStatuses(prev => ({ ...prev, [addNewDeviceData.device_id]: 'offline' }));
// // //             }

// // //             const assignmentSuccess = await handleDeviceAssignment({
// // //                 device_id: addNewDeviceData.device_id,
// // //                 device_name: addNewDeviceData.device_name,
// // //                 device_location: addNewDeviceData.device_location,
// // //                 device_site_name: addNewDeviceData.device_site_name
// // //             }, true);

// // //             if (assignmentSuccess) {
// // //                 setEditingDevices(prev => {
// // //                     if (!prev.some(d => d.device_id === addNewDeviceData.device_id)) {
// // //                         return [...prev, { 
// // //                             device_id: addNewDeviceData.device_id, 
// // //                             device_name: addNewDeviceData.device_name,
// // //                             device_location: addNewDeviceData.device_location,
// // //                             device_site_name: addNewDeviceData.device_site_name
// // //                         }];
// // //                     }
// // //                     return prev;
// // //                 });
// // //                 setDevicesModified(true);
// // //                 setAddNewDeviceData({ 
// // //                     device_id: '', 
// // //                     device_name: '',
// // //                     device_location: '',
// // //                     device_site_name: ''
// // //                 });
// // //                 setShowAddNewDeviceForm(false);
// // //                 setShowAvailableDevices(false);
// // //             } else {
// // //                 setError('Failed to assign the new device.');
// // //             }

// // //         } catch (err) {
// // //             console.error('Error adding new device or assigning it:', err);
// // //             setError(err.response?.data?.message || 'Failed to add and assign new device. It might already exist.');
// // //         } finally {
// // //             setIsAssigningDevices(false);
// // //         }
// // //     };

// // //     return (
// // //         <motion.div
// // //             className="user-management"
// // //             initial="hidden"
// // //             animate="visible"
// // //             variants={{
// // //                 hidden: { opacity: 0 },
// // //                 visible: {
// // //                     opacity: 1,
// // //                     transition: {
// // //                         staggerChildren: 0.1,
// // //                         when: "beforeChildren"
// // //                     }
// // //                 }
// // //             }}
// // //         >
// // //             <motion.h2 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // //                 User Management
// // //             </motion.h2>

// // //             <motion.div className="search-container" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // //                 <div className="search-bar">
// // //                     <FaSearch className="search-icon" />
// // //                     <input
// // //                         type="text"
// // //                         placeholder="Search by email or name..."
// // //                         value={searchQuery}
// // //                         onChange={(e) => setSearchQuery(e.target.value)}
// // //                     />
// // //                 </div>
// // //             </motion.div>

// // //             <motion.div
// // //                 className={`form-container ${isFormExpanded ? 'expanded' : ''}`}
// // //                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
// // //             >
// // //                 <div
// // //                     className="form-header"
// // //                     onClick={() => setIsFormExpanded(!isFormExpanded)}
// // //                 >
// // //                     <h3>{editingUserEmail ? 'Edit User' : 'Add New User'}</h3>
// // //                     {isFormExpanded ? <FaChevronUp /> : <FaChevronDown />}
// // //                 </div>

// // //                 <AnimatePresence>
// // //                     {isFormExpanded && (
// // //                         <motion.form
// // //                             onSubmit={handleFormSubmit}
// // //                             className={`user-form ${editingUserEmail ? 'update-form' : ''}`}
// // //                             variants={{
// // //                                 hidden: { height: 0, opacity: 0 },
// // //                                 visible: {
// // //                                     height: 'auto',
// // //                                     opacity: 1,
// // //                                     transition: {
// // //                                         duration: 0.3
// // //                                     }
// // //                                 },
// // //                                 exit: { height: 0, opacity: 0 }
// // //                             }}
// // //                             initial="hidden"
// // //                             animate="visible"
// // //                             exit="exit"
// // //                         >
// // //                             {editingUserEmail && (
// // //                                 <div className="input-group">
// // //                                     <label>Current Email</label>
// // //                                     <div className="email-display">{editingUserEmail}</div>
// // //                                 </div>
// // //                             )}

// // //                             {Object.entries(formData).map(([key, value]) => {
// // //                                 if (key === '_id') return null;
// // //                                 if (key === 'email' && editingUserEmail) return null;
// // //                                 if (key === 'new_email' && !editingUserEmail) return null;

// // //                                 if (key === 'role') {
// // //                                     return (
// // //                                         <div className="input-group" key={key}>
// // //                                             <label>Role</label>
// // //                                             <select
// // //                                                 name={key}
// // //                                                 value={value}
// // //                                                 onChange={handleInputChange}
// // //                                                 required
// // //                                             >
// // //                                                 <option value="">Select Role</option>
// // //                                                 <option value="superadmin">Super Admin</option>
// // //                                                 <option value="subadmin">Sub Admin</option>
// // //                                                 <option value="user">User</option>
// // //                                             </select>
// // //                                         </div>
// // //                                     );
// // //                                 }

// // //                                 return (
// // //                                     <div className="input-group" key={key}>
// // //                                         <label>
// // //                                             {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
// // //                                             {['password', 'activation_date', 'expiring_date'].includes(key) && ' *'}
// // //                                         </label>
// // //                                         <input
// // //                                             type={key === 'password' ? 'password' : key.includes('date') ? 'date' : 'text'}
// // //                                             name={key}
// // //                                             value={value}
// // //                                             onChange={handleInputChange}
// // //                                             required={!['password', 'new_email'].includes(key) && !(key === 'email' && editingUserEmail !== null)}
// // //                                             disabled={key === 'email' && editingUserEmail !== null}
// // //                                             placeholder={key === 'email' && editingUserEmail ? '' : undefined}
// // //                                         />
// // //                                     </div>
// // //                                 );
// // //                             })}

// // //                             <div className="form-buttons">
// // //                                 <button type="submit">
// // //                                     {editingUserEmail ? 'Update User' : 'Add User'}
// // //                                 </button>
// // //                                 {editingUserEmail && (
// // //                                     <button
// // //                                         type="button"
// // //                                         onClick={resetForm}
// // //                                         className="cancel-button"
// // //                                     >
// // //                                         Cancel
// // //                                     </button>
// // //                                 )}
// // //                             </div>
// // //                         </motion.form>
// // //                     )}
// // //                 </AnimatePresence>
// // //             </motion.div>

// // //             {error && (
// // //                 <motion.div
// // //                     className="error-message"
// // //                     initial={{ opacity: 0 }}
// // //                     animate={{ opacity: 1 }}
// // //                     exit={{ opacity: 0 }}
// // //                 >
// // //                     {error}
// // //                 </motion.div>
// // //             )}

// // //             <motion.div className="filter-controls" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // //                 <label>Status Filter: </label>
// // //                 <select
// // //                     value={statusFilter}
// // //                     onChange={(e) => setStatusFilter(e.target.value)}
// // //                     className="filter-select"
// // //                 >
// // //                     <option value="all">All Users</option>
// // //                     <option value="active">Active Users</option>
// // //                     <option value="suspended">Suspended Users</option>
// // //                 </select>
// // //             </motion.div>

// // //             <motion.div className="user-table" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// // //                 <table>
// // //                     <thead>
// // //                         <tr>
// // //                             <th>Email</th>
// // //                             <th>Client</th>
// // //                             <th>Mobile</th>
// // //                             <th>Role</th>
// // //                             <th>Status</th>
// // //                             <th>Actions</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {filteredUsers.map((user, index) => (
// // //                             <motion.tr
// // //                                 key={user.email}
// // //                                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
// // //                                 initial="hidden"
// // //                                 animate="visible"
// // //                                 transition={{ delay: index * 0.05 }}
// // //                             >
// // //                                 <td>{user.email}</td>
// // //                                 <td>{user.client_name}</td>
// // //                                 <td>{user.mobile_no}</td>
// // //                                 <td>{user.role}</td>
// // //                                 <td>
// // //                                     <span
// // //                                         className={`status-indicator ${new Date(user.expiring_date) >= new Date() ? 'active' : 'suspended'}`}
// // //                                         title={new Date(user.expiring_date) >= new Date() ? 'Active' : 'Suspended'}
// // //                                     ></span>
// // //                                 </td>
// // //                                 <td className="actions">
// // //                                     <button onClick={() => handleEditUser(user)} title="Edit">
// // //                                         <FaEdit />
// // //                                     </button>
// // //                                     <button onClick={() => handleViewUser(user)} title="View">
// // //                                         <FaEye />
// // //                                     </button>
// // //                                     <button onClick={() => handleViewDevices(user)} title="Devices">
// // //                                         <FaLaptop />
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={() => handleDeleteUser(user.email)}
// // //                                         className="delete-button"
// // //                                         title="Delete"
// // //                                     >
// // //                                         <FaTrash />
// // //                                     </button>
// // //                                 </td>
// // //                             </motion.tr>
// // //                         ))}
// // //                     </tbody>
// // //                 </table>
// // //             </motion.div>

// // //             <AnimatePresence>
// // //                 {viewUser && (
// // //                     <motion.div
// // //                         className="user-detail-popup"
// // //                         initial={{ opacity: 0 }}
// // //                         animate={{ opacity: 1 }}
// // //                         exit={{ opacity: 0 }}
// // //                     >
// // //                         <h3>User Details</h3>
// // //                         <div className="user-details-grid">
// // //                             <div><strong>Email:</strong> {viewUser.email}</div>
// // //                             <div><strong>Password:</strong> {viewUser.password || '(hidden)'}</div>
// // //                             <div><strong>Client Name:</strong> {viewUser.client_name}</div>
// // //                             <div><strong>Mobile No:</strong> {viewUser.mobile_no}</div>
// // //                             <div><strong>Lat/Long:</strong> {viewUser.lat_long}</div>
// // //                             <div><strong>Activation Date:</strong> {viewUser.activation_date?.slice(0, 10)}</div>
// // //                             <div><strong>Expiring Date:</strong> {viewUser.expiring_date?.slice(0, 10)}</div>
// // //                             <div><strong>Address:</strong> {viewUser.address}</div>
// // //                             <div><strong>Role:</strong> {viewUser.role}</div>
// // //                             <div><strong>Devices:</strong>
// // //                                 {viewUser.devices?.length > 0 ? (
// // //                                     <ul>
// // //                                         {viewUser.devices.map(device => (
// // //                                             <li key={device.device_id}>
// // //                                                 {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// // //                                                 {device.device_location && <div>Location: {device.device_location}</div>}
// // //                                                 {device.device_site_name && <div>Site: {device.device_site_name}</div>}
// // //                                             </li>
// // //                                         ))}
// // //                                     </ul>
// // //                                 ) : 'No devices assigned'}
// // //                             </div>
// // //                         </div>
// // //                         <button onClick={() => setViewUser(null)}>Close</button>
// // //                     </motion.div>
// // //                 )}
// // //             </AnimatePresence>

// // //             <AnimatePresence>
// // //                 {devicesView && (
// // //                     <motion.div
// // //                         className="devices-popup"
// // //                         initial={{ opacity: 0 }}
// // //                         animate={{ opacity: 1 }}
// // //                         exit={{ opacity: 0 }}
// // //                     >
// // //                         <h3>Manage Devices for {devicesView.email}</h3>

// // //                         <div className="device-assignment">
// // //                             <button
// // //                                 onClick={handleShowAvailableDevices}
// // //                                 className="view-devices-button"
// // //                                 disabled={loadingDevices}
// // //                             >
// // //                                 <FaPlus /> {loadingDevices ? 'Loading Devices...' : 'View Available Devices'}
// // //                             </button>

// // //                             <div className="assigned-devices-list">
// // //                                 <h4>Assigned Devices:</h4>
// // //                                 {editingDevices.length > 0 ? (
// // //                                     <ul>
// // //                                         {editingDevices.map(device => (
// // //                                             <li key={device.device_id}>
// // //                                                 <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
// // //                                                     {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// // //                                                     {device.device_location && <div>Location: {device.device_location}</div>}
// // //                                                     {device.device_site_name && <div>Site: {device.device_site_name}</div>}
// // //                                                 </span>
// // //                                                 <button
// // //                                                     onClick={() => removeDevice(device.device_id)}
// // //                                                     className="remove-device-button"
// // //                                                 >
// // //                                                     Remove
// // //                                                 </button>
// // //                                             </li>
// // //                                         ))}
// // //                                     </ul>
// // //                                 ) : (
// // //                                     <p>No devices assigned</p>
// // //                                 )}
// // //                             </div>
// // //                         </div>

// // //                         <div className="device-popup-buttons">
// // //                             {devicesModified && (
// // //                                 <button onClick={saveDevices} className="save-button">
// // //                                     Save Changes
// // //                                 </button>
// // //                             )}
// // //                             <button
// // //                                 onClick={() => {
// // //                                     setDevicesView(null);
// // //                                     setEditingDevices([]);
// // //                                     setDevicesModified(false);
// // //                                 }}
// // //                                 className="cancel-button"
// // //                             >
// // //                                 Cancel
// // //                             </button>
// // //                         </div>
// // //                     </motion.div>
// // //                 )}
// // //             </AnimatePresence>

// // //             <AnimatePresence>
// // //                 {showAvailableDevices && (
// // //                     <motion.div
// // //                         className="available-devices-popup"
// // //                         initial={{ opacity: 0 }}
// // //                         animate={{ opacity: 1 }}
// // //                         exit={{ opacity: 0 }}
// // //                     >
// // //                         <div className="available-devices-content">
// // //                             <h3>Available Devices ({filteredAvailableDevices.length})</h3>

// // //                             <div className="device-search-container">
// // //                                 <div className="search-bar">
// // //                                     <FaSearch className="search-icon" />
// // //                                     <input
// // //                                         type="text"
// // //                                         placeholder="Search by device ID..."
// // //                                         value={deviceSearchQuery}
// // //                                         onChange={(e) => setDeviceSearchQuery(e.target.value)}
// // //                                     />
// // //                                 </div>
// // //                             </div>

// // //                             <div className="device-name-selection">
// // //                                 <label>Device Type for Selected:</label>
// // //                                 <select
// // //                                     value={selectedDeviceName}
// // //                                     onChange={(e) => setSelectedDeviceName(e.target.value)}
// // //                                     required
// // //                                 >
// // //                                     <option value="">Select Device Type</option>
// // //                                     {Object.entries(deviceTypes).map(([value, label]) => (
// // //                                         <option key={value} value={value}>{label}</option>
// // //                                     ))}
// // //                                 </select>
// // //                             </div>

// // //                             <div className="devices-list-container">
// // //                                 {filteredAvailableDevices.length > 0 ? (
// // //                                     <ul className="available-devices-list">
// // //                                         {filteredAvailableDevices.map(device => (
// // //                                             <li
// // //                                                 key={device.device_id}
// // //                                                 className={`device-item ${selectedAvailableDevices.includes(device.device_id) ? 'selected' : ''}`}
// // //                                                 onClick={() => toggleDeviceSelection(device.device_id)}
// // //                                             >
// // //                                                 <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
// // //                                                     {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// // //                                                     {device.device_location && <div>Location: {device.device_location}</div>}
// // //                                                     {device.device_site_name && <div>Site: {device.device_site_name}</div>}
// // //                                                 </span>
// // //                                                 {selectedAvailableDevices.includes(device.device_id) && (
// // //                                                     <FaCheck className="selection-check" />
// // //                                                 )}
// // //                                             </li>
// // //                                         ))}
// // //                                     </ul>
// // //                                 ) : (
// // //                                     <p>No available devices found</p>
// // //                                 )}
// // //                             </div>

// // //                             <div className="available-devices-buttons">
// // //                                 <button
// // //                                     onClick={addSelectedDevices}
// // //                                     disabled={selectedAvailableDevices.length === 0 || isAssigningDevices || !selectedDeviceName}
// // //                                     className="add-devices-button"
// // //                                 >
// // //                                     {isAssigningDevices ? 'Assigning...' : 'Add Selected Devices'}
// // //                                 </button>
// // //                                 <button
// // //                                     onClick={handleAddDeviceClick}
// // //                                     className="add-new-device-toggle-button"
// // //                                 >
// // //                                     {showAddNewDeviceForm ? 'Hide Add Device Form' : 'Add New Device'}
// // //                                 </button>
// // //                                 <button
// // //                                     onClick={() => setShowAvailableDevices(false)}
// // //                                     className="cancel-button"
// // //                                 >
// // //                                     Close
// // //                                 </button>
// // //                             </div>

// // //                             <AnimatePresence>
// // //                                 {showAddNewDeviceForm && (
// // //                                     <motion.div
// // //                                         className="add-new-device-form"
// // //                                         initial={{ opacity: 0, height: 0 }}
// // //                                         animate={{ opacity: 1, height: 'auto' }}
// // //                                         exit={{ opacity: 0, height: 0 }}
// // //                                         transition={{ duration: 0.3 }}
// // //                                     >
// // //                                         <h4>Add New Device</h4>
// // //                                         <div className="input-group">
// // //                                             <label>Device ID:</label>
// // //                                             <input
// // //                                                 type="text"
// // //                                                 name="device_id"
// // //                                                 value={addNewDeviceData.device_id}
// // //                                                 onChange={handleNewDeviceInputChange}
// // //                                                 placeholder="Enter new device ID"
// // //                                             />
// // //                                         </div>
// // //                                         <div className="input-group">
// // //                                             <label>Device Type:</label>
// // //                                             <select
// // //                                                 name="device_name"
// // //                                                 value={addNewDeviceData.device_name}
// // //                                                 onChange={handleNewDeviceInputChange}
// // //                                                 required
// // //                                             >
// // //                                                 <option value="">Select Device Type</option>
// // //                                                 {Object.entries(deviceTypes).map(([value, label]) => (
// // //                                                     <option key={value} value={value}>{label}</option>
// // //                                                 ))}
// // //                                             </select>
// // //                                         </div>
// // //                                         <div className="input-group">
// // //                                             <label>Device Location:</label>
// // //                                             <input
// // //                                                 type="text"
// // //                                                 name="device_location"
// // //                                                 value={addNewDeviceData.device_location}
// // //                                                 onChange={handleNewDeviceInputChange}
// // //                                                 placeholder="Enter device location"
// // //                                             />
// // //                                         </div>
// // //                                         <div className="input-group">
// // //                                             <label>Site Name:</label>
// // //                                             <input
// // //                                                 type="text"
// // //                                                 name="device_site_name"
// // //                                                 value={addNewDeviceData.device_site_name}
// // //                                                 onChange={handleNewDeviceInputChange}
// // //                                                 placeholder="Enter site name"
// // //                                             />
// // //                                         </div>
// // //                                         <button
// // //                                             onClick={handleAddNewDevice}
// // //                                             disabled={isAssigningDevices || !addNewDeviceData.device_id.trim() || !addNewDeviceData.device_name}
// // //                                             className="add-new-device-to-user-button"
// // //                                         >
// // //                                             {isAssigningDevices ? 'Adding...' : 'Add Device to User'}
// // //                                         </button>
// // //                                     </motion.div>
// // //                                 )}
// // //                             </AnimatePresence>
// // //                         </div>
// // //                     </motion.div>
// // //                 )}
// // //             </AnimatePresence>
// // //         </motion.div>
// // //     );
// // // };

// // // export default UserManagement;
// // import React, { useEffect, useState } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import API from '../services/api';
// // import { FaTrash, FaEdit, FaEye, FaLaptop, FaChevronDown, FaChevronUp, FaSearch, FaPlus, FaCheck, FaSave } from 'react-icons/fa';
// // import '../styles/UserManagement.css';

// // const UserManagement = () => {
// //     const [users, setUsers] = useState([]);
// //     const [filteredUsers, setFilteredUsers] = useState([]);
// //     const [statusFilter, setStatusFilter] = useState('all');
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [formData, setFormData] = useState({
// //         email: '',
// //         new_email: '',
// //         password: '',
// //         client_name: '',
// //         mobile_no: '',
// //         lat_long: '',
// //         activation_date: '',
// //         expiring_date: '',
// //         address: '',
// //         role: '',
// //     });
// //     const [editingUserEmail, setEditingUserEmail] = useState(null);
// //     const [viewUser, setViewUser] = useState(null);
// //     const [devicesView, setDevicesView] = useState(null);
// //     const [allDevices, setAllDevices] = useState([]);
// //     const [deviceStatuses, setDeviceStatuses] = useState({});
// //     const [editingDevices, setEditingDevices] = useState([]);
// //     const [devicesModified, setDevicesModified] = useState(false);
// //     const [error, setError] = useState('');
// //     const [isFormExpanded, setIsFormExpanded] = useState(false);
// //     const [showAvailableDevices, setShowAvailableDevices] = useState(false);
// //     const [selectedAvailableDevices, setSelectedAvailableDevices] = useState([]);
// //     const [loadingDevices, setLoadingDevices] = useState(false);
// //     const [isAssigningDevices, setIsAssigningDevices] = useState(false);
// //     const [selectedDeviceName, setSelectedDeviceName] = useState('');
// //     const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
// //     const [deviceTypes] = useState({
// //         'flow-meter': 'Flow Meter',
// //         'pressure-sensor': 'Pressure Sensor',
// //         'Piezometer': 'Piezometer',
// //         'water-quality': 'Water Quality Sensor',
// //         'others': 'Other Device'
// //     });

// //     const [addNewDeviceData, setAddNewDeviceData] = useState({
// //         device_id: '',
// //         device_name: '',
// //         device_location: '',
// //         device_site_name: ''
// //     });
// //     const [showAddNewDeviceForm, setShowAddNewDeviceForm] = useState(false);
// //     const [editingDevice, setEditingDevice] = useState(null);
// //     const [deviceEditData, setDeviceEditData] = useState({
// //         device_location: '',
// //         device_site_name: ''
// //     });

// //     const loadUsers = async () => {
// //         try {
// //             const response = await API.get('/users');
// //             setUsers(response.data);
// //             setFilteredUsers(response.data);
// //         } catch (error) {
// //             console.error('Error fetching users:', error);
// //             setError('Failed to load users. Please try again.');
// //         }
// //     };

// //     const loadAllDevices = async () => {
// //         try {
// //             setLoadingDevices(true);
// //             const response = await API.get('/sensor-data');

// //             const sensorData = response.data.data || [];
// //             const uniqueDevices = [];
// //             const deviceIds = new Set();
// //             const statusMap = {};
// //             const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

// //             sensorData.forEach(device => {
// //                 if (!deviceIds.has(device.device_id)) {
// //                     deviceIds.add(device.device_id);
// //                     uniqueDevices.push({
// //                         device_id: device.device_id,
// //                         device_name: device.device_type || 'unknown',
// //                         device_location: device.device_location || '',
// //                         device_site_name: device.device_site_name || '',
// //                         last_seen: device.createdAt
// //                     });
// //                 }

// //                 const deviceTime = new Date(device.createdAt);
// //                 if (!statusMap[device.device_id] || deviceTime > new Date(statusMap[device.device_id].last_seen)) {
// //                     statusMap[device.device_id] = {
// //                         status: deviceTime > oneHourAgo ? 'online' : 'offline',
// //                         last_seen: device.createdAt
// //                     };
// //                 }
// //             });

// //             setAllDevices(uniqueDevices);

// //             const uiStatusMap = {};
// //             Object.keys(statusMap).forEach(deviceId => {
// //                 uiStatusMap[deviceId] = statusMap[deviceId].status;
// //             });
// //             setDeviceStatuses(uiStatusMap);

// //         } catch (error) {
// //             console.error("Error loading devices:", error);
// //             setError("Failed to load devices. Please try again.");
// //         } finally {
// //             setLoadingDevices(false);
// //         }
// //     };

// //     useEffect(() => {
// //         loadUsers();
// //         loadAllDevices();
// //     }, []);

// //     useEffect(() => {
// //         const filtered = users.filter(user => {
// //             const isActive = new Date(user.expiring_date) >= new Date();
// //             const statusMatch =
// //                 statusFilter === 'all' ||
// //                 (statusFilter === 'active' && isActive) ||
// //                 (statusFilter === 'suspended' && !isActive);

// //             const searchMatch =
// //                 searchQuery === '' ||
// //                 user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                 user.client_name.toLowerCase().includes(searchQuery.toLowerCase());

// //             return statusMatch && searchMatch;
// //         });

// //         setFilteredUsers(filtered);
// //     }, [users, statusFilter, searchQuery]);

// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData(prev => ({ ...prev, [name]: value }));
// //         setError('');
// //     };

// //     const validateForm = () => {
// //         const { email, new_email, password, client_name, mobile_no, lat_long, activation_date, expiring_date, address, role } = formData;
// //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //         const phoneRegex = /^\d{10}$/;

// //         if (editingUserEmail) {
// //             if (!editingUserEmail || !emailRegex.test(editingUserEmail)) return 'Invalid current email.';
// //         } else {
// //             if (!email || !emailRegex.test(email)) return 'Please enter a valid email.';
// //         }

// //         if (new_email && !emailRegex.test(new_email)) return 'Please enter a valid new email.';
// //         if (!editingUserEmail && (!password || password.length < 6)) return 'Password must be at least 6 characters.';
// //         if (!client_name.trim()) return 'Client name is required.';
// //         if (!mobile_no || !phoneRegex.test(mobile_no)) return 'Enter a valid 10-digit mobile number.';
// //         if (!lat_long.trim()) return 'Lat/Long is required.';
// //         if (!activation_date) return 'Activation date is required.';
// //         if (!expiring_date) return 'Expiring date is required.';
// //         if (!address.trim()) return 'Address is required.';
// //         if (!role) return 'Please select a role.';
// //         return '';
// //     };

// //     const handleFormSubmit = async (e) => {
// //         e.preventDefault();
// //         const validationError = validateForm();
// //         if (validationError) {
// //             setError(validationError);
// //             return;
// //         }

// //         try {
// //             if (editingUserEmail) {
// //                 const payload = {
// //                     ...formData,
// //                     email: editingUserEmail,
// //                 };

// //                 if (!payload.password) delete payload.password;
// //                 if (!payload.new_email) delete payload.new_email;

// //                 await API.put('/user', payload);
// //                 setEditingUserEmail(null);
// //             } else {
// //                 await API.post('/users', formData);
// //             }

// //             resetForm();
// //             loadUsers();
// //         } catch (error) {
// //             console.error('Error submitting form:', error);
// //             setError(error.response?.data?.message || 'Failed to submit form. Please try again.');
// //         }
// //     };

// //     const resetForm = () => {
// //         setFormData({
// //             email: '',
// //             new_email: '',
// //             password: '',
// //             client_name: '',
// //             mobile_no: '',
// //             lat_long: '',
// //             activation_date: '',
// //             expiring_date: '',
// //             address: '',
// //             role: '',
// //         });
// //         setEditingUserEmail(null);
// //         setError('');
// //         setIsFormExpanded(false);
// //     };

// //     const handleDeleteUser = async (email) => {
// //         if (window.confirm('Are you sure you want to delete this user?')) {
// //             try {
// //                 await API.delete(`/user?email=${encodeURIComponent(email)}`);
// //                 loadUsers();
// //             } catch (error) {
// //                 console.error('Error deleting user:', error);
// //                 setError('Failed to delete user. Please try again.');
// //             }
// //         }
// //     };

// //     const handleEditUser = (user) => {
// //         setFormData({
// //             email: '',
// //             new_email: '',
// //             password: '',
// //             client_name: user.client_name,
// //             mobile_no: user.mobile_no,
// //             lat_long: user.lat_long,
// //             activation_date: user.activation_date?.slice(0, 10),
// //             expiring_date: user.expiring_date?.slice(0, 10),
// //             address: user.address,
// //             role: user.role,
// //         });
// //         setEditingUserEmail(user.email);
// //         setIsFormExpanded(true);
// //     };

// //     const handleViewUser = async (user) => {
// //         try {
// //             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
// //             setViewUser(res.data);
// //         } catch (err) {
// //             console.error('Error viewing user:', err);
// //             setError('Failed to load user details. Please try again.');
// //         }
// //     };

// //     const handleViewDevices = async (user) => {
// //         try {
// //             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
// //             setDevicesView(res.data);
// //             setEditingDevices(res.data.devices || []);
// //             setDevicesModified(false);
// //             setSelectedAvailableDevices([]);
// //             setSelectedDeviceName('');
// //             setAddNewDeviceData({ device_id: '', device_name: '', device_location: '', device_site_name: '' });
// //             setShowAddNewDeviceForm(false);
// //             setEditingDevice(null);
// //         } catch (err) {
// //             console.error('Error viewing devices:', err);
// //             setError('Failed to load user devices. Please try again.');
// //         }
// //     };

// //     const handleShowAvailableDevices = () => {
// //         setShowAvailableDevices(true);
// //         setSelectedAvailableDevices([]);
// //         setSelectedDeviceName('');
// //         setDeviceSearchQuery('');
// //         setShowAddNewDeviceForm(false);
// //         setAddNewDeviceData({ device_id: '', device_name: '', device_location: '', device_site_name: '' });
// //     };

// //     const toggleDeviceSelection = (deviceId) => {
// //         setSelectedAvailableDevices(prev =>
// //             prev.includes(deviceId)
// //                 ? prev.filter(id => id !== deviceId)
// //                 : [...prev, deviceId]
// //         );
// //     };

// //     const handleDeviceAssignment = async (device, assign = true) => {
// //         try {
// //             const response = await fetch('http://13.201.156.32:5000/api/assign-devices', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({
// //                     email: devicesView.email,
// //                     devices: [{
// //                         device_id: device.device_id,
// //                         device_name: device.device_name,
// //                         device_location: device.device_location || '',
// //                         device_site_name: device.device_site_name || ''
// //                     }],
// //                     unassign: !assign
// //                 })
// //             });

// //             if (!response.ok) {
// //                 throw new Error(`HTTP error! status: ${response.status}`);
// //             }

// //             const data = await response.json();

// //             if (assign && data.message === "Devices assigned successfully") {
// //                 const assignedDevice = data.results.find(r => r.device_id === device.device_id);
// //                 if (assignedDevice && assignedDevice.status === "assigned successfully") {
// //                     return true;
// //                 }
// //             } else if (!assign && data.message === "Devices unassigned successfully") {
// //                 const unassignedDevice = data.results.find(r => r.device_id === device.device_id);
// //                 if (unassignedDevice && unassignedDevice.status === "unassigned") {
// //                     return true;
// //                 }
// //             } else if (data.message === "No devices were assigned" &&
// //                 data.results?.[0]?.status === "already assigned to this user") {
// //                 return true;
// //             }

// //             throw new Error(data.message || 'Device assignment failed');
// //         } catch (error) {
// //             console.error('Error assigning/unassigning device:', error);
// //             setError(`Failed to ${assign ? 'assign' : 'unassign'} device: ${error.message}`);
// //             return false;
// //         }
// //     };

// //     const addSelectedDevices = async () => {
// //         if (!selectedDeviceName) {
// //             setError('Please select a device type before assigning');
// //             return;
// //         }

// //         setIsAssigningDevices(true);
// //         setError('');
// //         try {
// //             const devicesToAdd = allDevices
// //                 .filter(device => selectedAvailableDevices.includes(device.device_id))
// //                 .filter(device => !editingDevices.some(d => d.device_id === device.device_id))
// //                 .map(device => ({
// //                     ...device,
// //                     device_name: selectedDeviceName
// //                 }));

// //             let allSuccess = true;

// //             for (const device of devicesToAdd) {
// //                 const success = await handleDeviceAssignment(device, true);
// //                 if (!success) {
// //                     allSuccess = false;
// //                     break;
// //                 }
// //             }

// //             if (allSuccess && devicesToAdd.length > 0) {
// //                 setEditingDevices(prev => [...prev, ...devicesToAdd]);
// //                 setDevicesModified(true);
// //                 setShowAvailableDevices(false);
// //             } else if (!allSuccess) {
// //                 setError('Failed to assign some devices. Please try again.');
// //             }
// //         } catch (error) {
// //             console.error('Error adding devices:', error);
// //             setError('Failed to add devices. Please try again.');
// //         } finally {
// //             setIsAssigningDevices(false);
// //         }
// //     };

// //     const removeDevice = async (deviceId) => {
// //         setError('');
// //         const deviceToRemove = editingDevices.find(d => d.device_id === deviceId);
// //         if (!deviceToRemove) return;

// //         try {
// //             const success = await handleDeviceAssignment(deviceToRemove, false);
// //             if (success) {
// //                 setEditingDevices(prev => {
// //                     const newDevices = prev.filter(d => d.device_id !== deviceId);
// //                     setDevicesModified(newDevices.length !== prev.length);
// //                     return newDevices;
// //                 });
// //             }
// //         } catch (error) {
// //             console.error('Error removing device:', error);
// //             setError('Failed to remove device. Please try again.');
// //         }
// //     };

// //     const saveDevices = async () => {
// //         setError('');
// //         try {
// //             const currentRes = await API.get(`/user?email=${encodeURIComponent(devicesView.email)}`);
// //             const currentDevices = currentRes.data.devices || [];

// //             const devicesToAdd = editingDevices.filter(ed =>
// //                 !currentDevices.some(cd => cd.device_id === ed.device_id)
// //             );

// //             const devicesToRemove = currentDevices.filter(cd =>
// //                 !editingDevices.some(ed => ed.device_id === cd.device_id)
// //             );

// //             for (const device of devicesToAdd) {
// //                 await handleDeviceAssignment(device, true);
// //             }

// //             for (const device of devicesToRemove) {
// //                 await handleDeviceAssignment(device, false);
// //             }

// //             loadUsers();
// //             setDevicesView(null);
// //             setEditingDevices([]);
// //             setDevicesModified(false);
// //         } catch (error) {
// //             console.error('Error saving device assignments:', error);
// //             setError('Failed to save device assignments. Please try again.');
// //         }
// //     };

// //     const handleEditDevice = (device) => {
// //         setEditingDevice(device.device_id);
// //         setDeviceEditData({
// //             device_location: device.device_location || '',
// //             device_site_name: device.device_site_name || ''
// //         });
// //     };

// //     const handleDeviceEditChange = (e) => {
// //         const { name, value } = e.target;
// //         setDeviceEditData(prev => ({ ...prev, [name]: value }));
// //     };

// //     const handleSaveDeviceEdit = async () => {
// //         try {
// //             const response = await API.put(`/device/${editingDevice}`, {
// //                 device_name: editingDevices.find(d => d.device_id === editingDevice)?.device_name,
// //                 device_location: deviceEditData.device_location,
// //                 device_site_name: deviceEditData.device_site_name
// //             });

// //             if (response.data.success) {
// //                 setEditingDevices(prev =>
// //                     prev.map(device =>
// //                         device.device_id === editingDevice
// //                             ? {
// //                                 ...device,
// //                                 device_location: deviceEditData.device_location,
// //                                 device_site_name: deviceEditData.device_site_name
// //                             }
// //                             : device
// //                     )
// //                 );
// //                 setDevicesModified(true);
// //                 setEditingDevice(null);

// //                 // Also update the allDevices list if needed
// //                 setAllDevices(prev =>
// //                     prev.map(device =>
// //                         device.device_id === editingDevice
// //                             ? {
// //                                 ...device,
// //                                 device_location: deviceEditData.device_location,
// //                                 device_site_name: deviceEditData.device_site_name
// //                             }
// //                             : device
// //                     )
// //                 );
// //             } else {
// //                 setError(response.data.message || 'Failed to update device details');
// //             }
// //         } catch (error) {
// //             console.error('Error updating device:', error);
// //             setError(error.response?.data?.message || 'Failed to update device details. Please try again.');
// //         }
// //     };

// //     const handleCancelDeviceEdit = () => {
// //         setEditingDevice(null);
// //     };

// //     const handleNewDeviceInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setAddNewDeviceData(prev => ({ ...prev, [name]: value }));
// //         setError('');
// //     };

// //     const handleAddDeviceClick = () => {
// //         setShowAddNewDeviceForm(prev => !prev);
// //         setAddNewDeviceData({ device_id: '', device_name: '', device_location: '', device_site_name: '' });
// //         setError('');
// //     };

// //     const handleAddNewDevice = async () => {
// //         if (!addNewDeviceData.device_id.trim()) {
// //             setError('Please enter a Device ID.');
// //             return;
// //         }
// //         if (!addNewDeviceData.device_name) {
// //             setError('Please select a Device Type.');
// //             return;
// //         }

// //         setError('');
// //         setIsAssigningDevices(true);

// //         try {
// //             const deviceCreationPayload = {
// //                 device_id: addNewDeviceData.device_id,
// //                 device_type: addNewDeviceData.device_name,
// //             };

// //             const deviceExists = allDevices.some(d => d.device_id === addNewDeviceData.device_id);

// //             if (!deviceExists) {
// //                 await API.post('/sensor-data', deviceCreationPayload);
// //                 setAllDevices(prev => [...prev, {
// //                     device_id: addNewDeviceData.device_id,
// //                     device_name: addNewDeviceData.device_name,
// //                     device_location: addNewDeviceData.device_location,
// //                     device_site_name: addNewDeviceData.device_site_name,
// //                     last_seen: new Date().toISOString()
// //                 }]);
// //                 setDeviceStatuses(prev => ({ ...prev, [addNewDeviceData.device_id]: 'offline' }));
// //             }

// //             const assignmentSuccess = await handleDeviceAssignment({
// //                 device_id: addNewDeviceData.device_id,
// //                 device_name: addNewDeviceData.device_name,
// //                 device_location: addNewDeviceData.device_location,
// //                 device_site_name: addNewDeviceData.device_site_name
// //             }, true);

// //             if (assignmentSuccess) {
// //                 setEditingDevices(prev => {
// //                     if (!prev.some(d => d.device_id === addNewDeviceData.device_id)) {
// //                         return [...prev, {
// //                             device_id: addNewDeviceData.device_id,
// //                             device_name: addNewDeviceData.device_name,
// //                             device_location: addNewDeviceData.device_location,
// //                             device_site_name: addNewDeviceData.device_site_name
// //                         }];
// //                     }
// //                     return prev;
// //                 });
// //                 setDevicesModified(true);
// //                 setAddNewDeviceData({
// //                     device_id: '',
// //                     device_name: '',
// //                     device_location: '',
// //                     device_site_name: ''
// //                 });
// //                 setShowAddNewDeviceForm(false);
// //                 setShowAvailableDevices(false);
// //             } else {
// //                 setError('Failed to assign the new device.');
// //             }

// //         } catch (err) {
// //             console.error('Error adding new device or assigning it:', err);
// //             setError(err.response?.data?.message || 'Failed to add and assign new device. It might already exist.');
// //         } finally {
// //             setIsAssigningDevices(false);
// //         }
// //     };

// //     const availableDevices = allDevices.filter(device =>
// //         !editingDevices.some(d => d.device_id === device.device_id)
// //     );

// //     const filteredAvailableDevices = availableDevices.filter(device =>
// //         device.device_id.toLowerCase().includes(deviceSearchQuery.toLowerCase())
// //     );

// //     const getDeviceDisplayName = (deviceName) => {
// //         return deviceTypes[deviceName] || deviceName;
// //     };

// //     return (
// //         <motion.div
// //             className="user-management"
// //             initial="hidden"
// //             animate="visible"
// //             variants={{
// //                 hidden: { opacity: 0 },
// //                 visible: {
// //                     opacity: 1,
// //                     transition: {
// //                         staggerChildren: 0.1,
// //                         when: "beforeChildren"
// //                     }
// //                 }
// //             }}
// //         >
// //             <motion.h2 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// //                 User Management
// //             </motion.h2>

// //             <motion.div className="search-container" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// //                 <div className="search-bar">
// //                     <FaSearch className="search-icon" />
// //                     <input
// //                         type="text"
// //                         placeholder="Search by email or name..."
// //                         value={searchQuery}
// //                         onChange={(e) => setSearchQuery(e.target.value)}
// //                     />
// //                 </div>
// //             </motion.div>

// //             <motion.div
// //                 className={`form-container ${isFormExpanded ? 'expanded' : ''}`}
// //                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
// //             >
// //                 <div
// //                     className="form-header"
// //                     onClick={() => setIsFormExpanded(!isFormExpanded)}
// //                 >
// //                     <h3>{editingUserEmail ? 'Edit User' : 'Add New User'}</h3>
// //                     {isFormExpanded ? <FaChevronUp /> : <FaChevronDown />}
// //                 </div>

// //                 <AnimatePresence>
// //                     {isFormExpanded && (
// //                         <motion.form
// //                             onSubmit={handleFormSubmit}
// //                             className={`user-form ${editingUserEmail ? 'update-form' : ''}`}
// //                             variants={{
// //                                 hidden: { height: 0, opacity: 0 },
// //                                 visible: {
// //                                     height: 'auto',
// //                                     opacity: 1,
// //                                     transition: {
// //                                         duration: 0.3
// //                                     }
// //                                 },
// //                                 exit: { height: 0, opacity: 0 }
// //                             }}
// //                             initial="hidden"
// //                             animate="visible"
// //                             exit="exit"
// //                         >
// //                             {editingUserEmail && (
// //                                 <div className="input-group">
// //                                     <label>Current Email</label>
// //                                     <div className="email-display">{editingUserEmail}</div>
// //                                 </div>
// //                             )}

// //                             {Object.entries(formData).map(([key, value]) => {
// //                                 if (key === '_id') return null;
// //                                 if (key === 'email' && editingUserEmail) return null;
// //                                 if (key === 'new_email' && !editingUserEmail) return null;

// //                                 if (key === 'role') {
// //                                     return (
// //                                         <div className="input-group" key={key}>
// //                                             <label>Role</label>
// //                                             <select
// //                                                 name={key}
// //                                                 value={value}
// //                                                 onChange={handleInputChange}
// //                                                 required
// //                                             >
// //                                                 <option value="">Select Role</option>
// //                                                 <option value="superadmin">Super Admin</option>
// //                                                 <option value="subadmin">Sub Admin</option>
// //                                                 <option value="user">User</option>
// //                                             </select>
// //                                         </div>
// //                                     );
// //                                 }

// //                                 return (
// //                                     <div className="input-group" key={key}>
// //                                         <label>
// //                                             {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
// //                                             {['password', 'activation_date', 'expiring_date'].includes(key) && ' *'}
// //                                         </label>
// //                                         <input
// //                                             type={key === 'password' ? 'password' : key.includes('date') ? 'date' : 'text'}
// //                                             name={key}
// //                                             value={value}
// //                                             onChange={handleInputChange}
// //                                             required={!['password', 'new_email'].includes(key) && !(key === 'email' && editingUserEmail !== null)}
// //                                             disabled={key === 'email' && editingUserEmail !== null}
// //                                             placeholder={key === 'email' && editingUserEmail ? '' : undefined}
// //                                         />
// //                                     </div>
// //                                 );
// //                             })}

// //                             <div className="form-buttons">
// //                                 <button type="submit">
// //                                     {editingUserEmail ? 'Update User' : 'Add User'}
// //                                 </button>
// //                                 {editingUserEmail && (
// //                                     <button
// //                                         type="button"
// //                                         onClick={resetForm}
// //                                         className="cancel-button"
// //                                     >
// //                                         Cancel
// //                                     </button>
// //                                 )}
// //                             </div>
// //                         </motion.form>
// //                     )}
// //                 </AnimatePresence>
// //             </motion.div>

// //             {error && (
// //                 <motion.div
// //                     className="error-message"
// //                     initial={{ opacity: 0 }}
// //                     animate={{ opacity: 1 }}
// //                     exit={{ opacity: 0 }}
// //                 >
// //                     {error}
// //                 </motion.div>
// //             )}

// //             <motion.div className="filter-controls" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// //                 <label>Status Filter: </label>
// //                 <select
// //                     value={statusFilter}
// //                     onChange={(e) => setStatusFilter(e.target.value)}
// //                     className="filter-select"
// //                 >
// //                     <option value="all">All Users</option>
// //                     <option value="active">Active Users</option>
// //                     <option value="suspended">Suspended Users</option>
// //                 </select>
// //             </motion.div>

// //             <motion.div className="user-table" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
// //                 <table>
// //                     <thead>
// //                         <tr>
// //                             <th>Email</th>
// //                             <th>Client</th>
// //                             <th>Mobile</th>
// //                             <th>Role</th>
// //                             <th>Status</th>
// //                             <th>Actions</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {filteredUsers.map((user, index) => (
// //                             <motion.tr
// //                                 key={user.email}
// //                                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
// //                                 initial="hidden"
// //                                 animate="visible"
// //                                 transition={{ delay: index * 0.05 }}
// //                             >
// //                                 <td>{user.email}</td>
// //                                 <td>{user.client_name}</td>
// //                                 <td>{user.mobile_no}</td>
// //                                 <td>{user.role}</td>
// //                                 <td>
// //                                     <span
// //                                         className={`status-indicator ${new Date(user.expiring_date) >= new Date() ? 'active' : 'suspended'}`}
// //                                         title={new Date(user.expiring_date) >= new Date() ? 'Active' : 'Suspended'}
// //                                     ></span>
// //                                 </td>
// //                                 <td className="actions">
// //                                     <button onClick={() => handleEditUser(user)} title="Edit">
// //                                         <FaEdit />
// //                                     </button>
// //                                     <button onClick={() => handleViewUser(user)} title="View">
// //                                         <FaEye />
// //                                     </button>
// //                                     <button onClick={() => handleViewDevices(user)} title="Devices">
// //                                         <FaLaptop />
// //                                     </button>
// //                                     <button
// //                                         onClick={() => handleDeleteUser(user.email)}
// //                                         className="delete-button"
// //                                         title="Delete"
// //                                     >
// //                                         <FaTrash />
// //                                     </button>
// //                                 </td>
// //                             </motion.tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //             </motion.div>

// //             <AnimatePresence>
// //                 {viewUser && (
// //                     <motion.div
// //                         className="user-detail-popup"
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <h3>User Details</h3>
// //                         <div className="user-details-grid">
// //                             <div><strong>Email:</strong> {viewUser.email}</div>
// //                             <div><strong>Password:</strong> {viewUser.password || '(hidden)'}</div>
// //                             <div><strong>Client Name:</strong> {viewUser.client_name}</div>
// //                             <div><strong>Mobile No:</strong> {viewUser.mobile_no}</div>
// //                             <div><strong>Lat/Long:</strong> {viewUser.lat_long}</div>
// //                             <div><strong>Activation Date:</strong> {viewUser.activation_date?.slice(0, 10)}</div>
// //                             <div><strong>Expiring Date:</strong> {viewUser.expiring_date?.slice(0, 10)}</div>
// //                             <div><strong>Address:</strong> {viewUser.address}</div>
// //                             <div><strong>Role:</strong> {viewUser.role}</div>
// //                             <div><strong>Devices:</strong>
// //                                 {viewUser.devices?.length > 0 ? (
// //                                     <ul>
// //                                         {viewUser.devices.map(device => (
// //                                             <li key={device.device_id}>
// //                                                 {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// //                                                 {device.device_location && <div>Location: {device.device_location}</div>}
// //                                                 {device.device_site_name && <div>Site: {device.device_site_name}</div>}
// //                                             </li>
// //                                         ))}
// //                                     </ul>
// //                                 ) : 'No devices assigned'}
// //                             </div>
// //                         </div>
// //                         <button onClick={() => setViewUser(null)}>Close</button>
// //                     </motion.div>
// //                 )}
// //             </AnimatePresence>

// //             <AnimatePresence>
// //                 {devicesView && (
// //                     <motion.div
// //                         className="devices-popup"
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <h3>Manage Devices for {devicesView.email}</h3>

// //                         <div className="device-assignment">
// //                             <button
// //                                 onClick={handleShowAvailableDevices}
// //                                 className="view-devices-button"
// //                                 disabled={loadingDevices}
// //                             >
// //                                 <FaPlus /> {loadingDevices ? 'Loading Devices...' : 'View Available Devices'}
// //                             </button>

// //                             <div className="assigned-devices-list">
// //                                 <h4>Assigned Devices:</h4>
// //                                 {editingDevices.length > 0 ? (
// //                                     <ul>
// //                                         {editingDevices.map(device => (
// //                                             <li key={device.device_id}>
// //                                                 {editingDevice === device.device_id ? (
// //                                                     <div className="device-edit-form">
// //                                                         <div className="input-group">
// //                                                             <label>Location:</label>
// //                                                             <input
// //                                                                 type="text"
// //                                                                 name="device_location"
// //                                                                 value={deviceEditData.device_location}
// //                                                                 onChange={handleDeviceEditChange}
// //                                                             />
// //                                                         </div>
// //                                                         <div className="input-group">
// //                                                             <label>Site Name:</label>
// //                                                             <input
// //                                                                 type="text"
// //                                                                 name="device_site_name"
// //                                                                 value={deviceEditData.device_site_name}
// //                                                                 onChange={handleDeviceEditChange}
// //                                                             />
// //                                                         </div>
// //                                                         <div className="device-edit-buttons">
// //                                                             <button
// //                                                                 onClick={handleSaveDeviceEdit}
// //                                                                 className="save-button"
// //                                                             >
// //                                                                 <FaSave /> Save
// //                                                             </button>
// //                                                             <button
// //                                                                 onClick={handleCancelDeviceEdit}
// //                                                                 className="cancel-button"
// //                                                             >
// //                                                                 Cancel
// //                                                             </button>
// //                                                         </div>
// //                                                     </div>
// //                                                 ) : (
// //                                                     <>
// //                                                         <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
// //                                                             {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// //                                                             {device.device_location && <div>Location: {device.device_location}</div>}
// //                                                             {device.device_site_name && <div>Site: {device.device_site_name}</div>}
// //                                                         </span>
// //                                                         <div className="device-actions">
// //                                                             <button
// //                                                                 onClick={() => handleEditDevice(device)}
// //                                                                 className="edit-device-button"
// //                                                             >
// //                                                                 <FaEdit /> Edit
// //                                                             </button>
// //                                                             <button
// //                                                                 onClick={() => removeDevice(device.device_id)}
// //                                                                 className="remove-device-button"
// //                                                             >
// //                                                                 Remove
// //                                                             </button>
// //                                                         </div>
// //                                                     </>
// //                                                 )}
// //                                             </li>
// //                                         ))}
// //                                     </ul>
// //                                 ) : (
// //                                     <p>No devices assigned</p>
// //                                 )}
// //                             </div>
// //                         </div>

// //                         <div className="device-popup-buttons">
// //                             {devicesModified && (
// //                                 <button onClick={saveDevices} className="save-button">
// //                                     Save All Changes
// //                                 </button>
// //                             )}
// //                             <button
// //                                 onClick={() => {
// //                                     setDevicesView(null);
// //                                     setEditingDevices([]);
// //                                     setDevicesModified(false);
// //                                 }}
// //                                 className="cancel-button"
// //                             >
// //                                 Cancel
// //                             </button>
// //                         </div>
// //                     </motion.div>
// //                 )}
// //             </AnimatePresence>

// //             <AnimatePresence>
// //                 {showAvailableDevices && (
// //                     <motion.div
// //                         className="available-devices-popup"
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <div className="available-devices-content">
// //                             <h3>Available Devices ({filteredAvailableDevices.length})</h3>

// //                             <div className="device-search-container">
// //                                 <div className="search-bar">
// //                                     <FaSearch className="search-icon" />
// //                                     <input
// //                                         type="text"
// //                                         placeholder="Search by device ID..."
// //                                         value={deviceSearchQuery}
// //                                         onChange={(e) => setDeviceSearchQuery(e.target.value)}
// //                                     />
// //                                 </div>
// //                             </div>

// //                             <div className="device-name-selection">
// //                                 <label>Device Type for Selected:</label>
// //                                 <select
// //                                     value={selectedDeviceName}
// //                                     onChange={(e) => setSelectedDeviceName(e.target.value)}
// //                                     required
// //                                 >
// //                                     <option value="">Select Device Type</option>
// //                                     {Object.entries(deviceTypes).map(([value, label]) => (
// //                                         <option key={value} value={value}>{label}</option>
// //                                     ))}
// //                                 </select>
// //                             </div>

// //                             <div className="devices-list-container">
// //                                 {filteredAvailableDevices.length > 0 ? (
// //                                     <ul className="available-devices-list">
// //                                         {filteredAvailableDevices.map(device => (
// //                                             <li
// //                                                 key={device.device_id}
// //                                                 className={`device-item ${selectedAvailableDevices.includes(device.device_id) ? 'selected' : ''}`}
// //                                                 onClick={() => toggleDeviceSelection(device.device_id)}
// //                                             >
// //                                                 <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
// //                                                     {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
// //                                                     {device.device_location && <div>Location: {device.device_location}</div>}
// //                                                     {device.device_site_name && <div>Site: {device.device_site_name}</div>}
// //                                                 </span>
// //                                                 {selectedAvailableDevices.includes(device.device_id) && (
// //                                                     <FaCheck className="selection-check" />
// //                                                 )}
// //                                             </li>
// //                                         ))}
// //                                     </ul>
// //                                 ) : (
// //                                     <p>No available devices found</p>
// //                                 )}
// //                             </div>

// //                             <div className="available-devices-buttons">
// //                                 <button
// //                                     onClick={addSelectedDevices}
// //                                     disabled={selectedAvailableDevices.length === 0 || isAssigningDevices || !selectedDeviceName}
// //                                     className="add-devices-button"
// //                                 >
// //                                     {isAssigningDevices ? 'Assigning...' : 'Add Selected Devices'}
// //                                 </button>
// //                                 <button
// //                                     onClick={handleAddDeviceClick}
// //                                     className="add-new-device-toggle-button"
// //                                 >
// //                                     {showAddNewDeviceForm ? 'Hide Add Device Form' : 'Add New Device'}
// //                                 </button>
// //                                 <button
// //                                     onClick={() => setShowAvailableDevices(false)}
// //                                     className="cancel-button"
// //                                 >
// //                                     Close
// //                                 </button>
// //                             </div>

// //                             <AnimatePresence>
// //                                 {showAddNewDeviceForm && (
// //                                     <motion.div
// //                                         className="add-new-device-form"
// //                                         initial={{ opacity: 0, height: 0 }}
// //                                         animate={{ opacity: 1, height: 'auto' }}
// //                                         exit={{ opacity: 0, height: 0 }}
// //                                         transition={{ duration: 0.3 }}
// //                                     >
// //                                         <h4>Add New Device</h4>
// //                                         <div className="input-group">
// //                                             <label>Device ID:</label>
// //                                             <input
// //                                                 type="text"
// //                                                 name="device_id"
// //                                                 value={addNewDeviceData.device_id}
// //                                                 onChange={handleNewDeviceInputChange}
// //                                                 placeholder="Enter new device ID"
// //                                             />
// //                                         </div>
// //                                         <div className="input-group">
// //                                             <label>Device Type:</label>
// //                                             <select
// //                                                 name="device_name"
// //                                                 value={addNewDeviceData.device_name}
// //                                                 onChange={handleNewDeviceInputChange}
// //                                                 required
// //                                             >
// //                                                 <option value="">Select Device Type</option>
// //                                                 {Object.entries(deviceTypes).map(([value, label]) => (
// //                                                     <option key={value} value={value}>{label}</option>
// //                                                 ))}
// //                                             </select>
// //                                         </div>
// //                                         <div className="input-group">
// //                                             <label>Device Location:</label>
// //                                             <input
// //                                                 type="text"
// //                                                 name="device_location"
// //                                                 value={addNewDeviceData.device_location}
// //                                                 onChange={handleNewDeviceInputChange}
// //                                                 placeholder="Enter device location"
// //                                             />
// //                                         </div>
// //                                         <div className="input-group">
// //                                             <label>Site Name:</label>
// //                                             <input
// //                                                 type="text"
// //                                                 name="device_site_name"
// //                                                 value={addNewDeviceData.device_site_name}
// //                                                 onChange={handleNewDeviceInputChange}
// //                                                 placeholder="Enter site name"
// //                                             />
// //                                         </div>
// //                                         <button
// //                                             onClick={handleAddNewDevice}
// //                                             disabled={isAssigningDevices || !addNewDeviceData.device_id.trim() || !addNewDeviceData.device_name}
// //                                             className="add-new-device-to-user-button"
// //                                         >
// //                                             {isAssigningDevices ? 'Adding...' : 'Add Device to User'}
// //                                         </button>
// //                                     </motion.div>
// //                                 )}
// //                             </AnimatePresence>
// //                         </div>
// //                     </motion.div>
// //                 )}
// //             </AnimatePresence>
// //         </motion.div>
// //     );
// // };

// // export default UserManagement;
// // export default UserManagement;
// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import API from '../services/api';
// import { FaTrash, FaEdit, FaEye, FaLaptop, FaChevronDown, FaChevronUp, FaSearch, FaPlus, FaCheck, FaSave } from 'react-icons/fa';
// import '../styles/UserManagement.css';

// const UserManagement = () => {
//     const [users, setUsers] = useState([]);
//     const [filteredUsers, setFilteredUsers] = useState([]);
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [formData, setFormData] = useState({
//         email: '',
//         new_email: '',
//         password: '',
//         client_name: '',
//         mobile_no: '',
//         lat_long: '',
//         activation_date: '',
//         expiring_date: '',
//         address: '',
//         role: '',
//     });
//     const [editingUserEmail, setEditingUserEmail] = useState(null);
//     const [viewUser, setViewUser] = useState(null);
//     const [devicesView, setDevicesView] = useState(null);
//     const [allDevices, setAllDevices] = useState([]);
//     const [deviceStatuses, setDeviceStatuses] = useState({});
//     const [editingDevices, setEditingDevices] = useState([]);
//     const [devicesModified, setDevicesModified] = useState(false);
//     const [error, setError] = useState('');
//     const [isFormExpanded, setIsFormExpanded] = useState(false);
//     const [showAvailableDevices, setShowAvailableDevices] = useState(false);
//     const [selectedAvailableDevices, setSelectedAvailableDevices] = useState([]);
//     const [loadingDevices, setLoadingDevices] = useState(false);
//     const [isAssigningDevices, setIsAssigningDevices] = useState(false);
//     const [selectedDeviceName, setSelectedDeviceName] = useState('');
//     const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
//     const [deviceTypes] = useState({
//         'flow-meter': 'Flow Meter',
//         'pressure-sensor': 'Pressure Sensor',
//         'Piezometer': 'Piezometer',
//         'water-quality': 'Water Quality Sensor',
//         'others': 'Other Device'
//     });

//     const [addNewDeviceData, setAddNewDeviceData] = useState({
//         device_id: '',
//         device_name: '',
//         device_location: '',
//         device_site_name: '',
//         latitude: '',
//         longitude: ''
//     });
//     const [showAddNewDeviceForm, setShowAddNewDeviceForm] = useState(false);
//     const [editingDevice, setEditingDevice] = useState(null);
//     const [deviceEditData, setDeviceEditData] = useState({
//         device_location: '',
//         device_site_name: '',
//         latitude: '',
//         longitude: ''
//     });

//     const loadUsers = async () => {
//         try {
//             const response = await API.get('/users');
//             setUsers(response.data);
//             setFilteredUsers(response.data);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setError('Failed to load users. Please try again.');
//         }
//     };

//     const loadAllDevices = async () => {
//         try {
//             setLoadingDevices(true);
//             const response = await API.get('/sensor-data');

//             const sensorData = response.data.data || [];
//             const uniqueDevices = [];
//             const deviceIds = new Set();
//             const statusMap = {};
//             const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

//             sensorData.forEach(device => {
//                 if (!deviceIds.has(device.device_id)) {
//                     deviceIds.add(device.device_id);
//                     uniqueDevices.push({
//                         device_id: device.device_id,
//                         device_name: device.device_type || 'unknown',
//                         device_location: device.device_location || '',
//                         device_site_name: device.device_site_name || '',
//                         latitude: device.latitude || '',
//                         longitude: device.longitude || '',
//                         last_seen: device.createdAt
//                     });
//                 }

//                 const deviceTime = new Date(device.createdAt);
//                 if (!statusMap[device.device_id] || deviceTime > new Date(statusMap[device.device_id].last_seen)) {
//                     statusMap[device.device_id] = {
//                         status: deviceTime > oneHourAgo ? 'online' : 'offline',
//                         last_seen: device.createdAt
//                     };
//                 }
//             });

//             setAllDevices(uniqueDevices);

//             const uiStatusMap = {};
//             Object.keys(statusMap).forEach(deviceId => {
//                 uiStatusMap[deviceId] = statusMap[deviceId].status;
//             });
//             setDeviceStatuses(uiStatusMap);

//         } catch (error) {
//             console.error("Error loading devices:", error);
//             setError("Failed to load devices. Please try again.");
//         } finally {
//             setLoadingDevices(false);
//         }
//     };

//     useEffect(() => {
//         loadUsers();
//         loadAllDevices();
//     }, []);

//     useEffect(() => {
//         const filtered = users.filter(user => {
//             const isActive = new Date(user.expiring_date) >= new Date();
//             const statusMatch =
//                 statusFilter === 'all' ||
//                 (statusFilter === 'active' && isActive) ||
//                 (statusFilter === 'suspended' && !isActive);

//             const searchMatch =
//                 searchQuery === '' ||
//                 user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 user.client_name.toLowerCase().includes(searchQuery.toLowerCase());

//             return statusMatch && searchMatch;
//         });

//         setFilteredUsers(filtered);
//     }, [users, statusFilter, searchQuery]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         setError('');
//     };

//     const validateForm = () => {
//         const { email, new_email, password, client_name, mobile_no, lat_long, activation_date, expiring_date, address, role } = formData;
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^\d{10}$/;

//         if (editingUserEmail) {
//             if (!editingUserEmail || !emailRegex.test(editingUserEmail)) return 'Invalid current email.';
//         } else {
//             if (!email || !emailRegex.test(email)) return 'Please enter a valid email.';
//         }

//         if (new_email && !emailRegex.test(new_email)) return 'Please enter a valid new email.';
//         if (!editingUserEmail && (!password || password.length < 6)) return 'Password must be at least 6 characters.';
//         if (!client_name.trim()) return 'Client name is required.';
//         if (!mobile_no || !phoneRegex.test(mobile_no)) return 'Enter a valid 10-digit mobile number.';
//         if (!lat_long.trim()) return 'Lat/Long is required.';
//         if (!activation_date) return 'Activation date is required.';
//         if (!expiring_date) return 'Expiring date is required.';
//         if (!address.trim()) return 'Address is required.';
//         if (!role) return 'Please select a role.';
//         return '';
//     };

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         const validationError = validateForm();
//         if (validationError) {
//             setError(validationError);
//             return;
//         }

//         try {
//             if (editingUserEmail) {
//                 const payload = {
//                     ...formData,
//                     email: editingUserEmail,
//                 };

//                 if (!payload.password) delete payload.password;
//                 if (!payload.new_email) delete payload.new_email;

//                 await API.put('/user', payload);
//                 setEditingUserEmail(null);
//             } else {
//                 await API.post('/users', formData);
//             }

//             resetForm();
//             loadUsers();
//         } catch (error) {
//             console.error('Error submitting form:', error);
//             setError(error.response?.data?.message || 'Failed to submit form. Please try again.');
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             email: '',
//             new_email: '',
//             password: '',
//             client_name: '',
//             mobile_no: '',
//             lat_long: '',
//             activation_date: '',
//             expiring_date: '',
//             address: '',
//             role: '',
//         });
//         setEditingUserEmail(null);
//         setError('');
//         setIsFormExpanded(false);
//     };

//     const handleDeleteUser = async (email) => {
//         if (window.confirm('Are you sure you want to delete this user?')) {
//             try {
//                 await API.delete(`/user?email=${encodeURIComponent(email)}`);
//                 loadUsers();
//             } catch (error) {
//                 console.error('Error deleting user:', error);
//                 setError('Failed to delete user. Please try again.');
//             }
//         }
//     };

//     const handleEditUser = (user) => {
//         setFormData({
//             email: '',
//             new_email: '',
//             password: '',
//             client_name: user.client_name,
//             mobile_no: user.mobile_no,
//             lat_long: user.lat_long,
//             activation_date: user.activation_date?.slice(0, 10),
//             expiring_date: user.expiring_date?.slice(0, 10),
//             address: user.address,
//             role: user.role,
//         });
//         setEditingUserEmail(user.email);
//         setIsFormExpanded(true);
//     };

//     const handleViewUser = async (user) => {
//         try {
//             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
//             setViewUser(res.data);
//         } catch (err) {
//             console.error('Error viewing user:', err);
//             setError('Failed to load user details. Please try again.');
//         }
//     };

//     const handleViewDevices = async (user) => {
//         try {
//             const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
//             setDevicesView(res.data);
//             setEditingDevices(res.data.devices || []);
//             setDevicesModified(false);
//             setSelectedAvailableDevices([]);
//             setSelectedDeviceName('');
//             setAddNewDeviceData({ 
//                 device_id: '', 
//                 device_name: '', 
//                 device_location: '', 
//                 device_site_name: '',
//                 latitude: '',
//                 longitude: ''
//             });
//             setShowAddNewDeviceForm(false);
//             setEditingDevice(null);
//         } catch (err) {
//             console.error('Error viewing devices:', err);
//             setError('Failed to load user devices. Please try again.');
//         }
//     };

//     const handleShowAvailableDevices = () => {
//         setShowAvailableDevices(true);
//         setSelectedAvailableDevices([]);
//         setSelectedDeviceName('');
//         setDeviceSearchQuery('');
//         setShowAddNewDeviceForm(false);
//         setAddNewDeviceData({ 
//             device_id: '', 
//             device_name: '', 
//             device_location: '', 
//             device_site_name: '',
//             latitude: '',
//             longitude: ''
//         });
//     };

//     const toggleDeviceSelection = (deviceId) => {
//         setSelectedAvailableDevices(prev =>
//             prev.includes(deviceId)
//                 ? prev.filter(id => id !== deviceId)
//                 : [...prev, deviceId]
//         );
//     };

//     const handleDeviceAssignment = async (device, assign = true) => {
//         try {
//             const response = await fetch('http://13.201.156.32:5000/api/assign-devices', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     email: devicesView.email,
//                     devices: [{
//                         device_id: device.device_id,
//                         device_name: device.device_name,
//                         device_location: device.device_location || '',
//                         device_site_name: device.device_site_name || '',
//                         latitude: device.latitude || '',
//                         longitude: device.longitude || ''
//                     }],
//                     unassign: !assign
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (assign && data.message === "Devices assigned successfully") {
//                 const assignedDevice = data.results.find(r => r.device_id === device.device_id);
//                 if (assignedDevice && assignedDevice.status === "assigned successfully") {
//                     return true;
//                 }
//             } else if (!assign && data.message === "Devices unassigned successfully") {
//                 const unassignedDevice = data.results.find(r => r.device_id === device.device_id);
//                 if (unassignedDevice && unassignedDevice.status === "unassigned") {
//                     return true;
//                 }
//             } else if (data.message === "No devices were assigned" &&
//                 data.results?.[0]?.status === "already assigned to this user") {
//                 return true;
//             }

//             throw new Error(data.message || 'Device assignment failed');
//         } catch (error) {
//             console.error('Error assigning/unassigning device:', error);
//             setError(`Failed to ${assign ? 'assign' : 'unassign'} device: ${error.message}`);
//             return false;
//         }
//     };

//     const addSelectedDevices = async () => {
//         if (!selectedDeviceName) {
//             setError('Please select a device type before assigning');
//             return;
//         }

//         setIsAssigningDevices(true);
//         setError('');
//         try {
//             const devicesToAdd = allDevices
//                 .filter(device => selectedAvailableDevices.includes(device.device_id))
//                 .filter(device => !editingDevices.some(d => d.device_id === device.device_id))
//                 .map(device => ({
//                     ...device,
//                     device_name: selectedDeviceName
//                 }));

//             let allSuccess = true;

//             for (const device of devicesToAdd) {
//                 const success = await handleDeviceAssignment(device, true);
//                 if (!success) {
//                     allSuccess = false;
//                     break;
//                 }
//             }

//             if (allSuccess && devicesToAdd.length > 0) {
//                 setEditingDevices(prev => [...prev, ...devicesToAdd]);
//                 setDevicesModified(true);
//                 setShowAvailableDevices(false);
//             } else if (!allSuccess) {
//                 setError('Failed to assign some devices. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error adding devices:', error);
//             setError('Failed to add devices. Please try again.');
//         } finally {
//             setIsAssigningDevices(false);
//         }
//     };

//     const removeDevice = async (deviceId) => {
//         setError('');
//         const deviceToRemove = editingDevices.find(d => d.device_id === deviceId);
//         if (!deviceToRemove) return;

//         try {
//             const success = await handleDeviceAssignment(deviceToRemove, false);
//             if (success) {
//                 setEditingDevices(prev => {
//                     const newDevices = prev.filter(d => d.device_id !== deviceId);
//                     setDevicesModified(newDevices.length !== prev.length);
//                     return newDevices;
//                 });
//             }
//         } catch (error) {
//             console.error('Error removing device:', error);
//             setError('Failed to remove device. Please try again.');
//         }
//     };

//     const saveDevices = async () => {
//         setError('');
//         try {
//             const currentRes = await API.get(`/user?email=${encodeURIComponent(devicesView.email)}`);
//             const currentDevices = currentRes.data.devices || [];

//             const devicesToAdd = editingDevices.filter(ed =>
//                 !currentDevices.some(cd => cd.device_id === ed.device_id)
//             );

//             const devicesToRemove = currentDevices.filter(cd =>
//                 !editingDevices.some(ed => ed.device_id === cd.device_id)
//             );

//             for (const device of devicesToAdd) {
//                 await handleDeviceAssignment(device, true);
//             }

//             for (const device of devicesToRemove) {
//                 await handleDeviceAssignment(device, false);
//             }

//             loadUsers();
//             setDevicesView(null);
//             setEditingDevices([]);
//             setDevicesModified(false);
//         } catch (error) {
//             console.error('Error saving device assignments:', error);
//             setError('Failed to save device assignments. Please try again.');
//         }
//     };

//     const handleEditDevice = (device) => {
//         setEditingDevice(device.device_id);
//         setDeviceEditData({
//             device_location: device.device_location || '',
//             device_site_name: device.device_site_name || '',
//             latitude: device.latitude || '',
//             longitude: device.longitude || ''
//         });
//     };

//     const handleDeviceEditChange = (e) => {
//         const { name, value } = e.target;
//         setDeviceEditData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSaveDeviceEdit = async () => {
//         try {
//             const response = await API.put(`/device/${editingDevice}`, {
//                 device_name: editingDevices.find(d => d.device_id === editingDevice)?.device_name,
//                 device_location: deviceEditData.device_location,
//                 device_site_name: deviceEditData.device_site_name,
//                 latitude: deviceEditData.latitude,
//                 longitude: deviceEditData.longitude
//             });

//             if (response.data.success) {
//                 setEditingDevices(prev =>
//                     prev.map(device =>
//                         device.device_id === editingDevice
//                             ? {
//                                 ...device,
//                                 device_location: deviceEditData.device_location,
//                                 device_site_name: deviceEditData.device_site_name,
//                                 latitude: deviceEditData.latitude,
//                                 longitude: deviceEditData.longitude
//                             }
//                             : device
//                     )
//                 );
//                 setDevicesModified(true);
//                 setEditingDevice(null);

//                 // Also update the allDevices list if needed
//                 setAllDevices(prev =>
//                     prev.map(device =>
//                         device.device_id === editingDevice
//                             ? {
//                                 ...device,
//                                 device_location: deviceEditData.device_location,
//                                 device_site_name: deviceEditData.device_site_name,
//                                 latitude: deviceEditData.latitude,
//                                 longitude: deviceEditData.longitude
//                             }
//                             : device
//                     )
//                 );
//             } else {
//                 setError(response.data.message || 'Failed to update device details');
//             }
//         } catch (error) {
//             console.error('Error updating device:', error);
//             setError(error.response?.data?.message || 'Failed to update device details. Please try again.');
//         }
//     };

//     const handleCancelDeviceEdit = () => {
//         setEditingDevice(null);
//     };

//     const handleNewDeviceInputChange = (e) => {
//         const { name, value } = e.target;
//         setAddNewDeviceData(prev => ({ ...prev, [name]: value }));
//         setError('');
//     };

//     const handleAddDeviceClick = () => {
//         setShowAddNewDeviceForm(prev => !prev);
//         setAddNewDeviceData({ 
//             device_id: '', 
//             device_name: '', 
//             device_location: '', 
//             device_site_name: '',
//             latitude: '',
//             longitude: ''
//         });
//         setError('');
//     };

//     const handleAddNewDevice = async () => {
//         if (!addNewDeviceData.device_id.trim()) {
//             setError('Please enter a Device ID.');
//             return;
//         }
//         if (!addNewDeviceData.device_name) {
//             setError('Please select a Device Type.');
//             return;
//         }

//         setError('');
//         setIsAssigningDevices(true);

//         try {
//             const deviceCreationPayload = {
//                 device_id: addNewDeviceData.device_id,
//                 device_type: addNewDeviceData.device_name,
//             };

//             const deviceExists = allDevices.some(d => d.device_id === addNewDeviceData.device_id);

//             if (!deviceExists) {
//                 await API.post('/sensor-data', deviceCreationPayload);
//                 setAllDevices(prev => [...prev, {
//                     device_id: addNewDeviceData.device_id,
//                     device_name: addNewDeviceData.device_name,
//                     device_location: addNewDeviceData.device_location,
//                     device_site_name: addNewDeviceData.device_site_name,
//                     latitude: addNewDeviceData.latitude,
//                     longitude: addNewDeviceData.longitude,
//                     last_seen: new Date().toISOString()
//                 }]);
//                 setDeviceStatuses(prev => ({ ...prev, [addNewDeviceData.device_id]: 'offline' }));
//             }

//             const assignmentSuccess = await handleDeviceAssignment({
//                 device_id: addNewDeviceData.device_id,
//                 device_name: addNewDeviceData.device_name,
//                 device_location: addNewDeviceData.device_location,
//                 device_site_name: addNewDeviceData.device_site_name,
//                 latitude: addNewDeviceData.latitude,
//                 longitude: addNewDeviceData.longitude
//             }, true);

//             if (assignmentSuccess) {
//                 setEditingDevices(prev => {
//                     if (!prev.some(d => d.device_id === addNewDeviceData.device_id)) {
//                         return [...prev, {
//                             device_id: addNewDeviceData.device_id,
//                             device_name: addNewDeviceData.device_name,
//                             device_location: addNewDeviceData.device_location,
//                             device_site_name: addNewDeviceData.device_site_name,
//                             latitude: addNewDeviceData.latitude,
//                             longitude: addNewDeviceData.longitude
//                         }];
//                     }
//                     return prev;
//                 });
//                 setDevicesModified(true);
//                 setAddNewDeviceData({
//                     device_id: '',
//                     device_name: '',
//                     device_location: '',
//                     device_site_name: '',
//                     latitude: '',
//                     longitude: ''
//                 });
//                 setShowAddNewDeviceForm(false);
//                 setShowAvailableDevices(false);
//             } else {
//                 setError('Failed to assign the new device.');
//             }

//         } catch (err) {
//             console.error('Error adding new device or assigning it:', err);
//             setError(err.response?.data?.message || 'Failed to add and assign new device. It might already exist.');
//         } finally {
//             setIsAssigningDevices(false);
//         }
//     };

//     const availableDevices = allDevices.filter(device =>
//         !editingDevices.some(d => d.device_id === device.device_id)
//     );

//     const filteredAvailableDevices = availableDevices.filter(device =>
//         device.device_id.toLowerCase().includes(deviceSearchQuery.toLowerCase())
//     );

//     const getDeviceDisplayName = (deviceName) => {
//         return deviceTypes[deviceName] || deviceName;
//     };

//     return (
//         <motion.div
//             className="user-management"
//             initial="hidden"
//             animate="visible"
//             variants={{
//                 hidden: { opacity: 0 },
//                 visible: {
//                     opacity: 1,
//                     transition: {
//                         staggerChildren: 0.1,
//                         when: "beforeChildren"
//                     }
//                 }
//             }}
//         >
//             <motion.h2 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
//                 User Management
//             </motion.h2>

//             <motion.div className="search-container" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
//                 <div className="search-bar">
//                     <FaSearch className="search-icon" />
//                     <input
//                         type="text"
//                         placeholder="Search by email or name..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                 </div>
//             </motion.div>

//             <motion.div
//                 className={`form-container ${isFormExpanded ? 'expanded' : ''}`}
//                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
//             >
//                 <div
//                     className="form-header"
//                     onClick={() => setIsFormExpanded(!isFormExpanded)}
//                 >
//                     <h3>{editingUserEmail ? 'Edit User' : 'Add New User'}</h3>
//                     {isFormExpanded ? <FaChevronUp /> : <FaChevronDown />}
//                 </div>

//                 <AnimatePresence>
//                     {isFormExpanded && (
//                         <motion.form
//                             onSubmit={handleFormSubmit}
//                             className={`user-form ${editingUserEmail ? 'update-form' : ''}`}
//                             variants={{
//                                 hidden: { height: 0, opacity: 0 },
//                                 visible: {
//                                     height: 'auto',
//                                     opacity: 1,
//                                     transition: {
//                                         duration: 0.3
//                                     }
//                                 },
//                                 exit: { height: 0, opacity: 0 }
//                             }}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                         >
//                             {editingUserEmail && (
//                                 <div className="input-group">
//                                     <label>Current Email</label>
//                                     <div className="email-display">{editingUserEmail}</div>
//                                 </div>
//                             )}

//                             {Object.entries(formData).map(([key, value]) => {
//                                 if (key === '_id') return null;
//                                 if (key === 'email' && editingUserEmail) return null;
//                                 if (key === 'new_email' && !editingUserEmail) return null;

//                                 if (key === 'role') {
//                                     return (
//                                         <div className="input-group" key={key}>
//                                             <label>Role</label>
//                                             <select
//                                                 name={key}
//                                                 value={value}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             >
//                                                 <option value="">Select Role</option>
//                                                 <option value="superadmin">Super Admin</option>
//                                                 <option value="subadmin">Sub Admin</option>
//                                                 <option value="user">User</option>
//                                             </select>
//                                         </div>
//                                     );
//                                 }

//                                 return (
//                                     <div className="input-group" key={key}>
//                                         <label>
//                                             {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                                             {['password', 'activation_date', 'expiring_date'].includes(key) && ' *'}
//                                         </label>
//                                         <input
//                                             type={key === 'password' ? 'password' : key.includes('date') ? 'date' : 'text'}
//                                             name={key}
//                                             value={value}
//                                             onChange={handleInputChange}
//                                             required={!['password', 'new_email'].includes(key) && !(key === 'email' && editingUserEmail !== null)}
//                                             disabled={key === 'email' && editingUserEmail !== null}
//                                             placeholder={key === 'email' && editingUserEmail ? '' : undefined}
//                                         />
//                                     </div>
//                                 );
//                             })}

//                             <div className="form-buttons">
//                                 <button type="submit">
//                                     {editingUserEmail ? 'Update User' : 'Add User'}
//                                 </button>
//                                 {editingUserEmail && (
//                                     <button
//                                         type="button"
//                                         onClick={resetForm}
//                                         className="cancel-button"
//                                     >
//                                         Cancel
//                                     </button>
//                                 )}
//                             </div>
//                         </motion.form>
//                     )}
//                 </AnimatePresence>
//             </motion.div>

//             {error && (
//                 <motion.div
//                     className="error-message"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                 >
//                     {error}
//                 </motion.div>
//             )}

//             <motion.div className="filter-controls" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
//                 <label>Status Filter: </label>
//                 <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="filter-select"
//                 >
//                     <option value="all">All Users</option>
//                     <option value="active">Active Users</option>
//                     <option value="suspended">Suspended Users</option>
//                 </select>
//             </motion.div>

//             <motion.div className="user-table" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Email</th>
//                             <th>Client</th>
//                             <th>Mobile</th>
//                             <th>Role</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredUsers.map((user, index) => (
//                             <motion.tr
//                                 key={user.email}
//                                 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
//                                 initial="hidden"
//                                 animate="visible"
//                                 transition={{ delay: index * 0.05 }}
//                             >
//                                 <td>{user.email}</td>
//                                 <td>{user.client_name}</td>
//                                 <td>{user.mobile_no}</td>
//                                 <td>{user.role}</td>
//                                 <td>
//                                     <span
//                                         className={`status-indicator ${new Date(user.expiring_date) >= new Date() ? 'active' : 'suspended'}`}
//                                         title={new Date(user.expiring_date) >= new Date() ? 'Active' : 'Suspended'}
//                                     ></span>
//                                 </td>
//                                 <td className="actions">
//                                     <button onClick={() => handleEditUser(user)} title="Edit">
//                                         <FaEdit />
//                                     </button>
//                                     <button onClick={() => handleViewUser(user)} title="View">
//                                         <FaEye />
//                                     </button>
//                                     <button onClick={() => handleViewDevices(user)} title="Devices">
//                                         <FaLaptop />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDeleteUser(user.email)}
//                                         className="delete-button"
//                                         title="Delete"
//                                     >
//                                         <FaTrash />
//                                     </button>
//                                 </td>
//                             </motion.tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </motion.div>

//             <AnimatePresence>
//                 {viewUser && (
//                     <motion.div
//                         className="user-detail-popup"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <h3>User Details</h3>
//                         <div className="user-details-grid">
//                             <div><strong>Email:</strong> {viewUser.email}</div>
//                             <div><strong>Password:</strong> {viewUser.password || '(hidden)'}</div>
//                             <div><strong>Client Name:</strong> {viewUser.client_name}</div>
//                             <div><strong>Mobile No:</strong> {viewUser.mobile_no}</div>
//                             <div><strong>Lat/Long:</strong> {viewUser.lat_long}</div>
//                             <div><strong>Activation Date:</strong> {viewUser.activation_date?.slice(0, 10)}</div>
//                             <div><strong>Expiring Date:</strong> {viewUser.expiring_date?.slice(0, 10)}</div>
//                             <div><strong>Address:</strong> {viewUser.address}</div>
//                             <div><strong>Role:</strong> {viewUser.role}</div>
//                             <div><strong>Devices:</strong>
//                                 {viewUser.devices?.length > 0 ? (
//                                     <ul>
//                                         {viewUser.devices.map(device => (
//                                             <li key={device.device_id}>
//                                                 {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
//                                                 {device.device_location && <div>Location: {device.device_location}</div>}
//                                                 {device.device_site_name && <div>Site: {device.device_site_name}</div>}
//                                                 {device.latitude && device.latitude !== 'NA' && <div>Latitude: {device.latitude}</div>}
//                                                 {device.longitude && device.longitude !== 'NA' && <div>Longitude: {device.longitude}</div>}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : 'No devices assigned'}
//                             </div>
//                         </div>
//                         <button onClick={() => setViewUser(null)}>Close</button>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <AnimatePresence>
//                 {devicesView && (
//                     <motion.div
//                         className="devices-popup"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <h3>Manage Devices for {devicesView.email}</h3>

//                         <div className="device-assignment">
//                             <button
//                                 onClick={handleShowAvailableDevices}
//                                 className="view-devices-button"
//                                 disabled={loadingDevices}
//                             >
//                                 <FaPlus /> {loadingDevices ? 'Loading Devices...' : 'View Available Devices'}
//                             </button>

//                             <div className="assigned-devices-list">
//                                 <h4>Assigned Devices:</h4>
//                                 {editingDevices.length > 0 ? (
//                                     <ul>
//                                         {editingDevices.map(device => (
//                                             <li key={device.device_id}>
//                                                 {editingDevice === device.device_id ? (
//                                                     <div className="device-edit-form">
//                                                         <div className="input-group">
//                                                             <label>Location:</label>
//                                                             <input
//                                                                 type="text"
//                                                                 name="device_location"
//                                                                 value={deviceEditData.device_location}
//                                                                 onChange={handleDeviceEditChange}
//                                                             />
//                                                         </div>
//                                                         <div className="input-group">
//                                                             <label>Site Name:</label>
//                                                             <input
//                                                                 type="text"
//                                                                 name="device_site_name"
//                                                                 value={deviceEditData.device_site_name}
//                                                                 onChange={handleDeviceEditChange}
//                                                             />
//                                                         </div>
//                                                         <div className="input-group">
//                                                             <label>Latitude:</label>
//                                                             <input
//                                                                 type="text"
//                                                                 name="latitude"
//                                                                 value={deviceEditData.latitude}
//                                                                 onChange={handleDeviceEditChange}
//                                                                 placeholder="e.g., 13.0827"
//                                                             />
//                                                         </div>
//                                                         <div className="input-group">
//                                                             <label>Longitude:</label>
//                                                             <input
//                                                                 type="text"
//                                                                 name="longitude"
//                                                                 value={deviceEditData.longitude}
//                                                                 onChange={handleDeviceEditChange}
//                                                                 placeholder="e.g., 80.2707"
//                                                             />
//                                                         </div>
//                                                         <div className="device-edit-buttons">
//                                                             <button
//                                                                 onClick={handleSaveDeviceEdit}
//                                                                 className="save-button"
//                                                             >
//                                                                 <FaSave /> Save
//                                                             </button>
//                                                             <button
//                                                                 onClick={handleCancelDeviceEdit}
//                                                                 className="cancel-button"
//                                                             >
//                                                                 Cancel
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     <>
//                                                         <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
//                                                             {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
//                                                             {device.device_location && <div>Location: {device.device_location}</div>}
//                                                             {device.device_site_name && <div>Site: {device.device_site_name}</div>}
//                                                             {device.latitude && device.latitude !== 'NA' && <div>Latitude: {device.latitude}</div>}
//                                                             {device.longitude && device.longitude !== 'NA' && <div>Longitude: {device.longitude}</div>}
//                                                         </span>
//                                                         <div className="device-actions">
//                                                             <button
//                                                                 onClick={() => handleEditDevice(device)}
//                                                                 className="edit-device-button"
//                                                             >
//                                                                 <FaEdit /> Edit
//                                                             </button>
//                                                             <button
//                                                                 onClick={() => removeDevice(device.device_id)}
//                                                                 className="remove-device-button"
//                                                             >
//                                                                 Remove
//                                                             </button>
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p>No devices assigned</p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="device-popup-buttons">
//                             {devicesModified && (
//                                 <button onClick={saveDevices} className="save-button">
//                                     Save All Changes
//                                 </button>
//                             )}
//                             <button
//                                 onClick={() => {
//                                     setDevicesView(null);
//                                     setEditingDevices([]);
//                                     setDevicesModified(false);
//                                 }}
//                                 className="cancel-button"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             <AnimatePresence>
//                 {showAvailableDevices && (
//                     <motion.div
//                         className="available-devices-popup"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <div className="available-devices-content">
//                             <h3>Available Devices ({filteredAvailableDevices.length})</h3>

//                             <div className="device-search-container">
//                                 <div className="search-bar">
//                                     <FaSearch className="search-icon" />
//                                     <input
//                                         type="text"
//                                         placeholder="Search by device ID..."
//                                         value={deviceSearchQuery}
//                                         onChange={(e) => setDeviceSearchQuery(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="device-name-selection">
//                                 <label>Device Type for Selected:</label>
//                                 <select
//                                     value={selectedDeviceName}
//                                     onChange={(e) => setSelectedDeviceName(e.target.value)}
//                                     required
//                                 >
//                                     <option value="">Select Device Type</option>
//                                     {Object.entries(deviceTypes).map(([value, label]) => (
//                                         <option key={value} value={value}>{label}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="devices-list-container">
//                                 {filteredAvailableDevices.length > 0 ? (
//                                     <ul className="available-devices-list">
//                                         {filteredAvailableDevices.map(device => (
//                                             <li
//                                                 key={device.device_id}
//                                                 className={`device-item ${selectedAvailableDevices.includes(device.device_id) ? 'selected' : ''}`}
//                                                 onClick={() => toggleDeviceSelection(device.device_id)}
//                                             >
//                                                 <span className={`device-status ${deviceStatuses[device.device_id] || 'offline'}`}>
//                                                     {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
//                                                     {device.device_location && <div>Location: {device.device_location}</div>}
//                                                     {device.device_site_name && <div>Site: {device.device_site_name}</div>}
//                                                     {device.latitude && device.latitude !== 'NA' && <div>Latitude: {device.latitude}</div>}
//                                                     {device.longitude && device.longitude !== 'NA' && <div>Longitude: {device.longitude}</div>}
//                                                 </span>
//                                                 {selectedAvailableDevices.includes(device.device_id) && (
//                                                     <FaCheck className="selection-check" />
//                                                 )}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p>No available devices found</p>
//                                 )}
//                             </div>

//                             <div className="available-devices-buttons">
//                                 <button
//                                     onClick={addSelectedDevices}
//                                     disabled={selectedAvailableDevices.length === 0 || isAssigningDevices || !selectedDeviceName}
//                                     className="add-devices-button"
//                                 >
//                                     {isAssigningDevices ? 'Assigning...' : 'Add Selected Devices'}
//                                 </button>
//                                 <button
//                                     onClick={handleAddDeviceClick}
//                                     className="add-new-device-toggle-button"
//                                 >
//                                     {showAddNewDeviceForm ? 'Hide Add Device Form' : 'Add New Device'}
//                                 </button>
//                                 <button
//                                     onClick={() => setShowAvailableDevices(false)}
//                                     className="cancel-button"
//                                 >
//                                     Close
//                                 </button>
//                             </div>

//                             <AnimatePresence>
//                                 {showAddNewDeviceForm && (
//                                     <motion.div
//                                         className="add-new-device-form"
//                                         initial={{ opacity: 0, height: 0 }}
//                                         animate={{ opacity: 1, height: 'auto' }}
//                                         exit={{ opacity: 0, height: 0 }}
//                                         transition={{ duration: 0.3 }}
//                                     >
//                                         <h4>Add New Device</h4>
//                                         <div className="input-group">
//                                             <label>Device ID:</label>
//                                             <input
//                                                 type="text"
//                                                 name="device_id"
//                                                 value={addNewDeviceData.device_id}
//                                                 onChange={handleNewDeviceInputChange}
//                                                 placeholder="Enter new device ID"
//                                             />
//                                         </div>
//                                         <div className="input-group">
//                                             <label>Device Type:</label>
//                                             <select
//                                                 name="device_name"
//                                                 value={addNewDeviceData.device_name}
//                                                 onChange={handleNewDeviceInputChange}
//                                                 required
//                                             >
//                                                 <option value="">Select Device Type</option>
//                                                 {Object.entries(deviceTypes).map(([value, label]) => (
//                                                     <option key={value} value={value}>{label}</option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                         <div className="input-group">
//                                             <label>Device Location:</label>
//                                             <input
//                                                 type="text"
//                                                 name="device_location"
//                                                 value={addNewDeviceData.device_location}
//                                                 onChange={handleNewDeviceInputChange}
//                                                 placeholder="Enter device location"
//                                             />
//                                         </div>
//                                         <div className="input-group">
//                                             <label>Site Name:</label>
//                                             <input
//                                                 type="text"
//                                                 name="device_site_name"
//                                                 value={addNewDeviceData.device_site_name}
//                                                 onChange={handleNewDeviceInputChange}
//                                                 placeholder="Enter site name"
//                                             />
//                                         </div>
//                                         <div className="input-group">
//                                             <label>Latitude:</label>
//                                             <input
//                                                 type="text"
//                                                 name="latitude"
//                                                 value={addNewDeviceData.latitude}
//                                                 onChange={handleNewDeviceInputChange}
//                                                 placeholder="e.g., 13.0827"
//                                             />
//                                         </div>
//                                         <div className="input-group">
//                                             <label>Longitude:</label>
//                                             <input
//                                                 type="text"
//                                                 name="longitude"
//                                                 value={addNewDeviceData.longitude}
//                                                 onChange={handleNewDeviceInputChange}
//                                                 placeholder="e.g., 80.2707"
//                                             />
//                                         </div>
//                                         <button
//                                             onClick={handleAddNewDevice}
//                                             disabled={isAssigningDevices || !addNewDeviceData.device_id.trim() || !addNewDeviceData.device_name}
//                                             className="add-new-device-to-user-button"
//                                         >
//                                             {isAssigningDevices ? 'Adding...' : 'Add Device to User'}
//                                         </button>
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </motion.div>
//     );
// };

// export default UserManagement;
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { FaTrash, FaEdit, FaEye, FaLaptop, FaChevronDown, FaChevronUp, FaSearch, FaPlus, FaCheck, FaSave } from 'react-icons/fa';
import '../styles/UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        new_email: '',
        password: '',
        client_name: '',
        mobile_no: '',
        lat_long: '',
        activation_date: '',
        expiring_date: '',
        address: '',
        role: '',
    });
    const [editingUserEmail, setEditingUserEmail] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const [devicesView, setDevicesView] = useState(null);
    const [allDevices, setAllDevices] = useState([]);
    const [editingDevices, setEditingDevices] = useState([]);
    const [devicesModified, setDevicesModified] = useState(false);
    const [error, setError] = useState('');
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [showAvailableDevices, setShowAvailableDevices] = useState(false);
    const [selectedAvailableDevices, setSelectedAvailableDevices] = useState([]);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [isAssigningDevices, setIsAssigningDevices] = useState(false);
    const [selectedDeviceName, setSelectedDeviceName] = useState('');
    const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
    const [deviceTypes] = useState({
        'flow-meter': 'Flow Meter',
        'pressure-sensor': 'Pressure Sensor',
        'Piezometer': 'Piezometer',
        'water-quality': 'Water Quality Sensor',
        'Flow-Sensor': 'AWDBS',
        'others': 'Other Device'
    });

    const [addNewDeviceData, setAddNewDeviceData] = useState({
        device_id: '',
        device_name: '',
        device_location: '',
        device_site_name: '',
        latitude: '',
        longitude: ''
    });
    const [showAddNewDeviceForm, setShowAddNewDeviceForm] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [deviceEditData, setDeviceEditData] = useState({
        device_location: '',
        device_site_name: '',
        latitude: '',
        longitude: ''
    });

    const loadUsers = async () => {
        try {
            const response = await API.get('/users');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again.');
        }
    };

    const loadAllDevices = async () => {
        try {
            setLoadingDevices(true);
            const response = await API.get('/sensor-data/devices/all');

            // The response has a "devices" array
            const devicesData = response.data.devices || [];

            const uniqueDevices = [];
            const deviceIds = new Set();

            devicesData.forEach(device => {
                if (!device || !device.device_id) return;

                if (!deviceIds.has(device.device_id)) {
                    deviceIds.add(device.device_id);
                    uniqueDevices.push({
                        device_id: device.device_id,
                        device_name: device.device_name || 'unknown',
                        device_location: device.device_location || device.location || '',
                        device_site_name: device.device_site_name || device.site_name || '',
                        latitude: device.latitude || '',
                        longitude: device.longitude || '',
                        last_seen: ''
                    });
                }
            });

            setAllDevices(uniqueDevices);

        } catch (error) {
            console.error("Error loading devices:", error);
            setError("Failed to load devices. Please try again.");
        } finally {
            setLoadingDevices(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadAllDevices();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user => {
            const isActive = new Date(user.expiring_date) >= new Date();
            const statusMatch =
                statusFilter === 'all' ||
                (statusFilter === 'active' && isActive) ||
                (statusFilter === 'suspended' && !isActive);

            const searchMatch =
                searchQuery === '' ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.client_name.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatch && searchMatch;
        });

        setFilteredUsers(filtered);
    }, [users, statusFilter, searchQuery]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        const { email, new_email, password, client_name, mobile_no, lat_long, activation_date, expiring_date, address, role } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (editingUserEmail) {
            if (!editingUserEmail || !emailRegex.test(editingUserEmail)) return 'Invalid current email.';
        } else {
            if (!email || !emailRegex.test(email)) return 'Please enter a valid email.';
        }

        if (new_email && !emailRegex.test(new_email)) return 'Please enter a valid new email.';
        if (!editingUserEmail && (!password || password.length < 6)) return 'Password must be at least 6 characters.';
        if (!client_name.trim()) return 'Client name is required.';
        if (!mobile_no || !phoneRegex.test(mobile_no)) return 'Enter a valid 10-digit mobile number.';
        if (!lat_long.trim()) return 'Lat/Long is required.';
        if (!activation_date) return 'Activation date is required.';
        if (!expiring_date) return 'Expiring date is required.';
        if (!address.trim()) return 'Address is required.';
        if (!role) return 'Please select a role.';
        return '';
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            if (editingUserEmail) {
                const payload = {
                    ...formData,
                    email: editingUserEmail,
                };

                if (!payload.password) delete payload.password;
                if (!payload.new_email) delete payload.new_email;

                await API.put('/user', payload);
                setEditingUserEmail(null);
            } else {
                await API.post('/users', formData);
            }

            resetForm();
            loadUsers();
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.response?.data?.message || 'Failed to submit form. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            new_email: '',
            password: '',
            client_name: '',
            mobile_no: '',
            lat_long: '',
            activation_date: '',
            expiring_date: '',
            address: '',
            role: '',
        });
        setEditingUserEmail(null);
        setError('');
        setIsFormExpanded(false);
    };

    const handleDeleteUser = async (email) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await API.delete(`/user?email=${encodeURIComponent(email)}`);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Failed to delete user. Please try again.');
            }
        }
    };

    const handleEditUser = (user) => {
        setFormData({
            email: '',
            new_email: '',
            password: '',
            client_name: user.client_name,
            mobile_no: user.mobile_no,
            lat_long: user.lat_long,
            activation_date: user.activation_date?.slice(0, 10),
            expiring_date: user.expiring_date?.slice(0, 10),
            address: user.address,
            role: user.role,
        });
        setEditingUserEmail(user.email);
        setIsFormExpanded(true);
    };

    const handleViewUser = async (user) => {
        try {
            const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
            setViewUser(res.data);
        } catch (err) {
            console.error('Error viewing user:', err);
            setError('Failed to load user details. Please try again.');
        }
    };

    const handleViewDevices = async (user) => {
        try {
            const res = await API.get(`/user?email=${encodeURIComponent(user.email)}`);
            setDevicesView(res.data);
            setEditingDevices(res.data.devices || []);
            setDevicesModified(false);
            setSelectedAvailableDevices([]);
            setSelectedDeviceName('');
            setAddNewDeviceData({
                device_id: '',
                device_name: '',
                device_location: '',
                device_site_name: '',
                latitude: '',
                longitude: ''
            });
            setShowAddNewDeviceForm(false);
            setEditingDevice(null);
        } catch (err) {
            console.error('Error viewing devices:', err);
            setError('Failed to load user devices. Please try again.');
        }
    };

    const handleShowAvailableDevices = () => {
        setShowAvailableDevices(true);
        setSelectedAvailableDevices([]);
        setSelectedDeviceName('');
        setDeviceSearchQuery('');
        setShowAddNewDeviceForm(false);
        setAddNewDeviceData({
            device_id: '',
            device_name: '',
            device_location: '',
            device_site_name: '',
            latitude: '',
            longitude: ''
        });
    };

    const toggleDeviceSelection = (deviceId) => {
        setSelectedAvailableDevices(prev =>
            prev.includes(deviceId)
                ? prev.filter(id => id !== deviceId)
                : [...prev, deviceId]
        );
    };

    const handleDeviceAssignment = async (device, assign = true) => {
        try {
            const response = await fetch('http://13.201.156.32:5000/api/assign-devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: devicesView.email,
                    devices: [{
                        device_id: device.device_id,
                        device_name: device.device_name,
                        device_location: device.device_location || '',
                        device_site_name: device.device_site_name || '',
                        latitude: device.latitude || '',
                        longitude: device.longitude || ''
                    }],
                    unassign: !assign
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (assign && data.message === "Devices assigned successfully") {
                const assignedDevice = data.results.find(r => r.device_id === device.device_id);
                if (assignedDevice && assignedDevice.status === "assigned successfully") {
                    return true;
                }
            } else if (!assign && data.message === "Devices unassigned successfully") {
                const unassignedDevice = data.results.find(r => r.device_id === device.device_id);
                if (unassignedDevice && unassignedDevice.status === "unassigned") {
                    return true;
                }
            } else if (data.message === "No devices were assigned" &&
                data.results?.[0]?.status === "already assigned to this user") {
                return true;
            }

            throw new Error(data.message || 'Device assignment failed');
        } catch (error) {
            console.error('Error assigning/unassigning device:', error);
            setError(`Failed to ${assign ? 'assign' : 'unassign'} device: ${error.message}`);
            return false;
        }
    };

    const addSelectedDevices = async () => {
        if (!selectedDeviceName) {
            setError('Please select a device type before assigning');
            return;
        }

        setIsAssigningDevices(true);
        setError('');
        try {
            // Don't overwrite the device_name from allDevices
            const devicesToAdd = allDevices
                .filter(device => selectedAvailableDevices.includes(device.device_id))
                .filter(device => !editingDevices.some(d => d.device_id === device.device_id))
                .map(device => ({
                    ...device
                    // Keep the original device_name from allDevices
                }));

            let allSuccess = true;

            for (const device of devicesToAdd) {
                const success = await handleDeviceAssignment(device, true);
                if (!success) {
                    allSuccess = false;
                    break;
                }
            }

            if (allSuccess && devicesToAdd.length > 0) {
                setEditingDevices(prev => [...prev, ...devicesToAdd]);
                setDevicesModified(true);
                setShowAvailableDevices(false);
            } else if (!allSuccess) {
                setError('Failed to assign some devices. Please try again.');
            }
        } catch (error) {
            console.error('Error adding devices:', error);
            setError('Failed to add devices. Please try again.');
        } finally {
            setIsAssigningDevices(false);
        }
    };

    const removeDevice = async (deviceId) => {
        setError('');
        const deviceToRemove = editingDevices.find(d => d.device_id === deviceId);
        if (!deviceToRemove) return;

        try {
            const success = await handleDeviceAssignment(deviceToRemove, false);
            if (success) {
                setEditingDevices(prev => {
                    const newDevices = prev.filter(d => d.device_id !== deviceId);
                    setDevicesModified(newDevices.length !== prev.length);
                    return newDevices;
                });
            }
        } catch (error) {
            console.error('Error removing device:', error);
            setError('Failed to remove device. Please try again.');
        }
    };

    const saveDevices = async () => {
        setError('');
        try {
            const currentRes = await API.get(`/user?email=${encodeURIComponent(devicesView.email)}`);
            const currentDevices = currentRes.data.devices || [];

            const devicesToAdd = editingDevices.filter(ed =>
                !currentDevices.some(cd => cd.device_id === ed.device_id)
            );

            const devicesToRemove = currentDevices.filter(cd =>
                !editingDevices.some(ed => ed.device_id === cd.device_id)
            );

            for (const device of devicesToAdd) {
                await handleDeviceAssignment(device, true);
            }

            for (const device of devicesToRemove) {
                await handleDeviceAssignment(device, false);
            }

            loadUsers();
            setDevicesView(null);
            setEditingDevices([]);
            setDevicesModified(false);
        } catch (error) {
            console.error('Error saving device assignments:', error);
            setError('Failed to save device assignments. Please try again.');
        }
    };

    const handleEditDevice = (device) => {
        setEditingDevice(device.device_id);
        setDeviceEditData({
            device_location: device.device_location || '',
            device_site_name: device.device_site_name || '',
            latitude: device.latitude || '',
            longitude: device.longitude || ''
        });
    };

    const handleDeviceEditChange = (e) => {
        const { name, value } = e.target;
        setDeviceEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveDeviceEdit = async () => {
        try {
            const response = await API.put(`/device/${editingDevice}`, {
                device_name: editingDevices.find(d => d.device_id === editingDevice)?.device_name,
                device_location: deviceEditData.device_location,
                device_site_name: deviceEditData.device_site_name,
                latitude: deviceEditData.latitude,
                longitude: deviceEditData.longitude
            });

            if (response.data.success) {
                setEditingDevices(prev =>
                    prev.map(device =>
                        device.device_id === editingDevice
                            ? {
                                ...device,
                                device_location: deviceEditData.device_location,
                                device_site_name: deviceEditData.device_site_name,
                                latitude: deviceEditData.latitude,
                                longitude: deviceEditData.longitude
                            }
                            : device
                    )
                );
                setDevicesModified(true);
                setEditingDevice(null);

                // Also update the allDevices list if needed
                setAllDevices(prev =>
                    prev.map(device =>
                        device.device_id === editingDevice
                            ? {
                                ...device,
                                device_location: deviceEditData.device_location,
                                device_site_name: deviceEditData.device_site_name,
                                latitude: deviceEditData.latitude,
                                longitude: deviceEditData.longitude
                            }
                            : device
                    )
                );
            } else {
                setError(response.data.message || 'Failed to update device details');
            }
        } catch (error) {
            console.error('Error updating device:', error);
            setError(error.response?.data?.message || 'Failed to update device details. Please try again.');
        }
    };

    const handleCancelDeviceEdit = () => {
        setEditingDevice(null);
    };

    const handleNewDeviceInputChange = (e) => {
        const { name, value } = e.target;
        setAddNewDeviceData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleAddDeviceClick = () => {
        setShowAddNewDeviceForm(prev => !prev);
        setAddNewDeviceData({
            device_id: '',
            device_name: '',
            device_location: '',
            device_site_name: '',
            latitude: '',
            longitude: ''
        });
        setError('');
    };

    const handleAddNewDevice = async () => {
        if (!addNewDeviceData.device_id.trim()) {
            setError('Please enter a Device ID.');
            return;
        }
        if (!addNewDeviceData.device_name) {
            setError('Please select a Device Type.');
            return;
        }

        setError('');
        setIsAssigningDevices(true);

        try {
            // Check if device exists in allDevices
            const deviceExists = allDevices.some(d => d.device_id === addNewDeviceData.device_id);

            if (!deviceExists) {
                // Create device - adjust endpoint as needed based on your API
                await API.post('/sensor-data/devices', {
                    device_id: addNewDeviceData.device_id,
                    device_name: addNewDeviceData.device_name,
                    device_location: addNewDeviceData.device_location,
                    device_site_name: addNewDeviceData.device_site_name,
                    latitude: addNewDeviceData.latitude,
                    longitude: addNewDeviceData.longitude
                });

                // Add to local state immediately
                setAllDevices(prev => [...prev, {
                    device_id: addNewDeviceData.device_id,
                    device_name: addNewDeviceData.device_name,
                    device_location: addNewDeviceData.device_location,
                    device_site_name: addNewDeviceData.device_site_name,
                    latitude: addNewDeviceData.latitude,
                    longitude: addNewDeviceData.longitude,
                    last_seen: ''
                }]);
            }

            // Assign the device to the user
            const assignmentSuccess = await handleDeviceAssignment({
                device_id: addNewDeviceData.device_id,
                device_name: addNewDeviceData.device_name,
                device_location: addNewDeviceData.device_location,
                device_site_name: addNewDeviceData.device_site_name,
                latitude: addNewDeviceData.latitude,
                longitude: addNewDeviceData.longitude
            }, true);

            if (assignmentSuccess) {
                // Add to editing devices
                setEditingDevices(prev => {
                    if (!prev.some(d => d.device_id === addNewDeviceData.device_id)) {
                        return [...prev, {
                            device_id: addNewDeviceData.device_id,
                            device_name: addNewDeviceData.device_name,
                            device_location: addNewDeviceData.device_location,
                            device_site_name: addNewDeviceData.device_site_name,
                            latitude: addNewDeviceData.latitude,
                            longitude: addNewDeviceData.longitude
                        }];
                    }
                    return prev;
                });

                setDevicesModified(true);
                setAddNewDeviceData({
                    device_id: '',
                    device_name: '',
                    device_location: '',
                    device_site_name: '',
                    latitude: '',
                    longitude: ''
                });
                setShowAddNewDeviceForm(false);
                setShowAvailableDevices(false);
            } else {
                setError('Failed to assign the new device.');
            }

        } catch (err) {
            console.error('Error adding new device or assigning it:', err);
            setError(err.response?.data?.message || 'Failed to add and assign new device.');
        } finally {
            setIsAssigningDevices(false);
        }
    };

    const availableDevices = allDevices.filter(device =>
        !editingDevices.some(d => d.device_id === device.device_id)
    );

    const filteredAvailableDevices = availableDevices.filter(device =>
        device.device_id.toLowerCase().includes(deviceSearchQuery.toLowerCase())
    );

    const getDeviceDisplayName = (deviceName) => {
        return deviceTypes[deviceName] || deviceName;
    };

    return (
        <motion.div
            className="user-management"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                        when: "beforeChildren"
                    }
                }
            }}
        >
            <motion.h2 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                User Management
            </motion.h2>

            <motion.div className="search-container" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            <motion.div
                className={`form-container ${isFormExpanded ? 'expanded' : ''}`}
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            >
                <div
                    className="form-header"
                    onClick={() => setIsFormExpanded(!isFormExpanded)}
                >
                    <h3>{editingUserEmail ? 'Edit User' : 'Add New User'}</h3>
                    {isFormExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                <AnimatePresence>
                    {isFormExpanded && (
                        <motion.form
                            onSubmit={handleFormSubmit}
                            className={`user-form ${editingUserEmail ? 'update-form' : ''}`}
                            variants={{
                                hidden: { height: 0, opacity: 0 },
                                visible: {
                                    height: 'auto',
                                    opacity: 1,
                                    transition: {
                                        duration: 0.3
                                    }
                                },
                                exit: { height: 0, opacity: 0 }
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {editingUserEmail && (
                                <div className="input-group">
                                    <label>Current Email</label>
                                    <div className="email-display">{editingUserEmail}</div>
                                </div>
                            )}

                            {Object.entries(formData).map(([key, value]) => {
                                if (key === '_id') return null;
                                if (key === 'email' && editingUserEmail) return null;
                                if (key === 'new_email' && !editingUserEmail) return null;

                                if (key === 'role') {
                                    return (
                                        <div className="input-group" key={key}>
                                            <label>Role</label>
                                            <select
                                                name={key}
                                                value={value}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Role</option>
                                                <option value="superadmin">Super Admin</option>
                                                <option value="subadmin">Sub Admin</option>
                                                <option value="user">User</option>
                                            </select>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="input-group" key={key}>
                                        <label>
                                            {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            {['password', 'activation_date', 'expiring_date'].includes(key) && ' *'}
                                        </label>
                                        <input
                                            type={key === 'password' ? 'password' : key.includes('date') ? 'date' : 'text'}
                                            name={key}
                                            value={value}
                                            onChange={handleInputChange}
                                            required={!['password', 'new_email'].includes(key) && !(key === 'email' && editingUserEmail !== null)}
                                            disabled={key === 'email' && editingUserEmail !== null}
                                            placeholder={key === 'email' && editingUserEmail ? '' : undefined}
                                        />
                                    </div>
                                );
                            })}

                            <div className="form-buttons">
                                <button type="submit">
                                    {editingUserEmail ? 'Update User' : 'Add User'}
                                </button>
                                {editingUserEmail && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="cancel-button"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>

            {error && (
                <motion.div
                    className="error-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {error}
                </motion.div>
            )}

            <motion.div className="filter-controls" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                <label>Status Filter: </label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="suspended">Suspended Users</option>
                </select>
            </motion.div>

            <motion.div className="user-table" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Client</th>
                            <th>Mobile</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <motion.tr
                                key={user.email}
                                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.05 }}
                            >
                                <td>{user.email}</td>
                                <td>{user.client_name}</td>
                                <td>{user.mobile_no}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span
                                        className={`status-indicator ${new Date(user.expiring_date) >= new Date() ? 'active' : 'suspended'}`}
                                        title={new Date(user.expiring_date) >= new Date() ? 'Active' : 'Suspended'}
                                    ></span>
                                </td>
                                <td className="actions">
                                    <button onClick={() => handleEditUser(user)} title="Edit">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleViewUser(user)} title="View">
                                        <FaEye />
                                    </button>
                                    <button onClick={() => handleViewDevices(user)} title="Devices">
                                        <FaLaptop />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.email)}
                                        className="delete-button"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            <AnimatePresence>
                {viewUser && (
                    <motion.div
                        className="user-detail-popup"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <h3>User Details</h3>
                        <div className="user-details-grid">
                            <div><strong>Email:</strong> {viewUser.email}</div>
                            <div><strong>Password:</strong> {viewUser.password || '(hidden)'}</div>
                            <div><strong>Client Name:</strong> {viewUser.client_name}</div>
                            <div><strong>Mobile No:</strong> {viewUser.mobile_no}</div>
                            <div><strong>Lat/Long:</strong> {viewUser.lat_long}</div>
                            <div><strong>Activation Date:</strong> {viewUser.activation_date?.slice(0, 10)}</div>
                            <div><strong>Expiring Date:</strong> {viewUser.expiring_date?.slice(0, 10)}</div>
                            <div><strong>Address:</strong> {viewUser.address}</div>
                            <div><strong>Role:</strong> {viewUser.role}</div>
                            <div><strong>Devices:</strong>
                                {viewUser.devices?.length > 0 ? (
                                    <ul>
                                        {viewUser.devices.map(device => (
                                            <li key={device.device_id}>
                                                {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
                                                {device.device_location && <div>Location: {device.device_location}</div>}
                                                {device.device_site_name && <div>Site: {device.device_site_name}</div>}
                                                {device.latitude && device.latitude !== 'NA' && <div>Latitude: {device.latitude}</div>}
                                                {device.longitude && device.longitude !== 'NA' && <div>Longitude: {device.longitude}</div>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : 'No devices assigned'}
                            </div>
                        </div>
                        <button onClick={() => setViewUser(null)}>Close</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {devicesView && (
                    <motion.div
                        className="devices-popup"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <h3>Manage Devices for {devicesView.email}</h3>

                        <div className="device-assignment">
                            <button
                                onClick={handleShowAvailableDevices}
                                className="view-devices-button"
                                disabled={loadingDevices}
                            >
                                <FaPlus /> {loadingDevices ? 'Loading Devices...' : 'View Available Devices'}
                            </button>

                            <div className="assigned-devices-list">
                                <h4>Assigned Devices:</h4>
                                {editingDevices.length > 0 ? (
                                    <ul>
                                        {editingDevices.map(device => (
                                            <li key={device.device_id}>
                                                {editingDevice === device.device_id ? (
                                                    <div className="device-edit-form">
                                                        <div className="input-group">
                                                            <label>Location:</label>
                                                            <input
                                                                type="text"
                                                                name="device_location"
                                                                value={deviceEditData.device_location}
                                                                onChange={handleDeviceEditChange}
                                                            />
                                                        </div>
                                                        <div className="input-group">
                                                            <label>Site Name:</label>
                                                            <input
                                                                type="text"
                                                                name="device_site_name"
                                                                value={deviceEditData.device_site_name}
                                                                onChange={handleDeviceEditChange}
                                                            />
                                                        </div>
                                                        <div className="input-group">
                                                            <label>Latitude:</label>
                                                            <input
                                                                type="text"
                                                                name="latitude"
                                                                value={deviceEditData.latitude}
                                                                onChange={handleDeviceEditChange}
                                                                placeholder="e.g., 13.0827"
                                                            />
                                                        </div>
                                                        <div className="input-group">
                                                            <label>Longitude:</label>
                                                            <input
                                                                type="text"
                                                                name="longitude"
                                                                value={deviceEditData.longitude}
                                                                onChange={handleDeviceEditChange}
                                                                placeholder="e.g., 80.2707"
                                                            />
                                                        </div>
                                                        <div className="device-edit-buttons">
                                                            <button
                                                                onClick={handleSaveDeviceEdit}
                                                                className="save-button"
                                                            >
                                                                <FaSave /> Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelDeviceEdit}
                                                                className="cancel-button"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="device-info">
                                                            {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
                                                            {device.device_location && <div>Location: {device.device_location}</div>}
                                                            {device.device_site_name && <div>Site: {device.device_site_name}</div>}
                                                            {device.latitude && device.latitude !== 'NA' && <div>Latitude: {device.latitude}</div>}
                                                            {device.longitude && device.longitude !== 'NA' && <div>Longitude: {device.longitude}</div>}
                                                        </span>
                                                        <div className="device-actions">
                                                            <button
                                                                onClick={() => handleEditDevice(device)}
                                                                className="edit-device-button"
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => removeDevice(device.device_id)}
                                                                className="remove-device-button"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No devices assigned</p>
                                )}
                            </div>
                        </div>

                        <div className="device-popup-buttons">
                            {devicesModified && (
                                <button onClick={saveDevices} className="save-button">
                                    Save All Changes
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setDevicesView(null);
                                    setEditingDevices([]);
                                    setDevicesModified(false);
                                }}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAvailableDevices && (
                    <motion.div
                        className="available-devices-popup"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="available-devices-content">
                            <h3>Available Devices ({filteredAvailableDevices.length})</h3>

                            <div className="device-search-container">
                                <div className="search-bar">
                                    <FaSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by device ID..."
                                        value={deviceSearchQuery}
                                        onChange={(e) => setDeviceSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="device-name-selection">
                                <label>Device Type for Selected:</label>
                                <select
                                    value={selectedDeviceName}
                                    onChange={(e) => setSelectedDeviceName(e.target.value)}
                                    required
                                >
                                    <option value="">Select Device Type</option>
                                    {Object.entries(deviceTypes).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="devices-list-container">
                                {filteredAvailableDevices.length > 0 ? (
                                    <ul className="available-devices-list">
                                        {filteredAvailableDevices.map(device => (
                                            <li
                                                key={device.device_id}
                                                className={`device-item ${selectedAvailableDevices.includes(device.device_id) ? 'selected' : ''}`}
                                                onClick={() => toggleDeviceSelection(device.device_id)}
                                            >
                                                <span className="device-info">
                                                    {device.device_id} ({getDeviceDisplayName(device.device_name || 'unknown')})
                                                    {device.device_location && <div>Location: {device.device_location}</div>}
                                                    {device.device_site_name && <div>Site: {device.device_site_name}</div>}
                                                    {device.latitude && device.latitude !== 'NA' && <div>Latitude: {device.latitude}</div>}
                                                    {device.longitude && device.longitude !== 'NA' && <div>Longitude: {device.longitude}</div>}
                                                </span>
                                                {selectedAvailableDevices.includes(device.device_id) && (
                                                    <FaCheck className="selection-check" />
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No available devices found</p>
                                )}
                            </div>

                            <div className="available-devices-buttons">
                                <button
                                    onClick={addSelectedDevices}
                                    disabled={selectedAvailableDevices.length === 0 || isAssigningDevices || !selectedDeviceName}
                                    className="add-devices-button"
                                >
                                    {isAssigningDevices ? 'Assigning...' : 'Add Selected Devices'}
                                </button>
                                <button
                                    onClick={handleAddDeviceClick}
                                    className="add-new-device-toggle-button"
                                >
                                    {showAddNewDeviceForm ? 'Hide Add Device Form' : 'Add New Device'}
                                </button>
                                <button
                                    onClick={() => setShowAvailableDevices(false)}
                                    className="cancel-button"
                                >
                                    Close
                                </button>
                            </div>

                            <AnimatePresence>
                                {showAddNewDeviceForm && (
                                    <motion.div
                                        className="add-new-device-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4>Add New Device</h4>
                                        <div className="input-group">
                                            <label>Device ID:</label>
                                            <input
                                                type="text"
                                                name="device_id"
                                                value={addNewDeviceData.device_id}
                                                onChange={handleNewDeviceInputChange}
                                                placeholder="Enter new device ID"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Device Type:</label>
                                            <select
                                                name="device_name"
                                                value={addNewDeviceData.device_name}
                                                onChange={handleNewDeviceInputChange}
                                                required
                                            >
                                                <option value="">Select Device Type</option>
                                                {Object.entries(deviceTypes).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label>Device Location:</label>
                                            <input
                                                type="text"
                                                name="device_location"
                                                value={addNewDeviceData.device_location}
                                                onChange={handleNewDeviceInputChange}
                                                placeholder="Enter device location"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Site Name:</label>
                                            <input
                                                type="text"
                                                name="device_site_name"
                                                value={addNewDeviceData.device_site_name}
                                                onChange={handleNewDeviceInputChange}
                                                placeholder="Enter site name"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Latitude:</label>
                                            <input
                                                type="text"
                                                name="latitude"
                                                value={addNewDeviceData.latitude}
                                                onChange={handleNewDeviceInputChange}
                                                placeholder="e.g., 13.0827"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Longitude:</label>
                                            <input
                                                type="text"
                                                name="longitude"
                                                value={addNewDeviceData.longitude}
                                                onChange={handleNewDeviceInputChange}
                                                placeholder="e.g., 80.2707"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddNewDevice}
                                            disabled={isAssigningDevices || !addNewDeviceData.device_id.trim() || !addNewDeviceData.device_name}
                                            className="add-new-device-to-user-button"
                                        >
                                            {isAssigningDevices ? 'Adding...' : 'Add Device to User'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UserManagement;