import React, { useState } from 'react';

const Inventory = () => {
    const [inventory, setInventory] = useState([
        { id: 1, name: 'Solar Panels', quantity: 50, carbonFootprint: 10 },
        { id: 2, name: 'Wind Turbines', quantity: 20, carbonFootprint: 15 },
        { id: 3, name: 'Recycled Batteries', quantity: 100, carbonFootprint: 5 },
    ]);

    const updateQuantity = (id, newQuantity) => {
        setInventory((prevInventory) =>
            prevInventory.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    return (
        <div>
            <h1>Green Supply Chain Inventory</h1>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Carbon Footprint (kg CO₂)</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.carbonFootprint}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;