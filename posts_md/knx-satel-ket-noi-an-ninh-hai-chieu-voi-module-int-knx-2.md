---
url: "https://knxstore.vn/knx-satel-ket-noi-an-ninh-hai-chieu-voi-module-int-knx-2.html"
headline: "KNX & SATEL: Giải pháp kết nối an ninh hai chiều với module INT-KNX-2"
description: "INT-KNX-2 tích hợp trực tiếp hệ báo động Satel INTEGRA với KNX TP qua built-in BCU, 3 loại communication object, 64 objects, không cần gateway trung gian."
title: "KNX & Satel: Kết Nối An Ninh Hai Chiều Với Module INT-KNX-2"
image: "https://knxstore.vn/media/a74e6148b5d101eaf7da821de063859c51a03e2f26b6459c764d491c754e1164.jpg"
datePublished: "2026-08-04T09:18:52.000Z"
dateModified: "2026-08-04T09:18:52.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "An ninh"
word_count: 2318
keywords: ["An ninh"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "An ninh"
    url: "https://knxstore.vn/blogs/an-ninh"
  - name: "KNX & SATEL: Giải pháp kết nối an ninh hai chiều với module INT-KNX-2"
    url: "https://knxstore.vn/knx-satel-ket-noi-an-ninh-hai-chieu-voi-module-int-knx-2.html"
products: [{"url": "https://knxstore.vn/products/satel-bo-tich-hop-he-thong-an-ninh-voi-knx-int-knx-2", "name": "trang sản phẩm INT-KNX-2"}, {"url": "https://knxstore.vn/products/satel-bang-dieu-khien-trung-tam-integra-256-plus", "name": "INTEGRA 256 PLUS"}, {"url": "https://knxstore.vn/products/satel-mo-dun-mo-rong-khu-vuc-int-e", "name": "Mô-đun mở rộng khu vực Satel - INT-E"}, {"url": "https://knxstore.vn/products/satel-mo-dun-mo-rong-ngo-ra-int-o", "name": "Mô-đun mở rộng ngõ ra Satel - INT-O"}, {"url": "https://knxstore.vn/products/satel-mo-dun-giao-thuc-ethernet-ethm-1-plus", "name": "Mô-đun giao thức truyền thông Ethernet Satel - ETHM-1 PLUS"}, {"url": "https://knxstore.vn/products/satel-bo-ngo-vao-cho-nut-nhan-knx-bin24", "name": "Satel KNX-BIN24"}]
related_links:
  - url: "https://knxstore.vn/camera-chong-trom-la-gi.html"
    slug: "camera-chong-trom-la-gi"
    anchor: "Camera Aqara G5 Pro Hay Eve Cam? Nên Chọn Loại Nào"
    position: 1
  - url: "https://knxstore.vn/khoa-cua-thong-minh-moorgen.html"
    slug: "khoa-cua-thong-minh-moorgen"
    anchor: "Khám phá 12 mẫu khóa cửa thông minh Moorgen ứng dụng vân tay tĩnh mạch hiện đại"
    position: 2
  - url: "https://knxstore.vn/so-sanh-he-thong-bao-dong-co-day-va-khong-day.html"
    slug: "so-sanh-he-thong-bao-dong-co-day-va-khong-day"
    anchor: "So sánh hệ thống báo động có dây và không dây"
    position: 3
  - url: "https://knxstore.vn/he-thong-chong-trom-la-gi.html"
    slug: "he-thong-chong-trom-la-gi"
    anchor: "Hệ thống chống trộm là gì? Những bộ phận nào cấu thành hệ thống?"
    position: 4
---

# KNX & SATEL: Giải pháp kết nối an ninh hai chiều với module INT-KNX-2

> INT-KNX-2 tích hợp trực tiếp hệ báo động Satel INTEGRA với KNX TP qua built-in BCU, 3 loại communication object, 64 objects, không cần gateway trung gian.

## Article Body

Trong các công trình dùng cả hệ điều khiển tự động KNX và hệ báo động chuyên dụng Satel INTEGRA, vấn đề thường gặp là hai hệ thống vận hành độc lập, mỗi hệ một tủ điều khiển, không chia sẻ dữ liệu trạng thái cho nhau. Người dùng phải bật đèn qua app KNX rồi mở app khác để tắt báo động, hoặc ngược lại. Satel INT-KNX-2 giải quyết đúng vấn đề này: module gắn bên trong enclosure của panel INTEGRA, có built-in BCU (Bus Coupling Unit) tích hợp sẵn nên không cần coupler hay gateway trung gian, và tự thân là một KNX TP device thực thụ.
INT-KNX-2 là gì và giải quyết bài toán nào
INT-KNX-2 vừa là expander module trên expander bus của panel INTEGRA, vừa là thiết bị KNX TP có địa chỉ vật lý riêng trong ETS. Nhờ built-in BCU, kỹ sư không cần thêm KNX coupler hay bất kỳ gateway trung gian nào: đấu 2 cọc KNX TP vào module là đủ để nó xuất hiện trên bus như một thiết bị KNX tiêu chuẩn.
Điểm khác biệt so với các giải pháp tích hợp qua dry contact relay là INT-KNX-2 cho phép ba chiều tích hợp hoạt động song song và độc lập: trạng thái output của INTEGRA đẩy giá trị lên KNX bus, telegram KNX kích hoạt hoặc restore một zone của INTEGRA, và telegram KNX trigger macro command để INTEGRA thực thi cả chuỗi hành động (arm/disarm partition, bật output, đổi mode). Đây là bi-directional, event-driven integration với lập trình đầy đủ trong DLOADX và ETS, không phải tích hợp nửa vời.
Điều kiện tương thích cần nắm trước khi tư vấn
Ràng buộc quan trọng nhất khi khảo sát hoặc báo giá: INT-KNX-2 chỉ tương thích panel INTEGRA và INTEGRA Plus (firmware 1.13 trở lên), KHÔNG hỗ trợ VERSA hoặc PERFECTA. Nếu công trình đang dùng hai dòng panel này, không có cách nào ép hoạt động, cần nâng cấp lên INTEGRA trước khi tính đến việc tích hợp KNX. Module hỗ trợ tối đa 64 communication object, cấp nguồn 12V DC lấy trực tiếp từ panel hoặc PSU riêng, và không có vỏ hộp riêng vì được thiết kế để sống bên trong enclosure có sẵn của INTEGRA. Thông số đầy đủ (dòng tiêu thụ, kích thước, nhiệt độ hoạt động) xem tại
trang sản phẩm INT-KNX-2
.
Ba loại communication object: cách tích hợp thật sự diễn ra
Toàn bộ tích hợp hai chiều được cấu hình qua ba loại object, mỗi loại đại diện cho một chiều dữ liệu riêng.
INTEGRA OUTPUT: chiều từ INTEGRA sang KNX. Khi output của panel đổi trạng thái (ví dụ output báo alarm), module gửi telegram đến group address đã gán, với hai giá trị cấu hình riêng cho ON và OFF. Có thể bật cyclical transmission (gửi lại định kỳ, ví dụ mỗi 30 giây) để đảm bảo actuator phía KNX luôn đồng bộ trạng thái nếu bus bị gián đoạn ngắn.
INTEGRA ZONE: chiều từ KNX sang INTEGRA. Một group address KNX được map vào một zone cụ thể của panel. Các reaction cấu hình được gồm: violation, restore, hoặc impulse (violation 5 giây rồi tự restore) khi nhận giá trị "1" hoặc "0", cùng reaction riêng cho các trường hợp bus restore, bus mất kết nối, và power up.
VIRTUAL (MACRO): chiều từ KNX sang INTEGRA nhưng mạnh hơn ZONE, vì trigger cả một macro command đã định nghĩa sẵn trong panel (arm/disarm partition, đổi mode, bật loạt output). Một KNX telegram duy nhất, ví dụ từ scene controller, có thể kích hoạt toàn bộ chuỗi hành động này.
Ba loại object hoạt động độc lập và phối hợp được trong cùng một dự án, cho phép xây dựng logic hai chiều đầy đủ chứ không chỉ đọc trạng thái một phía.
Kiến trúc kết nối giữa hai hệ thống
Module gắn bên trong enclosure của panel INTEGRA, đấu vào expander bus của panel (đường CLK/DAT) và đấu KNX TP qua 2 cọc riêng, hoạt động đồng thời như một thiết bị trên cả hai bus. Địa chỉ module trên expander bus và số outputs đăng ký được set bằng DIP switch vật lý trên board, đội thi công cần lập kế hoạch address map trước khi lắp đặt, đặc biệt ở công trình có nhiều module mở rộng khác (INT-E, INT-O) trên cùng panel để tránh trùng địa chỉ hoặc khai báo vượt số outputs còn khả dụng.
Kịch bản tích hợp thực tế
Alarm INTEGRA kích đèn cảnh báo KNX: output loại alarm map vào INTEGRA OUTPUT object, gửi giá trị bật khi có alarm, kèm cyclical transmission 30 giây để đèn tự đồng bộ lại nếu actuator KNX bị reset. Toàn bộ độ trễ dưới 1 giây.
Panic button KNX kích hoạt zone INTEGRA: nút nhấn KNX gửi giá trị "1" vào group address, map qua INTEGRA ZONE object với reaction "violation", ghi nhận đầy đủ vào event log của panel với tên zone rõ ràng, không chỉ là một tín hiệu khô như relay thường.
Scene KNX arm/disarm INTEGRA qua macro: scene "Rời tòa nhà" trên KNX trigger VIRTUAL object, chạy macro arm toàn bộ partition trong panel; scene "Về nhà" chạy macro ngược lại để disarm. Không cần keypad riêng, không cần relay trung gian.
Tòa nhà hybrid KNX và
INTEGRA 256 PLUS
: kiến trúc phổ biến ở công trình thương mại là dùng INTEGRA 256 PLUS làm security backbone 256 zones, INT-KNX-2 làm cầu nối, và một visualization KNX duy nhất hiển thị cả trạng thái an ninh lẫn lighting/HVAC. Alarm partition có thể override logic KNX, ví dụ tự bật full brightness đèn hành lang khi có sự cố để hỗ trợ thoát hiểm.
Ứng dụng thực tế trong công trình tại Việt Nam
Villa và nhà phố có sẵn hệ báo động Satel từ trước khi lắp KNX là trường hợp phổ biến nhất cần đến INT-KNX-2, vì chủ nhà không muốn bỏ hệ báo động đang hoạt động tốt để đổi sang giải pháp an ninh tích hợp sẵn trong KNX. Khách sạn và căn hộ dịch vụ cũng phù hợp, vì kịch bản "Do Not Disturb", "Rời phòng" cần đồng bộ giữa điều khiển phòng (KNX) và hệ an ninh khu vực chung, mà Satel INTEGRA thường phụ trách cho hành lang, cầu thang thoát hiểm, khu kỹ thuật.
Văn phòng và tòa nhà thương mại có nhiều khu vực với mức an ninh khác nhau (sảnh chính, phòng server, khu vực nhân viên) cũng thường dùng Satel cho an ninh chuyên sâu và KNX cho điều khiển tiện nghi, nên việc tích hợp hai chiều giúp bộ phận vận hành quản lý cả hai từ một giao diện duy nhất thay vì hai phần mềm tách biệt.
Những điều cần lưu ý khi triển khai
Vì INT-KNX-2 nằm giữa hai hệ thống do hai đội kỹ thuật khác nhau phụ trách trong nhiều dự án (đội KNX và đội an ninh Satel), việc mapping group address cần thống nhất trước khi thi công, tránh mỗi bên tự đặt địa chỉ theo quy ước riêng rồi phải sửa lại toàn bộ khi tích hợp. Trước khi bàn giao, cần kiểm tra từng kịch bản hai chiều thực tế: kích hoạt zone từ phía Satel để xem KNX có nhận đúng trạng thái không, và gửi lệnh macro từ phía KNX để xem panel có phản hồi đúng không. Bỏ qua bước kiểm tra này là nguyên nhân phổ biến khiến hệ thống báo lỗi sau khi khách đã sử dụng. Vì đây là hệ thống an ninh, nguồn điện cho module và tủ điều khiển KNX liên quan nên có UPS riêng để duy trì hoạt động báo động khi mất điện lưới. Quy trình cấu hình chi tiết trong DLOADX và ETS, kỹ thuật viên tham khảo hướng dẫn đi kèm sản phẩm hoặc liên hệ KNXStore để được hỗ trợ trực tiếp.
Thiết bị Satel tích hợp KNX thực tế tại KNXStore
Ngoài INT-KNX-2, panel INTEGRA thường đi kèm các module mở rộng khác trên cùng expander bus: INT-E (mở rộng khu vực/zone), INT-O (mở rộng ngõ ra), và ETHM-1 PLUS (giao tiếp Ethernet cho remote access và mobile app, hoạt động độc lập song song với INT-KNX-2, không xung đột nhau vì ETHM-1 PLUS xử lý phần TCP/IP còn INT-KNX-2 xử lý phần KNX TP). Khi lập kế hoạch address map cho panel có nhiều module mở rộng, cần tính tổng số địa chỉ expander bus mà tất cả module tiêu thụ trước khi chốt cấu hình INT-KNX-2.
Với các khu vực phụ chỉ cần vài cảm biến rời (kho, sân sau, khu kỹ thuật) mà không cần mở rộng zone trên panel INTEGRA chính, module ngõ vào
Satel KNX-BIN24
đấu cảm biến PIR hoặc cửa từ trực tiếp vào KNX là lựa chọn tiết kiệm hơn, không cần đến trung tâm INTEGRA đầy đủ cho khu vực đó.
KNXStore phân phối chính hãng cả dòng Satel INTEGRA và hệ sinh thái KNX TP. Khi triển khai, chúng tôi hỗ trợ khảo sát hệ báo động Satel hiện có, tư vấn address map cho expander bus, và lập trình DLOADX/ETS để đảm bảo logic hai chiều hoạt động ổn định, không xung đột với các kịch bản chiếu sáng, điều hòa đã có.
Thành phần cấu hình và lập trình hệ thống: DLOADX và ETS
Để thiết lập kết nối giữa hệ thống báo động INTEGRA / INTEGRA Plus và hệ thống KNX, kỹ sư triển khai cần làm việc với hai công cụ chính:
DLOADX – phần mềm cấu hình trung tâm báo động SATEL
ETS (Engineering Tool Software) – phần mềm cấu hình hệ thống KNX tiêu chuẩn
Hai phần mềm này hoạt động độc lập nhưng phối hợp với nhau thông qua mô-đun INT-KNX-2, nơi các địa chỉ group (KNX) và ngõ ra ảo (SATEL) được ánh xạ tương ứng.
Cấu hình bằng DLOADX (SATEL)
Phần mềm DLOADX được sử dụng để:
Cấu hình mô-đun INT-KNX-2 trong hệ thống INTEGRA
Tạo và gán các ngõ ra ảo (virtual outputs) tương ứng với từng communication object trong KNX
Lập trình các macro hoặc logic hành vi để điều khiển thiết bị KNX
Các bước cơ bản:
Vào chế độ SERVICE > STRUCTURE > HARDWARE > IDENTIFICATION > EXPANDERS ID. để nhận diện mô-đun INT-KNX-2
Gán số lượng output thông qua DIP switch trên phần cứng (từ 8 đến 64, bội số của 8)
Trong DLOADX, truy cập:
Structure > Hardware > Expansion Modules > [INT-KNX-2]
Cấu hình logic điều khiển: ví dụ khi vùng bị kích hoạt → bật output → gửi đến actuator KNX
Cấu hình bằng ETS (KNX)
Phần mềm ETS là công cụ tiêu chuẩn để lập trình và cấu hình các thiết bị KNX:
Nhập và ánh xạ Group Address tương ứng với các communication objects từ INT-KNX-2
Gán các group address này cho actuator (đèn, rèm, HVAC...) hoặc sensor (công tắc, nút nhấn, cảm biến...)
Xây dựng các ngữ cảnh (scenes) và logic điều khiển
Các bước cơ bản:
Tạo project ETS mới hoặc mở project hiện tại
Nhập sản phẩm INT-KNX-2 (nếu có file KNX product database từ SATEL)
Gán Group Address tương ứng với ngõ ra từ SATEL
Thiết lập liên kết (bindings) giữa group address đó với thiết bị KNX cần điều khiển
Kết luận
INT-KNX-2 giải quyết đúng bài toán tích hợp giữa hệ an ninh Satel và hệ điều khiển KNX bằng built-in BCU và ba loại communication object hoạt động song song, thay vì chạy hai hệ tách biệt hoặc tích hợp nửa vời qua relay khô. Với công trình chỉ cần vài cảm biến đơn giản, KNX-BIN24 vẫn là lựa chọn tiết kiệm hơn; INT-KNX-2 phù hợp khi cần tích hợp sâu, hai chiều, với panel INTEGRA hoặc INTEGRA Plus đã có sẵn hoặc đang được lên kế hoạch cho công trình.
Cần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
INT-KNX-2 có tương thích với VERSA hoặc PERFECTA không?
Không. INT-KNX-2 chỉ tương thích INTEGRA và INTEGRA Plus, firmware 1.13 trở lên. VERSA và PERFECTA không hỗ trợ module này; nếu công trình đang dùng hai dòng panel đó, cần nâng cấp lên INTEGRA trước khi triển khai.

INT-KNX-2 có cần KNX coupler riêng không?
Không. Module có built-in BCU tích hợp sẵn, kết nối trực tiếp vào KNX TP qua 2 cọc đấu dây, không cần thêm BCU hay gateway trung gian như một số giải pháp tích hợp khác.

Có thể lắp bao nhiêu INT-KNX-2 trên một panel INTEGRA?
Không giới hạn riêng cho số lượng module, nhưng bị ràng buộc bởi số địa chỉ expander bus và tổng số outputs còn khả dụng của panel. Ví dụ INTEGRA 128 PLUS hỗ trợ tối đa 128 outputs từ tất cả expander module cộng lại, nên nếu INT-KNX-2 khai báo 64 outputs, chỉ còn 64 outputs cho các module khác.

Điều gì xảy ra khi KNX bus bị mất kết nối?
Có thể bật tùy chọn báo trouble khi module mất communication trên KNX bus, và cấu hình riêng reaction của từng ZONE object khi bus off (none, violation, hoặc restore). Cần cân nhắc kỹ: nếu set "violation", mất bus sẽ tự kích hoạt alarm.

Nếu chỉ có vài cảm biến an ninh đơn giản, có bắt buộc phải dùng INT-KNX-2 không?
Không bắt buộc. Với khu vực phụ chỉ cần vài cảm biến PIR hoặc cửa từ, module ngõ vào KNX-BIN24 đấu trực tiếp vào KNX là giải pháp đơn giản và tiết kiệm hơn.

## Raw MCP

```json
{
  "slug": "knx-satel-ket-noi-an-ninh-hai-chieu-voi-module-int-knx-2",
  "title": "KNX & SATEL: Giải pháp kết nối an ninh hai chiều với module INT-KNX-2",
  "excerpt": "INT-KNX-2 tích hợp trực tiếp hệ báo động Satel INTEGRA với KNX TP qua built-in BCU, 3 loại communication object, 64 objects, không cần gateway trung gian.",
  "coverImage": "/media/a74e6148b5d101eaf7da821de063859c51a03e2f26b6459c764d491c754e1164.jpg",
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
  "publishedAt": "2026-08-04T09:18:52.000Z",
  "categories": [
    {
      "slug": "an-ninh",
      "name": "An ninh"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "KNX & Satel: Kết Nối An Ninh Hai Chiều Với Module INT-KNX-2",
  "seoDescription": "INT-KNX-2 tích hợp trực tiếp hệ báo động Satel INTEGRA với KNX TP qua built-in BCU, 3 loại communication object, 64 objects, không cần gateway trung gian.",
  "faqs": [
    {
      "question": "INT-KNX-2 có tương thích với VERSA hoặc PERFECTA không?",
      "answer": "Không. INT-KNX-2 chỉ tương thích INTEGRA và INTEGRA Plus, firmware 1.13 trở lên. VERSA và PERFECTA không hỗ trợ module này; nếu công trình đang dùng hai dòng panel đó, cần nâng cấp lên INTEGRA trước khi triển khai.",
      "position": 0
    },
    {
      "question": "INT-KNX-2 có cần KNX coupler riêng không?",
      "answer": "Không. Module có built-in BCU tích hợp sẵn, kết nối trực tiếp vào KNX TP qua 2 cọc đấu dây, không cần thêm BCU hay gateway trung gian như một số giải pháp tích hợp khác.",
      "position": 1
    },
    {
      "question": "Có thể lắp bao nhiêu INT-KNX-2 trên một panel INTEGRA?",
      "answer": "Không giới hạn riêng cho số lượng module, nhưng bị ràng buộc bởi số địa chỉ expander bus và tổng số outputs còn khả dụng của panel. Ví dụ INTEGRA 128 PLUS hỗ trợ tối đa 128 outputs từ tất cả expander module cộng lại, nên nếu INT-KNX-2 khai báo 64 outputs, chỉ còn 64 outputs cho các module khác.",
      "position": 2
    },
    {
      "question": "Điều gì xảy ra khi KNX bus bị mất kết nối?",
      "answer": "Có thể bật tùy chọn báo trouble khi module mất communication trên KNX bus, và cấu hình riêng reaction của từng ZONE object khi bus off (none, violation, hoặc restore). Cần cân nhắc kỹ: nếu set \"violation\", mất bus sẽ tự kích hoạt alarm.",
      "position": 3
    },
    {
      "question": "Nếu chỉ có vài cảm biến an ninh đơn giản, có bắt buộc phải dùng INT-KNX-2 không?",
      "answer": "Không bắt buộc. Với khu vực phụ chỉ cần vài cảm biến PIR hoặc cửa từ, module ngõ vào KNX-BIN24 đấu trực tiếp vào KNX là giải pháp đơn giản và tiết kiệm hơn.",
      "position": 4
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/knx-satel-ket-noi-an-ninh-hai-chieu-voi-module-int-knx-2.html"
}
```
