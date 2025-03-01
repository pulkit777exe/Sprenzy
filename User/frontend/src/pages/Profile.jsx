import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, MapPin, Phone, Mail, Edit, Plus, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    fullName: ''
  });
  
  const [addressData, setAddressData] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    isDefault: false
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    fetchUserProfile();
  }, [user, navigate]);
  
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setProfile(response.data.user);
        setAddresses(response.data.user.addresses || []);
        
        // Set form data
        setFormData({
          username: response.data.user.username || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          fullName: response.data.user.fullName || ''
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditingProfile(false);
        fetchUserProfile();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      let response;
      
      if (editingAddressId) {
        // Update existing address
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/address/${editingAddressId}`,
          addressData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Add new address
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/address`,
          addressData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      if (response.data.success) {
        toast.success(editingAddressId ? 'Address updated successfully' : 'Address added successfully');
        setIsAddingAddress(false);
        setEditingAddressId(null);
        setAddresses(response.data.addresses);
      } else {
        toast.error('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };
  
  const handleEditAddress = (address) => {
    setAddressData({
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || 'India',
      phone: address.phone,
      isDefault: address.isDefault
    });
    
    setEditingAddressId(address._id);
    setIsAddingAddress(true);
  };
  
  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Address deleted successfully');
        setAddresses(response.data.addresses);
      } else {
        toast.error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{profile?.username || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile?.email || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{profile?.fullName || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profile?.phone || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Addresses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
                <button 
                  onClick={() => {
                    setIsAddingAddress(true);
                    setEditingAddressId(null);
                    setAddressData({
                      fullName: '',
                      streetAddress: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      country: 'India',
                      phone: '',
                      isDefault: false
                    });
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Address</span>
                </button>
              </div>
              
              {isAddingAddress ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={addressData.fullName}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={addressData.phone}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={addressData.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={addressData.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={addressData.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={addressData.postalCode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={addressData.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={addressData.isDefault}
                      onChange={handleAddressChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      {editingAddressId ? 'Update Address' : 'Add Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddressId(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">You haven't added any addresses yet</p>
                      <button 
                        onClick={() => {
                          setIsAddingAddress(true);
                          setEditingAddressId(null);
                          setAddressData({
                            fullName: '',
                            streetAddress: '',
                            city: '',
                            state: '',
                            postalCode: '',
                            country: 'India',
                            phone: '',
                            isDefault: false
                          });
                        }}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div 
                        key={address._id} 
                        className={`border rounded-xl p-4 relative ${address.isDefault ? 'border-primary bg-amber-50' : 'border-gray-200'}`}
                      >
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-800">{address.fullName}</h3>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditAddress(address)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                              title="Edit address"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(address._id)}
                              className="p-1 text-red-500 hover:text-red-700"
                              title="Delete address"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-1">{address.streetAddress}</p>
                        <p className="text-gray-600 text-sm mb-1">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">{address.country}</p>
                        
                        <div className="flex items-center text-gray-600 text-sm">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{address.phone}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}