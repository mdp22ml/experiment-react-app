import React from 'react';
import PropTypes from 'prop-types';

/**
 * Format text content with emoji support and special formatting
 */
const formatProtocolContent = (content) => {
  if (!content) return '';
  
  // Check if the content has emojis and special formatting typical of OpenAI generated protocols
  const hasDetailedFormat = content.includes('🔬') || 
                          content.includes('📋') || 
                          content.includes('🧪') || 
                          content.includes('⚠️');

  // For specially formatted content (like from OpenAI)
  if (hasDetailedFormat) {
    // Split content into sections by emoji headers
    let formattedContent = content;
    
    // Format section headers with emojis
    formattedContent = formattedContent.replace(/^(🔬|📋|🧪|⚠️)\s+(.+)$/gm, '<h4 class="flex items-center text-lg font-medium text-gray-800 mt-6 mb-3">$1 <span class="ml-2">$2</span></h4>');
    
    // Format numbered steps with emoji numbers (1️⃣, 2️⃣, etc.)
    formattedContent = formattedContent.replace(/^(\d️⃣)\s+(.+)$/gm, '<h5 class="flex items-center text-base font-medium text-gray-700 mt-4 mb-2">$1 <span class="ml-2">$2</span></h5>');
    
    // Format list items with proper spacing and bullets
    formattedContent = formattedContent.replace(/^-\s+(.+)$/gm, '<li class="mb-2">$1</li>');
    
    // Wrap all list items in ul tags
    formattedContent = formattedContent.replace(/(<li class="mb-2">.+<\/li>\n)+/g, (match) => `<ul class="list-disc pl-5 my-3">${match}</ul>`);
    
    return formattedContent;
  }
  
  // For standard content
  return content;
};

/**
 * Protocol Template Component
 * Displays a read-only view of the protocol
 */
const ProtocolTemplate = ({ protocol }) => {
  if (!protocol) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No protocol available. Please generate a protocol first.</p>
      </div>
    );
  }

  // Check if the protocol appears to be AI-generated with emoji formatting
  const isDetailedProtocol = protocol.title?.includes('🌈') || 
                             protocol.title?.includes('🧬') || 
                             protocol.title?.includes('🔍');

  return (
    <div className="protocol-template p-6">
      {/* Protocol Header */}
      <div className={`mb-8 ${isDetailedProtocol ? 'text-left' : 'text-center'} border-b pb-6`}>
        <h2 className="text-2xl font-bold text-gray-900">{protocol.title}</h2>
        {protocol.author && (
          <p className="mt-2 text-sm text-gray-500">Author: {protocol.author}</p>
        )}
        {protocol.date && (
          <p className="mt-1 text-sm text-gray-500">Date: {protocol.date}</p>
        )}
      </div>
      
      {/* Protocol Sections */}
      <div className="space-y-8">
        {protocol.sections.map((section) => {
          // Format content with emoji support
          const formattedContent = formatProtocolContent(section.content);
          const hasFormattedContent = formattedContent !== section.content;
          
          return (
            <div key={section.id} className="protocol-section">
              <h3 className="text-xl font-medium text-gray-900 mb-3">{section.title}</h3>
              <div className="prose prose-sm max-w-none">
                {/* Render section content as HTML if it's been formatted or contains HTML tags */}
                {hasFormattedContent || (section.content.includes('<') && section.content.includes('>')) ? (
                  <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
                ) : (
                  // Otherwise render as text with line breaks preserved
                  <div className="whitespace-pre-wrap">{section.content}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Protocol Footer */}
      {protocol.footer && (
        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>{protocol.footer}</p>
        </div>
      )}
    </div>
  );
};

ProtocolTemplate.propTypes = {
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
};

export default ProtocolTemplate;