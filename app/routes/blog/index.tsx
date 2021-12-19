import { Link, LoaderFunction, useLoaderData } from "remix";
import React from "react";
import { IBlogPostFields } from "~/@types/generated/contentful";
import type { EntryCollection } from "contentful";
import { parseISO, format } from "date-fns";
import { getPreviewImage } from "~/utils/contentful.server";

type LoaderData = {
  posts: {
    title: string;
    slug: string;
    date: string;
    previewImage?: {
      title: string;
      url: string;
    };
  }[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const searchURL = new URL(
    "https://cdn.contentful.com/spaces/bymoug4xp0m3/environments/master/entries"
  );
  searchURL.searchParams.append("content_type", "blogPost");
  searchURL.searchParams.append("order", "-fields.publishedDate");

  const content: EntryCollection<IBlogPostFields> = await fetch(
    searchURL.toString(),
    {
      headers: {
        authorization: `Bearer ${process.env.CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN}`,
      },
    }
  ).then((response) => response.json());

  return {
    posts: content.items.map((post) => {
      return {
        title: post.fields.title,
        slug: post.fields.slug,
        date: post.fields.publishedDate,
        previewImage: getPreviewImage(content, post.sys.id)
      };
    }),
  };
};



export default function BlogPost() {
  const data = useLoaderData<LoaderData>();

  return (
    <section className="p-10">
      <ul className="flex gap-8 flex-col">
        {data.posts.map((post) => (
          <li key={post.slug} className="w-full flex gap-8 justify-center">
            <Link
              to={post.slug}
              className="w-full lg:w-1/2 border border-solid dark:border-neutral-600 flex justify-between gap-8 p-4 rounded dark:hover:bg-gray-800"
            >
              <div>
                <h1 className="text-xl font-bold">{post.title}</h1>
                <h3 className="text-md dark:text-gray-400">{format(parseISO(post.date), "PP")}</h3>
              </div>

              {post.previewImage ? (
                <img
                  className="w-28 object-cover aspect-video"
                  src={post.previewImage.url}
                  title={post.previewImage.title}
                />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
