import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

// Function to get UserData value from object with condition
function getValueByKeyWithCondition(object, key) {
  switch (key) {
    case "name":
    case "age":
    case "city":
    case "pinCode":
      return object.hasOwnProperty(key) ? object[key] : null;
    default:
      return null;
  }
}

const ListofData = () => {
  // State variables
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editUserData, setEditUserData] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editData, setEditData] = useState("");

  // Table headings
  const headingContent = [
    "Sl. No.",
    "Name",
    "Age",
    "City",
    "PinCode",
    "Action",
  ];

  // Fetch data from API on component mount
  useEffect(() => {
    axios
      .get("https://assets.alippo.com/catalog/static/data.json")
      .then((response) => setData(response.data))
      .catch((error) => alert("Error fetching data"));
  }, []);

  // Edit button click handler
  const handleEdit = (index, UserData, values) => {
    setEditIndex(index);
    setEditValue(data[index][UserData] || "");
    setEditData(values);
    setEditUserData(UserData);
  };

  // Submit edited data
  const handleEditSubmit = () => {
    const newData = [...data];
    newData[editIndex][editUserData] = editValue;
    setData(newData);
    setEditIndex(null);
  };

  // Cancel edit
  const handleEditCancel = () => setEditIndex(null);

  // Column select field value change
  const toogleEditHandler = (type) => {
    setEditUserData(type);
    const fieldValue = getValueByKeyWithCondition(editData, type);
    setEditValue(fieldValue);
  };

  // Delete button click handler
  const handleDelete = (index) => {
    setShowDeleteModal(true);
    setDeleteIndex(index);
  };

  // Confirm delete
  const confirmDelete = () => {
    const newData = [...data];
    newData.splice(deleteIndex, 1);
    setData(newData);
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <div className="table-container">
      {/* Table header */}
      <table>
        <thead>
          <tr>
            {headingContent.map((v, i) => (
              <th key={i}>{v}</th>
            ))}
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name || "N/A"}</td>
              <td>{item.age || "N/A"}</td>
              <td>{item.city || "N/A"}</td>
              <td>{item.pinCode || "N/A"}</td>
              <td>
                {/* Edit and delete buttons */}
                <div>
                  <button onClick={() => handleEdit(index, "name", item)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editIndex !== null && (
        <div className="edit-modal">
          <h2>Select Column to edit</h2>
          <div>
            {/* Buttons to select UserData type */}
            {["name", "age", "city", "pinCode"].map((type) => (
              <button key={type} onClick={() => toogleEditHandler(type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="text_input">
            {/* Input for editing value */}
            <label>
              {editUserData === "name" && "Name"}
              {editUserData === "age" && "Age"}
              {editUserData === "city" && "City"}
              {editUserData === "pinCode" && "Pincode"}
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </label>
          </div>
          <div className="text_input">
            {/* Submit and cancel buttons */}
            <button onClick={handleEditSubmit}>Submit</button>
            <button onClick={handleEditCancel}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal">
          <h2>Confirm Delete</h2>
          <p>
            Are you sure you want to delete{" "}
            <strong>{data[deleteIndex]?.name || "this item"}</strong> at row{" "}
            <strong>{deleteIndex + 1}</strong>?
          </p>
          <div>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListofData;
