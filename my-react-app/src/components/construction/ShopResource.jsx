import React from "react";

const ShopResource = ({ resource, onBuy }) => {
  return (
    <div className="resource">
      <img
        src={`${process.env.PUBLIC_URL}/${resource.image}`}
        alt={resource.name}
      />
      <div className="resource-info">
        <h4>
          {resource.name} {resource.emoji}
        </h4>
        <p>${resource.price}</p>
        <p className="amount">x{resource.quantity}</p>
        <button onClick={() => onBuy(resource.id, resource.price)}>Buy</button>
      </div>
    </div>
  );
};

export default ShopResource;
