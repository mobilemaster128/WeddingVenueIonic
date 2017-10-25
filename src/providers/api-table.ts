export namespace API {
    
  export const siteURL = "https://www.worldclassweddingvenues.com";
  let baseURL =
    //"https://www.worldclassweddingvenues.com/Specdev/WeddingVenues/Service/";
    "Service/";

  export const DoSearch = baseURL + "Methods.aspx?method=DoSearch";
  export const GetBookingEval = baseURL + "Methods.aspx?method=GetBookingEval";
  export const DoBooking = baseURL + "Methods.aspx?method=DoBooking";
  export const GetVenueCalendar =
    baseURL + "Methods.aspx?method=GetVenueCalendar";
  export const GetVenueDetails =
    baseURL + "Methods.aspx?method=GetVenueDetails";
  export const GetKeywords = baseURL + "Methods.aspx?method=GetKeywords";
}
