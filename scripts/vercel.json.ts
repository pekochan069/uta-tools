import { siteConfig } from "../src/config";
import { collections } from "../src/lib/contents";

let vercelJson = `{
  "redirects": [\n`;

let headers = `  "headers": [
    {
      "source": "/node_modules/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    },
    {
      "source": "/src/components/contents/tools/converters/Images/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    },\n`;
siteConfig.locales.forEach((locale, i) => {
  headers += `    {
      "source": "/${locale}/tools/converters/images",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }`;

  if (i === siteConfig.locales.length - 1) {
    headers += "\n  ]\n";
  } else {
    headers += ",\n";
  }
});

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

  vercelJson += "  ],\n";
  vercelJson += headers;
  vercelJson += "}";

  await Bun.write("vercel.json", vercelJson);
}

await main();
