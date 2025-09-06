// Test kullanıcıları oluşturmak için Node.js script
// NOT: Bu script'i çalıştırmadan önce .env dosyasında SUPABASE_SERVICE_ROLE key'ini ayarlayın

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://wunmkbijqnzsmwfjjymc.supabase.co";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE; // Dashboard'dan Service Role key'i alın

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

async function createTestUsers() {
  console.log("Test kullanıcıları oluşturuluyor...");

  try {
    // 1. Admin kullanıcısı oluştur
    console.log("\n1. Admin kullanıcısı oluşturuluyor...");
    const { data: adminUser, error: adminError } =
      await supabase.auth.admin.createUser({
        email: "admin@test.com",
        password: "AdminTest123!@#",
        email_confirm: true,
        user_metadata: {
          name: "Test Admin",
        },
      });

    if (adminError) {
      console.error("Admin kullanıcısı oluşturma hatası:", adminError.message);
      console.error("Hata detayı:", JSON.stringify(adminError, null, 2));
    } else {
      console.log("✅ Admin kullanıcısı oluşturuldu:", adminUser.user.email);

      // Admin profile oluştur
      const { error: profileError } = await supabase.from("profiles").insert({
        id: adminUser.user.id,
        email: "admin@test.com",
        name: "Test Admin",
        role: "admin",
        company_id: null,
      });

      if (profileError) {
        console.error("Admin profile hatası:", profileError.message);
      } else {
        console.log("✅ Admin profile oluşturuldu");
      }
    }

    // 2. Contractor kullanıcısı oluştur
    console.log("\n2. Contractor kullanıcısı oluşturuluyor...");
    const { data: contractorUser, error: contractorError } =
      await supabase.auth.admin.createUser({
        email: "contractor@test.com",
        password: "ContractorTest123!@#",
        email_confirm: true,
        user_metadata: {
          name: "Test Contractor",
        },
      });

    if (contractorError) {
      console.error(
        "Contractor kullanıcısı oluşturma hatası:",
        contractorError.message
      );
      console.error("Hata detayı:", JSON.stringify(contractorError, null, 2));
    } else {
      console.log(
        "✅ Contractor kullanıcısı oluşturuldu:",
        contractorUser.user.email
      );

      // Contractor profile oluştur (Beta Beton şirketine bağlı)
      const { error: profileError } = await supabase.from("profiles").insert({
        id: contractorUser.user.id,
        email: "contractor@test.com",
        name: "Test Contractor",
        role: "user",
        company_id: "550e8400-e29b-41d4-a716-446655440001", // Beta Beton
      });

      if (profileError) {
        console.error("Contractor profile hatası:", profileError.message);
      } else {
        console.log("✅ Contractor profile oluşturuldu");
      }
    }

    console.log("\n🎉 Test kullanıcıları başarıyla oluşturuldu!");
    console.log("\n📝 GİRİŞ BİLGİLERİ:");
    console.log("=====================");
    console.log("🔐 ADMIN PANELİ:");
    console.log("Email: admin@test.com");
    console.log("Şifre: AdminTest123!@#");
    console.log("URL: /admin/login");
    console.log("");
    console.log("🏗️ CONTRACTOR PANELİ:");
    console.log("Email: contractor@test.com");
    console.log("Şifre: ContractorTest123!@#");
    console.log("URL: /contractor/login");
    console.log("Şirket: Beta Beton");
  } catch (error) {
    console.error("Genel hata:", error);
  }
}

createTestUsers();
