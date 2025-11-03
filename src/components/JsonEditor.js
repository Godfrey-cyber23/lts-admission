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
  
  const handleChange = (field, newValue, parentPath = []) => {
    const updatedValue = { ...value };
    
    // Navigate to the correct nested object
    let current = updatedValue;
    for (const path of parentPath) {
      if (!current[path]) {
        current[path] = {};
      }
      current = current[path];
    }
    
    current[field] = newValue;
    onChange(updatedValue);
  };
  
  const handleArrayChange = (arrayIndex, field, newValue, parentPath = []) => {
    const updatedValue = { ...value };
    
    // Navigate to the correct nested object
    let current = updatedValue;
    for (const path of parentPath) {
      if (!current[path]) {
        current[path] = {};
      }
      current = current[path];
    }
    
    if (!Array.isArray(current[field])) {
      current[field] = [];
    }
    
    current[field][arrayIndex] = { ...current[field][arrayIndex], [field]: newValue };
    onChange(updatedValue);
  };
  
  const handleAddArrayItem = (field, newItem, parentPath = []) => {
    const updatedValue = { ...value };
    
    // Navigate to the correct nested object
    let current = updatedValue;
    for (const path of parentPath) {
      if (!current[path]) {
        current[path] = {};
      }
      current = current[path];
    }
    
    if (!Array.isArray(current[field])) {
      current[field] = [];
    }
    
    current[field] = [...current[field], newItem];
    onChange(updatedValue);
  };
  
  const handleDeleteArrayItem = (field, index, parentPath = []) => {
    const updatedValue = { ...value };
    
    // Navigate to the correct nested object
    let current = updatedValue;
    for (const path of parentPath) {
      if (!current[path]) {
        current[path] = {};
      }
      current = current[path];
    }
    
    if (Array.isArray(current[field])) {
      current[field] = current[field].filter((_, i) => i !== index);
    }
    
    onChange(updatedValue);
  };
  
  const renderField = (field, label, type = 'text', parentPath = []) => {
    const fieldValue = parentPath.length > 0 
      ? parentPath.reduce((obj, path) => obj?.[path] || {}, value)[field]
      : value[field];
    
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
    const fieldValue = parentPath.length > 0 
      ? parentPath.reduce((obj, path) => obj?.[path] || {}, value)[field]
      : value[field];
    
    const items = Array.isArray(fieldValue) ? fieldValue : [];
    
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1">{label}</Typography>
          <Button
            startIcon={<AddIcon />}
            size="small"
            onClick={() => handleAddArrayItem(field, itemSchema, parentPath)}
          >
            Add Item
          </Button>
        </Box>
        
        {items.map((item, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Item {index + 1}</Typography>
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
              {Object.entries(itemSchema).map(([key, schema]) => (
                <div key={key}>
                  {typeof schema === 'object' 
                    ? renderObjectField(key, schema, [...parentPath, field, index])
                    : renderField(key, schema.label || key, schema.type || 'text', [...parentPath, field, index])
                  }
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };
  
  const renderObjectField = (field, schema, parentPath = []) => {
    const fieldValue = parentPath.length > 0 
      ? parentPath.reduce((obj, path) => obj?.[path] || {}, value)[field]
      : value[field];
    
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
const homePageSchema = {
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