---
url: "https://knxstore.vn/mo-rong-kha-nang-chieu-sang-dmx-voi-casambi-bluetooth.html"
headline: "Mở rộng khả năng chiếu sáng DMX với Casambi Bluetooth"
description: "Tham khảo ngay dòng sản phẩm có khả năng điều khiển DMX của Casambi với nhiều ưu điểm vượt trội về tính linh hoạt, dễ sử dụng và khả năng tùy biến trong bài viết sau đây!"
title: "Mở Rộng Chiếu Sáng DMX Với Casambi Bluetooth: casDMX, DMXcas, SceneDMXcas"
image: "https://knxstore.vn/media/e0c485be6674fce73926958e68c7e5b28eded2072268a9a76de63ccd51904950.jpg"
datePublished: "2026-08-07T04:27:07.000Z"
dateModified: "2026-08-07T04:27:07.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Chiếu sáng"
word_count: 1641
keywords: ["Chiếu sáng"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Chiếu sáng"
    url: "https://knxstore.vn/blogs/chieu-sang"
  - name: "Mở rộng khả năng chiếu sáng DMX với Casambi Bluetooth"
    url: "https://knxstore.vn/mo-rong-kha-nang-chieu-sang-dmx-voi-casambi-bluetooth.html"
products: [{"url": "https://knxstore.vn/products/bo-dieu-khien-dmx-da-kenh-casambi-voi-radio-tam-xa-casdmx", "name": "Bộ điều khiển DMX đa kênh với radio tầm xa Casambi - casDMX"}, {"url": "https://knxstore.vn/products/bo-dieu-khien-do-sang-dmx-casambi-8-kenh-dmxcas", "name": "Bộ Điều Khiển DMX Không Dây BLE Casambi DMXcas"}, {"url": "https://knxstore.vn/products/bo-chuyen-doi-dmx-sang-casambi-chon-ngu-canh-scenedmxcas", "name": "Bộ chuyển đổi DMX sang Casambi chọn ngữ cảnh SceneDMXcas"}]
internal_links:
  - url: "https://knxstore.vn/cct-la-gi-trong-chieu-sang.html"
    slug: "cct-la-gi-trong-chieu-sang"
    anchor: "tunable white"
  - url: "https://knxstore.vn/vi-sao-tinh-tuong-tac-quyet-dinh-hieu-qua-cua-he-thong-chieu-sang-thong-minh.html"
    slug: "vi-sao-tinh-tuong-tac-quyet-dinh-hieu-qua-cua-he-thong-chieu-sang-thong-minh"
    anchor: "tính tương tác giữa các nền tảng trong hệ thống chiếu sáng thông minh"
related_links:
  - url: "https://knxstore.vn/mo-rong-dali-2-ra-dimmer-triac-relay-dmx-va-modbus-tcp.html"
    slug: "mo-rong-dali-2-ra-dimmer-triac-relay-dmx-va-modbus-tcp"
    anchor: "Mở Rộng DALI-2 Ra Dimmer Triac, Relay, DMX Và Modbus TCP"
    position: 1
  - url: "https://knxstore.vn/casambi-khong-ket-noi-homekit-mtb10-matter-bridge-la-giai-phap.html"
    slug: "casambi-khong-ket-noi-homekit-mtb10-matter-bridge-la-giai-phap"
    anchor: "Casambi không kết nối HomeKit? MTB10 Matter Bridge là giải pháp"
    position: 2
  - url: "https://knxstore.vn/nfc-trong-he-thong-chieu-sang-thong-minh-hoat-dong-nhu-the-nao.html"
    slug: "nfc-trong-he-thong-chieu-sang-thong-minh-hoat-dong-nhu-the-nao"
    anchor: "NFC có được sử dụng trong hệ thống chiếu sáng thông minh không?"
    position: 3
  - url: "https://knxstore.vn/thiet-ke-he-chieu-sang-dali-mo-rong-bang-casambi-se-nhu-the-nao.html"
    slug: "thiet-ke-he-chieu-sang-dali-mo-rong-bang-casambi-se-nhu-the-nao"
    anchor: "Thiết kế hệ chiếu sáng DALI mở rộng bằng Casambi sẽ như thế nào?"
    position: 4
---

# Mở rộng khả năng chiếu sáng DMX với Casambi Bluetooth

> Tham khảo ngay dòng sản phẩm có khả năng điều khiển DMX của Casambi với nhiều ưu điểm vượt trội về tính linh hoạt, dễ sử dụng và khả năng tùy biến trong bài viết sau đây!

## Article Body

Casambi Bluetooth Mesh và DMX-512 là hai hệ giao thức chiếu sáng phổ biến nhưng vận hành khác nhau: DMX-512 là chuẩn có dây, điều khiển tuyến tính theo địa chỉ kênh; Casambi là mạng mesh không dây qua Bluetooth Low Energy (BLE), tự cấu hình theo thiết bị. Ba thiết bị của DMX Engineering, casDMX, DMXcas và SceneDMXcas, cho phép ghép 2 hệ này lại theo từng chiều tín hiệu cụ thể, tùy vào hệ thống nào đóng vai trò điều khiển chính.
casDMX, DMXcas Và SceneDMXcas Khác Nhau Ở Chiều Tín Hiệu Nào?
Ba thiết bị này đều dùng chung Casambi CBM003B Radio Module (2.401-2.483 GHz, công suất phát ~+8 dBm, độ nhạy thu -103 dBm ở chế độ long-range), nhưng mỗi thiết bị xử lý tín hiệu theo một chiều riêng:
casDMX: nhận lệnh từ Casambi App qua Bluetooth, xuất ra tín hiệu DMX-512 để điều khiển fixture DMX có sẵn. Chiều đi: Casambi → DMX.
DMXcas: nhận tín hiệu DMX-512 từ một bộ điều khiển DMX chuẩn đã có, chuyển thành lệnh điều khiển mạng Casambi. Chiều đi: DMX → Casambi.
SceneDMXcas: nhận 2 kênh DMX để gọi Scene Casambi đã định sẵn, không điều khiển trực tiếp từng kênh màu/độ sáng như 2 thiết bị trên. Chiều đi: DMX → Scene Casambi.
Hiểu đúng chiều tín hiệu là điều kiện bắt buộc để chọn đúng thiết bị: nếu công trình đã có driver/fixture DMX và muốn điều khiển chúng từ app Casambi, cần casDMX; nếu công trình đã có bộ điều khiển DMX-512 (bàn DMX, bộ lập trình show) và muốn dùng nó để điều khiển mạng Casambi có sẵn, cần DMXcas hoặc SceneDMXcas.
casDMX - Master DMX Điều Khiển Từ Ứng Dụng Casambi
casDMX (Casambi CBM003 Multi-Channel DMX Master with Long Range Radio) là bộ master DMX-512 điều khiển bằng Bluetooth: kết nối vào mạng Casambi, sau đó xuất một universe DMX-512 (DMX+, DMX-, Ground) để điều khiển các fixture DMX đã lắp sẵn như dải LED RGBW hoặc đèn
tunable white
.
Thông số kỹ thuật chính: input 12-24VDC Class 2, dòng không tải 30mA, không dùng driver dòng không đổi (constant current) cho ngõ vào. Qua Casambi Profile, casDMX cấu hình được 3 kiểu kênh: 4-channel (color picker RGBW chuẩn Casambi, cấu hình mặc định xuất xưởng), 8-channel (Casambi slider) và 12-channel (slider ở Evolution mode). Địa chỉ DMX bắt đầu từ 1 và tuần tự theo số kênh đã chọn.
DMXcas - Đưa Bộ Điều Khiển DMX Có Sẵn Vào Mạng Casambi
DMXcas là dimmer DMX-512 8 kênh, đóng vai trò ngược lại với casDMX: nhận tín hiệu từ một bộ điều khiển DMX chuẩn (bàn DMX, bộ điều khiển show) đã có sẵn, sau đó chuyển thành lệnh điều khiển mạng Casambi. Trong Casambi App, DMXcas xuất hiện ở tab "Switches" và hoạt động như 8 nút nhấn ảo (pushbutton), mỗi nút được gán để điều khiển 1 element hoặc kích hoạt 1 hành động Casambi cụ thể, tương tự cách gán công tắc vật lý.
Thông số kỹ thuật chính giống casDMX: input 12-24VDC Class 2, dòng không tải 30mA, cùng module radio Casambi CBM003B Long Range. Nhiều DMXcas có thể dùng song song trong cùng mạng để điều khiển các fixture, kênh hoặc khu vực khác nhau, vì cả 8 kênh đều được gán độc lập qua app.
Tính năng nổi bật của casDMX:
8 kênh DMX để điều khiển đa dạng các thiết bị chiếu sáng
Tích hợp Bluetooth để kết nối với ứng dụng Casambi
Khả năng tạo các cảnh chiếu sáng phức tạp
Dễ dàng cài đặt và sử dụng
SceneDMXcas - Gọi Scene Casambi Bằng Tín Hiệu DMX
SceneDMXcas là Casambi Gateway giải mã 2 kênh DMX: kênh 1 chọn 1 trong tối đa 20 Scene Casambi đã định sẵn trong mạng, kênh 2 chỉnh cường độ sáng 0-100% cho Scene đang chọn. Địa chỉ DMX bắt đầu (DMX Start Address) tùy chỉnh được theo từng thiết bị.
Cấu hình qua tab "Gateways" trong Casambi App: thêm SceneDMXcas vào mạng, sau đó thiết lập DMX Start Address và gán tối đa 20 Scene đã tạo sẵn từ trước. Cách này phù hợp khi cần đồng bộ 2 hệ chiếu sáng đang chạy song song, ví dụ khu vực dùng Casambi và khu vực dùng bộ điều khiển DMX riêng, mà không cần lập trình lại toàn bộ hệ Casambi. Đây cũng là một minh chứng cho
tính tương tác giữa các nền tảng trong hệ thống chiếu sáng thông minh
.
Tính năng nổi bật của SceneDMXcas:
Điều khiển tối đa 20 cảnh Casambi thông qua DMX-512
Điều chỉnh cường độ ánh sáng cho từng cảnh
Dễ dàng cài đặt và cấu hình
Tích hợp với các hệ thống điều khiển nhà thông minh khác
Lưu Ý Lắp Đặt Chung Cho Cả 3 Thiết Bị
casDMX, DMXcas và SceneDMXcas dùng chung nền tảng phần cứng nên có các lưu ý lắp đặt giống nhau:
Không lắp trong hộp kim loại (junction box kim loại làm suy hao tín hiệu radio); nếu buộc phải lắp trong box, dùng box nhựa.
Chỉ dùng trong nhà (Rated for indoor use only).
Tầm phát ngoài trời giữa 2 thiết bị hoặc giữa thiết bị với điện thoại có thể vượt 200ft (~60m), nhưng giảm mạnh nếu bị che chắn bởi kết cấu kim loại; nên kiểm tra thực tế tại công trình trước khi thi công cố định.
Mỗi thiết bị hoạt động như 1 node lặp (repeater) trong mạng Casambi mesh, giúp mở rộng vùng phủ khi lắp nhiều thiết bị.
Chứng nhận FCC ID 2ALA3-CBM002A, IC 22496-CBM002A, tuân thủ UL STD 916 và CSA STD C22.2#205.
Ví Dụ Ứng Dụng Thực Tế
Ví dụ 1: Thêm điều khiển RGBW từ xa cho hệ DMX có sẵn
Công trình đã có hệ DMX-512 và muốn bổ sung khả năng điều khiển RGBW từ xa qua Bluetooth mà không cần kéo thêm dây mạng DMX. Thiết bị cần theo thứ tự tín hiệu:
Bộ điều khiển DMX-512 hiện có.
DMXcas (yêu cầu nguồn 12-24V DC), nhận tín hiệu từ bộ điều khiển DMX và chuyển sang mạng Casambi qua Bluetooth.
Bộ điều khiển LED tích hợp Casambi (yêu cầu nguồn LED riêng).
Dải đèn LED RGBW.
Ví dụ 2: Đồng bộ khu ăn uống Casambi với sân khấu DMX
Dự án đã có khu ăn uống dùng Casambi và sân khấu biểu diễn dùng DMX-512 riêng. Khi muốn tự động giảm độ sáng khu ăn uống lúc buổi biểu diễn bắt đầu, SceneDMXcas cho phép kết nối 2 hệ điều khiển này mà không cần lập trình lại hệ Casambi hiện có. Thiết bị cần:
Bộ điều khiển DMX-512 (sân khấu).
SceneDMXcas (yêu cầu nguồn 12-24V DC), nhận 2 kênh DMX để chọn Scene và cường độ.
Hệ thống chiếu sáng Casambi sẵn có, đã cấu hình trước các Scene tương ứng.
Ví dụ 3: Điều khiển fixture DMX có sẵn từ điện thoại
Gian hàng triển lãm đã có sẵn một số fixture chiếu sáng DMX-512 và cần điều khiển nhanh từ điện thoại mà không cần bàn DMX chuyên dụng. casDMX là giải pháp phù hợp vì cho phép Casambi App điều khiển trực tiếp các fixture DMX này:
Ứng dụng Casambi trên điện thoại, kết nối không dây qua Bluetooth.
casDMX (yêu cầu nguồn 12-24V DC), xuất tín hiệu DMX-512 theo cấu hình 4/8/12 kênh đã chọn.
Các fixture chiếu sáng DMX-512 có sẵn.
Nếu cần điều khiển nhiều fixture hơn số kênh của 1 thiết bị, có thể lắp thêm casDMX song song trong cùng mạng, mỗi casDMX xuất 1 universe DMX riêng.
Kết Luận
casDMX, DMXcas và SceneDMXcas giải quyết 3 nhu cầu tích hợp DMX-Casambi theo 3 chiều tín hiệu khác nhau: casDMX đưa lệnh từ Casambi ra DMX, DMXcas đưa lệnh từ DMX vào Casambi, còn SceneDMXcas chỉ dùng DMX để gọi Scene Casambi có sẵn, chọn đúng thiết bị theo chiều điều khiển thực tế của công trình là bước quan trọng nhất trước khi thi công. Cần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
casDMX và DMXcas có dùng thay thế cho nhau được không?
Không. Hai thiết bị đi ngược chiều tín hiệu: casDMX nhận lệnh từ Casambi App và xuất DMX ra fixture, còn DMXcas nhận DMX từ bộ điều khiển có sẵn để điều khiển mạng Casambi. Chọn sai chiều thiết bị sẽ không vận hành được.

casDMX hỗ trợ tối đa bao nhiêu kênh DMX?
Tối đa 12 kênh ở Evolution mode; ngoài ra còn có cấu hình 4 kênh (RGBW, mặc định xuất xưởng) và 8 kênh, chọn qua Casambi Profile.

SceneDMXcas điều khiển được tối đa bao nhiêu Scene?
Tối đa 20 Scene Casambi đã định sẵn, chọn qua kênh DMX thứ nhất; kênh DMX thứ hai chỉnh cường độ sáng 0-100% cho Scene đang chọn.

Vì sao không nên lắp casDMX/DMXcas/SceneDMXcas trong hộp kim loại?
Vì kim loại làm suy hao tín hiệu radio Bluetooth, ảnh hưởng trực tiếp đến khả năng kết nối mesh của thiết bị. Nếu cần lắp trong hộp kỹ thuật, nên dùng hộp nhựa.

Có thể dùng nhiều casDMX hoặc DMXcas trong cùng một công trình không?
Có. Casambi dùng mạng mesh nên mỗi thiết bị vừa hoạt động độc lập vừa làm node lặp, giúp mở rộng vùng phủ và số kênh điều khiển khi lắp thêm nhiều thiết bị.

casDMX, DMXcas, SceneDMXcas có dùng ngoài trời được không?
Không. Cả 3 thiết bị được chứng nhận Rated for indoor use only, chỉ lắp đặt trong nhà.

## Raw MCP

```json
{
  "slug": "mo-rong-kha-nang-chieu-sang-dmx-voi-casambi-bluetooth",
  "title": "Mở rộng khả năng chiếu sáng DMX với Casambi Bluetooth",
  "excerpt": "Tham khảo ngay dòng sản phẩm có khả năng điều khiển DMX của Casambi với nhiều ưu điểm vượt trội về tính linh hoạt, dễ sử dụng và khả năng tùy biến trong bài viết sau đây!",
  "coverImage": "/media/e0c485be6674fce73926958e68c7e5b28eded2072268a9a76de63ccd51904950.jpg",
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
  "publishedAt": "2026-08-07T04:27:07.000Z",
  "categories": [
    {
      "slug": "chieu-sang",
      "name": "Chiếu sáng"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Mở Rộng Chiếu Sáng DMX Với Casambi Bluetooth: casDMX, DMXcas, SceneDMXcas",
  "seoDescription": "Tham khảo ngay dòng sản phẩm có khả năng điều khiển DMX của Casambi với nhiều ưu điểm vượt trội về tính linh hoạt, dễ sử dụng và khả năng tùy biến trong bài viết sau đây!",
  "faqs": [
    {
      "question": "casDMX và DMXcas có dùng thay thế cho nhau được không?",
      "answer": "Không. Hai thiết bị đi ngược chiều tín hiệu: casDMX nhận lệnh từ Casambi App và xuất DMX ra fixture, còn DMXcas nhận DMX từ bộ điều khiển có sẵn để điều khiển mạng Casambi. Chọn sai chiều thiết bị sẽ không vận hành được.",
      "position": 0
    },
    {
      "question": "casDMX hỗ trợ tối đa bao nhiêu kênh DMX?",
      "answer": "Tối đa 12 kênh ở Evolution mode; ngoài ra còn có cấu hình 4 kênh (RGBW, mặc định xuất xưởng) và 8 kênh, chọn qua Casambi Profile.",
      "position": 1
    },
    {
      "question": "SceneDMXcas điều khiển được tối đa bao nhiêu Scene?",
      "answer": "Tối đa 20 Scene Casambi đã định sẵn, chọn qua kênh DMX thứ nhất; kênh DMX thứ hai chỉnh cường độ sáng 0-100% cho Scene đang chọn.",
      "position": 2
    },
    {
      "question": "Vì sao không nên lắp casDMX/DMXcas/SceneDMXcas trong hộp kim loại?",
      "answer": "Vì kim loại làm suy hao tín hiệu radio Bluetooth, ảnh hưởng trực tiếp đến khả năng kết nối mesh của thiết bị. Nếu cần lắp trong hộp kỹ thuật, nên dùng hộp nhựa.",
      "position": 3
    },
    {
      "question": "Có thể dùng nhiều casDMX hoặc DMXcas trong cùng một công trình không?",
      "answer": "Có. Casambi dùng mạng mesh nên mỗi thiết bị vừa hoạt động độc lập vừa làm node lặp, giúp mở rộng vùng phủ và số kênh điều khiển khi lắp thêm nhiều thiết bị.",
      "position": 4
    },
    {
      "question": "casDMX, DMXcas, SceneDMXcas có dùng ngoài trời được không?",
      "answer": "Không. Cả 3 thiết bị được chứng nhận Rated for indoor use only, chỉ lắp đặt trong nhà.",
      "position": 5
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/mo-rong-kha-nang-chieu-sang-dmx-voi-casambi-bluetooth.html"
}
```
