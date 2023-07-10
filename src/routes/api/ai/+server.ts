import { serializeNonPOJOs } from "$lib/tools";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch, url, locals: { company, user } }) {
  try {
    let data = await request.json();
    let u = "anonymous-user";
    if (user) {
      const { id, email, username, name } = user;
      u = JSON.stringify({
        id,
        name,
        username,
        email,
      });
    }
    data = {
      ...data,
      user: u,
      conversation_id: "c_1f04f704a788e6e4",
      site: url.origin,
    };

    const response = await fetch("https://askq-five.vercel.app/api/ai", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());

    return json({ success: true, data: response });
  } catch (error: any) {
    // console.log(error)
    error = serializeNonPOJOs(error);
    return json({ success: false, error });
  }
}

function replaceImagePlaceholders(
  inputString: string,
  imageUrls: string[]
): string {
  const placeholderRegex = /\[Image of \.\.\.\.\.\]/g;
  let index = 0;

  const outputString = inputString.replace(placeholderRegex, () => {
    if (index >= imageUrls.length) {
      return "[Image of ......]";
    }
    return `<img src="${imageUrls[index++]}" alt="Image">`;
  });

  return outputString;
}