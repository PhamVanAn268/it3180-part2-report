# Câu hỏi phản biện và kết quả đối chiếu

Nội dung dưới đây tổng hợp câu hỏi và kết quả kiểm tra trong hồ sơ phân tích ngày 29/10/2026. Đây là bản tổng hợp, không phải nhật ký hội thoại nguyên văn. Hai lượt phân tích ban đầu chỉ còn bản tóm tắt, chưa có transcript gốc để xác nhận đầy đủ nội dung và trình tự.

## 1. Kiểm tra danh tính và phương pháp tổng hợp

Câu hỏi phản biện:

> Đối chiếu B1/B3 với phần B trang 6–7 của bản trích xuất C5.5. Từ năm danh tính Git đã mã hóa, kiểm tra kịch bản A01+A05 nhưng không coi là mapping đã xác nhận. Giữ nguyên bảng gốc; tính commit, added, deleted, net, hợp unique paths/ngày và tuần ISO. Chỉ rõ sai khác với PDF, không dùng LOC xếp hạng. Kiểm tra phần C có bằng chứng gốc hay chỉ tóm tắt.

Kết quả đối chiếu:

- Cần xử lý alias trước khi diễn giải đóng góp. A01+A05 chỉ là giả định theo ví dụ C5.5, chưa được nhóm xác nhận; bảng năm danh tính gốc được giữ để đối chiếu.
- Tổng số liệu là 132 commit nonmerge, +107.574/−70.832, net +36.742. Kịch bản gộp có 21/91/6/14 commit.
- Unique paths và ngày hoạt động phải lấy hợp tập. Không cộng trực tiếp số đường dẫn hoặc số ngày của hai danh tính.
- Khi cộng riêng bản log đã che, A02 cho +32.524/−14.729, thấp hơn số thực +32.596/−14.730. Sai khác này cho thấy bản export thiếu dữ liệu, không phải lý do thay số Git đã đo.

## 2. Kiểm tra lại bằng numstat và tệp nguồn

Câu hỏi phản biện:

> Giả sử log đã che không còn đủ numstat: có bằng chứng nào bác bỏ bảng số hiện tại? Đọc lại từng SHA bằng git show --format= --numstat, chỉ xuất số an toàn. Lấy hợp tập đường dẫn cho A01+A05. Đối chiếu smoke test và ignore bằng file thực. Kết luận nào phải sửa, kết luận nào vẫn chỉ là giả thuyết? Không tái dựng transcript quá khứ.

Kết quả đối chiếu:

- `git rev-list --all --no-merges` xác nhận 132 SHA duy nhất. Numstat của cả 132 commit khớp bảng năm danh tính trong `author-stats.json`.
- Bảy commit có dòng numstat bị che trong export; cần đối chiếu Git cục bộ để tái lập đầy đủ. Danh sách SHA và kết quả kiểm tra nằm trong `REVIEW_COMMAND_RESULTS.json`.
- A01+A05 có **417** unique paths, do hai tập có 2 và 415 đường dẫn, giao bằng 0. Kết quả 416 từ export đã che không được dùng làm số cuối cùng.
- Hợp ngày hoạt động là 7; khoảng ngày 2026-04-09 → 2026-07-03. Nhịp tuần của kịch bản gộp: W15=5, W22=10, W23=5, W27=1, tổng 21 commit.
- Tệp test có `@SpringBootTest` và `contextLoads()` rỗng; có ba tệp ignore. Chưa có kết quả chạy ứng dụng hoặc test để kết luận runtime PASS.

## 3. Những kết luận cần giữ ở mức giả thuyết

| Nhận định | Dữ liệu quan sát được | Bằng chứng còn cần |
|---|---|---|
| A05 tự viết toàn bộ số dòng thêm | Commit khởi tạo có marker template | Nguồn scaffold, diff phần chỉnh sửa, trao đổi với nhóm |
| A03 làm giảm chất lượng vì net âm | Xóa cây UI cũ và thêm cấu trúc khác | Demo trước/sau, kiểm thử hồi quy và review yêu cầu |
| Ít commit nghĩa là ít đóng góp | Git chỉ ghi nhận thay đổi được commit | Phân công, lịch sử tài liệu, review và pair programming |

Trong báo cáo, em sử dụng số liệu để xác định câu hỏi cần làm rõ với nhóm. LOC và số commit không được dùng làm thang điểm cá nhân; danh tính thật, vai trò ngoài Git và chất lượng runtime còn cần thông tin bổ sung.

## 4. Cách đối chiếu số liệu

Các lệnh sau mô tả cách kiểm tra; đường dẫn repository cần thay theo máy thực hiện:

```powershell
git -C <thu_muc_repository> rev-parse HEAD
git -C <thu_muc_repository> rev-list --all --no-merges
git -C <thu_muc_repository> show --format= --numstat <SHA>
git -C <thu_muc_repository> ls-files
```

Chỉ công bố số tổng hợp và trích đoạn đã che. Việc đối chiếu không yêu cầu chia sẻ credential, email gốc hoặc bản clone chưa được kiểm tra an toàn.
