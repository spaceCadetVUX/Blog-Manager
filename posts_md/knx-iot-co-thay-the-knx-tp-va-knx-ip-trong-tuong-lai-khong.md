---
url: "https://knxstore.vn/knx-iot-co-thay-the-knx-tp-va-knx-ip-trong-tuong-lai-khong.html"
headline: "KNX IoT có thay thế KNX TP và KNX IP trong tương lai không?"
description: "KNX IoT mở rộng KNX TP/IP với IPv6, REST API, bảo mật TLS 1.3. So sánh cấu trúc, bảo mật, khả năng tích hợp và khi nào nên dùng song song."
title: "KNX IoT Có Thay Thế KNX TP Và KNX IP Trong Tương Lai?"
image: "https://knxstore.vn/media/68bed1531b9add23d5f2fecc1f9db5bda891a6d1882fab38583de9c5246a1940.jpg"
datePublished: "2026-08-04T03:38:14.000Z"
dateModified: "2026-08-04T03:38:14.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Kiến thức"
word_count: 2405
keywords: ["Kiến thức"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Kiến thức"
    url: "https://knxstore.vn/blogs/kien-thuc"
  - name: "KNX IoT có thay thế KNX TP và KNX IP trong tương lai không?"
    url: "https://knxstore.vn/knx-iot-co-thay-the-knx-tp-va-knx-ip-trong-tuong-lai-khong.html"
products: [{"url": "https://knxstore.vn/products/thinknx-bo-chuyen-doi-tin-hieu-knx-tich-hop-ethernet-micro", "name": "Bộ chuyển đổi tín hiệu KNX tích hợp Ethernet ThinKNX - MICRO"}, {"url": "https://knxstore.vn/products/thinknx-bo-chuyen-doi-tin-hieu-knx-mang-ethernet-compact", "name": "Bộ chuyển đổi tín hiệu KNX mạng Ethernet ThinKNX - COMPACT"}, {"url": "https://knxstore.vn/products/thinknx-bo-dieu-khien-da-nang-rack", "name": "Bộ điều khiển đa năng RACK ThinKNX"}]
internal_links:
  - url: "https://knxstore.vn/he-thong-ung-dung-knx.html"
    slug: "he-thong-ung-dung-knx"
    anchor: "hệ thống KNX"
  - url: "https://knxstore.vn/knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi.html"
    slug: "knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi"
    anchor: "KNX IP Interface và IP Router: khác nhau thế nào"
  - url: "https://knxstore.vn/nhung-rui-ro-khi-he-thong-knx-khong-duoc-bao-mat-dung-cach.html"
    slug: "nhung-rui-ro-khi-he-thong-knx-khong-duoc-bao-mat-dung-cach"
    anchor: "KNX Secure là gì? Bảo mật và rủi ro hệ KNX."
  - url: "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html"
    slug: "vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip"
    anchor: "AES-128 CCM"
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

# KNX IoT có thay thế KNX TP và KNX IP trong tương lai không?

> KNX IoT mở rộng KNX TP/IP với IPv6, REST API, bảo mật TLS 1.3. So sánh cấu trúc, bảo mật, khả năng tích hợp và khi nào nên dùng song song.

## Article Body

Trong hơn 30 năm phát triển, KNX đã trở thành nền tảng tiêu chuẩn cho tự động hóa tòa nhà, với hai hình thức truyền thông chính: KNX TP (twisted pair), ổn định, đáng tin cậy cho mạng có dây, và KNX IP, linh hoạt, hỗ trợ lập trình qua mạng và mở rộng kết nối giữa các khu vực.
Bước vào thời đại Internet of Things, nhu cầu tích hợp dữ liệu theo thời gian thực, kết nối đến cloud, AI và hệ thống IT ngày càng gia tăng. KNX IoT ra đời nhằm mở rộng khả năng giao tiếp của
hệ thống KNX
với các nền tảng hiện đại, sử dụng IPv6, REST API và mô hình dữ liệu semantic.
KNX TP và KNX IP là gì?
Trước khi nói đến KNX IoT, cần nhìn lại hai nền tảng đã làm nên tên tuổi của giao thức KNX trong suốt hơn ba thập kỷ: KNX TP và KNX IP. Đây là những lựa chọn truyền thông đã được triển khai hàng triệu lần trong các công trình dân dụng, thương mại và công nghiệp khắp thế giới.
Khái niệm KNX TP
KNX TP (Twisted Pair) là hình thức truyền thông vật lý gốc của KNX, sử dụng cặp dây xoắn chuyên dụng để truyền telegram giữa các thiết bị. Với tốc độ truyền dữ liệu khoảng 9.6 kbps, KNX TP không nhanh nhưng cực kỳ ổn định và có khả năng chống nhiễu cao, phù hợp cho các công trình có quy mô lớn hoặc môi trường nhiều nhiễu điện từ.
Một đặc điểm mạnh của KNX TP là nó hoạt động hoàn toàn độc lập với hệ thống mạng IP, không phụ thuộc vào router, switch hay server. Đây là lý do nhiều công trình hạ tầng quan trọng như bệnh viện, nhà máy hoặc khách sạn cao cấp vẫn ưu tiên dùng KNX TP làm xương sống điều khiển.
Một đặc điểm mạnh mẽ của KNX TP là nó hoạt động hoàn toàn độc lập với hệ thống mạng IP, không phụ thuộc vào router, switch hay server. Đây chính là lý do vì sao nhiều công trình hạ tầng quan trọng như bệnh viện, nhà máy hoặc khách sạn cao cấp vẫn ưu tiên sử dụng KNX TP làm xương sống điều khiển.
Khái niệm KNX IP
KNX IP cho phép truyền dữ liệu KNX qua mạng Ethernet nội bộ, mở ra khả năng kết nối giữa các line TP bằng backbone IP, lập trình từ xa qua mạng LAN hoặc VPN, và dễ dàng tích hợp với hệ thống BMS, SCADA, IoT trung gian thông qua gateway.
Dù KNX IP không thay thế hoàn toàn TP, nó giúp tăng tính linh hoạt trong thiết kế hệ thống, nhất là trong các công trình có sẵn hạ tầng mạng hoặc muốn tận dụng kết nối giữa nhiều khu vực mà không phải đi dây TP dài. Với dự án cần chọn cụ thể loại interface hay router, có thể xem thêm
KNX IP Interface và IP Router: khác nhau thế nào
để chọn đúng thiết bị theo quy mô công trình.
KNX IoT là gì?
KNX IoT là bước phát triển tiếp theo của hệ thống KNX nhằm đưa toàn bộ công nghệ điều khiển tòa nhà vào kỷ nguyên IP và IoT. Thay vì chỉ giao tiếp qua Group Address trên bus TP hoặc qua tunneling KNXnet/IP, KNX IoT hoạt động qua giao thức IPv6, sử dụng Point API chuẩn REST/JSON và mô hình dữ liệu ngữ nghĩa (KIM) để tương tác trực tiếp với cloud, hệ thống IT và phát triển ứng dụng web.
KNX IoT sử dụng các phương thức giao tiếp như IPv6, Thread mesh, hoặc Ethernet/Wi-Fi, thay thế cho bus TP hoặc multicast IP truyền thống. Điều này cho phép thiết bị KNX hoạt động trong mạng không dây tiêu thụ năng lượng thấp, dễ triển khai mà vẫn đảm bảo tính tự hồi phục và phủ sóng rộng, điều mà bus vật lý không thể đạt được.
Mặc dù vẫn sử dụng ETS6 để cấu hình, KNX IoT bổ sung lớp RESTful API giúp lập trình viên bên ngoài (không dùng KNX) có thể điều khiển thiết bị KNX qua HTTP và JSON. Điều này mở rộng khả năng tích hợp với hệ thống dashboard, ứng dụng di động, AI hoặc nền tảng cloud mà không đòi hỏi hiểu sâu về Group Address truyền thống.
KNX IoT áp dụng cơ chế bảo mật cấp cao như TLS 1.3, OAuth 2.0, và access token để bảo vệ kết nối khi tương tác qua API. Đồng thời vẫn tương thích với tiêu chuẩn bảo mật cũ
KNX Secure là gì? Bảo mật và rủi ro hệ KNX.
trên TP/IP, giúp bảo vệ dữ liệu end-to-end trong cả môi trường cloud và mạng nội bộ.
So sánh cấu trúc mạng, bảo mật và tính mở giữa KNX truyền thống và KNX IoT
Giao tiếp vật lý và mô hình truyền thông
KNX TP sử dụng dây bus chuyên dụng truyền telegram ở tốc độ khoảng 9600 bps, ổn định và chống nhiễu cao, phù hợp công trình có nhiều thiết bị gần nhau và không cần tốc độ cao.
KNX IP hỗ trợ giao tiếp qua Ethernet (LAN), giúp kết nối nhiều line TP thông qua backbone mạng IP, lập trình hoặc điều khiển từ xa qua ETS qua IP interface/router. KNX IP không thay thế TP mà bổ sung khả năng kết nối linh hoạt.
KNX IoT hoạt động trực tiếp trên IPv6, sử dụng các cơ chế như Thread mesh, Wi-Fi hoặc Ethernet mà không phụ thuộc bus TP, cho phép thiết bị KNX hoạt động trong mạng IP hiện đại, dễ mở rộng và tích hợp IT/OT hơn.
Bảo mật và khả năng an toàn
KNX truyền thống (TP/IP) yêu cầu bổ sung chuẩn KNX Secure (
AES-128 CCM
, xác thực FDSK) để đảm bảo tính toàn vẹn và mã hóa telegram. Nếu không bật Secure, telegram có thể bị giả mạo hoặc nghe lén.
KNX IoT được thiết kế bảo mật ngay từ đầu, tích hợp giao thức như TLS 1.3, OAuth 2.0, access token để truyền dữ liệu qua API REST an toàn như hệ thống cloud, đồng thời vẫn tương thích với mô hình Secure truyền thống nếu cần tương tác bus TP/IP.
Khả năng tích hợp và mở rộng linh hoạt
KNX truyền thống yêu cầu dùng ETS để lập trình, đọc dữ liệu qua Group Address, và tích hợp với bên thứ ba cần dùng gateway hoặc API riêng biệt.
KNX IoT hỗ trợ REST/JSON API chuẩn qua Point API và 3rd Party API, cho phép các hệ thống như dashboard, cloud, AI hoặc BMS dễ tương tác mà không cần hiểu địa chỉ group hoặc ETS sâu rộng. Mô hình dữ liệu semantic (KIM) đảm bảo dữ liệu KNX định nghĩa rõ ràng theo chuẩn chung, dễ chia sẻ giữa các ứng dụng, nhà sản xuất và hệ thống khác nhau.
Khía cạnh
KNX TP / KNX IP
KNX IoT
Tầng truyền thông
TP bus hoặc IP tunneling
IPv6 qua Thread, Wi-Fi hoặc Ethernet
Bảo mật
Cần KNX Secure (AES-128 CCM)
TLS 1.3, OAuth 2.0, API authentication, bảo mật thiết kế từ đầu
Giao tiếp và lập trình
ETS và Group Address
ETS + REST/JSON API cho bên ngoài
Dữ liệu semantic
Không có mô hình chung
Mô hình dữ liệu chuẩn hóa qua KIM
Tính mở và tích hợp mở rộng
Giới hạn với gateway và interface
Tích hợp trực tiếp với dashboard, AI, cloud
KNX TP và KNX IP vẫn giữ vị thế là nền tảng cốt lõi, đảm bảo độ ổn định và khả năng vận hành lâu dài. KNX IoT bổ sung lớp giao tiếp mới, mở đường cho khả năng kết nối sâu rộng, linh hoạt và an toàn hơn.
Khi nào nên sử dụng song song cả KNX TP/IP và KNX IoT
Triển khai toàn diện và vẫn duy trì ổn định
Khi cần tận dụng cả độ ổn định của mạng KNX TP/IP và khả năng tích hợp mở rộng của KNX IoT, mô hình hybrid với KNX IoT Router là lựa chọn hợp lý. Thiết bị IoT có thể được thêm vào mà không làm gián đoạn mạng TP hiện có, và vẫn dùng ETS để cấu hình toàn hệ thống đồng nhất.
Mở rộng vùng phủ sóng không dây với Thread mesh
Với các công trình retrofit hoặc diện tích lớn, mạng Thread mesh giúp thiết bị KNX IoT hoạt động trong môi trường không dây, tự phục hồi và tiết kiệm chi phí triển khai so với đi dây mới.
Ba trường hợp nên chọn mô hình hybrid
Công trình phức hợp như khách sạn, resort cao cấp dùng TP xử lý chiếu sáng, điều hòa tại chỗ, còn IoT cung cấp thống kê năng lượng, lịch bật/tắt, hỗ trợ truy cập từ mobile. Trong tòa nhà văn phòng hoặc đô thị thông minh, có thể nhân rộng cảm biến môi trường, camera hoặc thiết bị bên ngoài qua IoT, trong khi mạng lõi TP vẫn đảm bảo độ tin cậy. Với nhà ở thông minh dạng retrofit, có thể thêm node IoT mà không cần đi lại dây bus KNX TP.
KNX IoT mở rộng nền tảng KNX ở mức độ nào
Trong nhiều tài liệu kỹ thuật chính thức từ KNX Association, thông điệp được nhấn mạnh: KNX IoT không phải để thay thế KNX TP hay KNX IP, mà nhằm mở rộng khả năng, phạm vi tích hợp và ứng dụng của hệ thống KNX trong thời đại Internet of Things.
Mở rộng nhưng vẫn tương thích
KNX IoT hoạt động dựa trên IPv6 và các API mở, cho phép thiết bị mới giao tiếp với mạng KNX hiện có thông qua các cầu nối (KNX IoT Router). Thiết bị KNX truyền thống vẫn tiếp tục đóng vai trò quan trọng trong vận hành hệ thống, trong khi thiết bị KNX IoT có thể được thêm vào để xử lý các tác vụ mở rộng như kết nối dữ liệu môi trường với cloud AI, giao tiếp với hệ thống giám sát năng lượng, điều khiển từ xa qua ứng dụng di động hoặc dashboard.
Hỗ trợ đa giao thức mà không phá vỡ cấu trúc cũ
Nhờ sử dụng các công nghệ như Thread, MQTT, REST API, KNX IoT giúp hệ thống trao đổi dữ liệu với nhiều giao thức phổ biến mà không cần thêm gateway phức tạp. Việc này giảm độ trễ, tiết kiệm chi phí tích hợp, nhưng vẫn giữ cấu trúc KNX chuẩn phía sau, nơi ETS quản lý toàn bộ logic và liên kết thiết bị.
KNXStore đồng hành cùng xu hướng KNX IoT tại Việt Nam
Sự ra đời của KNX IoT không xóa bỏ hạ tầng TP/IP đã triển khai, mà bổ sung lớp giao tiếp để hệ thống dễ tích hợp hơn với cloud và các ứng dụng IT hiện đại. Với dự án đang cân nhắc nâng cấp lên KNX IoT, nên đánh giá trước phần nào của công trình thực sự cần lớp API mở này, tránh chuyển đổi toàn bộ hệ thống khi phần lớn nhu cầu vận hành vẫn chỉ cần TP/IP truyền thống là đủ.
Tại thị trường Việt Nam, KNXStore là một trong những đơn vị tiên phong cung cấp thiết bị hỗ trợ KNX IoT, đồng thời cập nhật liên tục các công cụ lập trình ETS6 mới nhất, KNX IoT Router, và giải pháp kết nối cloud cho công trình hiện đại. Với kinh nghiệm triển khai nhiều hệ thống KNX phức hợp và đội ngũ kỹ sư được đào tạo bài bản, KNXStore không chỉ bán sản phẩm – mà còn tư vấn, huấn luyện và đồng hành cùng khách hàng trên hành trình chuyển đổi sang hệ điều khiển thông minh thế hệ mới.
KNX IoT có thay thế hoàn toàn KNX TP và KNX IP không?
Không. KNX Association xác nhận KNX IoT là lớp mở rộng, không phải bản thay thế. KNX TP vẫn là lựa chọn ổn định nhất cho mạng có dây quy mô lớn, KNX IP vẫn dùng để kết nối các line TP qua backbone Ethernet.

Dự án đang chạy KNX TP/IP có cần nâng cấp lên KNX IoT ngay không?
Không cần, nếu nhu cầu vận hành hiện tại chỉ dừng ở điều khiển chiếu sáng, điều hòa, an ninh trong nội bộ công trình. KNX IoT chỉ thực sự cần khi có yêu cầu tích hợp cloud, AI, dashboard bên ngoài hoặc mở rộng bằng mạng không dây Thread mesh.

KNX IoT có cần ETS để cấu hình không?
Có. KNX IoT vẫn dùng ETS6 để cấu hình phần lõi, chỉ bổ sung thêm lớp REST/JSON API phía trên để hệ thống bên ngoài (không rành KNX) tương tác được qua HTTP.

Bảo mật của KNX IoT khác gì so với KNX Secure trên TP/IP?
KNX Secure trên TP/IP dùng AES-128 CCM để mã hóa và xác thực telegram trên bus. KNX IoT bổ sung thêm TLS 1.3, OAuth 2.0 và access token cho lớp giao tiếp API, đồng thời vẫn tương thích với KNX Secure khi cần tương tác ngược vào bus TP/IP.

Công trình retrofit không đi lại dây TP có dùng được KNX IoT không?
Có, đây là trường hợp phù hợp nhất. KNX IoT hỗ trợ Thread mesh và Wi-Fi, cho phép thêm thiết bị mới vào mạng KNX hiện có mà không cần kéo dây bus TP mới.

Chuyển hoàn toàn sang KNX IoT có làm mất khả năng tương thích với thiết bị KNX cũ không?
Không, nếu triển khai đúng theo mô hình hybrid qua cầu nối KNX IoT Router. Thiết bị KNX TP/IP cũ vẫn hoạt động bình thường, thiết bị IoT mới chỉ đóng vai trò bổ sung khả năng tích hợp.

Chi phí triển khai KNX IoT có cao hơn nhiều so với KNX IP truyền thống không?
Tùy quy mô mở rộng. Với công trình chỉ cần thêm vài điểm tích hợp cloud/dashboard, chi phí không chênh lệch lớn so với dùng thêm gateway IP thông thường. Chi phí tăng đáng kể khi mở rộng toàn bộ hạ tầng sang mô hình Thread mesh diện rộng.

## Raw MCP

```json
{
  "slug": "knx-iot-co-thay-the-knx-tp-va-knx-ip-trong-tuong-lai-khong",
  "title": "KNX IoT có thay thế KNX TP và KNX IP trong tương lai không?",
  "excerpt": "KNX IoT mở rộng KNX TP/IP với IPv6, REST API, bảo mật TLS 1.3. So sánh cấu trúc, bảo mật, khả năng tích hợp và khi nào nên dùng song song.",
  "coverImage": "/media/68bed1531b9add23d5f2fecc1f9db5bda891a6d1882fab38583de9c5246a1940.jpg",
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
  "publishedAt": "2026-08-04T03:38:14.000Z",
  "categories": [
    {
      "slug": "kien-thuc",
      "name": "Kiến thức"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "KNX IoT Có Thay Thế KNX TP Và KNX IP Trong Tương Lai?",
  "seoDescription": "KNX IoT mở rộng KNX TP/IP với IPv6, REST API, bảo mật TLS 1.3. So sánh cấu trúc, bảo mật, khả năng tích hợp và khi nào nên dùng song song.",
  "faqs": [
    {
      "question": "KNX IoT có thay thế hoàn toàn KNX TP và KNX IP không?",
      "answer": "Không. KNX Association xác nhận KNX IoT là lớp mở rộng, không phải bản thay thế. KNX TP vẫn là lựa chọn ổn định nhất cho mạng có dây quy mô lớn, KNX IP vẫn dùng để kết nối các line TP qua backbone Ethernet.",
      "position": 0
    },
    {
      "question": "Dự án đang chạy KNX TP/IP có cần nâng cấp lên KNX IoT ngay không?",
      "answer": "Không cần, nếu nhu cầu vận hành hiện tại chỉ dừng ở điều khiển chiếu sáng, điều hòa, an ninh trong nội bộ công trình. KNX IoT chỉ thực sự cần khi có yêu cầu tích hợp cloud, AI, dashboard bên ngoài hoặc mở rộng bằng mạng không dây Thread mesh.",
      "position": 1
    },
    {
      "question": "KNX IoT có cần ETS để cấu hình không?",
      "answer": "Có. KNX IoT vẫn dùng ETS6 để cấu hình phần lõi, chỉ bổ sung thêm lớp REST/JSON API phía trên để hệ thống bên ngoài (không rành KNX) tương tác được qua HTTP.",
      "position": 2
    },
    {
      "question": "Bảo mật của KNX IoT khác gì so với KNX Secure trên TP/IP?",
      "answer": "KNX Secure trên TP/IP dùng AES-128 CCM để mã hóa và xác thực telegram trên bus. KNX IoT bổ sung thêm TLS 1.3, OAuth 2.0 và access token cho lớp giao tiếp API, đồng thời vẫn tương thích với KNX Secure khi cần tương tác ngược vào bus TP/IP.",
      "position": 3
    },
    {
      "question": "Công trình retrofit không đi lại dây TP có dùng được KNX IoT không?",
      "answer": "Có, đây là trường hợp phù hợp nhất. KNX IoT hỗ trợ Thread mesh và Wi-Fi, cho phép thêm thiết bị mới vào mạng KNX hiện có mà không cần kéo dây bus TP mới.",
      "position": 4
    },
    {
      "question": "Chuyển hoàn toàn sang KNX IoT có làm mất khả năng tương thích với thiết bị KNX cũ không?",
      "answer": "Không, nếu triển khai đúng theo mô hình hybrid qua cầu nối KNX IoT Router. Thiết bị KNX TP/IP cũ vẫn hoạt động bình thường, thiết bị IoT mới chỉ đóng vai trò bổ sung khả năng tích hợp.",
      "position": 5
    },
    {
      "question": "Chi phí triển khai KNX IoT có cao hơn nhiều so với KNX IP truyền thống không?",
      "answer": "Tùy quy mô mở rộng. Với công trình chỉ cần thêm vài điểm tích hợp cloud/dashboard, chi phí không chênh lệch lớn so với dùng thêm gateway IP thông thường. Chi phí tăng đáng kể khi mở rộng toàn bộ hạ tầng sang mô hình Thread mesh diện rộng.",
      "position": 6
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/knx-iot-co-thay-the-knx-tp-va-knx-ip-trong-tuong-lai-khong.html"
}
```
