/**
 * Giao diện: cho phép thêm đại lý mới (nút + cạnh select).
 * Đặt NEXT_PUBLIC_CAN_ADD_AGENCY=false để ẩn (mô phỏng cấp quản lý mã thấp — chỉ được chọn đại lý có sẵn).
 * Khi có auth: thay bằng kiểm tra role thực tế (vd. code_manager_super).
 */
export function canAddAgencyInUi(): boolean {
  return process.env.NEXT_PUBLIC_CAN_ADD_AGENCY !== "false";
}
