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
    }).then(async (res) => {
      let result = await res.json();
      let images = result?.images;
      let answer = replaceImagePlaceholders(result?.answer, images);
      result = {
        ...result,
        images,
        answer,
      };
      return result;
    });

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
  const placeholderRegex = /\[Image of ([^\]]+)\]/g;

  const outputString = inputString
    .replace(placeholderRegex, (_, placeholder) => {
      const imageUrl = imageUrls.shift() || "";
      return `
      <div class="bg-white rounded-lg shadow-lg p-4">
        <img src="${imageUrl}" alt="${placeholder}" class="w-full h-auto rounded-lg">
      </div>
    `;
    })
    .replace(/\*{2}([^*]+)\*{2}/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return outputString;
}
