import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Get current date for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format date based on how recent it is
    if (date >= today) {
      // Today - show time only
      return format(date, 'h:mm a');
    } else if (date >= yesterday) {
      // Yesterday - show "Yesterday" with time
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (date.getFullYear() === now.getFullYear()) {
      // Same year - show month and day with time
      return format(date, 'MMM d, h:mm a');
    } else {
      // Different year - show full date with time
      return format(date, 'MMM d, yyyy, h:mm a');
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Returns a color based on the status
 * @param status Order or payment status
 * @param colors Theme colors object
 * @returns Color string
 */
export const getStatusColor = (status: string, colors: any): string => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'delivered':
    case 'success':
    case 'approved':
      return colors.success;
      
    case 'pending':
    case 'processing':
    case 'in transit':
    case 'preparing':
    case 'ready':
      return colors.warning;
      
    case 'cancelled':
    case 'failed':
    case 'rejected':
    case 'error':
      return colors.error;
      
    default:
      return colors.muted;
  }
};

/**
 * Formats a status string to be more user-friendly
 * @param status Order or payment status
 * @returns Formatted status string
 */
export const formatStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'in_transit':
      return 'In Transit';
      
    case 'out_for_delivery':
      return 'Out for Delivery';
      
    default:
      // Capitalize first letter of each word
      return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  }
};

/**
 * Returns a relative time string (e.g., "2 hours ago", "in 5 minutes")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

/**
 * Calculates the estimated delivery time based on distance and traffic conditions
 * @param distanceKm Distance in kilometers
 * @param trafficFactor Traffic factor (1.0 = normal, >1.0 = heavy traffic)
 * @returns Estimated delivery time in minutes
 */
export const calculateEstimatedDeliveryTime = (
  distanceKm: number,
  trafficFactor: number = 1.0
): number => {
  // Base speed: 30 km/h in city areas
  const baseSpeedKmPerHour = 30;
  
  // Calculate time in hours, adjusted for traffic
  const timeHours = (distanceKm / baseSpeedKmPerHour) * trafficFactor;
  
  // Convert to minutes and round up
  return Math.ceil(timeHours * 60);
};

/**
 * Formats a price with currency symbol
 * @param price Price value
 * @param currency Currency code (default: JMD)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = 'JMD'): string => {
  return `$${price.toFixed(2)} ${currency}`;
};