import {
  HeadersFunction,
  json,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import React from "react";
import { IBlogPostFields } from "~/@types/generated/contentful";
import { MarkdownContainer } from "~/components/markdown-container";
import type { EntryCollection } from "contentful";
import { getPreviewImage } from "~/utils/contentful.server";

type LoaderData = {
  post: string;
  date: string;
  title: string;
  previewImage?: { title: string; url: string };
  remoteUrl?: string;
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.title,
    "og:image": data.previewImage?.url,
    "og:title": data.title,
  };
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  if (loaderHeaders.get("Link")) {
    return {
      Link: loaderHeaders.get("Link"),
    };
  }
  return {};
};

export const loader: LoaderFunction = async ({ params }) => {
  const searchURL = new URL(
    "https://cdn.contentful.com/spaces/bymoug4xp0m3/environments/master/entries"
  );
  searchURL.searchParams.append("content_type", "blogPost");
  searchURL.searchParams.append("fields.slug", `${params.slug}`);
  const content: EntryCollection<IBlogPostFields> = await fetch(
    searchURL.toString(),
    {
      headers: {
        authorization: `Bearer ${process.env.CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN}`,
      },
    }
  ).then((response) => response.json());

  if (content.total === 0) {
    throw new Response("", { status: 404 });
  }
  try {
    const headers: HeadersInit = {};
    if (content.items[0].fields.remoteUrl) {
      headers.Link = `<${content.items[0].fields.remoteUrl}>; rel="canonical"`;
    }

    return json(
      {
        title: content.items[0].fields.title,
        post: content.items[0].fields.post,
        date: content.items[0].fields.publishedDate,
        previewImage: getPreviewImage(content, content.items[0].sys.id),
        remoteUrl: content.items[0].fields.remoteUrl
      },
      { headers }
    );
  } catch (error) {
    throw new Error(JSON.stringify(content, null, 2));
  }
};

export default function BlogPost() {
  const data = useLoaderData<LoaderData>();

  return (
    <article className="prose prose-zinc dark:prose-invert prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline m-auto mb-16">
      <h1 className="mb-2">{data.title}</h1>
      <time
        dateTime={data.date}
        className="block mb-10 text-xl dark:text-zinc-400 text-zinc-500"
      >
        {new Date(data.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      {data.remoteUrl ? <p className="italic text-sm">This blog post was originally posted to <a href={data.remoteUrl}>{data.remoteUrl}</a></p> : null}
      {data.previewImage ? (
        <img src={data.previewImage.url} title={data.previewImage.title} />
      ) : null}
      <MarkdownContainer>{data.post}</MarkdownContainer>
    </article>
  );
}
