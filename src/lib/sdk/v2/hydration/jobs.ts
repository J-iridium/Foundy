import type { HydrationJob, ContentType } from "../core/types";

/** Parse dataset value "posts:homepageHero" -> { type, name, args } */
// Typing is <ContentType>:<Name?>:<Index?>-<count>
// Different options:
// post::list-10
// post:x:list-10 <- x gets ignored.
// post::1 <- get the first post.
// post:: -> post::list-10 -- The post data tag will auto fill to a list of 10.
// post::list -- post::list-10 -- The post data tag will auto fill to a list of 10. 
export function parseFoundyDataset(value: string): { type: ContentType; name?: string, args?: {index : string, count? : string} } | null {
  if (!value) return null;

  const parts : string[] = value.split(":").map((p) => p.trim());
  const type : ContentType = parts[0] as ContentType;
  const listTypes : ContentType[] = ["homepage","image","post","product"] as ContentType[];
  
  if (!listTypes.includes(type)) return null;
  
  let args : { index : string, count? : string} | undefined = undefined;
  if (parts.length == 3) {
    args = {index : "0", count: "0"}
    args.index = value.split(":")[2].split('-')[0]
    args.count = value.split(":")[2].split('-')[1] ?? "0"
  }
  let name : string | undefined = parts[1] || undefined;

  if (name === undefined) {
    name = "";
    if (args === undefined) {
      args = {index : "0", count: "10"}
    }
  }
  if (args === undefined) {
    args = {index : "0", count: "0"}
  } 

  return { type, name, args };
}
