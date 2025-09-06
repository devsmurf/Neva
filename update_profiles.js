// Dashboard'dan oluşturulan kullanıcılar için profile update script
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://wunmkbijqnzsmwfjjymc.supabase.co";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseServiceRole) {
  console.error("SUPABASE_SERVICE_ROLE environment variable gerekli!");
  console.error(
    "Supabase Dashboard > Settings > API > service_role key'ini kopyalayın"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function updateUserProfiles() {
  console.log("Kullanıcı profilleri güncelleniyor...");

  try {
    // Tüm auth kullanıcılarını listele
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Kullanıcıları listeleme hatası:", usersError.message);
      return;
    }

    console.log(`\n📋 Toplam ${users.users.length} kullanıcı bulundu:`);

    for (const user of users.users) {
      console.log(`- ${user.email} (ID: ${user.id})`);

      // Admin kullanıcısı kontrolü
      if (user.email === "admin@test.com") {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          name: "Test Admin",
          role: "admin",
          company_id: null,
        });

        if (profileError) {
          console.error(`❌ Admin profile hatası:`, profileError.message);
        } else {
          console.log("✅ Admin profile güncellendi");
        }
      }

      // Contractor kullanıcısı kontrolü
      if (user.email === "contractor@test.com") {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          name: "Test Contractor",
          role: "user",
          company_id: "550e8400-e29b-41d4-a716-446655440001", // Beta Beton
        });

        if (profileError) {
          console.error(`❌ Contractor profile hatası:`, profileError.message);
        } else {
          console.log("✅ Contractor profile güncellendi");
        }
      }
    }

    console.log("\n🎉 Profile güncellemeleri tamamlandı!");

    // Profiles tablosunu kontrol et
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email, role, company_id")
      .in("email", ["admin@test.com", "contractor@test.com"]);

    if (profilesError) {
      console.error("Profiles kontrol hatası:", profilesError.message);
    } else {
      console.log("\n📊 Güncellenmiş Profiller:");
      console.table(profiles);
    }
  } catch (error) {
    console.error("Genel hata:", error);
  }
}

updateUserProfiles();
