import React, { useState } from "react";
import DemandPredictor from "./DemandPredictor";

const Inventory = () => {
  return (
    <div>
      <div className="content">
        <div className="panel">
          <DemandPredictor/>
        </div>

        
      </div>
    </div>
  );
};

export default Inventory;
