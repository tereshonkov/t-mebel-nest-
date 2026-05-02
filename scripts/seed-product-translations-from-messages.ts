/**
 * Upsert ProductTranslation from Next-style messages (keys data_<productId>).
 * Run from Nest repo root: npm run seed:translations
 *
 * Message sources (first match wins):
 * 1. T_MEBEL_MESSAGES_DIR
 * 2. scripts/i18n-snapshot/{uk,ru,en}.json (committed snapshot / manual export)
 * 3. sibling ../../t-mebel-next/src/messages
 *
 * Requires DATABASE_URL in .env
 */
import { PrismaClient, Locale } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function messagesDir(): string {
  const fromEnv = process.env.T_MEBEL_MESSAGES_DIR;
  if (fromEnv) return path.resolve(fromEnv);

  const snapshotDir = path.resolve(__dirname, 'i18n-snapshot');
  if (
    fs.existsSync(path.join(snapshotDir, 'uk.json')) &&
    fs.existsSync(path.join(snapshotDir, 'ru.json')) &&
    fs.existsSync(path.join(snapshotDir, 'en.json'))
  ) {
    return snapshotDir;
  }

  return path.resolve(__dirname, '../../t-mebel-next/src/messages');
}

async function upsertFromLocaleFile(locale: Locale, filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw) as Record<string, unknown>;

  let upserts = 0;
  let skippedNoProduct = 0;

  for (const [key, val] of Object.entries(json)) {
    if (!key.startsWith('data_')) continue;
    const productId = key.slice('data_'.length);
    if (!productId) continue;

    const row = val as {
      title?: string;
      description?: string;
      titleSeo?: string;
    };
    if (
      typeof row?.title !== 'string' ||
      typeof row?.description !== 'string' ||
      !row.title.trim() ||
      !row.description.trim()
    ) {
      continue;
    }

    const exists = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!exists) {
      skippedNoProduct++;
      continue;
    }

    await prisma.productTranslation.upsert({
      where: {
        productId_locale: {
          productId,
          locale,
        },
      },
      create: {
        productId,
        locale,
        title: row.title.trim(),
        description: row.description.trim(),
        titleSeo: row.titleSeo?.trim() ? row.titleSeo.trim() : null,
      },
      update: {
        title: row.title.trim(),
        description: row.description.trim(),
        titleSeo: row.titleSeo?.trim() ? row.titleSeo.trim() : null,
      },
    });
    upserts++;
  }

  return { upserts, skippedNoProduct };
}

async function main() {
  const dir = messagesDir();
  const summary: Record<string, { upserts: number; skippedNoProduct: number }> =
    {};

  for (const loc of [Locale.uk, Locale.ru, Locale.en]) {
    const file = path.join(dir, `${loc}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`Skip missing file: ${file}`);
      continue;
    }
    summary[loc] = await upsertFromLocaleFile(loc, file);
    console.log(`${loc}: upserts=${summary[loc].upserts}, noProduct=${summary[loc].skippedNoProduct}`);
  }

  console.log('Done.', summary);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
