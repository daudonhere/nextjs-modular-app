/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./node_modules/@shadcn/ui/**/*.js"
],
theme: {
  extend: {
  screens: {
    '4xl': '2560px'
  },
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      secondaryB: {
        DEFAULT: 'hsl(var(--secondary-background))',
        foreground: 'hsl(var(--secondary-background-foreground))'
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      success: {
        DEFAULT: 'hsl(var(--success))',
        foreground: 'hsl(var(--success-foreground))'
      },
      successH: {
        DEFAULT: 'hsl(var(--success-hover))',
        foreground: 'hsl(var(--success-hover-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      destructiveH: {
        DEFAULT: 'hsl(var(--destructive-hover))',
        foreground: 'hsl(var(--destructive-hover-foreground))'
      },
      mutted: {
        DEFAULT: 'hsl(var(--mutted))',
        foreground: 'hsl(var(--mutted-foreground))'
      },
      netral: {
        DEFAULT: 'hsl(var(--netral))',
        foreground: 'hsl(var(--netral-foreground))'
      },
      netralH: {
        DEFAULT: 'hsl(var(--netral-hover))',
        foreground: 'hsl(var(--netral-hover-foreground))'
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    keyframes: {
      'accordion-down': {
        from: {
          height: '0'
        },
        to: {
          height: 'var(--radix-accordion-content-height)'
        }
      },
      'accordion-up': {
        from: {
          height: 'var(--radix-accordion-content-height)'
        },
        to: {
          height: '0'
        }
      }
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out'
    }
  }
},
  plugins: [require("tailwindcss-animate")],
}


