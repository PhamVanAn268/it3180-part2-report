# Phần C — Bằng chứng tự rà soát ngày 2026-10-29

Đây là bản ghi tự phân tích của cùng Codex trong phiên hoàn thiện hiện tại, trên repository Nhóm 7 được chọn từ ví dụ C5.5. Chưa có xác nhận phân công từ giảng viên. Không phải hai AI độc lập, nhận xét của nhóm hay transcript nguyên văn của phiên trước.

## Nguồn bằng chứng và giới hạn lịch sử

Trước rà soát, `VALIDATION.md` mục 4 đã ghi Prompt A/B, Kết quả A/B và bảng so sánh; `REPO_ANALYSIS.md` có kết quả phân tích, `validation-facts.json` và `provenance-validation.json` có kết quả kiểm tra. Không tìm thấy file transcript độc lập trong analysis-output. Vì vậy không xác nhận được nguyên văn prompt, thứ tự hay toàn bộ đầu ra hai lượt cũ; giữ mô tả cũ với nhãn tóm tắt, không dựng lại lời thoại.

Các prompt và đầu ra bên dưới được viết và thực hiện như các lượt tự rà soát **ở phiên hiện tại**, không gán ngược cho phiên cũ. Lệnh thực thi là script private `../reports/complete_part2_review.py`; kết quả an toàn nằm ở `REVIEW_COMMAND_RESULTS.json`. Các lệnh Git chỉ đọc clone sẵn có; không thay refs, remote hoặc nội dung target.

## Lượt rà soát 1 — đối chiếu yêu cầu và dữ liệu hiện có

Prompt tự rà soát được ghi trong phiên này:

> Đối chiếu B1/B3 với phần B trang 6–7 của bản trích xuất C5.5. Từ năm danh tính Git đã mã hóa, kiểm tra kịch bản A01+A05 nhưng không coi là mapping đã xác nhận. Giữ nguyên bảng gốc; tính commit, added, deleted, net, hợp unique paths/ngày và tuần ISO. Chỉ rõ sai khác với PDF, không dùng LOC xếp hạng. Kiểm tra phần C có bằng chứng gốc hay chỉ tóm tắt.

Đầu ra tự phân tích ở phiên này:

- PDF yêu cầu xử lý alias trước phân tích đóng góp; chưa có nhóm xác nhận nên cần hai bảng song song. Mapping A01+A05 là giả định từ ví dụ PDF; không áp dụng mailmap vào target.
- Bảng gốc có 132 commit, +107.574/−70.832, net +36.742. Kịch bản gộp có 21/91/6/14 commit. Giữ nguyên số LOC gốc để kiểm tra bằng Git.
- Tóm tắt cũ ghi 416 đường dẫn cho A01+A05. Cần lấy hợp đường dẫn và ngày từ dữ liệu thực, không cộng trực tiếp các cột unique.
- Tóm tắt prompt/kết quả A/B trong VALIDATION chưa thay thế được transcript gốc. Không có bằng chứng để xác nhận toàn bộ cuộc hỏi đáp cũ.

Kiểm tra số bằng bản log đã che gặp sai khác: A02 cộng được +32.524/−14.729 thay vì +32.596/−14.730. Không sửa bảng theo kết quả thiếu dữ liệu này; chuyển sang đối chiếu numstat từ Git cục bộ. Đây là sai khác thật được phát hiện ở phiên này, không phải đầu ra giả định của phiên cũ.

## Lượt rà soát 2 — đổi câu hỏi để bác bỏ kết luận

Prompt tự phản biện được ghi trong phiên này:

> Giả sử log đã che không còn đủ numstat: có bằng chứng nào bác bỏ bảng số hiện tại? Đọc lại từng SHA bằng git show --format= --numstat, chỉ xuất số an toàn. Lấy hợp tập đường dẫn cho A01+A05. Đối chiếu smoke test và ignore bằng file thực. Kết luận nào phải sửa, kết luận nào vẫn chỉ là giả thuyết? Không tái dựng transcript quá khứ.

Đầu ra tự phân tích sau khi đọc kết quả lệnh thực thi:

- `git rev-list --all --no-merges` cho đúng 132 SHA, khớp tập SHA export. Đọc lại numstat của cả 132 commit xác nhận toàn bộ chỉ số commit/added/deleted/net/unique paths/ngày/binary của năm danh tính trong `author-stats.json`; không cần sửa bảng gốc.
- Bảy SHA có numstat trong bản đã che không đầy đủ; danh sách ở `REVIEW_COMMAND_RESULTS.json`. Do đó không hứa người nhận có thể cộng lại toàn bộ LOC chỉ từ `gitlog_full.txt`. Muốn tái lập đầy đủ phải kiểm Git cục bộ rồi chỉ xuất số an toàn.
- Hợp đường dẫn gốc A01+A05 là **417**, giao hai tập bằng 0. Số 416 cũ thiếu một đường dẫn do che dữ liệu; sửa đúng chỉ số này dựa trên bằng chứng mới. Không xuất tên đường dẫn nhạy cảm. Giữ JSON cũ để audit.
- Hợp ngày hoạt động là 7; khoảng ngày 2026-04-09 → 2026-07-03. Các tuần có commit của nhóm gộp là W15=5, W22=10, W23=5, W27=1; tổng 21.
- Mở test tại HEAD xác nhận `@SpringBootTest`, `contextLoads()` rỗng. Có ba ignore files; không có CI ở các đường dẫn đã kiểm. Chưa chạy target/test, không kết luận runtime PASS.
- Không đủ chứng minh ai viết nội dung thật, chất lượng refactor, deadline hoặc việc ngoài Git. Các giới hạn và ba nhận xét chưa đủ bằng chứng ở VALIDATION mục 5 tiếp tục có hiệu lực.

## Nội dung điều chỉnh có thể kiểm tra

| Nội dung trước rà soát | Nội dung sau rà soát | Bằng chứng/lý do |
|---|---|---|
| “chỉ minh họa PDF” | Repository được chọn từ ví dụ để làm bài; chưa xác nhận phân công | Yêu cầu người dùng hiện tại; không suy thành xác nhận của giảng viên |
| Kịch bản gộp chỉ một đoạn | Bảng bốn danh tính và bảng tuần, giữ nguyên bảng năm danh tính | B1/B3 trang 6–7 bản trích xuất; merged-identity-stats.json |
| Gộp có 416 unique paths | 417, giao rỗng; giữ số cũ trong prior-provisional-identity-scenario.json | Đọc numstat trên 132 SHA, hợp tập đường dẫn tại chỗ |
| Export đã che được hiểu là đủ tái tính | Cảnh báo bảy commit thiếu numstat trong export | REVIEW_COMMAND_RESULTS.json, danh sách SHA |
| Hai lượt cũ có vẻ là transcript | Ghi đúng là tóm tắt cũ chưa xác minh; bổ sung bản ghi tự rà soát hiện tại | Không có transcript gốc trong bộ file hiện có |
| Số LOC khác PDF | Giữ nguyên số Git đã kiểm; bổ sung bảng chênh lệch đủ bốn nhóm | Đối chiếu 132 commit và ví dụ trang 7 |

## Lệnh đối chiếu an toàn

Chạy từ `D:\IT3180\aims` bằng PowerShell, chỉ đọc:

```powershell
git -C it3180-agent/analysis-target-repo rev-parse HEAD
git -C it3180-agent/analysis-target-repo status --porcelain
(git -C it3180-agent/analysis-target-repo rev-list --all --no-merges | Sort-Object -Unique | Measure-Object).Count
git -C it3180-agent/analysis-target-repo ls-files '*gitignore' '*Tests.java'
git -C it3180-agent/analysis-target-repo show '52d05923806666d3810df5074932145ea2058e4b:Backend/src/test/java/org/example/backend/BackendApplicationTests.java'
```

Để đối chiếu LOC, chạy `git show --format= --numstat <SHA>` qua bộ tổng hợp cục bộ; không dán toàn bộ stdout vào AI hay gói nộp vì đường dẫn cũng có thể chứa dữ liệu nhạy cảm. Script rà soát thực hiện lệnh này cho từng SHA; chỉ lưu số tổng và kết quả so sánh trong JSON. Không đưa script private, raw clone hoặc mailmap private vào ZIP. Bản ghi này là báo cáo thực thi và tự phân tích, không phải log nguyên văn toàn bộ cuộc hội thoại.
