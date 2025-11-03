/**
 * Literacy Tree School Design System
 * Complete theme configuration with TypeScript support
 */

// Main theme configuration
export const literacyTreeTheme = {
  colors: {
    primary: '#2c5e3a',
    primaryDark: '#1a3a27',
    primaryLight: '#e8f5e9',
    secondary: '#f5a623',
    accent: '#8bc34a',
    success: '#4caf50',
    error: '#d32f2f',
    warning: '#ffa000',
    info: '#1976d2',
    text: '#333333',
    textLight: '#5a5a5a',
    textInverse: '#ffffff',
    white: '#ffffff',
    gray: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e'
    },
    border: '#d1d1d1'
  },
  fonts: {
    main: '"Open Sans", sans-serif',
    heading: '"Merriweather", serif',
    decorative: '"Schoolbell", cursive',
    code: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'
  },
  sizes: {
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      full: '9999px'
    },
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
      form: '800px'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    header: {
      height: '80px',
      mobileHeight: '60px'
    },
    footer: {
      height: '60px'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  breakpoints: {
    xs: '0px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  transitions: {
    quick: '0.15s ease-in-out',
    standard: '0.3s ease-in-out',
    slow: '0.45s ease-in-out'
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
};

// Alternative theme (blue variant)
export const literacyTreeAltTheme = {
  ...literacyTreeTheme,
  colors: {
    ...literacyTreeTheme.colors,
    primary: '#3a6ea5',
    primaryDark: '#1e3d6b',
    primaryLight: '#e3f2fd',
    accent: '#64b5f6'
  }
};

// Theme provider with enhanced functionality
export const ThemeProvider = ({ children, theme = 'default' }) => {
  const selectedTheme = theme === 'alternate' ? literacyTreeAltTheme : literacyTreeTheme;
  
  const themeStyles = {
    // Colors
    '--color-primary': selectedTheme.colors.primary,
    '--color-primary-dark': selectedTheme.colors.primaryDark,
    '--color-primary-light': selectedTheme.colors.primaryLight,
    '--color-secondary': selectedTheme.colors.secondary,
    '--color-accent': selectedTheme.colors.accent,
    '--color-success': selectedTheme.colors.success,
    '--color-error': selectedTheme.colors.error,
    '--color-warning': selectedTheme.colors.warning,
    '--color-info': selectedTheme.colors.info,
    '--color-text': selectedTheme.colors.text,
    '--color-text-light': selectedTheme.colors.textLight,
    '--color-text-inverse': selectedTheme.colors.textInverse,
    '--color-white': selectedTheme.colors.white,
    '--color-gray-100': selectedTheme.colors.gray[100],
    '--color-gray-200': selectedTheme.colors.gray[200],
    '--color-gray-300': selectedTheme.colors.gray[300],
    '--color-gray-400': selectedTheme.colors.gray[400],
    '--color-gray-500': selectedTheme.colors.gray[500],
    '--color-border': selectedTheme.colors.border,

    // Fonts
    '--font-main': selectedTheme.fonts.main,
    '--font-heading': selectedTheme.fonts.heading,
    '--font-decorative': selectedTheme.fonts.decorative,
    '--font-code': selectedTheme.fonts.code,

    // Sizes
    '--border-radius-sm': selectedTheme.sizes.borderRadius.small,
    '--border-radius-md': selectedTheme.sizes.borderRadius.medium,
    '--border-radius-lg': selectedTheme.sizes.borderRadius.large,
    '--border-radius-full': selectedTheme.sizes.borderRadius.full,
    '--container-sm': selectedTheme.sizes.container.sm,
    '--container-md': selectedTheme.sizes.container.md,
    '--container-lg': selectedTheme.sizes.container.lg,
    '--container-xl': selectedTheme.sizes.container.xl,
    '--container-form': selectedTheme.sizes.container.form,
    '--spacing-xs': selectedTheme.sizes.spacing.xs,
    '--spacing-sm': selectedTheme.sizes.spacing.sm,
    '--spacing-md': selectedTheme.sizes.spacing.md,
    '--spacing-lg': selectedTheme.sizes.spacing.lg,
    '--spacing-xl': selectedTheme.sizes.spacing.xl,
    '--spacing-xxl': selectedTheme.sizes.spacing.xxl,
    '--header-height': selectedTheme.sizes.header.height,
    '--header-mobile-height': selectedTheme.sizes.header.mobileHeight,
    '--footer-height': selectedTheme.sizes.footer.height,

    // Shadows
    '--shadow-sm': selectedTheme.shadows.sm,
    '--shadow-md': selectedTheme.shadows.md,
    '--shadow-lg': selectedTheme.shadows.lg,
    '--shadow-xl': selectedTheme.shadows.xl,
    '--shadow-inner': selectedTheme.shadows.inner,

    // Transitions
    '--transition-quick': selectedTheme.transitions.quick,
    '--transition-standard': selectedTheme.transitions.standard,
    '--transition-slow': selectedTheme.transitions.slow,

    // Z-index
    '--z-dropdown': selectedTheme.zIndex.dropdown,
    '--z-sticky': selectedTheme.zIndex.sticky,
    '--z-fixed': selectedTheme.zIndex.fixed,
    '--z-modal-backdrop': selectedTheme.zIndex.modalBackdrop,
    '--z-modal': selectedTheme.zIndex.modal,
    '--z-popover': selectedTheme.zIndex.popover,
    '--z-tooltip': selectedTheme.zIndex.tooltip
  };

  return (
    <div style={themeStyles} className="theme-provider">
      {children}
    </div>
  );
};

/**
 * Helper hook to use theme in components
 */
export const useTheme = () => {
  return literacyTreeTheme; 
};

// TypeScript support
export const themeTypes = {
  color: Object.keys(literacyTreeTheme.colors),
  fontSize: Object.keys(literacyTreeTheme.sizes),
  shadow: Object.keys(literacyTreeTheme.shadows)
};