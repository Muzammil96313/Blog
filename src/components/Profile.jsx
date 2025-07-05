import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { updateProfile, onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          name: currentUser.displayName || "",
          email: currentUser.email || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "avatars_preset");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmbtoka7s/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    return json.secure_url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = user?.photoURL || null;

      if (avatar) {
        photoURL = await uploadToCloudinary(avatar);
      }

      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: photoURL,
      });

      await auth.currentUser.reload();

      setMessage("Profile updated successfully!");
      setEditing(false);
      setUser(auth.currentUser);
      setAvatar(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white h-[100vh]">
      <div className="container py-10">
        <h2 className="text-4xl font-bold mb-4">User Profile</h2>
        {message && <p className="mb-4">{message}</p>}

        {!editing ? (
          <div>
            <div className="mb-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <label
                    className="cursor-pointer text-blue-500 underline"
                    onClick={() => setEditing(true)}
                  >
                    Upload Avatar
                  </label>
                </div>
              )}
            </div>
            <p className="text-xl mb-2">
              <strong>Name:</strong> {user?.displayName}
            </p>
            <p className="text-xl mb-2">
              <strong>Email:</strong> {user?.email}
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
            <div className="mb-4">
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 w-full text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email (cannot change):</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="border p-2 w-full text-gray-400 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Upload Avatar:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block mt-2"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-1 px-3 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
