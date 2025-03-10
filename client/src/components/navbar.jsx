import React, { useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import styles from "./navbar.module.css";
import { FiSidebar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { setNavbarTitle } from "../utils/helperFunctions";

const Sidebar = ({ buttons, setButtons }) => {
  const [search, setSearch] = useState(""); // For search functionality
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state
  const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button
  const [editingButton, setEditingButton] = useState(null); // Track which button is being edited
  const [newTitle, setNewTitle] = useState(""); // Track new title input

  const handleDelete = (id) => {
    const updatedButtons = buttons.filter((button) => button.id !== id);
    setButtons(updatedButtons);
    sessionStorage.setItem("buttons", JSON.stringify(updatedButtons));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleEditClick = (id, currentTitle) => {
    setEditingButton(id); // Set button in edit mode
    setNewTitle(currentTitle); // Pre-fill with current title
  };

  const handleEditChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleEditSubmit = (id) => {
    if (newTitle.trim() === "") return; // Prevent empty title

    const updatedButtons = buttons.map((button) =>
      button.id === id ? { ...button, title: newTitle } : button
    );

    setButtons(updatedButtons);
    sessionStorage.setItem("buttons", JSON.stringify(updatedButtons));
    setEditingButton(null); // Exit edit mode
  };

  // Filter buttons based on search (match from the beginning)
  const filteredButtons = buttons.filter((button) =>
    button.title?.toLowerCase().startsWith(search)
  );

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div
        className={`${styles.toggleButton} ${!isOpen ? styles.toggleOutside : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiSidebar className="toggleButton" />
      </div>

      {/* Sidebar Content */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        {isOpen && (
          <>
            {/* New Check Button */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <button className={styles.subjectItem} style={{ width: "100%", marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                New Check
              </button>
            </Link>

            {/* Header */}
            <h2 className={styles.header}>My Subjects</h2>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search for a subject..."
                value={search}
                onChange={handleSearch}
                className={styles.searchInput}
              />
              <FaSearch className={styles.searchIcon} />
            </div>

            {/* Subjects List */}
            <div className={styles.subjectsContainer}>
              {filteredButtons.map((button) => (
                <div key={button.id} style={{ position: "relative" }}>
                  <Link to={`/checking/${button.id}`} style={{ textDecoration: "none" }}>
                    <button
                      className={styles.subjectItem}
                      style={{ width: "100%" }}
                      onMouseEnter={() => setHoveredButton(button.id)} // Track hover start
                      onMouseLeave={() => setHoveredButton(null)} // Reset hover
                    >
                      {/* Editable Title */}
                      {editingButton === button.id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={handleEditChange}
                          onBlur={() => handleEditSubmit(button.id)} 
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSubmit(button.id); 
                          }}
                          autoFocus
                          className={styles.editInput}
                        />
                      ) : (
                        <span className={styles.subjectTitle}>{setNavbarTitle(button.title,hoveredButton=== button.id)}</span>
                      )}

                      {/* Show icons only when hovered */}
                      {hoveredButton === button.id && (
                        <div className={styles.actions}>
                          <FaEdit
                            className={styles.editIcon}
                            onClick={(e) => {
                              e.preventDefault(); // Prevent link navigation
                              handleEditClick(button.id, button.title);
                            }}
                          />
                          <FaTrash
                            className={styles.deleteIcon}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(button.id);
                            }}
                          />
                        </div>
                      )}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
