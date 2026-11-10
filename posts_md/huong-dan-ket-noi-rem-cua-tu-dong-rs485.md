---
url: "https://knxstore.vn/huong-dan-ket-noi-rem-cua-tu-dong-rs485.html"
headline: "Hướng dẫn kết nối rèm cửa tự động RS485"
description: "Kết nối rèm cửa tự động qua RS485: cấu trúc khung lệnh, sơ đồ dây RJ12, khoảng cách truyền, và cách chọn gateway RS485-KNX phù hợp. Hướng dẫn từ KNXStore."
image: "https://knxstore.vn/media/d2220b3f68c1916a18b2c76b2ea2d61f1ea3c31134d5b9f5391c2ecba18737cf.jpg"
datePublished: "2026-08-05T03:02:10.000Z"
dateModified: "2026-08-05T03:02:10.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Hướng dẫn"
word_count: 1894
keywords: ["Hướng dẫn"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Hướng dẫn"
    url: "https://knxstore.vn/blogs/huong-dan"
  - name: "Hướng dẫn kết nối rèm cửa tự động RS485"
    url: "https://knxstore.vn/huong-dan-ket-noi-rem-cua-tu-dong-rs485.html"
products: [{"url": "https://knxstore.vn/products/bo-dieu-khien-knx-host-5-cong-rs485-12-kenh-1-cong-dali-kanonbus-kcc-box3", "name": "Bộ điều khiển Host, 5 cổng RS485, 12 kênh, 1 cổng DALI Kanonbus - KCC-BOX3"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-knx-host-kts-d3", "name": "Bộ điều khiển KNX host đa năng Kanonbus - KTS-D1, D2, D3"}]
internal_links:
  - url: "https://knxstore.vn/cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx.html"
    slug: "cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx"
    anchor: "Các phương án điều khiển rèm cửa tự động cho Smarthome KNX"
related_links:
  - url: "https://knxstore.vn/gateway-kba-kanonbus-ket-noi-rs485-knx-vao-bms-toa-nha.html"
    slug: "gateway-kba-kanonbus-ket-noi-rs485-knx-vao-bms-toa-nha"
    anchor: "Gateway KBA Kanonbus: Kết Nối RS485 & KNX Vào BMS Tòa Nhà"
    position: 1
  - url: "https://knxstore.vn/huong-dan-cap-nhat-firmware-va-main-program-kanonbus-kac005-moi-nhat-2026.html"
    slug: "huong-dan-cap-nhat-firmware-va-main-program-kanonbus-kac005-moi-nhat-2026"
    anchor: "Hướng Dẫn Cập Nhật Firmware Và Main Program Kanonbus KAC005 Mới Nhất 2026"
    position: 2
  - url: "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
    slug: "huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx"
    anchor: "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX"
    position: 3
  - url: "https://knxstore.vn/cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx.html"
    slug: "cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx"
    anchor: "Các phương án điều khiển rèm cửa tự động cho Smarthome KNX"
    position: 4
---

# Hướng dẫn kết nối rèm cửa tự động RS485

> Kết nối rèm cửa tự động qua RS485: cấu trúc khung lệnh, sơ đồ dây RJ12, khoảng cách truyền, và cách chọn gateway RS485-KNX phù hợp. Hướng dẫn từ KNXStore.

## Article Body

Trong hệ thống tự động hóa tòa nhà, RS485 là chuẩn giao tiếp truyền thông phổ biến, được ưa chuộng bởi khả năng kết nối ổn định, truyền xa và hỗ trợ đa thiết bị trên cùng một đường bus. Nhờ ưu điểm đó, RS485 được ứng dụng rộng rãi trong điều khiển các thiết bị như cảm biến, đèn chiếu sáng, và đặc biệt là động cơ rèm cửa tự động.
Tại sao chọn RS485 cho động cơ rèm cửa
Động cơ rèm tích hợp RS485 cho phép điều khiển dễ dàng thông qua máy tính, hệ thống BMS (Building Management System), hoặc bộ điều khiển trung tâm như KNX. So với điều khiển dry contact hoặc RF, RS485 mang lại:
Kết nối nhiều động cơ trên một đường dây duy nhất (multi-drop bus), không cần kéo dây riêng cho từng động cơ.
Giao tiếp hai chiều: hệ thống điều khiển không chỉ gửi lệnh mà còn nhận phản hồi trạng thái, vị trí, hoặc mã lỗi từ động cơ.
Ổn định và ít nhiễu, phù hợp với các công trình lớn hoặc tòa nhà nhiều tầng có khoảng cách đi dây xa.
Một khi kết nối động cơ rèm RS485 với thiết bị điều khiển, việc vận hành rèm trở nên dễ dàng và thuận tiện hơn thông qua ứng dụng trên máy tính hoặc hệ thống quản lý tòa nhà.
Giao thức trên đường RS485: không phải lúc nào cũng là Modbus
Một điểm cần làm rõ khi triển khai thực tế: RS485 chỉ là lớp vật lý (physical layer) truyền tín hiệu điện, còn cách các byte dữ liệu được đóng gói và diễn giải phụ thuộc vào giao thức tầng trên do từng hãng động cơ tự định nghĩa. Không phải mọi động cơ rèm RS485 đều dùng Modbus RTU chuẩn.
Ví dụ cụ thể từ tài liệu kỹ thuật của các hãng động cơ RS485 phổ biến:
AOK dùng một khung lệnh riêng, không phải Modbus: tốc độ 2400 bps, 8 data bit, 1 stop bit, không parity. Khung lệnh gửi từ hệ thống điều khiển xuống động cơ có cấu trúc
Mã đầu khung (0x9a) + ID động cơ (1 byte) + 2 byte Channel + 2 byte Data + Checksum (XOR)
. Ví dụ lệnh "Up" gửi tới động cơ ID 9, Channel 8 là chuỗi byte
9a 09 80 00 0a dd 5e
, trong đó
dd
là mã lệnh Up còn
5e
là checksum XOR của các byte trước đó. Động cơ phản hồi lại bằng khung riêng bắt đầu bằng
0xd8
, mang theo dòng điện, điện áp, tốc độ vòng quay (RPM) và vị trí hiện tại (0-100%).
Somfy dùng "Somfy RS485 Protocol" độc quyền cho dòng Sonesse 30/40 RS485 và bộ RS485 RTS Transmitter, không tương thích trực tiếp với khung Modbus hoặc khung AOK.
Các gateway RS485-KNX/BMS (như dòng Kanonbus KCC-NEW) thường đóng vai trò "phiên dịch": nhận đúng giao thức riêng của động cơ ở phía RS485, rồi chuyển đổi sang group address KNX hoặc điểm dữ liệu Modbus TCP/BACnet ở phía BMS.
Vì vậy, trước khi mua gateway hoặc lập trình tích hợp, cần xác nhận rõ động cơ rèm đang dùng giao thức RS485 nào (thường ghi trong datasheet là "Modbus RTU", "AOK protocol", hoặc tên riêng của hãng), để chọn gateway hỗ trợ đúng, tránh trường hợp gateway "nhận được điện nhưng không hiểu lệnh".
Sơ đồ đấu nối và đầu nối thường gặp
Cổng RS485 và đầu nối RJ12
Để kết nối và điều khiển rèm cửa tự động, có thể dùng cổng RS232 hoặc RS485. So về khoảng cách truyền tín hiệu, tốc độ truyền, khả năng chống nhiễu và số lượng thiết bị kết nối, RS485 chiếm ưu thế hơn RS232 về mọi mặt.
Trên nhiều dòng động cơ rèm cửa (kiểu track/thanh ray), cổng giao tiếp RS485 dùng đầu nối RJ12, trong đó thường có 2 dây tín hiệu (số 1 và số 6) dành cho truyền dữ liệu, đi cùng các dây khác trên cùng đầu RJ12 dành cho điều khiển dry contact (UP/DOWN/STOP/COM) khi không dùng RS485. Cách bố trí phổ biến trên đầu RJ12:
Dây
Chức năng
Port A (RS485/RS232)
Dữ liệu RS485/RS232
Port B (RS485/RS232)
Dữ liệu RS485/RS232
UP
Điều khiển kéo lên qua dry contact
DOWN
Điều khiển kéo xuống qua dry contact
STOP
Dừng qua dry contact
COM
Chân chung (potential-free) cho các lệnh dry contact
Trên dòng động cơ dạng ống tròn (tubular motor) như Sonesse RS485, đấu nối RS485 lại đi qua cáp 3 lõi ngay tại đầu motor, không qua RJ12: dây GND (đen), DATA- (vàng), DATA+ (cam). Vì vậy, cần đọc đúng tài liệu đấu nối của từng dòng motor cụ thể trước khi thi công, không áp dụng máy móc một sơ đồ chung cho mọi hãng.
Công cụ cấu hình qua RS485
Với các dự án cần đặt limit, đặt nhóm điều khiển, hoặc đọc trạng thái động cơ trước khi tích hợp vào KNX/BMS, kỹ thuật viên thường dùng bộ chuyển đổi USB-to-RS485 kết nối trực tiếp máy tính với đường bus, cùng phần mềm cấu hình do hãng cung cấp. Phần mềm này thường có 3 bước cơ bản: chọn cổng COM đang kết nối, quét (discover) toàn bộ node động cơ đang có trên bus, sau đó chọn từng node để đặt limit, đặt nhóm hoặc test lệnh Up/Stop/Down. Nguyên lý này áp dụng chung cho hầu hết hệ động cơ RS485 chuyên dụng, không riêng một hãng nào.
Kết nối và giới hạn hệ thống RS485
Về khoảng cách truyền, RS485 có thể truyền tín hiệu lên đến 1200 mét trong điều kiện lý tưởng (theo chuẩn EIA/TIA-485-A). Nếu cần mở rộng, có thể dùng bộ lặp tín hiệu (repeater) tối đa 8 bộ lặp cho khoảng cách truyền lên tới 9,6 km.
Nếu dự án có yêu cầu truyền xa hơn nữa, có thể chuyển đổi hệ thống sang cáp quang kết hợp bộ chuyển đổi quang điện. Cáp đa mode đạt 5-10 km, cáp đơn mode có thể lên đến 50 km.
Số lượng thiết bị trên mỗi đường RS485 có thể kết nối tối đa 16 động cơ rèm (tùy gateway/controller), giúp mở rộng kiểm soát rèm cửa linh hoạt cho các căn hộ hoặc văn phòng nhiều khu vực.
Sử dụng thiết bị điều khiển nào để đưa rèm RS485 vào KNX
Một trong những thiết bị lý tưởng để tích hợp rèm cửa RS485 vào hệ thống nhà thông minh KNX là
KTS D3
của Kanonbus. Thiết bị đóng vai trò gateway trung gian, hỗ trợ:
Kết nối nhiều động cơ rèm RS485 trên một đường bus, miễn là các động cơ dùng chung giao thức mà gateway hỗ trợ (cần xác nhận với nhà cung cấp trước khi đấu nối hàng loạt động cơ khác hãng).
Giao tiếp đồng thời giữa hệ thống KNX và RS485, cho phép lập trình kịch bản rèm cùng lịch trình ánh sáng, cảm biến trong ETS.
Quản lý rèm theo vùng, nhóm hoặc theo lịch trình.
Nếu công trình cần một host trung tâm quản lý đồng thời nhiều loại thiết bị RS485 khác (điều hòa, sàn nhiệt) ngoài rèm, xem thêm
Các phương án điều khiển rèm cửa tự động cho Smarthome KNX
để so sánh phương án dùng KNX host đa giao thức (Kanonbus KTS-Dx) thay vì gateway RS485 chuyên biệt.
Các loại đầu nối cần nhận biết khi triển khai
Dây tín hiệu và nguồn cấp. Cần phân biệt rõ ràng giữa dây điều khiển (data) và dây nguồn động lực để tránh nhầm lẫn khi thi công, đặc biệt trên các dòng dùng chung một đầu nối cho cả dry contact và RS485.
Đầu nối động cơ rèm cuốn. Cần nhận biết dây tín hiệu điều khiển chiều quay và điểm dừng.
Đầu nối rèm kéo ngang. Đặc biệt lưu ý kết nối chính xác tín hiệu mở trái/phải và vị trí trung gian.
Ứng dụng thực tế
RS485 là giải pháp kết nối mạnh mẽ cho hệ thống rèm cửa tự động quy mô vừa và lớn: với giao thức đúng chuẩn của từng hãng và gateway phù hợp, người dùng có thể tích hợp điều khiển rèm vào toàn bộ hệ thống BMS hoặc KNX, đồng thời tiết kiệm chi phí dây dẫn nhờ khả năng đấu nối nhiều động cơ trên một bus và nâng cao tính ổn định của toàn hệ thống so với dùng riêng lẻ từng đường dry contact.
Kết luận
RS485 là giải pháp bus mạnh và tiết kiệm dây cho hệ thống rèm cửa tự động quy mô lớn, nhưng khác với cảm nhận thông thường, không phải mọi động cơ RS485 đều nói chung một "ngôn ngữ" Modbus  mỗi hãng có thể dùng khung lệnh riêng, nên việc chọn đúng gateway trung gian (như Kanonbus KCC-NEW cho hệ KNX) và xác nhận giao thức tương thích trước khi lắp đặt là bước quan trọng để tránh lỗi tích hợp.
Cần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
RS485 trên động cơ rèm có phải luôn là Modbus không?
Không. Nhiều hãng động cơ (ví dụ AOK, Somfy) dùng khung lệnh RS485 riêng, không phải Modbus RTU chuẩn. Modbus RTU chỉ là một trong các giao thức có thể chạy trên lớp vật lý RS485, chủ yếu gặp ở các gateway BMS. Cần đọc datasheet động cơ để biết chính xác giao thức, tránh chọn nhầm gateway.

Sự khác biệt giữa điều khiển RS485 và dry contact cho rèm là gì?
Dry contact chỉ truyền tín hiệu đóng/mở tiếp điểm đơn giản (lên/xuống/dừng), không có phản hồi trạng thái và mỗi động cơ thường cần một đường dây riêng về bộ điều khiển. RS485 truyền dữ liệu số hai chiều, cho phép nhiều động cơ chia sẻ chung một bus và hệ thống điều khiển đọc được vị trí, tốc độ, hoặc lỗi của từng động cơ.

Có thể trộn nhiều hãng động cơ RS485 khác nhau trên cùng một bus không?
Không nên, trừ khi gateway trung tâm xác nhận hỗ trợ đồng thời nhiều giao thức. Vì mỗi hãng đóng khung lệnh khác nhau (như ví dụ AOK và Somfy ở trên), gateway chỉ "hiểu" đúng giao thức nó được thiết kế để giao tiếp; trộn lẫn dễ gây lỗi giao tiếp hoặc động cơ không phản hồi.

Làm sao biết động cơ rèm hiện có tương thích RS485-KNX không?
Kiểm tra datasheet động cơ có ghi rõ giao thức RS485 cụ thể (tên hãng hoặc Modbus RTU), rồi đối chiếu với thông số gateway RS485-KNX dự kiến dùng. Nếu không chắc, nên gửi model động cơ cho đội kỹ thuật của nhà cung cấp gateway để xác nhận trước khi mua.

Ngoài rèm, RS485 còn dùng cho thiết bị nào trong nhà thông minh?
RS485 là chuẩn giao tiếp công nghiệp dùng rộng rãi cho điều hòa VRV/VRF (qua Modbus RTU), sàn nhiệt, cảm biến đa điểm, và các gateway BMS nói chung — không riêng cho rèm cửa.

## Raw MCP

```json
{
  "slug": "huong-dan-ket-noi-rem-cua-tu-dong-rs485",
  "title": "Hướng dẫn kết nối rèm cửa tự động RS485",
  "excerpt": "Kết nối rèm cửa tự động qua RS485: cấu trúc khung lệnh, sơ đồ dây RJ12, khoảng cách truyền, và cách chọn gateway RS485-KNX phù hợp. Hướng dẫn từ KNXStore.",
  "coverImage": "/media/d2220b3f68c1916a18b2c76b2ea2d61f1ea3c31134d5b9f5391c2ecba18737cf.jpg",
  "authorName": null,
  "author": {
    "slug": "le-vo-quoc-huy",
    "name": "Lê Võ Quốc Huy",
    "bio": "Quốc Huy là chuyên viên tư vấn giải pháp tự động hóa tòa nhà tại KNXStore.vn, với kinh nghiệm làm việc trực tiếp cùng các System Integrator, ME Contractor và đơn vị thi công điện cơ và điện lạnh trên toàn quốc.\nHuy chuyên tư vấn và hỗ trợ kỹ thuật cho các dự án ứng dụng giao thức KNX, Casambi, DALI-2, BACnet và Modbus trong các công trình văn phòng, khách sạn, tòa nhà thương mại và khu công nghiệp.\nĐể được tư vấn dự án hoặc báo giá, bạn có thể liên hệ trực tiếp qua Zalo Hotline của KNXStore.",
    "jobTitle": "Sales Engineer",
    "expertiseAreas": "KNX TP / KNX IP DALI-2 Lighting Control BACnet / Modbus Integration Building Management System (BMS) M&E Project Consulting Commercial & Hospitality Automation",
    "certifications": null,
    "linkedinUrl": "https://www.linkedin.com/in/huy-le-vo-quoc-177ba8309/",
    "facebookUrl": "https://www.facebook.com/levoquochuy3011",
    "websiteUrl": "https://qhsmart.vn/",
    "seoDescription": "Lê Võ Quốc Huy Chuyên viên tư vấn B2B tại KNXStore.vn. Hỗ trợ System Integrator & ME Contractor triển khai KNX, Casambi, DALI-2, BACnet cho tòa nhà thương mại tại Việt Nam.",
    "imageUrl": "/media/97b725830514056a9de009c65ee513e0dfc89b8e538adb71b25533ed7c766777.jpg",
    "imageAlt": "Lê Võ Quốc Huy",
    "isActive": true
  },
  "publishedAt": "2026-08-05T03:02:10.000Z",
  "categories": [
    {
      "slug": "huong-dan",
      "name": "Hướng dẫn"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Hướng dẫn kết nối rèm cửa tự động RS485",
  "seoDescription": "Kết nối rèm cửa tự động qua RS485: cấu trúc khung lệnh, sơ đồ dây RJ12, khoảng cách truyền, và cách chọn gateway RS485-KNX phù hợp. Hướng dẫn từ KNXStore.",
  "faqs": [
    {
      "question": "RS485 trên động cơ rèm có phải luôn là Modbus không?",
      "answer": "Không. Nhiều hãng động cơ (ví dụ AOK, Somfy) dùng khung lệnh RS485 riêng, không phải Modbus RTU chuẩn. Modbus RTU chỉ là một trong các giao thức có thể chạy trên lớp vật lý RS485, chủ yếu gặp ở các gateway BMS. Cần đọc datasheet động cơ để biết chính xác giao thức, tránh chọn nhầm gateway.",
      "position": 0
    },
    {
      "question": "Sự khác biệt giữa điều khiển RS485 và dry contact cho rèm là gì?",
      "answer": "Dry contact chỉ truyền tín hiệu đóng/mở tiếp điểm đơn giản (lên/xuống/dừng), không có phản hồi trạng thái và mỗi động cơ thường cần một đường dây riêng về bộ điều khiển. RS485 truyền dữ liệu số hai chiều, cho phép nhiều động cơ chia sẻ chung một bus và hệ thống điều khiển đọc được vị trí, tốc độ, hoặc lỗi của từng động cơ.",
      "position": 1
    },
    {
      "question": "Có thể trộn nhiều hãng động cơ RS485 khác nhau trên cùng một bus không?",
      "answer": "Không nên, trừ khi gateway trung tâm xác nhận hỗ trợ đồng thời nhiều giao thức. Vì mỗi hãng đóng khung lệnh khác nhau (như ví dụ AOK và Somfy ở trên), gateway chỉ \"hiểu\" đúng giao thức nó được thiết kế để giao tiếp; trộn lẫn dễ gây lỗi giao tiếp hoặc động cơ không phản hồi.",
      "position": 2
    },
    {
      "question": "Làm sao biết động cơ rèm hiện có tương thích RS485-KNX không?",
      "answer": "Kiểm tra datasheet động cơ có ghi rõ giao thức RS485 cụ thể (tên hãng hoặc Modbus RTU), rồi đối chiếu với thông số gateway RS485-KNX dự kiến dùng. Nếu không chắc, nên gửi model động cơ cho đội kỹ thuật của nhà cung cấp gateway để xác nhận trước khi mua.",
      "position": 3
    },
    {
      "question": "Ngoài rèm, RS485 còn dùng cho thiết bị nào trong nhà thông minh?",
      "answer": "RS485 là chuẩn giao tiếp công nghiệp dùng rộng rãi cho điều hòa VRV/VRF (qua Modbus RTU), sàn nhiệt, cảm biến đa điểm, và các gateway BMS nói chung — không riêng cho rèm cửa.",
      "position": 4
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/huong-dan-ket-noi-rem-cua-tu-dong-rs485.html"
}
```
