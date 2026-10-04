import fs from "node:fs";
import path from "node:path";

const repo = process.env.GITHUB_REPOSITORY || "karannagpaal/pgthane";
const token = process.env.GITHUB_TOKEN;
const sourceDir = process.env.PGTHANE_PHOTO_DIR || "./pgthane-photos";

if (!token) throw new Error("GITHUB_TOKEN is required.");
if (!fs.existsSync(sourceDir)) throw new Error("Photo directory not found: " + sourceDir);

const sourceToTarget: Record<string, string> = {
  "59499.jpg": "01-59499.jpg", "59500.jpg": "02-59500.jpg", "59501.jpg": "03-59501.jpg",
  "59502.jpg": "04-59502.jpg", "59503.jpg": "05-59503.jpg", "59504.jpg": "06-59504.jpg",
  "59505.jpg": "07-59505.jpg", "59506.jpg": "08-59506.jpg", "59507.jpg": "09-59507.jpg",
  "59508.jpg": "10-59508.jpg", "59509.jpg": "11-59509.jpg", "59510.jpg": "12-59510.jpg",
  "59511.jpg": "13-59511.jpg", "59512.jpg": "14-59512.jpg", "59513.jpg": "15-59513.jpg",
  "59514.jpg": "16-59514.jpg", "59515.jpg": "17-59515.jpg", "59516.jpg": "18-59516.jpg",
  "59517.jpg": "19-59517.jpg", "59518.jpg": "20-59518.jpg", "59519.jpg": "21-59519.jpg",
  "59520.jpg": "22-59520.jpg", "59521.jpg": "23-59521.jpg", "59522.jpg": "24-59522.jpg",
  "59523.jpg": "25-59523.jpg", "59524.jpg": "26-59524.jpg", "59525.jpg": "27-59525.jpg",
  "59526.jpg": "28-59526.jpg", "59527.jpg": "29-59527.jpg", "59528.jpg": "30-59528.jpg",
  "Ac PG in Hiranandani estate Thane(1).JPG": "31-ac-pg-in-hiranandani-estate-thane-1.jpg",
  "Ac PG in Hiranandani estate(1).jpeg": "32-ac-pg-in-hiranandani-estate-1.jpg",
  "Double Sharing PG near TCS Olympus Hiranandani Estate(1).jpeg": "33-double-sharing-pg-near-tcs-olympus-hiranandani-estate-1.jpg",
  "Double sharing PG in Hiranandani Estate(1).jpeg": "34-double-sharing-pg-in-hiranandani-estate-1.jpg",
  "PG in Hiranandani Estate Thane west(1).jpeg": "35-pg-in-hiranandani-estate-thane-west-1.jpg",
  "PG in Wagle Estate(2).jpeg": "36-pg-in-wagle-estate-2.jpg",
  "Single room pg in hiranandani estate.jpeg": "37-single-room-pg-in-hiranandani-estate.jpg",
  "Triple Sharing PG in Hiranandani Estate(1).jpeg": "38-triple-sharing-pg-in-hiranandani-estate-1.jpg",
  "Triple Sharing room in Hiranandani estate(1).jpeg": "39-triple-sharing-room-in-hiranandani-estate-1.jpg",
  "pic2(2).jpeg": "40-pic2-2.jpg",
  "pic3(1).jpeg": "41-pic3-1.jpg"
};

async function api(url: string, init: RequestInit = {}) {
  const res = await fetch("https://api.github.com" + url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const head = await api("/repos/" + repo + "/git/ref/heads/main");
const commit = await api("/repos/" + repo + "/git/commits/" + head.object.sha);

const treeEntries = [];
for (const [source, target] of Object.entries(sourceToTarget)) {
  const file = path.join(sourceDir, source);
  if (!fs.existsSync(file)) throw new Error("Missing source photo: " + source);
  const blob = await api("/repos/" + repo + "/git/blobs", {
    method: "POST",
    body: JSON.stringify({ content: fs.readFileSync(file).toString("base64"), encoding: "base64" })
  });
  treeEntries.push({ path: "public/inventory/" + target, mode: "100644", type: "blob", sha: blob.sha });
  console.log("uploaded blob:", source);
}

const tree = await api("/repos/" + repo + "/git/trees", {
  method: "POST",
  body: JSON.stringify({ base_tree: commit.tree.sha, tree: treeEntries })
});
const newCommit = await api("/repos/" + repo + "/git/commits", {
  method: "POST",
  body: JSON.stringify({
    message: "Add verified source photo inventory",
    tree: tree.sha,
    parents: [head.object.sha]
  })
});
await api("/repos/" + repo + "/git/refs/heads/main", {
  method: "PATCH",
  body: JSON.stringify({ sha: newCommit.sha, force: false })
});
console.log("Inventory upload complete:", newCommit.sha);
