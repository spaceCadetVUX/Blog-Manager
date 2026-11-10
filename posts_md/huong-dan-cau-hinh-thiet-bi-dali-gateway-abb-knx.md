---
url: "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
headline: "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX"
description: "Cấu hình ABB DALI Gateway DG/S2.64.5.1 vào KNX qua i-bus Tool và ETS: gán địa chỉ driver, group address, DPT dimming/CCT/RGBW, parameters nâng cao."
image: "https://knxstore.vn/media/132ea4c88756994d8cee50688a42d4831109c5241d99a7fcb88a0a15e50b1730.jpg"
datePublished: "2026-08-05T06:38:45.000Z"
dateModified: "2026-08-05T06:38:45.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Hướng dẫn"
word_count: 2374
keywords: ["Hướng dẫn"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Hướng dẫn"
    url: "https://knxstore.vn/blogs/huong-dan"
  - name: "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX"
    url: "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
products: [{"url": "https://knxstore.vn/products/knx-dali-gateway-premium-2-kenh-abb-dg-s-2-64-5-1", "name": "KNX DALI Gateway Premium 2 kênh ABB - DG/S 2.64.5.1"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-knx-dali-gateway-kts0-dali", "name": "Bộ điều khiển KNX DALI Gateway Kanonbus KTS0-DALI"}]
internal_links:
  - url: "https://knxstore.vn/cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx.html"
    slug: "cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx"
    anchor: "các phương án điều khiển rèm cửa tự động cho Smarthome KNX"
related_links:
  - url: "https://knxstore.vn/gateway-kba-kanonbus-ket-noi-rs485-knx-vao-bms-toa-nha.html"
    slug: "gateway-kba-kanonbus-ket-noi-rs485-knx-vao-bms-toa-nha"
    anchor: "Gateway KBA Kanonbus: Kết Nối RS485 & KNX Vào BMS Tòa Nhà"
    position: 1
  - url: "https://knxstore.vn/huong-dan-cap-nhat-firmware-va-main-program-kanonbus-kac005-moi-nhat-2026.html"
    slug: "huong-dan-cap-nhat-firmware-va-main-program-kanonbus-kac005-moi-nhat-2026"
    anchor: "Hướng Dẫn Cập Nhật Firmware Và Main Program Kanonbus KAC005 Mới Nhất 2026"
    position: 2
  - url: "https://knxstore.vn/huong-dan-ket-noi-rem-cua-tu-dong-rs485.html"
    slug: "huong-dan-ket-noi-rem-cua-tu-dong-rs485"
    anchor: "Hướng dẫn kết nối rèm cửa tự động RS485"
    position: 3
  - url: "https://knxstore.vn/cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx.html"
    slug: "cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx"
    anchor: "Các phương án điều khiển rèm cửa tự động cho Smarthome KNX"
    position: 4
---

# Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX

> Cấu hình ABB DALI Gateway DG/S2.64.5.1 vào KNX qua i-bus Tool và ETS: gán địa chỉ driver, group address, DPT dimming/CCT/RGBW, parameters nâng cao.

## Article Body

Trong bài viết này, KNXStore sẽ cùng bạn tìm hiểu cách cấu hình DALI Gateway ABB tích hợp vào hệ thống KNX, giúp điều khiển chiếu sáng thông minh hiệu quả, tiết kiệm và linh hoạt. Đây là một tài liệu chuyên sâu nhưng sẽ được trình bày dễ hiểu cho cả người mới lẫn kỹ sư triển khai.
Giới thiệu tổng quan về hệ thống DALI và KNX
Hệ sinh thái nhà thông minh ngày càng phát triển, và việc tích hợp giữa chuẩn KNX và DALI đang mở ra nhiều cơ hội mới cho việc điều khiển hệ thống chiếu sáng thông minh.
Việc tích hợp DALI vào mạng KNX giúp điều khiển đèn hiệu quả và đồng bộ với hệ thống cảm biến, nút nhấn, giao diện điều khiển,v.v.. Với tính năng DALI Gateway có trên ABB KNX Gateway, người dùng có thể:
Điều khiển trực tiếp các thiết bị chiếu sáng DALI từ hệ thống KNX.
Giao tiếp hai chiều giữa các group address KNX và ballast DALI.
Tối ưu hóa hiệu quả chiếu sáng tùy theo không gian sống và làm việc.
Thiết bị sử dụng: ABB DALI Gateway DG/S2.64.5.1
Thiết bị
KNX DALI Gateway Premium 2 kênh ABB - DG/S 2.64.5.1
cho phép giao tiếp 2 chiều giữa hệ DALI và KNX. Thiết bị hỗ trợ tối đa 64 driver DALI, chia nhóm linh hoạt, tích hợp cảnh chiếu sáng, đổi màu, điều chỉnh độ sáng và phản hồi trạng thái.
Lưu ý cho SI: nếu dự án chưa chốt thương hiệu DALI Gateway, KNXStore cũng phân phối
Bộ điều khiển KNX DALI Gateway Kanonbus KTS0-DALI
như một phương án thay thế cùng chức năng chuyển đổi DALI sang KNX, phù hợp khi cần tối ưu chi phí cho công trình vừa và nhỏ.
Bước 1- Cấu hình thiết bị bằng phần mềm i-bus® Tool
Để bắt đầu, chúng ta sẽ sử dụng phần mềm i-bus® Tool của ABB để cấu hình thiết bị DALI Gateway. Đây là công cụ miễn phí, hỗ trợ bạn trong việc gán địa chỉ và cấu hình các driver đèn DALI.
Các bước cấu hình như sau:
Cấp nguồn cho hệ thống. Bạn cần đảm bảo rằng thiết bị DALI Gateway và các driver đèn DALI đều được cấp nguồn đầy đủ.
Mở phần mềm i-bus® Tool sau khi đã kết nối thiết bị với hệ thống KNX. Lúc này bạn cần lưu ý chọn đúng thiết bị DALI Gateway (trong ví dụ này là DG/S2.64.5.1) trên phần mềm.
Tiếp theo cần gán địa chỉ cho các driver. Chuyển sang tab DALI, bạn sẽ thấy các ô vuông đại diện cho từng địa chỉ ballast (0-63). Nhấn nút "Start DALI Adressierung" để phần mềm tự động quét và gán địa chỉ cho các driver.
Sau đó bạn có thể tiến hành chọn từng đèn để xác định chính xác từng địa chỉ driver và nhóm chiếu sáng. Lúc này, trong thực tế, đèn được chọn sẽ sáng, và tất cả đèn trong bộ điều khiển sẽ tắt. Bạn có thể kéo từng driver vào các nhóm DALI (G0 đến G15) tuỳ theo cách chia khu vực chiếu sáng.
Sau khi hoàn tất việc cấu hình, hãy nhấn "Gateway-Werte übernehmen" để lưu lại cấu hình vào bộ nhớ thiết bị. Quay lại ETS, tiến hành mapping group address tương ứng cho việc dim, on/off, thay đổi nhiệt độ màu…
Chú ý:
Khi cấu hình ở bước 3, các driver nào hoạt động tốt sẽ hiển thị với biểu tượng bóng đèn màu vàng hoặc trắng, nếu thấy dấu X đỏ có nghĩa là thiết bị đang gặp các vấn đề hư hỏng hoặc lỏng dây.
Bạn cần đảm bảo rằng tất cả các dây kết nối đều ổn định để tránh tình trạng lỗi.
Nếu gặp bất kỳ vấn đề nào trong quá trình gán địa chỉ, kiểm tra lại kết nối dây hoặc trạng thái của driver.
Bước 2 - Cấu hình logic điều khiển trong ETS
Sau khi đã gán địa chỉ và group DALI, bước tiếp theo là cấu hình logic điều khiển trong phần mềm ETS (Engineering Tool Software) của KNX. Đây chính là lúc chúng ta làm việc trực tiếp với Group Object của DALI Gateway.
Trong hệ DALI tích hợp KNX, Group Address đóng vai trò là “ngôn ngữ giao tiếp” giữa các thiết bị điều khiển (nút bấm, cảm biến...) và đèn chiếu sáng thông qua Gateway. Mỗi group address tương ứng với một chức năng cụ thể như: bật/tắt, dim, đổi màu, trạng thái…
Các nhóm Group Address cơ bản như sau (cho đèn dim DALI DT8):
Switch (1-bit). Có chức năng điều khiển bật/tắt đèn, lệnh đơn giản từ phím nhấn, cảm biến hoặc tự động hóa. Thường ứng dụng trong các không gian như phòng ngủ, hành lang, toilet.
Brightness Value Output (1 byte). Điều chỉnh các mức sáng một cách cụ thể (0–100%). Phù hợp khi điều khiển qua app, giao diện visualization, giúp người dùng chỉnh độ sáng chính xác hơn.
Relative Dimming (4-bit). Có chức năng tăng/ giảm độ sáng bằng cách nhấn giữ nút. Rất phù hợp với nút bấm vật lý dạng “press & hold”.
Set Color Temperature (2 byte – DPT 7.600) (Kelvin). Có chức năng điều khiển nhiệt độ màu (CCT) cho đèn DT8 Tunable White. Giá trị tính bằng Kelvin, ví dụ: 2700K (ấm), 4000K (trung tính), 6000K (lạnh).
RGB(W) Color Control (1 byte mỗi màu). Có thể điều khiển màu sắc cho đèn DT8 RGBW. Mỗi màu là một group riêng, điều khiển cường độ từ 0–255. Dùng cho led dây RGB, đèn hắt trần, ánh sáng trang trí.
Chức năng
Group Object trong Gateway
Kiểu dữ liệu
Công dụng
Bật/Tắt đèn
Switch
1-bit
Điều khiển On/Off cho driver DALI
Điều chỉnh độ sáng (dimming)
Brightness Value Output
1 byte (0–100%)
Gửi giá trị phần trăm độ sáng đến driver
Dimming giữ nút (tăng/giảm)
Relative Dimming
4-bit
Nhấn giữ nút để tăng/giảm dần độ sáng
Đổi nhiệt độ màu (Tunable White)
Set color temperature (Kelvin)
2 byte (DPT 7.600)
Điều khiển đèn DT8 loại CCT (trắng ấm – trắng lạnh)
Đổi màu RGBW
RGB(W) Color Control
1 byte mỗi màu
Điều khiển đèn DT8 RGBW từng kênh màu (R, G, B, W)
Các thiết bị có những phản hồi trạng thái (status feedback) như sau:
Status Switch (1-bit). Trả về trạng thái bật/tắt của driver. Thường dùng để hiển thị trên app, visualization, hoặc đồng bộ với LED báo trên công tắc cảm ứng.
Status Brightness Value (1 byte). Gửi lại mức độ sáng hiện tại dưới dạng phần trăm. Cần thiết khi người dùng điều chỉnh đèn từ nhiều nguồn (phím bấm, cảm biến, app), đảm bảo UI luôn hiển thị đúng.
Status Color Temperature (2 byte – DPT 7.600). Trả về nhiệt độ màu thực tế (Kelvin) đang được driver sử dụng. Hữu ích khi dùng chế độ Tunable White, cần đồng bộ trạng thái trên giao diện người dùng.
Lamp/Ballast Fault (1-bit hoặc logic). Phát hiện lỗi phần cứng như: driver hỏng, bóng cháy, mất nguồn DALI. Có thể cấu hình để gửi cảnh báo lên BMS hoặc bật đèn cảnh báo trong hệ thống.
Trạng thái
Group Object trong Gateway
Kiểu dữ liệu
Công dụng
Trạng thái On/Off
Status Switch
1-bit
Cho biết đèn đang bật hay tắt
Mức sáng hiện tại
Status Brightness Value
1 byte
Trả về % độ sáng thực tế
Nhiệt độ màu (Kelvin)
Status Color Temperature
2 byte (DPT 7.600)
Trả về giá trị nhiệt độ màu đang dùng (Kelvin)
Lỗi driver, lỗi nguồn, cháy bóng
Lamp/Ballast Fault
1-bit hoặc logic
Phát hiện lỗi đèn cháy, ballast hỏng, mất tín hiệu...
Dựa vào các group từ 2 loại nhóm trên, bạn có thể dùng để khai báo cho các hệ điều khiển dali khác thông qua các group KNX được gán trong cấu hình ETS5.
Ngoài ra, KNX DALI còn có thể tích hợp với các hệ khác như Savant, Control4, Crestron, Lutron, Home Assistant, Apple Home,v.v..
Cấu hình nâng cao và các thông số đặc biệt
Cấu hình Parameters
Ngay trong phần “Parameters”, bạn có thể thay đổi được các thông số cũng như số lượng driver đèn DALI mà chúng ta có thể điều khiển.
Cấu hình General
Tại mục General sẽ hiển thị các thông số cấu hình để đáp ứng mọi nhu cầu dự án như:
Inactive wait state on KNX recovery: Đặt thời gian chờ (tính bằng giây) sau khi kết nối KNX bị ngắt rồi phục hồi. Giúp hệ thống ổn định trước khi hoạt động lại.
Send stat. val. on inactive wait state: Gửi trạng thái của đèn trong lúc hệ thống đang chờ phục hồi (nên tắt để tránh sai trạng thái).
Limit number of KNX telegrams: Giới hạn số lượng telegram KNX gửi ra (bật để tránh spam mạng nếu có nhiều thiết bị cùng phản hồi).
Enable manual operation: Cho phép thao tác tay trên thiết bị Gateway (nút nhấn vật lý).
Brightness value on exiting manual operation: Chọn giữ lại mức sáng đã điều chỉnh bằng tay hoặc trả về trạng thái do KNX điều khiển trước đó.
Reset from manual operation to KNX operation: Chọn cách chuyển lại điều khiển về KNX sau khi có can thiệp tay: nhấn nút hoặc tự động.
Time for automatic reset: Nếu chọn reset tự động, đây là thời gian chờ trước khi chuyển lại điều khiển về KNX (ví dụ 60 phút).
Enable group object "In operation": Bật group object gửi trạng thái Gateway đang hoạt động (hữu ích cho giám sát hệ thống).
Enable group object "Request status values": Cho phép thiết bị khác gửi lệnh yêu cầu Gateway cập nhật trạng thái của các thiết bị DALI.
Enable group object "Gateway supply voltage fault": Bật báo lỗi nếu nguồn cấp của Gateway bị mất hay bất thường.
Ngoài ra còn rất nhiều thông số chính trong bộ DG/S2.64.5.1 ABB để giúp nâng cao toàn bộ công dụng mà dali có thể mang lại.
Cấu hình DALI configuration
Tại mục "A DALI configuration", có thể bật các tính năng DALI như nhóm (Group), từng đèn (Ballast), chiếu sáng khẩn cấp (Emergency), Scene, hiệu ứng (Sequence) trước khi hệ thống tạo group object.
Cài đặt "A Output" cấu hình hành vi khi bật/tắt, dim đèn, fade time: Status (trạng thái On/Off, độ sáng, nhiệt độ màu), Fault (thông tin lỗi đèn, lỗi điện áp, lỗi driver), Functions (burn-in, slave offset, thời lượng sử dụng), Color functions (điều khiển màu RGB, trắng ấm/lạnh CCT, bao gồm HCL và Dim2Warm).
Cài đặt "A Group/ballast x template" dùng để tạo cấu hình mẫu cho nhiều ballast cùng loại, gồm Status template, Fault template, Functions template, Slave template, Staircase lighting template (chiếu sáng theo thời gian như cầu thang, hành lang), Color temperature Tc template, và RGB(W) color control template.
Sau khi hoàn tất mọi bước cấu hình và đảm bảo thiết bị hoạt động ổn định, hệ thống DALI Gateway ABB đã sẵn sàng hoạt động trong mạng lưới KNX, biến toàn bộ hệ thống chiếu sáng DALI thành một mắt xích trong mạng lưới KNX Smarthome/Smart Building. Người dùng điều khiển đèn bằng nút nhấn cảm ứng, cảm biến chuyển động, màn hình điều khiển trung tâm, điện thoại thông minh, hoặc trợ lý ảo (Alexa, Google Assistant, Siri nếu có Matter Gateway) và hệ thống có thể tự phản ứng theo kịch bản ánh sáng đã thiết kế (ví dụ có người vào phòng bật 70% sắc vàng ấm, buổi trưa giảm cường độ sang tông trung tính, nhấn "Scene Relax" xuống 40% ở 2700K).
Không chỉ dừng ở đèn chiếu sáng, hệ thống KNX còn tích hợp thêm rèm cửa tự động (xem
các phương án điều khiển rèm cửa tự động cho Smarthome KNX
), điều hòa không khí (HVAC), âm thanh đa vùng, tất cả điều phối trong cùng một nền tảng thống nhất.
Kết luận
ABB DALI Gateway DG/S 2.64.5.1
biến toàn bộ hệ chiếu sáng DALI thành một phần liền mạch trong mạng KNX, đủ chi tiết để điều khiển từng driver riêng lẻ (on/off, dimming, CCT, RGBW) và phản hồi trạng thái lỗi về BMS. Với dự án cần tối ưu chi phí hơn phân khúc ABB,
Kanonbus KTS0-DALI
là phương án thay thế cùng chức năng đáng xem xét. Việc cấu hình đúng ngay từ bước gán địa chỉ driver trong i-bus Tool sẽ tránh được phần lớn lỗi mapping group address về sau trong ETS.
Cần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
ABB DALI Gateway DG/S2.64.5.1 hỗ trợ tối đa bao nhiêu driver DALI?
Tối đa 128 driver DALI, chia thành 16 nhóm DALI (G0 đến G15) tùy theo cách phân khu chiếu sáng của công trình.

Cần dùng phần mềm gì để cấu hình thiết bị này?
Hai phần mềm: i-bus® Tool của ABB (miễn phí) để gán địa chỉ driver và cấu hình DALI configuration, và ETS để mapping group address điều khiển từ phía KNX.

Đèn DT8 (Tunable White, RGBW) có cấu hình khác đèn DT6 thông thường không?
Có. Đèn DT6 (dim đơn) chỉ cần Switch và Brightness Value Output. Đèn DT8 cần thêm Set Color Temperature (CCT) hoặc RGB(W) Color Control tùy loại, với DPT và group object riêng cho từng kênh màu.

Nếu driver DALI báo lỗi (dấu X đỏ) trong lúc gán địa chỉ, phải làm gì?
Kiểm tra lại kết nối dây DALI đến driver đó trước, vì dấu X đỏ thường do driver hỏng hoặc dây lỏng. Sau khi khắc phục dây, chạy lại "Start DALI Adressierung" cho driver đó.

DALI Gateway ABB có tích hợp được với hệ thống ngoài KNX không?
Có, thông qua group KNX đã gán trong ETS5, hệ DALI có thể tích hợp gián tiếp với Savant, Control4, Crestron, Lutron, Home Assistant, hoặc Apple Home nếu các hệ đó có kết nối vào KNX.

## Raw MCP

```json
{
  "slug": "huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx",
  "title": "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX",
  "excerpt": "Cấu hình ABB DALI Gateway DG/S2.64.5.1 vào KNX qua i-bus Tool và ETS: gán địa chỉ driver, group address, DPT dimming/CCT/RGBW, parameters nâng cao.",
  "coverImage": "/media/132ea4c88756994d8cee50688a42d4831109c5241d99a7fcb88a0a15e50b1730.jpg",
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
  "publishedAt": "2026-08-05T06:38:45.000Z",
  "categories": [
    {
      "slug": "huong-dan",
      "name": "Hướng dẫn"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX",
  "seoDescription": "Cấu hình ABB DALI Gateway DG/S2.64.5.1 vào KNX qua i-bus Tool và ETS: gán địa chỉ driver, group address, DPT dimming/CCT/RGBW, parameters nâng cao.",
  "faqs": [
    {
      "question": "ABB DALI Gateway DG/S2.64.5.1 hỗ trợ tối đa bao nhiêu driver DALI?",
      "answer": "Tối đa 128 driver DALI, chia thành 16 nhóm DALI (G0 đến G15) tùy theo cách phân khu chiếu sáng của công trình.",
      "position": 0
    },
    {
      "question": "Cần dùng phần mềm gì để cấu hình thiết bị này?",
      "answer": "Hai phần mềm: i-bus® Tool của ABB (miễn phí) để gán địa chỉ driver và cấu hình DALI configuration, và ETS để mapping group address điều khiển từ phía KNX.",
      "position": 1
    },
    {
      "question": "Đèn DT8 (Tunable White, RGBW) có cấu hình khác đèn DT6 thông thường không?",
      "answer": "Có. Đèn DT6 (dim đơn) chỉ cần Switch và Brightness Value Output. Đèn DT8 cần thêm Set Color Temperature (CCT) hoặc RGB(W) Color Control tùy loại, với DPT và group object riêng cho từng kênh màu.",
      "position": 2
    },
    {
      "question": "Nếu driver DALI báo lỗi (dấu X đỏ) trong lúc gán địa chỉ, phải làm gì?",
      "answer": "Kiểm tra lại kết nối dây DALI đến driver đó trước, vì dấu X đỏ thường do driver hỏng hoặc dây lỏng. Sau khi khắc phục dây, chạy lại \"Start DALI Adressierung\" cho driver đó.",
      "position": 3
    },
    {
      "question": "DALI Gateway ABB có tích hợp được với hệ thống ngoài KNX không?",
      "answer": "Có, thông qua group KNX đã gán trong ETS5, hệ DALI có thể tích hợp gián tiếp với Savant, Control4, Crestron, Lutron, Home Assistant, hoặc Apple Home nếu các hệ đó có kết nối vào KNX.",
      "position": 4
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
}
```
