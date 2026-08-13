import { revalidatePath } from "next/cache";

/** Revalidate specific routes instead of the whole layout tree. */
export function revalidatePaths(...paths: string[]) {
  const unique = new Set(["/", ...paths]);
  for (const path of unique) {
    revalidatePath(path);
  }
}
