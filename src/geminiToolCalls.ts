//@ts-nocheck

import {
  checkSeatAndBook,
  getAvailableBuses,
  getAvailableSeats,
  getBookingById,
  isSeatAvailable,
} from "./database";

// Define the function declarations that Gemini can call
export const functionDeclarations = [
  {
    name: "check_available_buses",
    description: "Check available buses",
    parameters: {
      type: "OBJECT",
      properties: {
        starting_point: { type: "STRING", description: "Origin city" },
        destination: {
          type: "STRING",
          description: "Destination city (optional)",
        },
        date: {
          type: "STRING",
          description: "Travel date (YYYY-MM-DD format) (optional)",
        },
      },
      required: ["starting_point"],
    },
  },
  {
    name: "check_available_seats",
    description: "Check available seats for a specific bus",
    parameters: {
      type: "OBJECT",
      properties: {
        starting_point: { type: "STRING", description: "Origin city" },
        destination: { type: "STRING", description: "Destination city" },
        date: {
          type: "STRING",
          description: "Travel date (YYYY-MM-DD format)",
        },
        departure_time: {
          type: "STRING",
          description: "Departure time (HH:MM format)",
        },
      },
      required: ["starting_point", "destination", "date", "departure_time"],
    },
  },
  {
    name: "check_seat_availability",
    description: "Check if a specific seat is available",
    parameters: {
      type: "OBJECT",
      properties: {
        starting_point: { type: "STRING", description: "Origin city" },
        destination: { type: "STRING", description: "Destination city" },
        date: {
          type: "STRING",
          description: "Travel date (YYYY-MM-DD format)",
        },
        departure_time: {
          type: "STRING",
          description: "Departure time (HH:MM format)",
        },
        seat_number: {
          type: "STRING",
          description: "Seat identifier (e.g., '1A')",
        },
      },
      required: [
        "starting_point",
        "destination",
        "date",
        "departure_time",
        "seat_number",
      ],
    },
  },
  {
    name: "make_reservation",
    description: "Make a seat reservation",
    parameters: {
      type: "OBJECT",
      properties: {
        starting_point: { type: "STRING", description: "Origin city" },
        destination: { type: "STRING", description: "Destination city" },
        date: {
          type: "STRING",
          description: "Travel date (YYYY-MM-DD format)",
        },
        seat_number: {
          type: "STRING",
          description: "Seat identifier (e.g., '1A')",
        },
        customer_name: {
          type: "STRING",
          description: "Customer's full name",
        },
        phone_number: {
          type: "STRING",
          description: "Customer's phone number",
        },
        departure_time: {
          type: "STRING",
          description: "Departure time (HH:MM format)",
        },
      },
      required: [
        "starting_point",
        "destination",
        "date",
        "seat_number",
        "customer_name",
        "phone_number",
        "departure_time",
      ],
    },
  },
  {
    name: "get_booking_details",
    description: "Get details of an existing booking by ID",
    parameters: {
      type: "OBJECT",
      properties: {
        booking_id: {
          type: "STRING",
          description: "The booking ID to look up",
        },
      },
      required: ["booking_id"],
    },
  },
];

// Define the function implementations
export const functions_obj = {
  check_available_buses: async ({ starting_point, destination, date }) => {
    console.log(`Calling getAvailableBuses with:`, {
      starting_point,
      destination,
      date,
    });
    try {
      // Handle optional parameters correctly
      const result = await getAvailableBuses(starting_point, destination, date);
      console.log(`getAvailableBuses result:`, result);
      return result;
    } catch (error) {
      console.error("Error in check_available_buses:", error);
      return { error: "Failed to retrieve bus schedules" };
    }
  },

  check_available_seats: async ({
    starting_point,
    destination,
    date,
    departure_time,
  }) => {
    try {
      return await getAvailableSeats(
        starting_point,
        destination,
        date,
        departure_time
      );
    } catch (error) {
      console.error("Error in check_available_seats:", error);
      return { error: "Failed to retrieve available seats" };
    }
  },

  check_seat_availability: async ({
    starting_point,
    destination,
    date,
    departure_time,
    seat_number,
  }) => {
    try {
      return await isSeatAvailable(
        starting_point,
        destination,
        date,
        departure_time,
        seat_number
      );
    } catch (error) {
      console.error("Error in check_seat_availability:", error);
      return { error: "Failed to check seat availability" };
    }
  },

  make_reservation: async ({
    starting_point,
    destination,
    date,
    seat_number,
    customer_name,
    phone_number,
    departure_time,
  }) => {
    try {
      return await checkSeatAndBook({
        starting_point,
        destination,
        date,
        seat_number,
        customer_name,
        phone_number,
        departure_time,
      });
    } catch (error) {
      console.error("Error in make_reservation:", error);
      return {
        success: false,
        error_message: "Failed to complete booking",
      };
    }
  },

  get_booking_details: async ({ booking_id }) => {
    try {
      return await getBookingById(booking_id);
    } catch (error) {
      console.error("Error in get_booking_details:", error);
      return { error: "Failed to retrieve booking details" };
    }
  },
};
