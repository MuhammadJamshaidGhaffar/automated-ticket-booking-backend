//@ts-nocheck

import { v4 as uuidv4 } from "uuid";

// Simple booking details interface
interface BookingRequest {
  starting_point: string;
  destination: string;
  date: string;
  seat_number: string;
  customer_name: string;
  phone_number: string;
  departure_time?: string;
}

interface BookingResponse {
  success: boolean;
  booking_id?: string;
  confirmation_code?: string;
  error_message?: string;
}

// New data structure
interface BusRoute {
  origin: string;
  destination: string;
  date: string;
  schedules: BusSchedule[];
}

// Enhanced dummy data
const busRoutes: BusRoute[] = [
  {
    origin: "Karachi",
    destination: "Lahore",
    date: "2025-03-20",
    schedules: [
      {
        departure_time: "08:00",
        bus_type: "Business",
        duration: "14h 30m",
        fare: 4500,
      },
      {
        departure_time: "22:30",
        bus_type: "VIP",
        duration: "13h 45m",
        fare: 6000,
      },
    ],
  },
  {
    origin: "Lahore",
    destination: "Islamabad",
    date: "2025-03-21",
    schedules: [
      {
        departure_time: "09:00",
        bus_type: "Economy",
        duration: "5h 15m",
        fare: 1500,
      },
    ],
  },
];

// Enhanced seat data
const seatData: Record<string, string[]> = {
  "Karachi_Lahore_2025-03-20_08:00": ["1A", "1B", "1C", "2A"],
  "Karachi_Lahore_2025-03-20_22:30": ["1A", "2B", "3C"],
  "Lahore_Islamabad_2025-03-21_09:00": ["1A", "1B", "2A"],
};

// Store completed bookings
const bookings: Record<
  string,
  BookingRequest & { booking_id: string; confirmation_code: string }
> = {};

/**
 * Check seat availability and make reservation
 * @param bookingRequest - The booking request details
 * @returns Booking response with success/failure and booking details
 */
export async function checkSeatAndBook(
  bookingRequest: BookingRequest
): Promise<BookingResponse> {
  // Simulate network delay (500ms-1.5s)
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  // Validate required fields
  if (
    !bookingRequest.starting_point ||
    !bookingRequest.destination ||
    !bookingRequest.date ||
    !bookingRequest.seat_number ||
    !bookingRequest.customer_name ||
    !bookingRequest.phone_number ||
    !bookingRequest.departure_time
  ) {
    return {
      success: false,
      error_message: "Missing required booking information",
    };
  }

  // Create route key for checking availability
  const routeKey = `${bookingRequest.starting_point}_${bookingRequest.destination}_${bookingRequest.date}_${bookingRequest.departure_time}`;

  // Check if route exists
  if (!seatData[routeKey]) {
    return {
      success: false,
      error_message: "No buses available for selected route and date/time",
    };
  }

  // Check if seat is available
  const seatIndex = seatData[routeKey].indexOf(bookingRequest.seat_number);
  if (seatIndex === -1) {
    return {
      success: false,
      error_message: "Selected seat is not available",
    };
  }

  // Remove seat from available seats (mark as booked)
  seatData[routeKey].splice(seatIndex, 1);

  // Generate booking ID and confirmation code
  const booking_id = uuidv4();
  const confirmation_code = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  // Save booking
  bookings[booking_id] = {
    ...bookingRequest,
    booking_id,
    confirmation_code,
  };

  return {
    success: true,
    booking_id,
    confirmation_code,
  };
}

/**
 * Check if specific seat is available
 * @param starting_point Origin city
 * @param destination Destination city
 * @param date Travel date (YYYY-MM-DD)
 * @param departure_time Departure time (HH:MM)
 * @param seat_number Seat identifier (e.g., "1A")
 * @returns Boolean indicating if seat is available
 */
export async function isSeatAvailable(
  starting_point: string,
  destination: string,
  date: string,
  departure_time: string,
  seat_number: string
): Promise<boolean> {
  // Add small delay to simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routeKey = `${starting_point}_${destination}_${date}_${departure_time}`;

  // Check if route exists
  if (!seatData[routeKey]) {
    return false; // Route doesn't exist
  }

  // Check if seat exists in available seats
  return seatData[routeKey].includes(seat_number);
}

/**
 * Get all available seats for a specific bus
 * @param starting_point Origin city
 * @param destination Destination city
 * @param date Travel date (YYYY-MM-DD)
 * @param departure_time Departure time (HH:MM)
 * @returns Array of available seat numbers
 */
export async function getAvailableSeats(
  starting_point: string,
  destination: string,
  date: string,
  departure_time: string
): Promise<string[]> {
  // Add small delay to simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  const routeKey = `${starting_point}_${destination}_${date}_${departure_time}`;

  // Return empty array if route doesn't exist
  if (!seatData[routeKey]) {
    return [];
  }

  // Return copy of available seats array
  return [...seatData[routeKey]];
}

/**
 * Get all available buses with their times
 * @param starting_point Origin city (required)
 * @param destination Destination city (optional)
 * @param date Travel date (YYYY-MM-DD) (optional)
 * @returns Array of available buses with schedules and seat counts
 */
export async function getAvailableBuses(
  starting_point?: string,
  destination?: string,
  date?: string
): Promise<
  Array<
    BusSchedule & {
      available_seats: number;
      origin: string;
      destination: string;
      date: string;
    }
  >
> {
  return busRoutes
    .filter(
      (route) =>
        (!starting_point || route.origin === starting_point) &&
        (!destination || route.destination === destination) &&
        (!date || route.date === date)
    )
    .flatMap((route) =>
      route.schedules.map((schedule) => ({
        ...schedule,
        available_seats:
          seatData[
            `${route.origin}_${route.destination}_${route.date}_${schedule.departure_time}`
          ]?.length || 0,
        origin: route.origin,
        destination: route.destination,
        date: route.date,
      }))
    );
}

/**
 * Get booking details by booking ID
 * @param bookingId The booking ID to look up
 * @returns The booking details or null if not found
 */
export async function getBookingById(bookingId: string) {
  // Add small delay to simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  return bookings[bookingId] || null;
}
