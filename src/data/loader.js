import qs from "qs";
// import { getStrapiURL } from "../lib/utils";


const baseUrl = "http://localhost:1337";

export async function fetchData(url, authToken) {
  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    if (!response.ok) throw new Error("Failed to fetch data");
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } 
}

// Fetch data
export async function getLoginPageData() {
  const url = new URL("/api/login-pages", baseUrl);
  url.search = qs.stringify({
    populate: {
        logo: {
          fields: ["url"] 
        }     
      },
  });


  return await fetchData(url.href);
}

// Fetch about us page data
export async function getAboutUsPageData() {
  const url = new URL("/api/about", baseUrl);
  url.search = qs.stringify({
    populate: {
        content: {
          fields: ["text"] 
        }     
      },
  });

  return await fetchData(url.href);
}

// Fetch global data
// export async function getGlobalPageData() {
//   const url = new URL("/api/global", baseUrl);
//   url.search = qs.stringify({
//     populate: [
//       "header.logo",       
//       "footer.privacyPolicy" 
//     ],
//   });

//   return await fetchData(url.href);
// }



  