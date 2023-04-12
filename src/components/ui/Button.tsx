import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";

const buttonVariants = cva(
  // first argument is a string containing the base CSS classes that will be applied to the button component
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",

  // second argument is an object that defines the class variations and their associated CSS classes
  {
    // this object defines the different class variations for the variant and size properties
    variants: {
      // each property has its own object with keys representing the variation name and values representing the associated CSS classes
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        ghost: "b-transparent hover:text-slate-900 hover:bg-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    // this object sets the default variations that will be used if no specific variation is provided when using the buttonVariants object
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// defines an interface called ButtonProps, which extends the standard ButtonHTMLAttributes<HTMLButtonElement> interface
// (to include all standard button attributes) and the VariantProps<typeof buttonVariants> interface

// VariantProps is a utility type provided by the class-variance-authority package that extracts the variant prop types from the given buttonVariants object
// This makes sure that the Button component accepts all the standard button props and the variant props defined earlier in the buttonVariants object
// Additionally, a custom prop isLoading is defined, which is an optional boolean value that indicates if the button is in a loading state
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

// defines a new function component called Button with the type FC<ButtonProps>, which means it's a function component that expects props of type ButtonProps
const Button: FC<ButtonProps> = ({
  // destructures the props object, extracting className, children, variant, isLoading, size, and the rest of the button attributes (denoted by ...props)
  className,
  children,
  variant,
  isLoading,
  size,
  ...props
}) => {
  return (
    // component renders a button element
    <button
      // generates appropriate CSS classes based on the variant and size props and merges any additional className provided by parent component
      className={cn(buttonVariants({ variant, size, className }))}
      // button is disabled if isLoading is true
      disabled={isLoading}
      // all other button attributes are passed through using the spread operator
      {...props}
      // inside the button, conditional rendering is used
      // if isLoading is true, the Loader2 component is rendered
      // otherwise, nothing is rendered before the button's children (indicated by the null)
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
