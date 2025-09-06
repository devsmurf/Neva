// Supabase Auth kullanıcıları oluşturma script'i
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://wunmkbijqnzsmwfjjymc.supabase.co";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseServiceRole) {
  console.error("❌ SUPABASE_SERVICE_ROLE environment variable gerekli!");
  console.error("Supabase Dashboard > Settings > API > service_role key'ini kopyalayın");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAuthUsers() {
  console.log("🚀 Supabase Auth kullanıcıları oluşturuluyor...");

  try {
    // 1. Admin kullanıcısı oluştur
    console.log("\n👨‍💼 Admin kullanıcısı oluşturuluyor...");
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: "admin@test.com",
      password: "AdminTest123!",
      email_confirm: true,
      user_metadata: {
        name: "Test Admin",
      },
    });

    if (adminError) {
      console.error("❌ Admin kullanıcısı hatası:", adminError.message);
    } else {
      console.log("✅ Admin kullanıcısı oluşturuldu:", adminUser.user.email);
    }

    // 2. Contractor kullanıcısı oluştur
    console.log("\n🏗️ Contractor kullanıcısı oluşturuluyor...");
    const { data: contractorUser, error: contractorError } = await supabase.auth.admin.createUser({
      email: "contractor@test.com", 
      password: "ContractorTest123!",
      email_confirm: true,
      user_metadata: {
        name: "Test Contractor",
      },
    });

    if (contractorError) {
      console.error("❌ Contractor kullanıcısı hatası:", contractorError.message);
    } else {
      console.log("✅ Contractor kullanıcısı oluşturuldu:", contractorUser.user.email);
    }

    // 3. Mevcut kullanıcıları listele
    console.log("\n📋 Tüm kullanıcıları listeleniyor...");
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("❌ Kullanıcı listeleme hatası:", listError.message);
    } else {
      console.log(`\n👥 Toplam ${allUsers.users.length} kullanıcı:`);
      allUsers.users.forEach(user => {
        console.log(`  - ${user.email} (ID: ${user.id})`);
      });
    }

    // 4. Profiles kontrol et
    console.log("\n🔍 Profiles tablosu kontrol ediliyor...");
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email, name, role, company_id");

    if (profilesError) {
      console.error("❌ Profiles hatası:", profilesError.message);
    } else {
      console.log("\n📊 Profiles tablosu:");
      console.table(profiles);
    }

    console.log("\n🎉 İşlem tamamlandı!");
    console.log("\n🔐 TEST BİLGİLERİ:");
    console.log("==================");
    console.log("👨‍💼 ADMIN:");
    console.log("   Email: admin@test.com");
    console.log("   Şifre: AdminTest123!");
    console.log("   URL: /admin/login");
    console.log("");
    console.log("🏗️ CONTRACTOR:");
    console.log("   Email: contractor@test.com");
    console.log("   Şifre: ContractorTest123!");
    console.log("   URL: /contractor/login");

  } catch (error) {
    console.error("💥 Genel hata:", error);
  }
}

createAuthUsers();
