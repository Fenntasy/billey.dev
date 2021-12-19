import { Asset, EntryCollection } from "contentful";
import { IBlogPostFields } from "~/@types/generated/contentful";

export function getPreviewImage(content: EntryCollection<IBlogPostFields>, postId:string): {title: string, url: string} | undefined {
  const post = content.items.find(post => post.sys.id === postId);
  if (!post) {
    return undefined;
  }

  const previewImage = post.fields.previewImage
    ? content.includes?.Asset.find(
      (asset: Asset) => asset.sys.id === post.fields.previewImage?.sys.id
    )
    : undefined;

  return  previewImage
    ? {
      title: previewImage.fields.title,
      url: previewImage.fields.file.url,
    }
    : undefined;
}
