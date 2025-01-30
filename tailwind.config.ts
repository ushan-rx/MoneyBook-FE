import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			card: 'hsl(var(--card))',
			cardForeground: 'hsl(var(--card-foreground))',
			popover: 'hsl(var(--popover))',
			popoverForeground: 'hsl(var(--popover-foreground))',
			primary: 'hsl(var(--primary))',
			primaryForeground: 'hsl(var(--primary-foreground))',
			secondary: 'hsl(var(--secondary))',
			secondaryForeground: 'hsl(var(--secondary-foreground))',
			muted: 'hsl(var(--muted))',
			mutedForeground: 'hsl(var(--muted-foreground))',
			accent: 'hsl(var(--accent))',
			accentForeground: 'hsl(var(--accent-foreground))',
			destructive: 'hsl(var(--destructive))',
			destructiveForeground: 'hsl(var(--destructive-foreground))',
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			radius: 'var(--radius)',
			chart1: 'hsl(var(--chart-1))',
			chart2: 'hsl(var(--chart-2))',
			chart3: 'hsl(var(--chart-3))',
			chart4: 'hsl(var(--chart-4))',
			chart5: 'hsl(var(--chart-5))',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), heroui(
	{
		layout: {
			disabledOpacity: "0.3", // opacity-[0.3]
			radius: {
				small: 'calc(var(--radius) - 4px)',
				medium: 'calc(var(--radius) - 2px)',
				large: 'var(--radius)',
			},
			borderWidth: {
			  small: "1px", // border-small
			  medium: "1px", // border-medium
			  large: "2px", // border-large
			},
			fontSize: {
				tiny: "0.75rem", // text-tiny
				small: "0.875rem", // text-small
				medium: "1rem", // text-medium
				large: "1.728rem", // text-large
			  },
			  lineHeight: {
				tiny: "1rem", // text-tiny
				small: "1.25rem", // text-small
				medium: "1.5rem", // text-medium
				large: "1.75rem", // text-large
			  },
		  },
		themes:{
			"light":{
				extend: "dark",
				colors: {
						background: "#fffefe",
						foreground: "#020817",
						primary: {
							50: "#D6E4FF",
							100: "#ADC7FF",
							200: "#83A8FF",
							300: "#658FFF",
							500: "#3265FF",
							600: "#244DDB",
							700: "#1938B7",
							800: "#0F2693",
							900: "#091A7A",
						  DEFAULT: "#3265FF",
						  foreground: "#ffffff",
						},
						focus: "#F182F6",
					  },
			}
		}
	}
  )],
} satisfies Config;
