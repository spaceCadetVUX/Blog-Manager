---
url: "https://knxstore.vn/huong-dan-thiet-lap-cam-bien-casambi-dali-cp-electronic.html"
headline: "Hướng dẫn thiết lập và vận hành cảm biến Casambi DALI CP Electronic series"
description: "Bài viết hướng dẫn thiết lập và vận hành cơ bản các thiết bị cảm biến Casambi DALI CP Electronic như EBDSPIR-CB-NN, EBDSPIR-CB-DD, EBDHS-B-CB-DD,v.v.."
title: "Hướng dẫn thiết lập cảm biến Casambi DALI CP Electronic"
image: "https://knxstore.vn/media/0aa8922621c40b95ab20ec8cacc74095609efd2526c43652f681bba94aad0861.jpg"
datePublished: "2025-05-28T03:46:16.000Z"
dateModified: "2025-05-28T03:46:16.000Z"
publisher: "KNXStore.vn"
articleSection: "Kiến thức"
word_count: 4438
keywords: ["Kiến thức"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Kiến thức"
    url: "https://knxstore.vn/blogs/kien-thuc"
  - name: "Hướng dẫn thiết lập và vận hành cảm biến Casambi DALI CP Electronic series"
    url: "https://knxstore.vn/huong-dan-thiet-lap-cam-bien-casambi-dali-cp-electronic.html"
products: [{"url": "https://knxstore.vn/products/casambi-cam-bien-hong-ngoai-khu-vuc-tran-cao-ebdhs-b-cb-dd", "name": "EBDHS-B-CB-DD"}, {"url": "https://knxstore.vn/products/casambi-cam-bien-hong-ngoai-gan-tran-ebdspir-cb-dd", "name": "EBDSPIR-CB-DD"}]
related_links:
  - url: "https://knxstore.vn/giam-sat-nang-luong-trong-he-thong-knx-vi-sao-phai-do-dien-truoc-khi-tiet-kiem-dien.html"
    slug: "giam-sat-nang-luong-trong-he-thong-knx-vi-sao-phai-do-dien-truoc-khi-tiet-kiem-dien"
    anchor: "Giám Sát Năng Lượng Trong Hệ Thống KNX: Vì Sao Phải Đo Điện Trước Khi Tiết Kiệm Điện"
    position: 1
  - url: "https://knxstore.vn/ic-la-gi-vai-tro-cua-ic-trong-thiet-bi-smarthome.html"
    slug: "ic-la-gi-vai-tro-cua-ic-trong-thiet-bi-smarthome"
    anchor: "IC Là Gì? Cấu Tạo, Chức Năng Và Vai Trò Trong Smarthome"
    position: 2
  - url: "https://knxstore.vn/nfc-la-gi-vi-sao-smarthome-hien-dai-deu-tich-hop-cong-nghe-nay.html"
    slug: "nfc-la-gi-vi-sao-smarthome-hien-dai-deu-tich-hop-cong-nghe-nay"
    anchor: "NFC là gì? Vì sao smarthome hiện đại đều tích hợp công nghệ này?"
    position: 3
  - url: "https://knxstore.vn/spi-la-gi-ung-dung-spi-led-controller-trong-led-rgbw.html"
    slug: "spi-la-gi-ung-dung-spi-led-controller-trong-led-rgbw"
    anchor: "SPI Là Gì? Ứng Dụng SPI LED Controller Trong LED RGBW"
    position: 4
---

# Hướng dẫn thiết lập và vận hành cảm biến Casambi DALI CP Electronic series

> Bài viết hướng dẫn thiết lập và vận hành cơ bản các thiết bị cảm biến Casambi DALI CP Electronic như EBDSPIR-CB-NN, EBDSPIR-CB-DD, EBDHS-B-CB-DD,v.v..

## Article Body

Với xu hướng công nghệ chiếu sáng hiện đại ngày càng phát triển, giải pháp Casambi – nền tảng điều khiển không dây – đang ngày càng được ứng dụng rộng rãi trong các công trình thông minh.
Trong bài viết này, KNXStore sẽ hướng dẫn bạn cách thiết lập và vận hành cảm biến Casambi DALI thuộc dòng CP Electronics một cách chi tiết, dễ hiểu và trực quan nhất.
Lưu ý: Mặc dù bài viết sử dụng cảm biến CP Electronics làm ví dụ minh họa, nhưng quy trình thiết lập này hoàn toàn có thể áp dụng tương tự cho các thiết bị điều khiển khác trong hệ thống Casambi. Chỉ cần thiết bị hỗ trợ kết nối vào mạng Casambi là bạn có thể triển khai với cùng phương pháp như trên.
Tổng quan về cảm biến Casambi DALI CP Electronics
Cấu trúc và thiết bị hệ thống Casambi
Nếu hệ thống Casambi vẫn còn quá xa lạ với bạn, vậy hãy cùng KNXStore điểm qua một vài điểm nổi bật của hệ thống này nhé. Hệ thống Casambi bao gồm các thiết bị điều khiển ánh sáng thông minh hoạt động trên nền tảng không dây, được lập trình và điều khiển thông qua ứng dụng trên thiết bị di động.
Các mẫu cảm biến CP như
EBDHS-B-CB-DD
(gắn trần cao) hay
EBDSPIR-CB-DD
(trần tiêu chuẩn) có mã định danh riêng để dễ dàng phân biệt và cấu hình.
Thiết bị cần thiết và truy cập cấu hình
Thiết bị di động: iOS hoặc Android, có tải ứng dụng Casambi (App Store hoặc CH Play)
NFC: Bắt buộc để cấu hình công tắc không dây EnOcean.
Internet: Khuyến nghị để tải dữ liệu thiết bị và đồng bộ dự án lên cloud Casambi.
Cập nhật phần mềm cảm biến
Người dùng có thể cập nhật firmware cảm biến CP trực tiếp từ ứng dụng Casambi. Việc cập nhật nên được thực hiện đồng bộ giữa các thiết bị để đảm bảo hoạt động thống nhất.
Thiết lập và quản lý mạng Casambi
Về cấu trúc mạng trong Casambi
Trong hệ sinh thái Casambi, mỗi dự án điều khiển chiếu sáng sẽ được tổ chức dưới dạng một mạng (network) riêng biệt. Một mạng bao gồm các thiết bị đầu cuối như cảm biến, đèn chiếu sáng, công tắc và các bộ điều khiển.
Khi người dùng đăng nhập vào ứng dụng Casambi, họ có thể truy cập và quản lý nhiều mạng khác nhau nếu có quyền truy cập. Mỗi mạng được định danh bằng một tên riêng – thường là tên dự án hoặc tầng/khu vực để dễ nhận biết.
Cách tạo và đặt tên mạng lưới
Người dùng có thể tạo một mạng mới bằng cách vào ứng dụng Casambi và chọn "Tạo một mạng lưới (Create a Network)".
Khi tạo mạng, ứng dụng sẽ yêu cầu bạn đặt tên và chọn loại cấu hình phù hợp. Casambi cung cấp 3 loại mạng chính:
Classic network: Tối đa 127 thiết bị, quyền người dùng bị giới hạn. Thích hợp với dự án nhỏ hoặc yêu cầu đơn giản.
Evolution network: Tối đa 250 thiết bị, đầy đủ quyền kiểm soát. Đây là cấu hình được khuyến nghị cho các dự án tòa nhà thương mại hoặc dân cư có quy mô lớn.
Với Evolution network, bạn có thể chọn giữa hai chế độ. Một là Balanced (Cân bằng) - chế độ này có tính tương thích cao, phù hợp khi dùng các thiết bị EnOcean đời cũ. Hoặc Performance (Hiệu suất tốt hơn) - chế độ này sẽ tối ưu hiệu suất truyền tải, khuyến nghị dùng nếu không có vấn đề về tương thích.
Xem ảnh trên - Giao diện lựa chọn và quản lý mạng Casambi. Bạn có thể thấy danh sách các mạng đã tạo hoặc đang hoạt động như “Classic SJ1”, “Demo1”, “My Network”, “Sales demo”. Mỗi mạng hiển thị số lượng thiết bị được kết nối và phiên bản mạng đang sử dụng.
Giao diện mạng và quản lý ngữ cảnh điều khiển
Sau khi tạo mạng, người dùng sẽ cấu hình các “cảnh (scenes)” – đây là các kịch bản điều khiển ánh sáng định nghĩa cách đèn phản ứng với các tín hiệu như chuyển động, ánh sáng ban ngày, công tắc, v.v.
Một “scene” có thể chứa:
Cài đặt độ sáng cho từng đèn
Cài đặt màu sắc (với đèn RGB hoặc tunable white)
Cài đặt điều kiện để kích hoạt (sự hiện diện, ánh sáng xung quanh,v.v..)
Ví dụ:
Scene1 dùng để xử lý sự hiện diện (Occupancy) → Khi có người, đèn Light1, Light2, Light3 sẽ bật sáng.
Scene2 dùng cho daylight → tự động điều chỉnh độ sáng theo ánh sáng ban ngày.
Cấu trúc điều khiển và quy trình hoạt động
Tất cả các chức năng điều khiển như cảm biến chuyển động, công tắc, bộ hẹn giờ,v.v.. sẽ được kết nối để gọi các “scene” phù hợp. Đây là quy trình làm việc chuẩn trong Casambi.
Sơ đồ liên kết điều khiển thể hiện như sau:
Sensor (cảm biến) sẽ phát hiện chuyển động hoặc mức độ ánh sáng.
Công tắc (Switch) và Timer có thể kích hoạt các kịch bản (Zone 1: max, Zone 1: night light...).
Các “scene” này sẽ điều khiển từng đèn theo nhóm đã thiết lập.
Lưu ý: Scene groups không được tạo qua chức năng [Group] mà dựa trên cách bạn định nghĩa scene. Điều này đảm bảo tính linh hoạt cao hơn trong các hệ thống chiếu sáng thông minh.
Ứng dụng dành cho người dùng - Casambi App
Trong hệ thống Casambi, các cảm biến CP Electronics được xử lý như “đèn có cảm biến”, tức là chúng không hiển thị độc lập như cảm biến mà nằm trong thuộc tính điều khiển của từng đèn chiếu sáng. Điều này giúp việc lập trình trở nên tinh gọn và dễ quản lý hơn.
Tab [Luminaires] – Quản lý đèn chiếu sáng
Trong ứng dụng Casambi, hầu hết các thao tác điều khiển đèn đều thực hiện trong tab [Luminaires]. Đây là nơi bạn có thể kiểm tra trạng thái thiết bị, chỉnh độ sáng hoặc màu ánh sáng bằng các thao tác trực quan:
Chạm một lần: Bật/Tắt đèn.
Nhấn và giữ: Hiện bảng điều khiển chi tiết.
Vuốt trái/phải: Điều chỉnh độ sáng (Dim out).
Vuốt lên/xuống: Điều chỉnh nhiệt độ màu (Colour temperature).
Trong tab Luminaires này có bao gồm chức năng nhóm - được dùng để điều khiển tự động hóa, mà chỉ hỗ trợ thao tác thủ công trên ứng dụng. Nếu bạn cần cấu hình cảm biến, lịch hẹn giờ, hoặc phản ứng theo ánh sáng ban ngày, hãy sử dụng Scenes (Ngữ cảnh) thay thế.
Tab [Gallery]
Tab này đơn thuần để xem bản đồ sơ đồ vị trí đèn, không cần thiết cho quá trình điều khiển. Bạn có thể bỏ qua bước này nếu mục tiêu chỉ là thiết lập ánh sáng hoặc cảm biến.
Tab [Scene] – Ngữ cảnh hoạt động
Ngữ cảnh (scene) được xem như là "trái tim" của hệ thống Casambi khi muốn tạo các kịch bản ánh sáng hoặc hành vi dựa trên sự kiện. Bạn có thể tham khảo cách tạo một ngữ cảnh như sau:
Vào tab [Scene]
Chọn [edit]
Nhấn [+] để tạo scene mới
Chọn đèn cần thiết và thiết lập đầu ra sáng/tắt (ON/OFF), mức dim (ví dụ: 50%)
Trong tab ngữ cảnh này có khá nhiều tính năng quan trọng. Cùng KNXStore điểm qua các chức năng được sử dụng phổ biến trong điều khiển chiếu sáng Casambi qua các phần bên dưới nhé!
Ngữ cảnh cho cảm biến CP Electronics
Thiết bị cảm biến CP hỗ trợ hai loại đầu ra như sau:
Switched Output (Bật/Tắt): Ví dụ tắt riêng dãy đèn gần màn chiếu.
DALI Dim Output (Giảm sáng DALI): Áp dụng toàn phòng theo ánh sáng tự nhiên.
Các cài đặt ngữ cảnh hợp lệ
Casambi không cho phép cấu hình “dim = 0% nhưng switched = ON” vì nó gây mâu thuẫn logic điều khiển. Hệ thống sẽ báo "Not valid!" nếu cố gắng lưu cấu hình này.
Ghi đè đối với các đầu ra Switched trong kiểm soát ánh sáng ban ngày
Để giữ đèn luôn tắt, kể cả khi ánh sáng yếu, hãy cấu hình cảnh có switched = OFF. Nhờ đó, cảm biến sẽ không tự bật lại đèn, dù mức lux thấp.
Cài đặt kiểm soát ánh sáng ban ngày (Daylight Control Settings)
Chức năng kiểm soát ánh sáng ban ngày trong Casambi cho phép hệ thống điều chỉnh độ sáng của đèn theo mức độ ánh sáng tự nhiên hiện có trong không gian.
Đây là một trong những phương pháp hiệu quả nhất để tiết kiệm năng lượng mà vẫn đảm bảo độ sáng tiêu chuẩn cho môi trường làm việc, học tập hoặc sinh hoạt.
Cơ chế hoạt động của chế độ vòng lặp kín (Closed Loop) như thế nào?
Ở chế độ này, cảm biến liên tục đọc giá trị ánh sáng hiện tại (lux) trong khu vực chiếu sáng và so sánh với giá trị lux mục tiêu do người dùng thiết lập.
Dựa trên sự chênh lệch đó, hệ thống sẽ tự động tăng/giảm độ sáng của các đèn (dimmable) để đưa tổng mức chiếu sáng về gần với giá trị mong muốn.
Lưu ý: Cảm biến bị ảnh hưởng bởi chính các đèn trong khu vực nó đang đo, vì vậy cảm biến và nhóm đèn nên được đặt cùng khu vực. Đồng thời, chỉ nên áp dụng Closed Loop khi chức năng kiểm soát ánh sáng ban ngày là cấp độ điều khiển ưu tiên cao nhất trong cấu trúc điều khiển (Control Hierarchy).
Nếu bạn quan tâm đến cách thiết lập Closed Loop trong Scene, có thể làm theo các bước chỉ dẫn dưới đây (Hoặc tham khảo thêm tại
video này
):
Bước 1: Khởi tạo lại giá trị gốc. Trước tiên, đảm bảo các thông số mặc định từ CP Electronics được khôi phục để tránh xung đột thiết lập trước đó. (Tham khảo phụ lục 1 nếu cần.)
Bước 2: Truy cập vào cảnh cần điều khiển. Bạn có thể làm theo các bước sau:
Vào tab [Scenes]
Chọn cảnh muốn cấu hình
Nhấn đúp (Double tap) vào biểu tượng cảnh để mở phần cài đặt chi tiết.
Bước 3: Thiết lập kiểm soát ánh sáng ban ngày
Trong mục Daylight Control, chọn [Closed loop] cho chế độ vận hành.
Tiếp theo, tại phần Controlling sensors, chọn cảm biến chính được sử dụng để điều chỉnh độ sáng.
(**Nếu chọn nhiều cảm biến, hệ thống sẽ sử dụng giá trị trung bình các cảm biến để ra quyết định.)
Bước 4, Kích hoạt chế độ toàn dải giảm sáng.
Bật tùy chọn “Use the full dim range”
Đây là điều bắt buộc để đảm bảo cảm biến CP phản hồi chính xác với tín hiệu điều khiển độ sáng.
Bước 5: Thiết lập mức Lux mong muốn.
Chỉnh thanh trượt tại mục Desired illuminance hoặc nhập trực tiếp con số, ví dụ: 500 lux.
Tùy thuộc không gian (văn phòng, lớp học, nhà ở), bạn có thể thay đổi mức này linh hoạt.
Bước 6: Lưu lại và chờ cảm biến phản hồi.
Sau khi hoàn tất cấu hình, cảm biến sẽ bắt đầu giám sát và điều khiển độ sáng. Hãy cho hệ thống 1–2 phút để bắt đầu điều chỉnh và ổn định.
Cài đặt mặc định sẽ tạo phản ứng điều khiển mềm mại (mượt mà) giúp người dùng không bị chói hoặc khó chịu vì thay đổi đột ngột.
Sau khi đã chạy thử, nếu muốn tăng độ nhạy của cảm biến hoặc làm cho đèn phản ứng nhanh hơn với thay đổi ánh sáng tự nhiên, bạn có thể tinh chỉnh thêm tại mục "Cài đặt hành vi phản ứng nhanh hơn" bên dưới nhé!
Cài đặt hành vi phản ứng nhanh hơn (Enhanced Light Response Behavior)
Nếu bạn cần hệ thống chiếu sáng phản hồi nhanh hơn với thay đổi độ sáng môi trường, đặc biệt khi mây che nắng hoặc khi có sự thay đổi đột ngột về ánh sáng tự nhiên, bạn có thể tinh chỉnh độ nhạy (Sensitivity) và độ chịu đựng (Tolerance) của cảm biến ánh sáng trong Casambi.
Mục tiêu của việc này là để rút ngắn độ trễ và tăng độ chính xác khi hệ thống điều chỉnh ánh sáng tự động theo điều kiện thực tế.
Bạn cần theo sát hướng dẫn sau để thiết lập các chỉ số phản hồi của hệ thống chiếu sáng nhé:
Bước 1: Truy cập cấu hình cảm biến.
Mở tab [Luminaire], chọn cảm biến cần cấu hình.
Nhấn [Edit] ở góc trên bên phải màn hình.
Nhấn đúp (Double Tap) vào cảm biến để mở phần chỉnh sửa thuộc tính ánh sáng.
Bước 2: Chỉnh các thông số như sau:
Tham số
Mục đích
Giá trị khuyến nghị
Use full dim range
Cho phép cảm biến điều chỉnh từ 0–100%
✅ Bật
Sensitivity
Cảm biến nhạy hơn với thay đổi ánh sáng
90%
Tolerance
Cảm biến phản ứng với sai số nhỏ hơn
2%
Change rate
Tốc độ cập nhật phản ứng ánh sáng
1.0 sec
Daylight gain
Hệ số bù ánh sáng từ cảm biến
100% (mặc định)
Min/Max dim level
Ngưỡng tối thiểu/tối đa đèn sẽ dim
0% – 100% (mặc định)
Lưu ý: Thiết lập này nhằm đảm bảo hệ thống có thể phát hiện và điều chỉnh độ sáng kịp thời mà không gây ra hiệu ứng nhấp nháy hoặc thay đổi quá đột ngột.
Các phương pháp khác của kiểm soát ánh sáng ban ngày
Bên cạnh chế độ Closed Loop, Casambi hỗ trợ thêm các phương pháp khác để xử lý ánh sáng theo điều kiện thực tế, bao gồm:
Thứ nhất, kiểm soát dạng BẬT/TẮT dựa vào ngưỡng Lux (On/Off Control)
Hệ thống bật đèn khi Lux đo được < ngưỡng đặt.
Tắt đèn khi Lux đo được > ngưỡng đặt.
Phù hợp với các đèn cơ bản không hỗ trợ dimming.
Có thể hoạt động khi đây là mục ưu tiên cao nhất trong cấu trúc điều khiển.
Ví dụ: Hệ thống của bạn sẽ bật đèn khi trời tối dưới 300 lux, và sẽ tắt đèn khi trời sáng vượt 500 lux.
Thứ hai, kiểm soát ánh sáng theo đồ thị phản hồi – Vòng lặp mở (Open Loop)
Cảm biến ánh sáng được đặt ngoài vùng ảnh hưởng ánh sáng của đèn.
Giá trị Lux từ cảm biến sẽ được so sánh với đường cong phản ứng → từ đó xác định mức dim (0–100%) phù hợp.
Không cần cảm biến ở gần đèn → cực kỳ phù hợp khi cảm biến đặt gần cửa sổ hoặc bên ngoài.
Ưu điểm của phương pháp Open Loop đó là cảm biến có thể vận hành độc lập, không bị ảnh hưởng bởi đèn LED chiếu vào. Và chúng vẫn hoạt động tốt dù không ở cấp độ ưu tiên cao nhất trong cấu trúc điều khiển.
>>>Có thể bạn quan tâm: Cách thiết lập
Open Loop cho cảm biến NEMA Olfer DALI trên Casambi App
Tóm lại, bạn có thể tham khảo các phương pháp điều khiển đèn với cảm biến như sau:
Tình huống
Phương pháp đề xuất
Đèn không hỗ trợ dimming
Bật/Tắt dựa vào ngưỡng Lux
Cảm biến và đèn cùng khu vực
Vòng lặp kín (Closed Loop)
Cảm biến gần cửa, xa khỏi đèn
Vòng lặp mở (Open Loop)
Thêm nhiều tính năng hơn nữa với menu "More"
Tất cả các chức năng bổ sung như hẹn giờ, cảm biến, công tắc, thiết lập mạng,v.v.. đều có thể được truy cập trong tab [More] ở góc dưới bên phải màn hình chính.
Kích hoạt bảng ưu tiên kiểm soát
Vào [More] > Network setup > Control options, bật công tắc [Use control hierarchy]. Việc bật tùy chọn này rất quan trọng để cho phép hệ thống Casambi xử lý ưu tiên giữa các điều khiển như cảm biến, công tắc và hẹn giờ.
Khi bật thành công, biểu tượng @ sẽ xuất hiện ở góc dưới bên trái — đây là nơi người dùng có thể thủ công khôi phục tự động hóa.
Cài đặt cảm biến cho kiểm soát sự hiện diện
Vào [More] > Sensors, chọn cảm biến hiện diện, gán cho nhóm đèn mong muốn và thiết lập chế độ hoạt động:
Presence: chỉ định cảnh BẬT (ON), hệ thống sẽ tự xử lý cảnh TẮT.
Presence/Absence: chỉ định cả cảnh BẬT và TẮT.
Absence Only: chỉ cần chỉ định cảnh TẮT.
Nếu cần thiết, bạn có thể thiết lập thêm các thông số như:
Linger time: thời gian chờ khi không phát hiện chuyển động trước khi chuyển cảnh.
Fade out: thời gian làm mờ đèn dần về 0%.
Xem biểu đồ thời gian kiểm soát (bên dưới) để hiểu rõ luồng điều khiển.
Thiết lập giá trị giảm sáng và đầu ra ON/OFF & Dimming
Không cho phép cấu hình cảnh với Dim Out = 0% và Switched Output = ON — cấu hình này không hợp lệ. Bạn có thể xem chi tiết lại mục "Các cài đặt ngữ cảnh hợp lệ" về các thiết lập cảnh hợp lệ trong bài viết này.
Thêm cảm biến phụ vào cùng nhóm
Lặp lại các bước trên với từng cảm biến phụ, gán chung một nhóm đèn và sử dụng chung cảnh ON/OFF. Mỗi cảm biến sẽ đếm ngược riêng, khi tất cả hết thời gian thì toàn bộ nhóm sẽ chuyển sang trạng thái TẮT.
Cài đặt thời gian đếm
CP Electronics tuân thủ đúng các giá trị đếm thời gian trong Casambi, không cần cấu hình đặc biệt. Hệ thống sẽ điều khiển mượt mà dựa theo cấu trúc ưu tiên được thiết lập trong Control Hierarchy.
Ưu tiên kiểm soát
Khi ưu tiên cao hơn bị gỡ bỏ, Casambi sẽ chuyển sang ưu tiên kế tiếp. Nếu không còn điều khiển nào, đèn sẽ tự động tắt. Thứ tự ưu tiên:
Điều khiển thủ công (app, công tắc)
Timer theo ngày (override bởi cảm biến)
Timer theo tuần (override bởi cảm biến)
Cảm biến sự hiện diện
Timer theo ngày
Timer theo tuần
Kiểm soát ánh sáng thủ công có mức ưu tiên cao nhất và luôn được ghi đè để kiểm soát tự động. Khi bật thủ công (manual override), người dùng có thể duy trì trạng thái ON cho đến khi hết thời gian đếm ngược hoặc tắt thủ công. Nếu thời gian kết thúc, quyền điều khiển sẽ trở lại ưu tiên kế tiếp. Biểu tượng @ sẽ xuất hiện trên đèn khi đang bị cảm biến hoặc timer kiểm soát — chạm vào để xóa điều khiển thủ công.
Thiết lập công tắc EnOcean trong Casambi App
EnOcean chỉ hoạt động trong mạng Evolution được thiết lập ở chế độ Evolution -> Balanced. Khi tạo mạng mới, tại mục [Mode], bạn chọn “Balanced”. Mục này không thể thay đổi sau khi đã tạo xong.
Cách thêm công tắc EnOcean
Vào [More] > Switches > Add an EnOcean switch
Chạm nhẹ phần trên điện thoại có NFC vào công tắc.
Nếu gặp lỗi tương thích, ứng dụng sẽ cảnh báo. Khi đó, cần kiểm tra lại mạng đã ở chế độ “Balanced” chưa.
Đặt phần đầu trên của điện thoại gần công tắc EnOcean và thực hiện một cú chạm để có phản ứng tốt nhất.
Đối với dòng iPhone 7, hiệu quả kết nối tốt nhất đạt được khi đặt phần đầu của điện thoại sát mép dưới của công tắc EnOcean và thực hiện thao tác chạm nhẹ.
Với các dòng điện thoại khác, vị trí cảm biến NFC có thể khác nhau, vì vậy bạn nên thử chạm ở nhiều vị trí trên mặt sau thiết bị để tìm ra điểm nhận tín hiệu tối ưu nhất.
Nếu bạn cố gắng thêm thiết bị EnOcean vào mạng được tạo với chế độ “Better performance”, ứng dụng sẽ hiển thị cảnh báo như hình. Điều này xảy ra do thiết bị EnOcean chỉ tương thích với chế độ "Balanced".
Để tránh lỗi, hãy đảm bảo chọn chế độ Balanced khi tạo mạng Casambi ngay từ đầu. Một khi mạng đã được tạo, chế độ này không thể thay đổi lại sau đó.
Gán chức năng cho nút nhấn
Mỗi nút trên công tắc EnOcean có thể gán chức năng gọi cảnh, nhóm đèn hoặc đèn đơn:
Tap to select > Chọn chức năng.
Gán nút cho “Control a scene”, “Control a luminaire” hoặc “Control an element”.
Nếu bạn muốn một nút chỉ điều khiển đầu ra công tắc (không ảnh hưởng dimming), chọn Control an element và gán nó cho thành phần “Switched Output” trong cảm biến.
Thời gian timeout cho chế độ điều khiển bằng tay
Để tránh tình trạng đèn chiếu sáng được bật thủ công nhưng không được tắt, hệ thống Casambi cho phép cấu hình thời gian đếm ngược (manual timeout).
Tính năng này đảm bảo rằng sau một khoảng thời gian định trước, nếu không có tín hiệu điều khiển tự động nào (như cảm biến sự hiện diện hoặc hẹn giờ), thì hệ thống sẽ tự động hủy bỏ điều khiển thủ công và trả quyền kiểm soát lại cho các chức năng tự động.
Thao tác cấu hình:
Truy cập vào More > Network Setup > Control Options.
Cuộn xuống mục Manual Control Timeouts.
Cài đặt thời gian đếm ngược theo từng ngày trong tuần (ví dụ: Thứ Hai từ 07:00 đến 18:00).
Nhấn vào từng ngày để điều chỉnh thời gian đếm ngược — bạn có thể thiết lập thời gian riêng biệt cho ban ngày và ban đêm nếu cần.
Ví dụ cấu hình: Bạn có thể đặt thời gian đếm ngược cho điều khiển tay vào thứ Hai là 2 giờ 1 phút cho cả ngày và đêm (2:01 / 2:01).
Điều này có nghĩa là: nếu người dùng bật đèn bằng tay, và sau 2 giờ 1 phút không có hành động nào khác, hệ thống sẽ tự động trả lại trạng thái theo các logic tự động đã thiết lập trước đó.
Các ứng dụng điển hình
Kiểm soát ánh sáng ban ngày cho đèn dimmable và non-dimmable
Một trong những kịch bản phổ biến trong thực tế là khi một khu vực chiếu sáng có hai loại đèn: một dãy đèn gần cửa sổ có khả năng điều chỉnh độ sáng (dimmable) để tận dụng ánh sáng tự nhiên, và một dãy đèn bên trong không có khả năng dim (non-dimmable).
Cả hai dãy đèn sẽ được điều khiển dựa trên cảm biến hiện diện (occupancy) và cảm biến ánh sáng ban ngày (daylight harvesting) thông qua cảm biến Casambi DALI của CP Electronics.
Cấu trúc điều khiển:
Dãy đèn gần cửa sổ (Dim Row Light3, Light4) sẽ điều khiển bằng chế độ điều chỉnh độ sáng tự động theo mức ánh sáng ban ngày.
Dãy đèn bên trong (Inner Row Light1, Light2) thì không có khả năng dim, sẽ bật/tắt hoàn toàn theo trạng thái phát hiện hiện diện.
PD (Passive Infrared Sensor) là cảm biến thực hiện công việc điều khiển toàn bộ khu vực (Occupancy Control Group).
Mục tiêu vận hành:
Khi phát hiện có người, hệ thống sẽ bật đèn non-dimmable và đặt dimmable ở mức sáng đã định.
Khi không có người, hệ thống sẽ tắt toàn bộ.
Khi có đủ ánh sáng tự nhiên, hệ thống sẽ dim đèn gần cửa sổ về 0% và có thể tắt cả dãy đèn non-dimmable nếu cấu hình yêu cầu.
Các bước thiết lập chi tiết trong ứng dụng Casambi
Bước 1: Tạo mạng điều khiển
Mở ứng dụng Casambi, sau đó quét và thêm các thiết bị chiếu sáng và cảm biến CP Electronics vào mạng.
Đặt tên mạng (VD: “Regents Floor 1”). Sau đó chọn kiểu mạng Evolution để sử dụng đầy đủ tính năng mới.
Bước 2: Tạo cảnh BẬT (ON Scene) cho trạng thái có hiện diện
Vào mục [Scenes] → chọn [Edit].
Nhấn dấu [+] để tạo cảnh mới → đặt tên (VD: “Bật tất cả + Ban ngày”).
Thêm toàn bộ các đèn cần điều khiển.
Nhấn giữ vào từng đèn để hiện thanh trượt:
Đèn dimmable: đặt mức sáng (VD: 50%).
Đèn non-dimmable: đảm bảo trạng thái là ON.
Nhấn [Done] để lưu lại cảnh.
Bước 3: Cấu hình cảm biến hiện diện
Ở bước này, bạn có thể vào Phụ lục 1 (trong manual CP Electronics) để đặt toàn bộ các thông số cảm biến về giá trị mặc định (Initial Setup).
Bước 4: Kích hoạt bảng ưu tiên điều khiển
Vào mục More → chọn [Network Setup].
Kích hoạt mục [Use control hierarchy table] để ưu tiên điều khiển bằng hiện diện, đồng thời vẫn cho phép sử dụng công tắc hoặc các dạng điều khiển khác nếu cần.
Minh họa cấu hình tham khảo
Tính năng
Cách triển khai
Occupancy
Bật/tắt cả hai dãy đèn:
• ON Scene = Switched out: ON, Dim out: 50%
• OFF Scene = Switched out: OFF, Dim out: 0%
Daylight
Dim đèn gần cửa sổ tùy thuộc ánh sáng tự nhiên:
• Mode = Closed Loop
• Mức Lux mong muốn = 500 lux
• Daylight min dim = 0% hoặc 3% tùy trường hợp
Lưu ý: Nếu yêu cầu giữ đèn luôn bật dù ánh sáng tự nhiên cao, hãy đặt giá trị Daylight min dim = 3% để giữ ánh sáng thấp nhất thay vì tắt hoàn toàn.
Thông qua hướng dẫn chi tiết ở trên, hy vọng bạn đọc đã có thể nắm rõ quy trình thiết lập cảm biến Casambi DALI CP Electronics một cách hiệu quả, từ cấu hình chiếu sáng đến kiểm soát hiện diện và ánh sáng ban ngày. Đây là giải pháp thông minh không chỉ giúp tối ưu hóa trải nghiệm chiếu sáng mà còn góp phần tiết kiệm năng lượng và vận hành bền vững cho công trình.
Nếu bạn có bất kỳ thắc mắc nào trong quá trình triển khai thực tế, đừng ngần ngại liên hệ với đội ngũ kỹ thuật của KNXStore để được hỗ trợ nhanh chóng và chính xác.

## Raw MCP

```json
{
  "slug": "huong-dan-thiet-lap-cam-bien-casambi-dali-cp-electronic",
  "title": "Hướng dẫn thiết lập và vận hành cảm biến Casambi DALI CP Electronic series",
  "excerpt": "Bài viết hướng dẫn thiết lập và vận hành cơ bản các thiết bị cảm biến Casambi DALI CP Electronic như EBDSPIR-CB-NN, EBDSPIR-CB-DD, EBDHS-B-CB-DD,v.v..",
  "coverImage": "/media/0aa8922621c40b95ab20ec8cacc74095609efd2526c43652f681bba94aad0861.jpg",
  "authorName": null,
  "author": null,
  "publishedAt": "2025-05-28T03:46:16.000Z",
  "categories": [
    {
      "slug": "kien-thuc",
      "name": "Kiến thức"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Hướng dẫn thiết lập cảm biến Casambi DALI CP Electronic",
  "seoDescription": "Bài viết hướng dẫn thiết lập và vận hành cơ bản các thiết bị cảm biến Casambi DALI CP Electronic như EBDSPIR-CB-NN, EBDSPIR-CB-DD, EBDHS-B-CB-DD,v.v..",
  "faqs": [],
  "editedAt": null,
  "url": "https://knxstore.vn/huong-dan-thiet-lap-cam-bien-casambi-dali-cp-electronic.html"
}
```
