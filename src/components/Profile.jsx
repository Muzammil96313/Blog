import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [avatar, setAvatar] = useState(null); // State for the avatar file
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]); // Update the avatar state with the selected file
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");

      // Create a FormData object for sending avatar along with other profile data
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      if (avatar) {
        formDataObj.append("avatar", avatar); // Append avatar if selected
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        }
      );
      setUser(response.data.user);
      setMessage(response.data.message);
      setEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating profile");
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white h-[100vh]">
      <div className="container py-10">
        <h2 className="text-4xl font-bold mb-4">User Profile</h2>
        {message && <p>{message}</p>}

        {!editing ? (
          <div>
            {/* Display avatar */}
            <div className="mb-4">
              {user.avatar ? (
                <img
                  src={`http://localhost:5000${user.avatar}`} // Use the full URL path for image
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <label className="cursor-pointer text-blue-500 underline">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    Upload Avatar
                  </label>
                </div>
              )}
            </div>
            <p className="text-xl mb-2">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-xl mb-2">
              <strong>Email:</strong> {user.email}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white py-1 px-3 rounded"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="mt-4">
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 w-full text-black"
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border p-2 w-full text-black"
              />
            </div>
            <div className="mt-4">
              <label>Avatar:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="border p-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-1 px-3 rounded mt-4"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
