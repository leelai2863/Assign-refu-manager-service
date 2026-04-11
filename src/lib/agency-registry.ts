import type { AgencyOption } from "@/types/electric-bill";

export type AgencyTreeNode = {
  id: string;
  name: string;
  code: string;
  level: number;
  children: AgencyTreeNode[];
};

/** Một nhánh cây duy nhất chứa toàn bộ đại lý (đồng bộ với menu chọn). */
export function agenciesAsTreeRoots(opts: AgencyOption[]): AgencyTreeNode[] {
  return [
    {
      id: "root-contract-agencies",
      name: "Đại lý ký hợp đồng",
      code: "ROOT",
      level: 0,
      children: opts.map((a) => ({
        id: a.id,
        name: a.name,
        code: a.code,
        level: 1,
        children: [],
      })),
    },
  ];
}
