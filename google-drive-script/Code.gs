/**
 * GOOGLE APPS SCRIPT - TỰ ĐỘNG ĐỒNG BỘ FILE TRONG THƯ MỤC GOOGLE DRIVE LÊN WEB ĐẠI HỘI
 * Hướng dẫn:
 * 1. Truy cập https://script.google.com -> Dự án mới -> Dán mã này vào.
 * 2. Thay FOLDER_ID_DEFAULT bằng ID thư mục Google Drive chứa văn kiện của trường.
 * 3. Bấm Triển khai (Deploy) -> Tùy chọn triển khai mới -> Ứng dụng Web (Web App)
 *    - Thực thi dưới dạng: Tôi (Me)
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)
 * 4. Copy URL Web App dán vào mục "Cấu hình Cloud & Drive" trên trang Web Đại hội.
 */

const FOLDER_ID_DEFAULT = "THAY_ID_THU_MUC_GOOGLE_DRIVE_VAO_DAY";

function doGet(e) {
  const folderId = (e && e.parameter && e.parameter.folderId) ? e.parameter.folderId : FOLDER_ID_DEFAULT;
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    const list = [];
    let idx = 1;

    while (files.hasNext()) {
      const f = files.next();
      const mime = f.getMimeType();
      let type = "PDF";
      if (mime.indexOf("document") !== -1) type = "DOCS";
      else if (mime.indexOf("presentation") !== -1) type = "SLIDES";
      else if (mime.indexOf("spreadsheet") !== -1) type = "SHEETS";

      list.push({
        id: "DRV-" + String(idx).padStart(2, "0"),
        type: type,
        title: f.getName(),
        driveUrl: f.getUrl(),
        summary: "Đồng bộ tự động từ thư mục Google Drive (" + (f.getSize() / 1024).toFixed(0) + " KB)",
        updatedAt: f.getLastUpdated().toISOString()
      });
      idx++;
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, folderName: folder.getName(), documents: list }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
