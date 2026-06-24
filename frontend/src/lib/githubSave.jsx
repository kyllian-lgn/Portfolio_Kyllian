const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
const FILE_PATH = "frontend/src/lib/data.jsx";

export async function saveDataToGithub(newData) {
  // 1. Récupère le SHA du fichier actuel (obligatoire pour le modifier)
  const getRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  const getJson = await getRes.json();
  const sha = getJson.sha;

  // 2. Prépare le nouveau contenu
  const fileContent = `const portfolioData = ${JSON.stringify(newData, null, 2)};\n\nexport default portfolioData;`;
  const encoded = btoa(unescape(encodeURIComponent(fileContent)));

  // 3. Envoie la mise à jour
  const putRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Mise à jour du portfolio via admin",
        content: encoded,
        sha: sha,
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(err.message || "Erreur GitHub");
  }

  return true;
}

export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "portfolio_upload");
  formData.append("api_key", apiKey);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Erreur upload Cloudinary");
  const data = await res.json();
  return data.secure_url;
}

export async function uploadDocumentToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "portfolio_upload");
  formData.append("api_key", apiKey);

  // resource_type "auto" laisse Cloudinary détecter PDF, images, etc.
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Erreur upload Cloudinary");
  const data = await res.json();
  return data.secure_url;
}
