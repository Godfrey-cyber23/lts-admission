import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  IconButton,
  Button,
  Alert
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const JsonEditor = ({ value, onChange, schema }) => {
  const [jsonError, setJsonError] = useState('');
  
  // Deep clone function to avoid mutation issues
  const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  };

  // Get nested value safely
  const getNestedValue = (obj, path) => {
    return path.reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  // Set nested value immutably
  const setNestedValue = (obj, path, value) => {
    const newObj = deepClone(obj);
    let current = newObj;
    
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (current[key] === undefined || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[path[path.length - 1]] = value;
    return newObj;
  };

  const handleChange = (field, newValue, parentPath = []) => {
    const fullPath = [...parentPath, field];
    const updatedValue = setNestedValue(value, fullPath, newValue);
    onChange(updatedValue);
  };
  
  const handleArrayChange = (arrayIndex, field, newValue, parentPath = []) => {
    const arrayPath = [...parentPath];
    const currentArray = getNestedValue(value, arrayPath) || [];
    
    if (!Array.isArray(currentArray)) {
      console.error('Expected array at path:', arrayPath);
      return;
    }
    
    const updatedArray = currentArray.map((item, index) => {
      if (index === arrayIndex) {
        return { ...item, [field]: newValue };
      }
      return item;
    });
    
    const updatedValue = setNestedValue(value, arrayPath, updatedArray);
    onChange(updatedValue);
  };
  
  const handleAddArrayItem = (field, defaultItem, parentPath = []) => {
    const fullPath = [...parentPath, field];
    const currentArray = getNestedValue(value, fullPath) || [];
    
    const newItem = typeof defaultItem === 'object' 
      ? deepClone(defaultItem)
      : defaultItem;
    
    const updatedArray = [...currentArray, newItem];
    const updatedValue = setNestedValue(value, fullPath, updatedArray);
    onChange(updatedValue);
  };
  
  const handleDeleteArrayItem = (field, index, parentPath = []) => {
    const fullPath = [...parentPath, field];
    const currentArray = getNestedValue(value, fullPath) || [];
    
    if (Array.isArray(currentArray)) {
      const updatedArray = currentArray.filter((_, i) => i !== index);
      const updatedValue = setNestedValue(value, fullPath, updatedArray);
      onChange(updatedValue);
    }
  };
  
  const renderField = (field, label, type = 'text', parentPath = []) => {
    const fullPath = [...parentPath, field];
    const fieldValue = getNestedValue(value, fullPath);
    
    switch (type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={label}
            value={fieldValue || ''}
            onChange={(e) => handleChange(field, e.target.value, parentPath)}
            margin="normal"
          />
        );
      case 'textarea':
        return (
          <TextField
            fullWidth
            label={label}
            value={fieldValue || ''}
            onChange={(e) => handleChange(field, e.target.value, parentPath)}
            margin="normal"
            multiline
            rows={4}
          />
        );
      default:
        return null;
    }
  };
  
  const renderArrayField = (field, label, itemSchema, parentPath = []) => {
    const fullPath = [...parentPath, field];
    const fieldValue = getNestedValue(value, fullPath);
    const items = Array.isArray(fieldValue) ? fieldValue : [];
    
    // Create default item based on schema
    const createDefaultItem = () => {
      if (typeof itemSchema === 'object') {
        const defaultItem = {};
        Object.keys(itemSchema).forEach(key => {
          defaultItem[key] = '';
        });
        return defaultItem;
      }
      return '';
    };
    
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1">{label}</Typography>
          <Button
            startIcon={<AddIcon />}
            size="small"
            onClick={() => handleAddArrayItem(field, createDefaultItem(), parentPath)}
          >
            Add Item
          </Button>
        </Box>
        
        {items.map((item, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {item.title || item.text || item.label || `Item ${index + 1}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteArrayItem(field, index, parentPath)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              {typeof itemSchema === 'object' ? (
                Object.entries(itemSchema).map(([key, schema]) => (
                  <div key={key}>
                    {renderField(key, schema.label || key, schema.type || 'text', [...parentPath, field, index])}
                  </div>
                ))
              ) : (
                <TextField
                  fullWidth
                  label={label}
                  value={item || ''}
                  onChange={(e) => {
                    const updatedArray = [...items];
                    updatedArray[index] = e.target.value;
                    const updatedValue = setNestedValue(value, fullPath, updatedArray);
                    onChange(updatedValue);
                  }}
                  margin="normal"
                />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No items added yet. Click "Add Item" to create one.
          </Typography>
        )}
      </Box>
    );
  };
  
  const renderObjectField = (field, schema, parentPath = []) => {
    const fullPath = [...parentPath, field];
    const fieldValue = getNestedValue(value, fullPath) || {};
    
    return (
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{schema.label || field}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(schema.fields || {}).map(([key, fieldSchema]) => {
            if (fieldSchema.type === 'array') {
              return renderArrayField(key, fieldSchema.label || key, fieldSchema.items, [...parentPath, field]);
            } else if (fieldSchema.type === 'object') {
              return renderObjectField(key, fieldSchema, [...parentPath, field]);
            } else {
              return renderField(key, fieldSchema.label || key, fieldSchema.type || 'text', [...parentPath, field]);
            }
          })}
        </AccordionDetails>
      </Accordion>
    );
  };
  
  // Initialize with default values if value is empty
  React.useEffect(() => {
    if (!value || Object.keys(value).length === 0) {
      const initializeWithDefaults = (schemaObj, currentValue = {}) => {
        if (!schemaObj.fields) return currentValue;
        
        Object.entries(schemaObj.fields).forEach(([key, fieldSchema]) => {
          if (fieldSchema.type === 'object') {
            currentValue[key] = initializeWithDefaults(fieldSchema, currentValue[key] || {});
          } else if (fieldSchema.type === 'array') {
            currentValue[key] = currentValue[key] || [];
          } else {
            currentValue[key] = currentValue[key] || '';
          }
        });
        
        return currentValue;
      };
      
      if (schema) {
        const initializedValue = initializeWithDefaults(schema, {});
        onChange(initializedValue);
      }
    }
  }, [value, schema, onChange]);
  
  return (
    <Box>
      {jsonError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {jsonError}
        </Alert>
      )}
      
      {schema && Object.entries(schema.fields || {}).map(([key, fieldSchema]) => {
        if (fieldSchema.type === 'array') {
          return renderArrayField(key, fieldSchema.label || key, fieldSchema.items);
        } else if (fieldSchema.type === 'object') {
          return renderObjectField(key, fieldSchema);
        } else {
          return renderField(key, fieldSchema.label || key, fieldSchema.type || 'text');
        }
      })}
    </Box>
  );
};

// Define the schema for the home page content
export const homePageSchema = {
  fields: {
    hero: {
      type: 'object',
      label: 'Hero Section',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
        images: {
          type: 'array',
          label: 'Hero Images',
          items: {
            src: { type: 'text', label: 'Image URL' },
            alt: { type: 'text', label: 'Alt Text' }
          }
        },
        buttons: {
          type: 'array',
          label: 'Hero Buttons',
          items: {
            text: { type: 'text', label: 'Button Text' },
            link: { type: 'text', label: 'Button Link' },
            icon: { type: 'text', label: 'Icon' }
          }
        }
      }
    },
    stats: {
      type: 'array',
      label: 'Statistics',
      items: {
        number: { type: 'text', label: 'Number' },
        label: { type: 'text', label: 'Label' },
        icon: { type: 'text', label: 'Icon' },
        suffix: { type: 'text', label: 'Suffix (e.g. %)' }
      }
    },
    about: {
      type: 'object',
      label: 'About Section',
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        image: { type: 'text', label: 'Image URL' },
        linkText: { type: 'text', label: 'Link Text' },
        link: { type: 'text', label: 'Link URL' }
      }
    },
    programs: {
      type: 'object',
      label: 'Programs Section',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        items: {
          type: 'array',
          label: 'Program Items',
          items: {
            title: { type: 'text', label: 'Title' },
            description: { type: 'textarea', label: 'Description' },
            icon: { type: 'text', label: 'Icon' },
            image: { type: 'text', label: 'Image URL' }
          }
        }
      }
    },
    testimonials: {
      type: 'object',
      label: 'Testimonials Section',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'text', label: 'Subtitle' },
        items: {
          type: 'array',
          label: 'Testimonial Items',
          items: {
            quote: { type: 'textarea', label: 'Quote' },
            author: { type: 'text', label: 'Author' },
            role: { type: 'text', label: 'Role' }
          }
        }
      }
    },
    cta: {
      type: 'object',
      label: 'Call to Action Section',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
        buttons: {
          type: 'array',
          label: 'CTA Buttons',
          items: {
            text: { type: 'text', label: 'Button Text' },
            link: { type: 'text', label: 'Button Link' }
          }
        }
      }
    }
  }
};

export default JsonEditor;