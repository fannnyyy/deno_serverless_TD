function handlePreFlightRequest(): Response {
  return new Response("Preflight OK!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
    },
  });
}

async function handler(_req: Request): Promise<Response> {
  if (_req.method === "OPTIONS") {
    return handlePreFlightRequest(); 
  }

  const url = new URL(_req.url);
  const word = url.searchParams.get("value"); // récupère le paramètre "value"

  if (!word) {
    return new Response(JSON.stringify({ error: "Missing ?value parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const similarityRequestBody = JSON.stringify({
    word1: "centrale",
    word2: word,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body: similarityRequestBody,
  };

  try {
    const response = await fetch("https://word2vec.nicolasfley.fr/similarity", requestOptions);

    if (!response.ok) {
      return new Response(`Error: ${response.statusText}`, {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const result = await response.json();
    console.log("Similarity result:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

Deno.serve(handler);
