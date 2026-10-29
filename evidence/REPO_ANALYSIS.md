# Phân tích repository BlueMoon — Phần 2 C5.5

**Báo cáo phân tích repository được chọn từ ví dụ trong tài liệu C5.5 (Nhóm 7). Chưa có xác nhận phân công từ giảng viên.** Nguồn: https://github.com/neveraccept/IT3180_2025.2_Nhom7, snapshot `52d05923806666d3810df5074932145ea2058e4b`, ngày phiên làm việc 2026-10-29 (Asia/Bangkok). Không phân tích AIMS-mini thay cho đồ án khóa trước.

Phạm vi: 270 tệp đang được quản lý, mọi ref đã clone, 132 SHA commit không phải merge được đếm đúng một lần; 46 merge commit không đưa vào bảng LOC. Có 20 PR được API trả về, 19 MERGED (`pr-metadata.json`). Không cài dependency, chạy ứng dụng, đăng nhập thử hoặc push repo mục tiêu. Phân tích tĩnh không chứng minh build/test của đồ án đang chạy thành công.

## Vai trò và an toàn dữ liệu

Áp dụng Prompt 0: chỉ nêu nhận xét có đường dẫn/SHA/số liệu; tách dữ liệu khỏi suy luận; không xếp hạng thành viên. Các tác giả dùng mã A01–A05; email thay bằng mã băm ổn định. Tên/email gốc chỉ có trong đề xuất mailmap private cục bộ, không đưa vào báo cáo chia sẻ và không áp dụng vào repo.

Đã scan 1.196 blob văn bản và loại 52 blob binary khỏi đầu vào AI. `SECURITY_SCAN.json` ghi 2.143 dòng ứng viên theo heuristic, không phải 2.143 secret thật: regex cũng khớp tên biến/import. Có **4 cấu hình credential dạng literal không rỗng** tại `Backend/src/main/resources/application.properties:8,16,32,38`; giá trị được che và không thử xác thực. `Frontend/.env` từng xuất hiện trong commit lịch sử `3f80b038`. Không kết luận giá trị còn hiệu lực. Cần chủ repo kiểm tra, thu hồi/rotate nếu cần, chuyển cấu hình sang môi trường và cung cấp file mẫu an toàn; thêm ignore không xóa dữ liệu đã nằm trong Git. Không tự sửa repo của nhóm.

Đầu vào đã che các dòng cấu hình, email, số điện thoại/ID khả nghi và bảng tài khoản/thành viên; binary và các giá trị credential không dùng trong nhận xét. Scan heuristic chưa chứng minh vắng mọi secret/PII, và chưa đọc nội dung PDF/ảnh/XLSX trong target.

## A1 — Dữ liệu thu thập

`cautruc.txt` biểu diễn cây tối đa 3 cấp, bỏ `.git/node_modules/dist/target/build`; `danhsach_file.txt` từ `git ls-files`; `readme.txt` là README đã che dữ liệu. `collection-summary.json` ghi HEAD và refs. `verified-source-excerpts.txt` lưu trích đoạn đã che, giữ số dòng gốc. `validation-facts.json` chứa đếm thực và kiểm chứng bằng lệnh Git độc lập.

## A2 — Kiến trúc và đánh giá

| Thành phần | Bằng chứng tại snapshot | Vai trò quan sát được |
|---|---|---|
| Frontend | `Frontend/package.json:6–20`, `Frontend/src/App.jsx`, `src/routes/AppRoutes.jsx`, `src/api/`, `src/context/`, `src/pages/` | React 19, Vite, router, API client, context và giao diện; phiên bản được đọc từ manifest, chưa cài/chạy |
| HTTP backend | `Backend/src/main/java/org/example/backend/controller/` — 18 Java files | REST controllers; ví dụ `ApartmentController.java:12` phụ thuộc ApartmentService |
| Nghiệp vụ | `Backend/src/main/java/org/example/backend/service/` — 32 Java files | Tầng xử lý nghiệp vụ; số file không đồng nghĩa 32 chức năng độc lập |
| Dữ liệu | `repository/` 27, `entity/` 33, `dto/` 63 Java files dưới cùng package | Repository/JPA, mô hình và DTO; ví dụ `ApartmentRepository.java`, `Apartment.java` |
| CSDL/bảo mật | `Backend/pom.xml:59–70`, `security/SecurityConfig.java:28–77` | Phụ thuộc MySQL/JPA, phân quyền JWT/stateless; đây là ý định trong code, chưa xác nhận cấu hình triển khai thực tế |
| Tài liệu | `README.md`, `docs/SDD.md` — 194.385 bytes | Hướng dẫn setup/run, mô tả API và thiết kế; SDD có mục use-case/thiết kế |

Ba điểm mạnh có bằng chứng:

1. Tách Frontend/Backend và backend phân tầng rõ (`controller/service/repository/entity/dto`); giúp tìm nơi thay đổi theo trách nhiệm. Không suy ra chất lượng logic chỉ từ số lớp.
2. `README.md` có yêu cầu môi trường, lệnh chạy và sơ đồ tổng quan; `docs/SDD.md` có thiết kế/use-case. Đây là tài liệu thực trong Git, không chứng minh ai viết hay tài liệu hoàn toàn khớp runtime.
3. Có manifest, Maven wrapper, `Frontend/package-lock.json` và ignore theo từng module; `git ls-files` không có đường dẫn build/node_modules/target/dist hoặc `.class`. Không coi lockfile là code tự viết khi phân tích đóng góp.

Các cơ hội cải thiện, dựa trên kiểm tra tệp:

1. **Kiểm thử nghiệp vụ:** `Backend/src/test/java/org/example/backend/BackendApplicationTests.java:6–11` chỉ có `@SpringBootTest` và thân `contextLoads()` rỗng. Đây là smoke test khởi tạo context, không có assertion nghiệp vụ trực tiếp; không nói “không có test”. Chưa thấy test frontend; `Frontend/package.json:6–10` không có script test. Bổ sung tình huống API, phân quyền, tính phí và FE; chưa chạy smoke test nên không khẳng định PASS.
2. **CI:** không có `.github/workflows`, `.gitlab-ci.yml` hay `Jenkinsfile` trong 270 tệp; nên tự động hóa test/build. Không loại trừ CI cấu hình ngoài Git mà dữ liệu này không thấy.
3. **Credential/config:** bốn vị trí literal nêu trên vẫn được track, dù `Backend/.gitignore:21` đã ghi application.properties. Ignore không untrack file cũ. Tách secret khỏi code, để file mẫu không chứa giá trị nhạy cảm; chủ repo quyết định xử lý lịch sử.
4. **Tài liệu và ignore:** root `.gitignore` chỉ có `.idea/`, nhưng `Backend/.gitignore:1–37` và `Frontend/.gitignore:1–24` có nhiều quy tắc. Kết luận “cả repo chỉ ignore một dòng” là thiếu bối cảnh. README liệt kê `hooks/` nhưng danh sách tracked tại snapshot không có thư mục đó; cần cập nhật cây tài liệu.
5. **Truy vết thay đổi:** có nhánh BE/FE và PR thật, nhưng các message như `ok`/`sửa code` không giải thích tác động; liên kết issue và mô tả test sẽ giúp kiểm chứng hơn. API metadata này chưa chứng minh review độc lập hay branch protection.

### Rubric minh bạch

PDF có sáu tiêu chí 0–2, nên tổng toán học là **/12**; yêu cầu /10 được đáp ứng bằng `raw / 12 * 10`. Đây là đánh giá độ trưởng thành kỹ thuật của snapshot, không phải điểm cá nhân.

| Tiêu chí | Điểm /2 | Lý do và bằng chứng |
|---|---:|---|
| Cấu trúc/phân tầng | 2 | Frontend/Backend, các package lớp và router/API riêng |
| Tài liệu | 2 | README setup/run và docs/SDD.md; có drift nhỏ chưa làm mất cấu trúc tài liệu |
| Quy trình Git | 1 | 46 merge commits và 19 PR MERGED; chưa kiểm chứng approval/rule, có message mơ hồ |
| Kiểm thử | 0 | Một context smoke test, chưa thấy kiểm thử hành vi; không có kết quả chạy |
| CI/CD | 0 | Chưa thấy cấu hình CI trong tracked files |
| Quản lý phụ thuộc/cấu hình | 1 | Manifest/wrapper/lockfile và không có build artifacts; credential config vẫn tracked |
| **Tổng** | **6/12** | **Chuẩn hóa 5,00/10** |

Không sao chép điểm mẫu trong PDF: điểm quản lý cấu hình giảm vì bằng chứng hiện tại, và tiêu chí chấm đã được nêu rõ.

## A3 — Đối chiếu thủ công

Đã mở trích đoạn nguồn đúng snapshot để đối chiếu test `contextLoads`, ba ignore files, manifest và đường dẫn tầng; đếm lại đường dẫn từ Git. Ba commit outlier được đối chiếu `git show --numstat` độc lập với parser log. Chi tiết bằng chứng, câu hỏi lặp lại và giới hạn trong `VALIDATION.md`.

## B1 — Danh tính trước khi tổng hợp

`tacgia.txt` và `email_ten.txt` giữ quan hệ email–tên bằng mã giả; 5 cặp author name/email, không mặc định là 5 người. A01/A05 trùng tên chuẩn hóa nhưng email khác: **chỉ là ứng viên cùng người**, chưa gộp vào bảng chính. `identity-proposals.json` và `mailmap.proposed.txt` ghi đề xuất; file mailmap thật chỉ ở private local, các mapping đang comment. Cần nhóm xác nhận email/noreply trước khi áp dụng. Không coi cùng tên là bằng chứng đủ về nhân thân.

## B2 — Phương pháp số liệu

Lệnh nền: `git log --all --no-merges --numstat --date=short --pretty=format:COMMIT|%H|%an|%ae|%ad|%s`. Xuất thay tên/email bằng mã; SHA đầy đủ giữ nguyên. Đếm mỗi SHA duy nhất một lần; binary `-` không chuyển thành số dòng (99 binary entries, không phải 99 file duy nhất). Net = thêm − xóa. File từng chạm là **chuỗi đường dẫn xuất hiện trong numstat**, không phải số file hiện tại và chưa gộp các rename thành một thực thể logic.

Tổng thực: 132 commits, +107.574/−70.832, net +36.742. `git rev-list --all --no-merges` đối chiếu đúng 132. Số liệu có thể chứa mã thư viện/template, file lock, generated text hoặc nội dung chỉnh sửa nhiều lần; không đo chất lượng hay giờ làm.

**Giới hạn export đã che:** bảy commit có dòng numstat bị bộ lọc an toàn loại khỏi `gitlog_full.txt`. Do đó không cộng lại toàn bộ LOC/unique paths chỉ từ export này. Phiên hoàn thiện đã đọc numstat của cả 132 SHA bằng Git cục bộ và xác nhận bảng năm danh tính; chỉ xuất số an toàn. `REVIEW_COMMAND_RESULTS.json` ghi lệnh và các SHA bị ảnh hưởng. Không khôi phục đường dẫn nhạy cảm vào gói nộp.

## B3 — Bảng dữ liệu, không xếp hạng

| Danh tính Git | Commit | Thêm | Xóa | Net | Đường dẫn khác nhau | Khoảng ngày | Ngày có commit |
|---|---:|---:|---:|---:|---:|---|---:|
| A01 | 2 | 25 | 3 | +22 | 2 | 2026-04-09 → 2026-07-03 | 2 |
| A02 | 91 | 32,596 | 14,730 | +17,866 | 279 | 2026-05-27 → 2026-06-27 | 17 |
| A03 | 6 | 15,799 | 54,856 | -39,057 | 398 | 2026-06-04 → 2026-06-10 | 2 |
| A04 | 14 | 2,803 | 861 | +1,942 | 53 | 2026-05-29 → 2026-06-06 | 7 |
| A05 | 19 | 56,351 | 382 | +55,969 | 415 | 2026-04-09 → 2026-06-04 | 6 |

### Kịch bản gộp theo B1/B3 — PDF C5.5 trang 6–7

**Mapping A01+A05 là giả định dựa trên ví dụ PDF, chưa được nhóm xác nhận.** Không áp dụng `.mailmap`, không sửa repository; bảng 5 danh tính gốc ở trên giữ nguyên để audit. B1 yêu cầu kiểm tra alias trước B3; vì chưa có xác nhận, trình bày song song bảng gốc và kịch bản 4 danh tính, không khẳng định đã xác minh 4 người thật.

| Kịch bản danh tính | Commit | Added | Deleted | Net | Unique paths | Khoảng ngày author | Ngày hoạt động |
|---|---:|---:|---:|---:|---:|---|---:|
| A01+A05 | 21 | 56,376 | 385 | +55,991 | 417 | 2026-04-09 → 2026-07-03 | 7 |
| A02 | 91 | 32,596 | 14,730 | +17,866 | 279 | 2026-05-27 → 2026-06-27 | 17 |
| A03 | 6 | 15,799 | 54,856 | -39,057 | 398 | 2026-06-04 → 2026-06-10 | 2 |
| A04 | 14 | 2,803 | 861 | +1,942 | 53 | 2026-05-29 → 2026-06-06 | 7 |

Unique paths được tính bằng hợp các tập đường dẫn numstat trên SHA duy nhất: |A01∪A05| = 2 + 415 − 0 = **417**. Đây là kết quả lấy hợp và kiểm tra giao rỗng, không cộng unique paths theo giả định. Số cũ 416 được tính từ log đã che nên thiếu đường dẫn; bằng chứng mới `REVIEW_COMMAND_RESULTS.json` và `merged-identity-stats.json` thay thế kết quả này. Giữ bản cũ tại `prior-provisional-identity-scenario.json` để audit. Ngày hoạt động cũng lấy hợp ngày (7 ngày), không cộng 2+6. Giữ cả đường dẫn binary; không cộng binary vào added/deleted. Tuần ISO dùng ngày author đã xuất, không suy ra giờ làm/deadline. Tuần không xuất hiện trong bảng có 0 commit của cả bốn nhóm.

| Tuần ISO | A01+A05 | A02 | A03 | A04 |
|---|---:|---:|---:|---:|
| 2026-W15 | 5 | 0 | 0 | 0 |
| 2026-W22 | 10 | 8 | 0 | 7 |
| 2026-W23 | 5 | 38 | 5 | 7 |
| 2026-W24 | 0 | 41 | 1 | 0 |
| 2026-W25 | 0 | 2 | 0 | 0 |
| 2026-W26 | 0 | 2 | 0 | 0 |
| 2026-W27 | 1 | 0 | 0 | 0 |

Tổng theo tuần khớp 21/91/6/14 commit; tổng hai bảng cùng là 132 commit, +107.574/−70.832, net +36.742. Dữ liệu máy đọc và phương pháp: `merged-identity-stats.json`; kiểm đếm lại 132 commit bằng Git: `REVIEW_COMMAND_RESULTS.json`.

| Danh tính đối chiếu ví dụ PDF trang 7 | PDF added/deleted/net | Thực đo added/deleted/net | Chênh lệch thực − PDF |
|---|---:|---:|---:|
| A01+A05 (giả định) | 56.362 / 371 / +55.991 | 56.376 / 385 / +55.991 | +14 / +14 / 0 |
| A02 | 32.206 / 14.458 / +17.748 | 32.596 / 14.730 / +17.866 | +390 / +272 / +118 |
| A03 | 15.646 / 54.828 / −39.182 | 15.799 / 54.856 / −39.057 | +153 / +28 / +125 |
| A04 | 2.795 / 853 / +1.942 | 2.803 / 861 / +1.942 | +8 / +8 / 0 |

Số commit theo kịch bản đều khớp ví dụ (21/91/6/14); LOC không hoàn toàn khớp. PDF không ghi đủ cấu hình Git/diff/rename, refs và phiên bản xuất để xác định nguyên nhân. Khác biệt snapshot, refs hoặc cách diff là các khả năng cần đối chiếu, **chưa được chứng minh là nguyên nhân**. Không sửa số thực để khớp ví dụ. Đối chiếu dùng bản trích xuất đồng hành `IT3180_AI_Part2_reference.txt`, phần B trang 6–7; phiên rà soát này chưa render PDF trực tiếp do thiếu thư viện PDF, không suy diễn nội dung hình.

### Loại công việc quan sát qua đường dẫn

Đây là số lượt file xuất hiện trong commit theo nhóm đường dẫn/đuôi, không phải LOC, số task hay chức danh chính thức. Một commit có thể chạm nhiều nhóm. Java/backend → Backend, JSX/CSS/frontend → Frontend, tài liệu → Docs; phần còn lại là cấu hình/khác. Heuristic có thể phân loại sai JS hoặc file mẫu; dùng để đặt câu hỏi.

| Danh tính | Backend | Frontend | Docs | Test | Cấu hình/khác |
|---|---:|---:|---:|---:|---:|
| A01 | 0 | 0 | 2 | 0 | 1 |
| A02 | 554 | 269 | 6 | 0 | 2 |
| A03 | 1 | 399 | 3 | 1 | 3 |
| A04 | 108 | 0 | 1 | 0 | 0 |
| A05 | 115 | 322 | 3 | 2 | 3 |

Ví dụ: A02 chạm cả backend/frontend; A03 có nhiều biến động frontend; A04 tập trung đường dẫn backend; A01 chủ yếu tài liệu/cấu hình; A05 có cả hai tầng và khởi tạo template. **Suy luận về vùng hoạt động Git**, không chứng minh người duy nhất thực hiện các việc đó (`author-stats.json`, `outliers.json`).

### Nhịp theo tuần ISO, ngày author trong Git

| Tuần | A01 | A02 | A03 | A04 | A05 |
|---|---:|---:|---:|---:|---:|
| 2026-W15 | 1 | 0 | 0 | 0 | 4 |
| 2026-W22 | 0 | 8 | 0 | 7 | 10 |
| 2026-W23 | 0 | 38 | 5 | 7 | 5 |
| 2026-W24 | 0 | 41 | 1 | 0 | 0 |
| 2026-W25 | 0 | 2 | 0 | 0 | 0 |
| 2026-W26 | 0 | 2 | 0 | 0 | 0 |
| 2026-W27 | 1 | 0 | 0 | 0 | 0 |

A02 có 79/91 commits trong W23–W24; A03 hoạt động trong 2 tuần, A04 trong 2 tuần; A01 có hai ngày cách xa nhau. Không có dữ liệu deadline, giờ làm hay lịch họp để khẳng định “làm sát hạn”, “làm ít”, hoặc “commit hộ”. Ngày tác giả có thể bị đặt lại và không phải time tracking (`weekly.json`).

### Outlier cần người kiểm chứng

| SHA | Danh tính | + / − | Quan sát và giới hạn |
|---|---|---:|---|
| `3f80b0384e3fa0e456314b454e1160417a797729` | A05 | 50.078 / 0 | `frontend init commit`, 326 paths và 47 binary entries. package.json:2 và README:1 có dấu Horizon/Chakra, LICENSE có trong commit; có bằng chứng scaffold/template, chưa thể xác định mọi dòng là bên thứ ba |
| `c5feefcd90dc6a36fec283a1a591dd7e6b55d531` | A03 | 961 / 50.134 | Xóa nhiều file FE cũ; ví dụ views/admin/contributions/index.jsx −1.510 dòng, thêm src/App.jsx +735. Hỗ trợ giả thuyết thay cấu trúc UI, không chứng minh toàn bộ là refactor đúng hay không mất chức năng |
| `7aa5f74f3b8a61caa61afcc41513f0c07f650eb4` | A02 | 7.624 / 6.732 | App.jsx −6.493 dòng, thêm pages/Vehicles.jsx +999 và nhiều API/pages; hỗ trợ giả thuyết tách file. Cần diff chức năng/tests để đánh giá đúng/sai |
| `05232f95ff39322086d3d5a2c00276348e9bc63d` | A03 | 5.303 / 4.104 | Message “sửa code”, 38 paths; message không giải thích tác động, không đủ suy ra chất lượng |

Số net âm lớn của A03 phần lớn liên quan commit xóa cây UI cũ; số thêm lớn của A05 chịu ảnh hưởng commit khởi tạo template. Cả hai dễ bị đánh giá sai nếu chỉ nhìn LOC. Chênh lệch commit không chứng minh ai viết code hộ ai; file tài liệu chỉ ghi người commit, không ghi người soạn.

Năm câu hỏi phỏng vấn:

1. A01 và A05 có cùng người không; nhóm có thể xác nhận các email và mapping `.mailmap` không?
2. Commit `3f80b038` dùng scaffold nào, phần nào chỉnh sửa riêng và yêu cầu license ra sao?
3. `c5feefcd` đã thay chức năng nào của cây FE cũ; nhóm có demo/test chứng minh không mất nghiệp vụ không?
4. Có pair programming, gom code/commit hộ, review ngoài GitHub hoặc chia task trong họp không; bằng chứng phân công là gì?
5. Ai đóng góp SDD, báo cáo, slide và thuyết trình; có lịch sử tài liệu/biên bản và xác nhận chéo để bổ sung Git không?

## B4 — Commit message (tùy chọn đã thực hiện)

Heuristic công khai: message generic/upload/init/chỉ số module hoặc quá ngắn → mơ hồ; còn lại ít nhất 6 từ và 25 ký tự → rõ ràng; còn lại tạm được. Đây là lọc thô, cần đọc diff để đánh giá thật, không phải chấm tác giả.

| Nhóm | Số | Tỉ lệ |
|---|---:|---:|
| rõ ràng | 61 | 46.21% |
| tạm được | 46 | 34.85% |
| mơ hồ | 25 | 18.94% |

Ví dụ rõ theo heuristic: A01 `52d05923` “Update project course code from IT3160 to IT3180”; ví dụ mơ hồ: A03 `05232f95` “sửa code”, A04 `fb99e14d` “ok”. `message-quality.json` giữ tiêu chí và ví dụ có SHA. Gợi ý: `type(scope): hành động và mục đích`, như `fix(payment): reject duplicate invoice payment`, thêm Issue và test trong body. Không bắt buộc mọi message phải có prefix mới có ý nghĩa.

## C — Phản biện AI

`VALIDATION.md` ghi kiểm chứng nguồn gốc và giới hạn. `C_REVIEW_EVIDENCE.md` lưu prompt/nội dung tự phân tích được ghi trong phiên rà soát 2026-10-29 và lệnh đối chiếu; không có transcript gốc để xác minh hai lượt cũ. Ba kết luận không đủ bằng chứng: “người có nhiều dòng tự viết nhiều nhất”, “net âm là phá code”, “ít commit nghĩa là ít làm/không review”. Cần thông tin template, diff/tests/demo, phân công, review, tài liệu và phỏng vấn; Git không chứng minh báo cáo/slide/thuyết trình/pair programming hoặc người thật tạo nội dung.

Kết luận sử dụng: chuẩn bị câu hỏi với nhóm; repository đã được chọn để làm bài từ ví dụ; phân công của giảng viên, danh tính thật và kết quả chạy chưa được xác nhận. Không dùng thống kê này làm bảng điểm cá nhân.
