import type { AgencyTreeNode } from "@/lib/agency-registry";
import type { VoucherRow } from "@/types/voucher";

export const MOCK_VOUCHERS: VoucherRow[] = [
  {
    _id: "1",
    code: "EV-10001",
    status: 0,
    agencyId: null,
    billingScanHasBill: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    code: "EV-10002",
    status: 1,
    agencyId: "a1",
    agencyName: "Đại lý Miền Bắc",
    billingScanHasBill: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    code: "EV-10003",
    status: 2,
    agencyId: "a2",
    agencyName: "Đại lý Hà Nội 1",
    billingScanHasBill: true,
    customerProfile: {
      fullName: "Nguyễn Văn A",
      idNumber: "001234567890",
      billAmount: 1_250_000,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    code: "EV-10004",
    status: 3,
    agencyId: "a2",
    agencyName: "Đại lý Hà Nội 1",
    billingScanHasBill: true,
    approvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    code: "EV-10005",
    status: 4,
    agencyId: "a3",
    agencyName: "Đại lý TP.HCM",
    billingScanHasBill: false,
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
    mailedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_AGENCY_TREE: AgencyTreeNode[] = [
  {
    id: "root-north",
    name: "Tổng Miền Bắc",
    code: "MB",
    level: 0,
    children: [
      {
        id: "a1",
        name: "Đại lý Miền Bắc",
        code: "MB-DL1",
        level: 1,
        children: [
          {
            id: "a2",
            name: "Đại lý Hà Nội 1",
            code: "HN-01",
            level: 2,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "root-south",
    name: "Tổng Miền Nam",
    code: "MN",
    level: 0,
    children: [
      {
        id: "a3",
        name: "Đại lý TP.HCM",
        code: "HCM-01",
        level: 1,
        children: [],
      },
    ],
  },
];
