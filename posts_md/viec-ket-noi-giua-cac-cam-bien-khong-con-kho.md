---
url: "https://knxstore.vn/viec-ket-noi-giua-cac-cam-bien-khong-con-kho.html"
headline: "Cảm Biến Cho Nhà Máy: Modbus RTU, DALI Casambi, BACnet/IP"
description: "MRB-510SF Modbus RTU, Versaan Unity S1 DALI Casambi, Lithernet BACnet/IP: hai cách đưa dữ liệu cảm biến nhà máy vào BMS. Tư vấn kỹ thuật tại KNXStore."
image: "https://knxstore.vn/media/9926dae6a5b1a45fc26d2ee876db26ea7e0c528771552d01e24a05178cf60a5d.jpg"
datePublished: "2026-08-19T02:22:34.000Z"
dateModified: "2026-08-19T02:22:34.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Chiếu sáng"
word_count: 1885
keywords: ["Chiếu sáng"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Chiếu sáng"
    url: "https://knxstore.vn/blogs/chieu-sang"
  - name: "Cảm Biến Cho Nhà Máy: Modbus RTU, DALI Casambi, BACnet/IP"
    url: "https://knxstore.vn/viec-ket-noi-giua-cac-cam-bien-khong-con-kho.html"
products: [{"url": "https://knxstore.vn/products/cam-bien-hien-dien-modbus-rtu-ir-tec-mrb-510sf", "name": "Cảm Biến Hiện Diện Modbus RTU IR-TEC MRB-510SF"}, {"url": "https://knxstore.vn/products/cam-bien-hien-dien-dali-versaan-casambi-unity-s1", "name": "Cảm biến hiện diện DALI Versaan Casambi Dali Unity S1 - VS-S1-LBW"}, {"url": "https://knxstore.vn/products/lithernet-gateway-tich-hop-casambi-dua-tren-ethernet", "name": "Lithernet - Bộ cổng kết nối Ethernet Casambi"}]
internal_links:
  - url: "https://knxstore.vn/cam-bien-os-net-irtec.html"
    slug: "cam-bien-os-net-irtec"
    anchor: "dòng OS-NET của IR-TEC"
  - url: "https://knxstore.vn/cam-bien-trans-tu-irtec.html"
    slug: "cam-bien-trans-tu-irtec"
    anchor: "dòng TRANS của IR-TEC"
  - url: "https://knxstore.vn/6-loai-cam-bien-quan-trong-trong-he-thong-chieu-sang-thong-minh.html"
    slug: "6-loai-cam-bien-quan-trong-trong-he-thong-chieu-sang-thong-minh"
    anchor: "6 loại cảm biến quan trọng trong hệ thống chiếu sáng thông minh"
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

# Cảm Biến Cho Nhà Máy: Modbus RTU, DALI Casambi, BACnet/IP

> MRB-510SF Modbus RTU, Versaan Unity S1 DALI Casambi, Lithernet BACnet/IP: hai cách đưa dữ liệu cảm biến nhà máy vào BMS. Tư vấn kỹ thuật tại KNXStore.

## Article Body

Cảm biến hiện diện dạng relay on/off đủ cho một dây chuyền nhỏ: bật đèn khi có người, tắt khi vắng. Nhưng khi nhà máy mở rộng ra nhiều khu vực, ban quản lý vận hành cần nhiều hơn một tín hiệu bật/tắt: cần dữ liệu occupancy và lux đọc được từ xa, log được theo thời gian, và tích hợp vào BMS/HVAC đang chạy song song. Bài này nói về ba cách đưa cảm biến vào kiến trúc giám sát tập trung của nhà máy: cảm biến Modbus RTU cho BMS đọc dữ liệu số trực tiếp, cảm biến kết hợp DALI/Relay/Casambi cho khu vực vừa cần điều khiển tại chỗ vừa cần giám sát không dây, và gateway BACnet/IP để đưa toàn bộ mạng Casambi vào BMS hiện có.
Vì Sao Cảm Biến Rời Rạc Không Đủ Khi Nhà Máy Mở Rộng Quy Mô
Nguyên lý nhóm cảm biến cơ bản (cảm biến A và B cùng nhóm, ai đi vào vùng A thì đèn cả A và B sáng) vẫn đúng và vẫn dùng được cho nhà xưởng nhỏ, chạy độc lập, không cần giám sát tập trung. Vấn đề xuất hiện khi quy mô lớn hơn: ban quản lý vận hành muốn biết khu vực nào đang có người, mức lux thực tế bao nhiêu, log dữ liệu này theo thời gian để tính toán tiêu thụ năng lượng, hoặc để BMS/HVAC tự điều chỉnh theo hiện diện thực tế. Cảm biến relay on/off thuần túy không cung cấp được thông tin này, vì bản chất chỉ có 1 bit đầu ra: có tải hoặc không có tải.
Ba lớp giải pháp dưới đây giải quyết đúng bài toán đưa dữ liệu cảm biến vào hệ thống giám sát, theo mức độ tích hợp tăng dần: Modbus RTU đưa số liệu thô vào BMS, cảm biến DALI/Relay/Casambi kết hợp điều khiển tại chỗ với khả năng giám sát không dây, và gateway BACnet/IP đưa toàn bộ mạng cảm biến không dây vào BMS đang chạy giao thức tòa nhà chuẩn.
Modbus RTU: Đưa Dữ Liệu Cảm Biến Thẳng Vào BMS/HVAC
MRB-510SF Của IR-TEC: Cảm Biến Hiện Diện Và Ánh Sáng Dạng Modbus Slave
MRB-510SF không có relay, không có ngõ ra DALI hay 0-10V. Toàn bộ output là dữ liệu số trên bus RS-485, giao thức Modbus RTU. Thiết bị hoạt động như Modbus slave, cung cấp 2 loại dữ liệu cho BMS: trạng thái occupancy (occupied/vacant) đọc từ PIR omni-directional, và mức ánh sáng môi trường từ 1 đến 2.000 lux đọc từ cảm biến ALS. BMS controller (HVAC controller, lighting controller, energy management system) định kỳ đọc 2 giá trị này qua Modbus function code 01 (Read Coil Status) hoặc 03 (Read Holding Registers), rồi tự quyết định logic điều khiển theo phần mềm riêng, không bị ràng buộc bởi firmware cố định của cảm biến.
Register map của MRB-510SF cho phép cấu hình ON delay (0-300 giây) và OFF delay (5-1.800 giây) trực tiếp qua Modbus, không cần remote riêng. Baud rate hỗ trợ từ 1200 đến 115.200 bps, mặc định 9600bps/no parity/1 stop bit. Theo kinh nghiệm của chúng tôi, nên giữ nguyên baud rate mặc định trừ khi BMS yêu cầu khác, vì đổi baud rate bắt buộc phải factory reset trước, dễ gây gián đoạn khi đang vận hành.
Kiến Trúc RS-485 Khi Nhiều Cảm Biến Modbus Cùng Bus
Nhiều MRB-510SF có thể chạy trên cùng một bus RS-485, mỗi cảm biến giữ 1 địa chỉ Modbus riêng trong khoảng 1-250. Bus RS-485 là half-duplex, không phân nhánh, cần điện trở termination 180Ω tại đúng 2 đầu cuối bus, các node ở giữa không đấu terminal RT. Nhà máy dùng nhiều cảm biến Modbus trên diện tích lớn nên vẽ sơ đồ topology trước khi kéo dây, đặc biệt xác định rõ node nào là đầu và cuối bus để tránh phải tháo lắp lại điện trở termination sau khi đã đi dây xong.
Một Cảm Biến Vừa Có DALI, Relay Và Casambi: Versaan Unity S1
Không phải khu vực nào trong nhà máy cũng cần dữ liệu Modbus. Nhiều khu vực chỉ cần vừa điều khiển tại chỗ (dim DALI hoặc cắt nguồn qua relay) vừa muốn có lớp giám sát không dây song song, không phải kéo thêm dây tín hiệu riêng cho việc giám sát. Versaan VS-S1-LBW (Unity S1) giải quyết đúng tình huống này: một cảm biến tích hợp DALI (100mA/16.5VDC, hỗ trợ tối đa 50 driver theo thông số DALI chuẩn), relay 10A cho tải điện trở/điện cảm/điện dung, đầu vào cho nút bấm tạm thời, và kết nối không dây Casambi qua băng tần 2.4GHz ISM.
Cảm biến hỗ trợ hơn 20 cấu hình DALI profile khác nhau, từ DALI Broadcast dimmer, DALI 1-3 kênh, đến DALI DT8 RGBWAF cho hệ tunable white. Chuẩn bảo vệ IP65, lắp được cả âm trần (khoét lỗ 62-66mm) và gắn nổi bằng phụ kiện Surface Kit, phù hợp cải tạo không muốn đục trần bê tông trong nhà máy. Ở chế độ mặc định, đèn giữ sáng 20 phút sau lần phát hiện cuối, mờ dần trong 1 giây, sáng 75% khi có người và 0% khi vắng, có thể chỉnh lại toàn bộ qua ứng dụng Casambi.
Điểm cần lưu ý: thông số PIR tầm phát hiện cụ thể theo mét không được công bố trong tài liệu, cảm biến phù hợp không gian văn phòng hoặc khu vực làm việc thông thường trong nhà máy hơn là kho xưởng trần cao, nơi cần cảm biến PIR tầm xa chuyên dụng.
Đưa Dữ Liệu Cảm Biến Casambi Về BACnet/IP Qua Lithernet
Khi nhà máy đã có mạng Casambi (driver tích hợp sẵn hoặc cảm biến như Versaan VS-S1-LBW ở trên) và muốn đưa toàn bộ dữ liệu, trạng thái vào BMS đang chạy BACnet/IP, Lithernet Casambi Gateway là thiết bị đứng giữa. Gateway nhận lệnh từ BMS qua BACnet write và chuyển vào mạng Casambi để điều khiển luminaire, đồng thời cho phép BMS đọc trạng thái thiết bị Casambi qua BACnet read, bao gồm cả dữ liệu cảm biến hiện diện, ánh sáng nếu sensor đó nằm trong mạng Casambi. Giao tiếp hai chiều, tối đa 32 trigger mỗi chiều.
Lithernet chỉ cấp nguồn qua PoE chuẩn 802.3af/at, một cổng RJ-45 duy nhất vừa truyền dữ liệu vừa cấp nguồn, không có tùy chọn adapter điện riêng. Một điểm cần lưu ý khi lắp trong tủ điện nhà máy: gateway cần nằm trong vùng phủ BLE của ít nhất 1 node Casambi, và tủ kim loại kín sẽ chặn tín hiệu đáng kể, nên cân nhắc tủ có cửa nhựa hoặc đặt gateway ngoài tủ.
Nếu Muốn Giữ Kiến Trúc Mesh Không Dây: Dòng OS-NET Của IR-TEC
Cả 3 lớp trên đều giả định nhà máy chấp nhận đi dây RS-485 hoặc DALI cho từng khu vực. Nếu công trình ưu tiên không dây hoàn toàn cho cả lớp cảm biến,
dòng OS-NET của IR-TEC
là hướng khác: mạng cảm biến ZigBee riêng, không dùng Casambi BLE, với khả năng nhóm cảm biến qua remote lập trình mà không cần kéo dây tín hiệu giữa các cảm biến trong cùng nhóm. Bài dòng OS-NET đã nói chi tiết về cách nhóm, số lượng nhóm, thiết bị và ứng dụng riêng, không lặp lại ở đây.
Chọn Kiến Trúc Nào Cho Đúng Quy Mô Nhà Máy
Không có một lựa chọn đúng cho mọi nhà máy. Khu vực chỉ cần dữ liệu cho BMS/HVAC, không cần điều khiển đèn trực tiếp từ cảm biến, nên dùng Modbus RTU như MRB-510SF, thuộc
dòng TRANS của IR-TEC
. Khu vực cần vừa điều khiển tại chỗ vừa muốn thêm lớp giám sát không dây nên dùng cảm biến kết hợp như Versaan Unity S1. Toàn nhà máy đã có mạng Casambi và cần đưa vào BMS BACnet có sẵn thì thêm Lithernet ở lớp gateway, không cần thay lại cảm biến đã lắp.
Không nên chọn Modbus RTU nếu nhà máy chưa có BMS controller đọc được Modbus, vì MRB-510SF không tự điều khiển gì cả, chỉ là data source. Lắp cảm biến này mà không có phần đọc dữ liệu ở phía BMS thì tương đương không lắp gì, tốn chi phí đi dây RS-485 mà không thu được giá trị gì. Tổng quan về các loại cảm biến khác trong hệ chiếu sáng thông minh đã nói ở bài
6 loại cảm biến quan trọng trong hệ thống chiếu sáng thông minh
.
Kết Luận
Ba lớp giải pháp cho nhà máy cần giám sát cảm biến tập trung: Modbus RTU (MRB-510SF) đưa số liệu occupancy, lux thẳng vào BMS/HVAC không qua trung gian, cảm biến DALI/Relay/Casambi (Versaan Unity S1) cho khu vực cần cả điều khiển tại chỗ và giám sát không dây, và Lithernet BACnet/IP đưa toàn bộ mạng Casambi vào BMS tòa nhà đang chạy sẵn. Chọn đúng lớp theo nhu cầu giám sát thực tế của từng khu vực, không cần áp một kiến trúc duy nhất cho toàn nhà máy.
Cần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
MRB-510SF có tự bật tắt đèn được không?
Không. MRB-510SF là Modbus RTU slave device, không có relay hay ngõ ra DALI/0-10V. Toàn bộ dữ liệu occupancy và lux nằm trên bus RS-485, việc điều khiển đèn do BMS controller đọc dữ liệu và tự quyết định.

Có thể chạy nhiều MRB-510SF trên cùng một bus RS-485 không?
Có. Mỗi cảm biến giữ 1 địa chỉ Modbus riêng trong khoảng 1-250, đặt điện trở termination 180Ω tại 2 đầu cuối bus, không đấu tại các node giữa.

Versaan Unity S1 có cần app Casambi để hoạt động cơ bản không?
Không bắt buộc. Ở chế độ mặc định, cảm biến đã có logic occupancy sẵn: giữ sáng, mờ dần, tắt theo thời gian định trước. App Casambi chỉ cần khi muốn tùy chỉnh lại thời gian, mức sáng hoặc tạo scene riêng.

Lithernet có thay được cảm biến Modbus hoặc DALI đang dùng không?
Không. Lithernet là gateway chuyển đổi giao thức, không phải cảm biến. Nó đứng giữa mạng Casambi hiện có và BMS, không thay thế MRB-510SF (Modbus) hay Versaan Unity S1 (DALI/relay) đã lắp.

Nên chọn Modbus RTU hay Casambi cho khu vực mới xây?
Tùy nhu cầu giám sát. Nếu chỉ cần BMS đọc số liệu occupancy, lux thuần túy, Modbus RTU đơn giản hơn và không cần thêm gateway. Nếu khu vực cần cả điều khiển linh hoạt qua app, scene, tích hợp không dây, hướng DALI/Casambi qua Versaan Unity S1 phù hợp hơn.

RS-485 và mạng Casambi có thể tồn tại song song trong cùng một nhà máy không?
Có. Hai lớp không xung đột. Khu vực dùng Modbus RTU giữ nguyên bus RS-485 riêng, khu vực dùng Casambi hoạt động độc lập qua BLE mesh, chỉ gặp nhau khi cần đưa cả hai vào chung một BMS, lúc đó BMS đọc trực tiếp Modbus và đọc qua Lithernet cho phần Casambi.

## Raw MCP

```json
{
  "slug": "viec-ket-noi-giua-cac-cam-bien-khong-con-kho",
  "title": "Cảm Biến Cho Nhà Máy: Modbus RTU, DALI Casambi, BACnet/IP",
  "excerpt": "MRB-510SF Modbus RTU, Versaan Unity S1 DALI Casambi, Lithernet BACnet/IP: hai cách đưa dữ liệu cảm biến nhà máy vào BMS. Tư vấn kỹ thuật tại KNXStore.",
  "coverImage": "/media/9926dae6a5b1a45fc26d2ee876db26ea7e0c528771552d01e24a05178cf60a5d.jpg",
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
  "publishedAt": "2026-08-19T02:22:34.000Z",
  "categories": [
    {
      "slug": "chieu-sang",
      "name": "Chiếu sáng"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Cảm Biến Cho Nhà Máy: Modbus RTU, DALI Casambi, BACnet/IP",
  "seoDescription": "MRB-510SF Modbus RTU, Versaan Unity S1 DALI Casambi, Lithernet BACnet/IP: hai cách đưa dữ liệu cảm biến nhà máy vào BMS. Tư vấn kỹ thuật tại KNXStore.",
  "faqs": [
    {
      "question": "MRB-510SF có tự bật tắt đèn được không?",
      "answer": "Không. MRB-510SF là Modbus RTU slave device, không có relay hay ngõ ra DALI/0-10V. Toàn bộ dữ liệu occupancy và lux nằm trên bus RS-485, việc điều khiển đèn do BMS controller đọc dữ liệu và tự quyết định.",
      "position": 0
    },
    {
      "question": "Có thể chạy nhiều MRB-510SF trên cùng một bus RS-485 không?",
      "answer": "Có. Mỗi cảm biến giữ 1 địa chỉ Modbus riêng trong khoảng 1-250, đặt điện trở termination 180Ω tại 2 đầu cuối bus, không đấu tại các node giữa.",
      "position": 1
    },
    {
      "question": "Versaan Unity S1 có cần app Casambi để hoạt động cơ bản không?",
      "answer": "Không bắt buộc. Ở chế độ mặc định, cảm biến đã có logic occupancy sẵn: giữ sáng, mờ dần, tắt theo thời gian định trước. App Casambi chỉ cần khi muốn tùy chỉnh lại thời gian, mức sáng hoặc tạo scene riêng.",
      "position": 2
    },
    {
      "question": "Lithernet có thay được cảm biến Modbus hoặc DALI đang dùng không?",
      "answer": "Không. Lithernet là gateway chuyển đổi giao thức, không phải cảm biến. Nó đứng giữa mạng Casambi hiện có và BMS, không thay thế MRB-510SF (Modbus) hay Versaan Unity S1 (DALI/relay) đã lắp.",
      "position": 3
    },
    {
      "question": "Nên chọn Modbus RTU hay Casambi cho khu vực mới xây?",
      "answer": "Tùy nhu cầu giám sát. Nếu chỉ cần BMS đọc số liệu occupancy, lux thuần túy, Modbus RTU đơn giản hơn và không cần thêm gateway. Nếu khu vực cần cả điều khiển linh hoạt qua app, scene, tích hợp không dây, hướng DALI/Casambi qua Versaan Unity S1 phù hợp hơn.",
      "position": 4
    },
    {
      "question": "RS-485 và mạng Casambi có thể tồn tại song song trong cùng một nhà máy không?",
      "answer": "Có. Hai lớp không xung đột. Khu vực dùng Modbus RTU giữ nguyên bus RS-485 riêng, khu vực dùng Casambi hoạt động độc lập qua BLE mesh, chỉ gặp nhau khi cần đưa cả hai vào chung một BMS, lúc đó BMS đọc trực tiếp Modbus và đọc qua Lithernet cho phần Casambi.",
      "position": 5
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/viec-ket-noi-giua-cac-cam-bien-khong-con-kho.html"
}
```
