import React from 'react';
import _ from 'lodash';
function Sidebar() {
  return (
    <div className="w-64 border-r p-4">
      <h2 className="mb-4 text-lg font-bold">Charts</h2>
      {['pie', 'geo', 'pie3d'].map((type) => (
        <div
          key={type}
          className="mb-3 cursor-move rounded bg-black   p-3 shadow"
          draggable
          onDragStart={(e) => {
            const item = JSON.stringify({
              i: new Date().getTime().toString(),
              w: 2,
              h: 2,
              type,
            });
            e.dataTransfer.setData('application/json', item);
          }}
        >
          ➕ {_.capitalize(type)} Chart
        </div>
      ))}
      {/* <button
        className="mt-4 w-full rounded bg-blue-500 px-3 py-2 text-white shadow"
        onClick={this.onNewLayout}
      >
        Generate New Layout
      </button>
      <button
        className="mt-2 w-full rounded bg-gray-500 px-3 py-2 text-white shadow"
        onClick={this.onCompactTypeChange}
      >
        Change Compaction
      </button> */}
    </div>
  );
}

export default Sidebar;
