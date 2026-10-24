# HƯỚNG DẪN TẠO TRANG MỚI HOÀN TOÀN ĐỘC LẬP (V5.0)
*(Không đụng chạm đến trang cũ `https://thpthothibi.github.io/daihoi-doan-hothibi/`)*

---

## PHẦN 1: TẠO REPOSITORY GITHUB PAGES MỚI ĐỘC LẬP
1. Đăng nhập tài khoản GitHub của trường (`thpthothibi`).
2. Bấm nút **`+` (New repository)** ở góc trên bên phải.
3. Đặt tên Repository mới hoàn toàn, ví dụ: **`dahoinhi-hothibi`** (Tuyệt đối không trùng tên `daihoi-doan-hothibi`).
4. Chọn **Public** -> Bấm **Create repository**.
5. Giải nén gói `HTB_DA_HOI_NGHI_V5_DOC_LAP.zip` này và tải toàn bộ các tệp (`index.html`, `config.js`, `.nojekyll`, thư mục `.github`, `worker`, `google-drive-script`) lên Repository mới.
6. Vào mục **Settings** của Repository mới -> Chọn **Pages** ở menu trái:
   - Mục **Build and deployment (Source)**: Chọn **GitHub Actions** (hoặc **Deploy from a branch -> main / root**).
7. Sau 1 phút, bạn sẽ có địa chỉ trang web mới hoàn toàn độc lập tại:
   👉 **`https://thpthothibi.github.io/dahoinhi-hothibi/`**

---

## PHẦN 2: TẠO CLOUDFLARE WORKER & DATABASE D1 MỚI ĐỘC LẬP
1. Đăng nhập **Cloudflare Dashboard** -> Vào mục **Workers & Pages** -> **D1 SQL Database**.
2. Bấm **Create Database** -> Đặt tên mới: **`htb_hoinghi_v5_db`** (Hoàn toàn tách biệt với D1 của trang cũ).
3. Vào tab **Console** của `htb_hoinghi_v5_db`, copy toàn bộ nội dung file `worker/schema_d1_v5.sql` dán vào và bấm **Execute** để tạo bảng.
4. Vào lại **Workers & Pages** -> Bấm **Create Worker** -> Đặt tên mới: **`htb-hoinghi-v5-api`** -> Bấm **Deploy**.
5. Bấm **Edit Code**, xóa code mặc định và dán toàn bộ nội dung file `worker/WORKER_DAN_TRUC_TIEP.mjs` vào -> Bấm **Deploy**.
6. Vào tab **Settings -> Bindings** của Worker `htb-hoinghi-v5-api`:
   - Bấm **Add binding** -> Chọn **D1 database**.
   - **Variable name**: Nhập chính xác là `DB`
   - **D1 database**: Chọn `htb_hoinghi_v5_db` -> Lưu lại.
7. Copy đường dẫn Worker mới (ví dụ: `https://htb-hoinghi-v5-api.<ten-phu>.workers.dev`) dán vào file `config.js` (hoặc nhập trực tiếp trong mục **Kết nối Cloud & Drive** của Admin trên web).

---

## PHẦN 3: KẾT NỐI VĂN KIỆN TỪ GOOGLE DRIVE
Bạn có 2 cách cực kỳ tiện lợi:
* **Cách 1 (Dán trực tiếp link trên Web - Không cần cài đặt):**
  1. Trên Google Drive của trường, nhấp chuột phải vào file PDF / Google Docs / Google Slides hoặc nguyên Thư mục -> Chọn **Chia sẻ (Share)** -> Chuyển thành **"Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with the link can view)**.
  2. Trên trang Web Đại hội -> Vào mục **Văn kiện (Google Drive)** -> Bấm **`+ Nạp link Drive`** -> Dán link vừa copy vào là đại biểu đọc được ngay trên điện thoại!
* **Cách 2 (Tự động đồng bộ nguyên Thư mục Google Drive bằng Google Apps Script):**
  1. Mở https://script.google.com -> **Dự án mới**.
  2. Copy nội dung file `google-drive-script/Code.gs` dán vào, thay ID thư mục Google Drive của trường.
  3. Bấm **Triển khai (Deploy) -> Tùy chọn triển khai mới -> Ứng dụng Web (Web App)** -> Quyền truy cập: **Bất kỳ ai (Anyone)**.
  4. Dán URL Web App nhận được vào file `config.js` (`GOOGLE_DRIVE_GAS_URL`). Từ lúc này, cứ thả file PDF/Word vào thư mục Google Drive là web tự động cập nhật!
