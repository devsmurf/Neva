// Clear old session cookies for migration
console.log("🧹 Clearing old session cookies...");

// Clear old neva-session cookie
document.cookie =
  "neva-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

// Clear any other old cookies
const cookies = document.cookie.split(";");
cookies.forEach((cookie) => {
  const [name] = cookie.trim().split("=");
  if (name && name !== "sb-wunmkbijqnzsmwfjjymc-auth-token") {
    console.log("🗑️ Clearing old cookie:", name);
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
});

console.log("✅ Old cookies cleared");

// Reload page to apply changes
setTimeout(() => {
  window.location.reload();
}, 1000);



