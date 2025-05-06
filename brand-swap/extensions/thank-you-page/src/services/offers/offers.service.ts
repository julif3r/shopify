
import {
  ApiResponse,
  QueryBundle,
  QueryCustomVoucher,
  QueryParams,
  QueryPostEmail,
  QueryPostOfferView,
  QuerySaveEmail,
  TrackingParams,
  TrackingShare,
} from "../../types/global.types";


export async function postTagEmailOffer(
  data: QuerySaveEmail,
  token: string,
): Promise<Response> {
  return await fetch(`${process.env.SHOPIFY_APP_TRACKAPI_URL}/tracking/emailoffer`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}


export async function postOfferView(
  data: QueryPostOfferView,
  token: string,
): Promise<Response> {
  return await fetch(`${process.env.SHOPIFY_APP_TRACKAPI_URL}/tracking/offerview`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}


export async function getTrackingEvent(
  data: TrackingParams,
  token: string,
): Promise<any> {
  const url = new URL(`${process.env.SHOPIFY_APP_TRACKAPI_URL}/tracking`);

  for (const [key, value] of Object.entries(data)) {
    value && url.searchParams.set(key, value);
  }
  return await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}
