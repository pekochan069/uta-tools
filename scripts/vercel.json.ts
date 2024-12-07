import { siteConfig } from "../src/config";
import { collections } from "../src/lib/contents";

let vercelJson = `{
  "redirects": [
    {
      "source": "/",
      "destination": "/${siteConfig.defaultLocale}",
      "statusCode": 301
    },\n`;

async function main() {
  const pathnames = collections.reduce((acc, collection) => {
    const collectionSlug = collection.slug;
    collection.categories.forEach((category) => {
      const categorySlug = category.slug;
      category.contents.forEach((content) => {
        acc.push(`/${collectionSlug}/${categorySlug}/${content.slug}`);
      });
    });
    return acc;
  }, [] as string[]);

  pathnames.forEach((path, i) => {
    vercelJson += `    {
      "source": "${path}",
      "destination": "/${siteConfig.defaultLocale}${path}"
    }`;

    if (i === pathnames.length - 1) {
      vercelJson += "\n";
    } else {
      vercelJson += ",\n";
    }
  });

  vercelJson += "  ]\n";
  vercelJson += "}";

  await Bun.write("vercel.json", vercelJson);
}

await main();
