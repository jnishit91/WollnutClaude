// prisma/seed/index.ts
// Database seed runner — populates GPU plans, templates, and AI models

import { PrismaClient } from "@prisma/client";
import { GPU_PLANS_SEED } from "./gpu-plans";
import { TEMPLATES_SEED } from "./templates";
import { AI_MODELS_SEED } from "./models";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── GPU Plans ────────────────────────────
  console.log("📊 Seeding GPU plans...");
  let planCount = 0;
  for (const plan of GPU_PLANS_SEED) {
    await prisma.gPUPlan.upsert({
      where: { e2ePlanId: plan.e2ePlanId },
      update: {
        gpuName: plan.gpuName,
        gpuShortName: plan.gpuShortName,
        vram: plan.vram,
        vcpus: plan.vcpus,
        ram: plan.ram,
        storage: plan.storage,
        infiniband: plan.infiniband,
        e2ePricePerHour: plan.e2ePricePerHour,
        availableCount: plan.availableCount,
        sortOrder: plan.sortOrder,
        category: plan.category,
        // NOTE: wollnutPricePerHour is NOT overwritten on re-seed
        // to preserve admin pricing changes
      },
      create: plan,
    });
    planCount++;
  }
  console.log(`   ✅ ${planCount} GPU plans upserted`);

  // ── Templates ────────────────────────────
  console.log("🧩 Seeding templates...");
  let templateCount = 0;
  for (const template of TEMPLATES_SEED) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: {
        name: template.name,
        description: template.description,
        category: template.category,
        e2eImageId: template.e2eImageId,
        icon: template.icon,
        tags: template.tags,
        includedPackages: template.includedPackages,
        recommendedGpu: template.recommendedGpu,
        minVram: template.minVram,
        featured: template.featured,
        sortOrder: template.sortOrder,
      },
      create: template,
    });
    templateCount++;
  }
  console.log(`   ✅ ${templateCount} templates upserted`);

  // ── AI Models ────────────────────────────
  console.log("🤖 Seeding AI models...");
  let modelCount = 0;
  for (const model of AI_MODELS_SEED) {
    await prisma.aIModel.upsert({
      where: { slug: model.slug },
      update: {
        name: model.name,
        provider: model.provider,
        category: model.category,
        description: model.description,
        parameters: model.parameters,
        contextLength: model.contextLength,
        vramRequired: model.vramRequired,
        recommendedGpu: model.recommendedGpu,
        templateSlug: model.templateSlug,
        huggingFaceId: model.huggingFaceId,
        licenseType: model.licenseType,
        featured: model.featured,
        sortOrder: model.sortOrder,
      },
      create: model,
    });
    modelCount++;
  }
  console.log(`   ✅ ${modelCount} AI models upserted`);

  // ── System settings ──────────────────────
  console.log("⚙️  Seeding system settings...");
  const defaultSettings = [
    { key: "new_user_credits", value: 5.0 },
    { key: "low_credits_threshold", value: 2.0 },
    { key: "min_credits_hours", value: 1 },
    { key: "billing_currency", value: "USD" },
    { key: "platform_status", value: "operational" },
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key, value: setting.value },
    });
  }
  console.log(`   ✅ ${defaultSettings.length} system settings initialized`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
