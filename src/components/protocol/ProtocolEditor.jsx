import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

/**
 * Protocol Editor Component
 * Allows for editing of protocol content including
 * title, sections, and other metadata
 */
const ProtocolEditor = ({ protocol, onSave, onCancel }) => {
  const [editedProtocol, setEditedProtocol] = useState(protocol ? { ...protocol } : null);
  
  if (!editedProtocol) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No protocol available for editing. Please generate a protocol first.</p>
      </div>
    );
  }
  
  // Update the protocol title
  const handleTitleChange = (e) => {
    setEditedProtocol({
      ...editedProtocol,
      title: e.target.value
    });
  };
  
  // Update section content
  const handleSectionChange = (sectionId, field, value) => {
    setEditedProtocol({
      ...editedProtocol,
      sections: editedProtocol.sections.map(section => 
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    });
  };
  
  // Add a new section
  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: 'Enter content here...'
    };
    
    setEditedProtocol({
      ...editedProtocol,
      sections: [...editedProtocol.sections, newSection]
    });
  };
  
  // Remove a section
  const handleRemoveSection = (sectionId) => {
    setEditedProtocol({
      ...editedProtocol,
      sections: editedProtocol.sections.filter(section => section.id !== sectionId)
    });
  };
  
  // Move section up in the order
  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const newSections = [...editedProtocol.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    
    setEditedProtocol({
      ...editedProtocol,
      sections: newSections
    });
  };
  
  // Move section down in the order
  const handleMoveDown = (index) => {
    if (index === editedProtocol.sections.length - 1) return;
    
    const newSections = [...editedProtocol.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    
    setEditedProtocol({
      ...editedProtocol,
      sections: newSections
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProtocol);
  };
  
  return (
    <form onSubmit={handleSubmit} className="protocol-editor p-6">
      <div className="mb-6">
        <label htmlFor="protocol-title" className="block text-sm font-medium text-gray-700">
          Protocol Title
        </label>
        <input
          type="text"
          id="protocol-title"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={editedProtocol.title}
          onChange={handleTitleChange}
          required
        />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-900">Protocol Sections</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddSection}
            className="text-sm"
          >
            Add Section
          </Button>
        </div>
        
        <div className="space-y-6">
          {editedProtocol.sections.map((section, index) => (
            <div key={section.id} className="bg-gray-50 p-4 rounded-md">
              <div className="mb-3">
                <label htmlFor={`section-title-${section.id}`} className="block text-sm font-medium text-gray-700">
                  Section Title
                </label>
                <input
                  type="text"
                  id={`section-title-${section.id}`}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor={`section-content-${section.id}`} className="block text-sm font-medium text-gray-700">
                  Section Content
                </label>
                <textarea
                  id={`section-content-${section.id}`}
                  rows="5"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={section.content}
                  onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleRemoveSection(section.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="space-x-2">
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleMoveUp(index)}
                      className="text-sm"
                    >
                      Move Up
                    </Button>
                  )}
                  
                  {index < editedProtocol.sections.length - 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleMoveDown(index)}
                      className="text-sm"
                    >
                      Move Down
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Protocol
        </Button>
      </div>
    </form>
  );
};

ProtocolEditor.propTypes = {
  protocol: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    date: PropTypes.string,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      })
    ).isRequired,
    footer: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProtocolEditor;