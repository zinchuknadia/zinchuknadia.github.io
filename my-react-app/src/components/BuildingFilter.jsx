import React from "react";

const BuildingFilter = ({ selectedTypes, setSelectedTypes, showMenu, setShowMenu }) => {
  const types = ["All", "Infrastructure", "Commercial", "Public"];

  const handleChange = (type) => {
    if (type === "All") {
      setSelectedTypes(["All"]);
    } else {
      setSelectedTypes((prev) => {
        const withoutAll = prev.filter((t) => t !== "All");
        if (prev.includes(type)) {
          const updated = withoutAll.filter((t) => t !== type);
          return updated.length === 0 ? ["All"] : updated;
        } else {
          return [...withoutAll, type];
        }
      });
    }
  };

  return (
    <div className="building-filter">
      <button onClick={() => setShowMenu((prev) => !prev)}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/filter.svg`}
          alt="Filter"
          style={{ width: "24px", height: "24px" }}
        />
        Filter
      </button>
      {showMenu && (
        <div className="filter-menu">
          {types.map((type) => (
            <label
              key={type}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.3rem",
              }}
            >
              <input
                type="checkbox"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={() => handleChange(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildingFilter;
