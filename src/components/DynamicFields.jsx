import React, { useState } from "react";

const DynamicFields = () => {
  const [fields, setFields] = useState([{ name: "", value: "" }]);

  // Add new field
  const addField = () => {
    setFields([...fields, { name: "", value: "" }]);
  };

  // Remove field by index
  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  // Handle change
  const handleChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  // Submit handler (for validation)
  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmpty = fields.some(field => !field.name.trim() || !field.value.trim());
    if (hasEmpty) {
      alert("All fields are required.");
      return;
    }
    console.log("Submitted Fields:", fields);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="flex items-center space-x-4">
          {/* Name Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              value={field.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
            />
          </div>

          {/* Value Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Value<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter value"
              value={field.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              required
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeField(index)}
            className="text-red-500 text-lg font-bold hover:text-red-700"
            title="Remove"
          >
            ⛔
          </button>
        </div>
      ))}

      {/* Add Field Button */}
      <button
        type="button"
        onClick={addField}
        className="flex items-center text-blue-600 text-sm font-medium hover:underline"
      >
        ➕ Add another field
      </button>

      {/* Submit (if needed) */}
      <div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default DynamicFields;
