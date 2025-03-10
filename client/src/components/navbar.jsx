import React, { useState } from "react";
import { FaEdit, FaTrash, FaBars, FaSearch } from "react-icons/fa";
import styles from "./navbar.module.css";
import { FiSidebar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ buttons, setButtons }) => {
  const [search, setSearch] = useState(""); // For search functionality
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state

  const handleDelete = (id) => {
    const updatedButtons = buttons.filter((button) => button.id !== id);
    setButtons(updatedButtons);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredButtons = buttons.filter((button) =>
    button.title.toLowerCase().includes(search)
  );
  const navigate = useNavigate();
  const handleButtonClick = (id) => {
    console.log("Navigating with ID:", id); 
    navigate(`/checking/${id}`);
  };

  return (
    <>
      {/* FaBars Icon for Sidebar Toggle */}
      <div
        className={`${styles.toggleButton} ${
          !isOpen ? styles.toggleOutside : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiSidebar className="toggleButton" />
      </div>

      {/* Sidebar Content */}
      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      >
        {isOpen && (
          <>
            {/* New Check */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "none",
                  textDecoration: "none", // Removes the underline
                }}
                className={styles.subjectItem}
              >
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
              {filteredButtons.map((button,index) => (
                <button
                  key={index}
                  className={styles.subjectItem}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add(styles.hover)
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove(styles.hover)
                  }
                >
                  <span className={styles.subjectTitle}>{button.title}</span>
                  <div className={styles.actions}>
                    <FaEdit
                      className={styles.editIcon}
                      onClick={() => handleEdit(index)}
                    />
                    <FaTrash
                      className={styles.deleteIcon}
                      onClick={() => handleDelete(index)}
                    />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
