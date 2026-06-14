import { Location } from "./types";

// Hardcoded dataset of notable Abuja landmarks — no database needed for the MVP
const LOCATIONS: Location[] = [
  {
    id: "1",
    name: "Aso Rock",
    description:
      "A massive 400-metre monolith that dominates Abuja's skyline and gives the city its distinctive character. The rock is a defining symbol of Nigeria's capital.",
    category: "landmark",
    lat: 9.0765,
    lng: 7.4981,
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
    address: "Aso Rock, Abuja, FCT, Nigeria",
  },
  {
    id: "2",
    name: "Aso Rock Presidential Villa",
    description:
      "The official residence and principal workplace of the President of Nigeria, set against the backdrop of Aso Rock. An iconic seat of power in Africa.",
    category: "landmark",
    lat: 9.0820,
    lng: 7.4957,
    imageUrl: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800",
    address: "Three Arms Zone, Abuja, FCT, Nigeria",
  },
  {
    id: "3",
    name: "Nigerian National Mosque",
    description:
      "One of the largest mosques in sub-Saharan Africa, with golden domes and minarets that are visible from across central Abuja. Built to hold over 100,000 worshippers.",
    category: "landmark",
    lat: 9.0579,
    lng: 7.4951,
    imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800",
    address: "Independence Avenue, Abuja, FCT, Nigeria",
  },
  {
    id: "4",
    name: "Nigerian National Christian Centre",
    description:
      "A striking modernist cathedral at the heart of Abuja's central area, designed to serve as the national place of worship for Nigerian Christians.",
    category: "landmark",
    lat: 9.0584,
    lng: 7.5004,
    imageUrl: "https://images.unsplash.com/photo-1548535651-0b3d5fb5e9e1?w=800",
    address: "Independence Avenue, Abuja, FCT, Nigeria",
  },
  {
    id: "5",
    name: "Millennium Park",
    description:
      "Abuja's largest public park, opened in 2003 by Queen Elizabeth II. Features vast lawns, walking paths, a fountain, and sweeping views of Aso Rock.",
    category: "park",
    lat: 9.0458,
    lng: 7.5003,
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
    address: "Millennium Park, Maitama, Abuja, FCT, Nigeria",
  },
  {
    id: "6",
    name: "Arts and Crafts Village",
    description:
      "A vibrant open-air market where artisans from across Nigeria sell traditional crafts, carvings, textiles, and jewellery. A great place to find authentic Nigerian souvenirs.",
    category: "market",
    lat: 9.0556,
    lng: 7.4867,
    imageUrl: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800",
    address: "Area 10, Garki, Abuja, FCT, Nigeria",
  },
  {
    id: "7",
    name: "National Museum Abuja",
    description:
      "Houses artefacts tracing Nigeria's pre-colonial, colonial, and post-independence history. Includes traditional costumes, bronze works, and ceremonial objects.",
    category: "museum",
    lat: 9.0508,
    lng: 7.5173,
    imageUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800",
    address: "Area 1, Garki, Abuja, FCT, Nigeria",
  },
  {
    id: "8",
    name: "Wuse Market",
    description:
      "The largest and busiest market in Abuja, offering everything from fresh produce and spices to electronics and fabrics. A sensory overload in the best way.",
    category: "market",
    lat: 9.0697,
    lng: 7.4696,
    imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800",
    address: "Wuse Zone 5, Abuja, FCT, Nigeria",
  },
  {
    id: "9",
    name: "Jabi Lake",
    description:
      "A popular recreational lake in the heart of Abuja surrounded by restaurants and leisure facilities. Visitors enjoy boat rides, waterfront dining, and evening strolls.",
    category: "park",
    lat: 9.0795,
    lng: 7.4374,
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    address: "Jabi, Abuja, FCT, Nigeria",
  },
  {
    id: "10",
    name: "Transcorp Hilton Abuja",
    description:
      "Nigeria's most iconic five-star hotel and a central hub for diplomats, business travellers, and heads of state. Features multiple restaurants, pools, and panoramic city views.",
    category: "restaurant",
    lat: 9.0611,
    lng: 7.4929,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    address: "1 Aguiyi Ironsi St, Maitama, Abuja, FCT, Nigeria",
  },
];

// The Worker's single entry point — Cloudflare calls fetch() for every incoming HTTP request
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Attach CORS + content-type headers to every response so the React Native client can call this from any origin
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    // Respond to browser preflight checks (OPTIONS) before the real GET request is sent
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Route: GET /locations — return the full list of locations for the map screen
    if (url.pathname === "/locations") {
      return Response.json(LOCATIONS, { headers: corsHeaders });
    }

    // Route: GET /locations/:id — extract the id segment and look up a single location
    const match = url.pathname.match(/^\/locations\/(.+)$/);
    if (match) {
      const loc = LOCATIONS.find((l) => l.id === match[1]);

      // Return 404 with a JSON body if no location matches the given id
      if (!loc) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: corsHeaders,
        });
      }
      return Response.json(loc, { headers: corsHeaders });
    }

    // Fallback: any unrecognised path returns 404 so the client gets a consistent JSON error shape
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: corsHeaders,
    });
  },
};
