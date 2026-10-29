# Kiểm chứng và phản biện — Phần 2 C5.5

Repository Nhóm 7 được chọn từ ví dụ trong tài liệu để làm bài C5.5: https://github.com/neveraccept/IT3180_2025.2_Nhom7, snapshot `52d05923806666d3810df5074932145ea2058e4b`. Chưa có xác nhận phân công từ giảng viên. Mọi kiểm tra dưới đây là tĩnh/đọc Git, không chạy code target.

## 1. Kiểm chứng nhận xét bằng tệp gốc

Nhận xét AI: “chỉ có một context smoke test, chưa thấy test nghiệp vụ”. Đối chiếu `git ls-files` (270 đường dẫn): chỉ `Backend/src/test/java/org/example/backend/BackendApplicationTests.java`. Đọc file gốc: dòng 6 `@SpringBootTest`, dòng 9 `@Test`, dòng 10–11 `contextLoads()` thân rỗng, không có assertion nghiệp vụ. `Frontend/package.json:6–10` chỉ dev/build/lint/preview. Kết quả: nhận xét được hỗ trợ ở phạm vi tracked snapshot; sửa cách diễn đạt “không có test” thành “có một smoke test”, không khẳng định test chạy PASS. Nguồn đã che: verified-source-excerpts.txt.

Nhận xét AI: “không có build artifacts trong tracked HEAD”. Đối chiếu `git ls-files` qua bộ lọc node_modules/target/dist/build/*.class: 0. Đây không chứng minh toàn bộ lịch sử sạch; commit cũ có template/.env. Nguồn: validation-facts.json.

Nhận xét AI: “root ignore mỏng nhưng module có ignore riêng”. Đọc .gitignore:1, Backend/.gitignore:1–37, Frontend/.gitignore:1–24. Có ignore module thật; `application.properties` vẫn tracked dù Backend/.gitignore:21. Loại bỏ suy luận thiếu bối cảnh từ ví dụ PDF.

## 2. Kiểm chứng nhận xét bằng commit gốc

`git show --format= --numstat <SHA>` đối chiếu độc lập với parser của gitlog_full.txt:

| SHA | Thêm | Xóa | Kết quả |
|---|---:|---:|---|
| c5feefcd90dc6a36fec283a1a591dd7e6b55d531 | 961 | 50.134 | Khớp parser |
| 3f80b0384e3fa0e456314b454e1160417a797729 | 50.078 | 0 | Khớp parser |
| 7aa5f74f3b8a61caa61afcc41513f0c07f650eb4 | 7.624 | 6.732 | Khớp parser |

Kiểm tra `git show 3f80b038:Frontend/package.json`, `:Frontend/README.md`, `:Frontend/LICENSE` bằng bộ lọc tại chỗ: package dòng 2 và README dòng 1 có Horizon/Chakra. `provenance-validation.json` chỉ lưu marker/path/line, không chép credential/PII. Có cơ sở nói chứa template; chưa đủ chứng minh mọi dòng thêm là template hay sao chép trái phép.

`git rev-list --all --no-merges` có 132 SHA duy nhất, khớp tổng author-stats. 46 merge commit tách riêng; binary numstat `-` không bị cộng vào LOC. Ba recount là kiểm tra chéo, chưa kiểm thủ công hết 132 diff.

## 3. Giới hạn dữ liệu và danh tính

A01/A05 cùng tên chuẩn hóa, email khác. Chưa đủ để khẳng định cùng người: không áp dụng mailmap, bảng chính giữ riêng; bảng giả định chỉ phục vụ đối chiếu. Số liệu không đủ nói “A03 làm ít” do net âm: commit c5feefcd xóa nhiều UI cũ. Cũng không đủ kết luận thay đổi là refactor có ích nếu chưa có regression tests/demo.

Không xác định được tác giả thực của tài liệu/slide qua người commit. Không có dữ liệu deadline nên không nói chắc “sát hạn”. PR metadata có 19 merged nhưng không chứng minh review độc lập hay không push thẳng. Scan chỉ heuristic, 2.143 candidate lines không đồng nghĩa số secret. Bốn literal credential candidates không được thử hiệu lực.

## 4. Đổi cách hỏi và so sánh

**Giới hạn bằng chứng cũ:** phần dưới là tóm tắt Prompt A/B và Kết quả A/B đã có sẵn khi bắt đầu rà soát, không phải transcript gốc đã xác minh. Không có file transcript độc lập trong analysis-output để chứng minh nguyên văn hay trình tự hai lượt cũ. Không coi đây là hai AI độc lập hoặc phản hồi của người thật. Bằng chứng tự rà soát hiện tại, với prompt, đầu ra, thay đổi và lệnh thật, nằm ở [C_REVIEW_EVIDENCE.md](C_REVIEW_EVIDENCE.md) và [REVIEW_COMMAND_RESULTS.json](REVIEW_COMMAND_RESULTS.json).

**Prompt A:** “Dùng file tree, README và gitlog đã che để mô tả kiến trúc, phân loại vùng hoạt động và thống kê; mọi kết luận kèm path/SHA, không xếp hạng.”

**Kết quả A:** backend phân lớp 18/32/27/33/63; 5 danh tính Git và đề xuất alias; A03 có net −39.057; A05 có +56.351 dòng; W23–W24 tập trung 79 commit của A02. Gắn caveat template và việc ngoài Git.

**Prompt B:** “Hãy bỏ bảng LOC và cố bác bỏ nhận xét của bạn: căn cứ nào đủ chứng minh chất lượng, ai làm thật, test/CI hoạt động và việc xóa UI có ích? Mở lại tệp/commit trước khi trả lời.”

**Kết quả B:** Không đủ chứng minh chất lượng/người viết thật. Giữ nhận xét kiến trúc dựa trên đường dẫn; phát hiện root ignore một dòng không đại diện ignore toàn repo; chỉ một smoke test, không có kết quả runtime; template markers và xóa UI là dữ liệu, lợi ích refactor là giả thuyết. Nên ưu tiên kiểm thử nghiệp vụ, cấu hình credential và xác nhận alias hơn là suy ra nỗ lực từ LOC. Điểm 6/12 là đánh giá rubric snapshot có giải thích, không đo năng lực cá nhân.

| Vấn đề | Giữ nguyên sau hỏi lại | Điều chỉnh/giới hạn |
|---|---|---|
| Kiến trúc | Phân lớp và số file | Không suy ra code đúng/chất lượng tốt chỉ từ phân tầng |
| Đóng góp | SHA, số commit/numstat/tuần | Không dùng LOC/net để xếp hạng; không gộp alias chưa xác nhận |
| Template/xóa UI | Có marker và thay đổi đường dẫn thực | Không nói tất cả code là template hoặc xóa chắc chắn có ích |
| Test/ignore | Một context smoke test, ignore module có thật | Không nói “không có test” hay “repo chỉ ignore .idea” |

## 5. Ba kết luận chưa thể khẳng định và bằng chứng còn cần

| Kết luận không đủ dữ liệu | Vì sao | Cần thêm |
|---|---|---|
| “A05 tự viết nhiều nhất vì thêm nhiều dòng” | 50.078 dòng ở commit init chứa marker template | Nguồn scaffold/license, phần chỉnh sửa, phỏng vấn và diff |
| “A03 phá code vì net âm” | Xóa cây UI cũ rồi thêm cấu trúc mới; Git không đánh giá đúng/sai nghiệp vụ | Demo trước/sau, regression tests, review yêu cầu và xác nhận nhóm |
| “A01 ít làm vì chỉ 2 commits, hoặc A02 commit hộ vì có 91” | Alias chưa xác nhận; tài liệu, review, pair và công việc ngoài Git không đo bằng số commit | Xác nhận danh tính, task board, biên bản họp, lịch sử review/docs, phỏng vấn chéo |

Nếu chấm theo LOC, A03 dễ bị bất lợi do net âm và người làm tài liệu/offline dễ bị bỏ sót; A05 có thể bị thổi phồng vì init template. Đây là cảnh báo về phương pháp, không là thứ hạng hay kết tội cá nhân.

## 6. Bổ sung kiểm chứng trong phiên hoàn thiện 2026-10-29

Đã chạy `git show --format= --numstat` cục bộ cho **cả 132 SHA**. Kết quả khớp bảng gốc năm danh tính, tổng +107.574/−70.832, 99 binary entries. Đây là kiểm số/path bằng lệnh, không phải đọc ngữ nghĩa toàn bộ 132 diff. Bảy commit có dòng numstat bị che trong `gitlog_full.txt`; export không đủ để tự cộng lại mọi số. SHA và kết quả tổng hợp an toàn ở `REVIEW_COMMAND_RESULTS.json`.

**Bằng chứng mới sửa một số cũ:** hợp đường dẫn gốc A01+A05 là 417 (2 và 415, giao 0), không phải 416 như kịch bản cũ tính từ log đã che. Không xuất tên đường dẫn bị che. `merged-identity-stats.json` ghi phép hợp; `prior-provisional-identity-scenario.json` giữ kết quả cũ; `provisional-identity-scenario.json` ghi kết quả đã sửa. Các số khác của bảng gốc được giữ nguyên sau đối chiếu. Mapping vẫn là giả định dựa trên ví dụ PDF, chưa được nhóm xác nhận.

Đối chiếu B1/B3 dùng bản trích xuất đồng hành của PDF trang 6–7. Chưa render trang PDF trực tiếp trong phiên này vì Python hiện có không có thư viện đọc PDF. Không có nội dung hình/bảng mơ hồ cần suy đoán; bảng số và yêu cầu nằm trong bản trích xuất.

## 7. Việc cần người thật

Xác nhận repo được giao và mapping alias; xác nhận vai trò ngoài Git; kiểm tra credential trực tiếp cục bộ và rotate nếu cần. Build/test target cần môi trường cô lập và cấu hình an toàn, nằm ngoài phân tích tĩnh đã làm. Không liên hệ chủ repo hoặc thử credential.
