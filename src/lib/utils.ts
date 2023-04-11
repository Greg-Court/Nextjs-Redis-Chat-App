import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// cn function is defined as a utility function that combines the clsx and twMerge functions
// clsx is used to merge multiple class names into a single string

// twMerge is a utility provided by the tailwind-merge package that merges multiple Tailwind CSS classes
// ensuring that the correct order is maintained and that conflicting classes are handled appropriately.
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}