import type { AgencyTreeNode } from "@/lib/agency-registry";
import type { AgencyOption } from "@/types/electric-bill";

export function flattenAgencyTree(nodes: AgencyTreeNode[], acc: AgencyOption[] = []): AgencyOption[] {
  for (const n of nodes) {
    acc.push({ id: n.id, name: n.name, code: n.code });
    if (n.children?.length) flattenAgencyTree(n.children, acc);
  }
  return acc;
}
