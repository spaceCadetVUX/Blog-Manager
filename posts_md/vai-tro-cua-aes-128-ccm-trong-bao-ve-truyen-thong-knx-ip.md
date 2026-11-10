---
url: "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html"
headline: "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP"
description: "Cơ chế AES-128 CCM và Secure Wrapper bảo vệ KNXnet/IP khỏi nghe lén, giả mạo, phát lại. Cấu trúc frame, hiệu năng xử lý và khuyến nghị triển khai."
title: "AES-128 CCM Trong KNX Secure: Cơ Chế Bảo Vệ KNXnet/IP"
image: "https://knxstore.vn/media/d1006141e7a9fdc6179681654baff0f123ad8f436f246b28450af578f8fa7346.jpg"
datePublished: "2026-08-04T07:51:12.000Z"
dateModified: "2026-08-04T07:51:12.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Kiến thức"
word_count: 2325
keywords: ["Kiến thức"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Kiến thức"
    url: "https://knxstore.vn/blogs/kien-thuc"
  - name: "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP"
    url: "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html"
products: [{"url": "https://knxstore.vn/products/weinzierl-cong-giao-tiep-ip-he-thong-knx", "name": "Cổng giao tiếp KNX IP Interface 732 secure Weinzierl"}]
internal_links:
  - url: "https://knxstore.vn/vi-sao-nen-chon-knx-cho-he-dieu-khien-thong-minh.html"
    slug: "vi-sao-nen-chon-knx-cho-he-dieu-khien-thong-minh"
    anchor: "vì sao nhiều kỹ sư chọn KNX cho hệ điều khiển thông minh"
  - url: "https://knxstore.vn/he-thong-ung-dung-knx.html"
    slug: "he-thong-ung-dung-knx"
    anchor: "Hệ thống KNX"
  - url: "https://knxstore.vn/en-50090-3-4-la-gi-vi-sao-tieu-chuan-nay-quan-trong-voi-knx-rf-868-mhz.html"
    slug: "en-50090-3-4-la-gi-vi-sao-tieu-chuan-nay-quan-trong-voi-knx-rf-868-mhz"
    anchor: "EN 50090-3-4 là gì? Vì sao tiêu chuẩn này quan trọng với KNX RF (868 MHz)?"
  - url: "https://knxstore.vn/nhung-rui-ro-khi-he-thong-knx-khong-duoc-bao-mat-dung-cach.html"
    slug: "nhung-rui-ro-khi-he-thong-knx-khong-duoc-bao-mat-dung-cach"
    anchor: "KNX Secure là gì? Bảo mật và rủi ro hệ KNX."
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

# AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP

> Cơ chế AES-128 CCM và Secure Wrapper bảo vệ KNXnet/IP khỏi nghe lén, giả mạo, phát lại. Cấu trúc frame, hiệu năng xử lý và khuyến nghị triển khai.

## Article Body

Khi hệ thống KNX mở rộng giao tiếp qua mạng IP, telegram không còn di chuyển trên một bus TP kín mà đi qua LAN hoặc cả Internet, nơi ai cũng có thể bắt gói tin nếu không mã hóa. KNXnet/IP Secure giải quyết vấn đề này bằng AES-128 CCM, cơ chế mã hóa kết hợp xác thực trong một bước duy nhất, và cũng chính là lý do
vì sao nhiều kỹ sư chọn KNX cho hệ điều khiển thông minh
thay vì các giao thức không có mã hóa nội tại. Bài viết này đi vào cách cơ chế này hoạt động ở mức frame, không chỉ nói bảo mật ở mức khái niệm chung.
Vì sao KNXnet/IP cần một lớp bảo mật riêng
Hệ thống KNX
mở rộng hạ tầng truyền thống (TP1, PL, RF) sang mạng IP qua KNXnet/IP, tận dụng băng thông cao và khả năng tích hợp với hệ thống IT hiện đại. Nhưng bản chất mở của mạng IP cũng khiến telegram KNX dễ bị can thiệp khi lưu thông qua LAN hoặc Internet, không còn được bảo vệ như trên đường truyền TP1 kín trước đây.
Ba mối đe dọa chính với KNXnet/IP không dùng Secure: nghe lén (kẻ tấn công thu thập và giải mã nội dung telegram để lấy cấu hình hệ thống), chỉnh sửa/giả mạo (telegram bị thay đổi hoặc gắn thêm gói tin giả khiến thiết bị thực thi lệnh không mong muốn), và tấn công phát lại (ghi lại telegram hợp lệ rồi phát lại sau để hệ thống lặp lại hành động cũ mà không có sự đồng ý của người dùng). Đây không phải rủi ro lý thuyết, telegram điều khiển cửa, an ninh nếu bị phát lại có thể mở khóa hoặc tắt cảm biến chống trộm đúng lúc không ai để ý.
Một kịch bản tấn công phát lại cụ thể
Giả sử một biệt thự dùng KNXnet/IP không mã hóa để điều khiển cổng ra vào qua ứng dụng di động từ xa. Nếu kẻ tấn công ở cùng mạng Wi-Fi khách hoặc chặn được lưu lượng LAN, họ chỉ cần ghi lại đúng một telegram "mở cổng" hợp lệ đã đi qua mạng, sau đó phát lại telegram này vào bất kỳ thời điểm nào để mở cổng, mà không cần biết mật khẩu hay bẻ khóa gì cả. Đây chính là lý do Sequence Counter và Nonce trong AES-128 CCM tồn tại, mỗi telegram chỉ hợp lệ đúng một lần, telegram cũ bị phát lại sẽ có sequence counter thấp hơn giá trị thiết bị nhận đã ghi nhận và bị loại bỏ ngay.
AES-128 CCM: mã hóa và xác thực trong một bước
AES-128 CCM là cơ chế Authenticated Encryption kết hợp hai bước xử lý trên cùng một khóa: CBC-MAC để tạo tem xác thực, và CTR để mã hóa nội dung.
CBC-MAC tạo Authentication Tag
Associated Data là các trường header của Secure Wrapper (phiên bản, độ dài, sequence counter, control field) chỉ dùng để xác thực, không mã hóa. Quá trình bắt đầu từ chaining value khởi tạo bằng 0, sau đó với mỗi khối dữ liệu 16 octet (lần lượt các khối header rồi các khối plaintext), giá trị chaining trước đó được XOR với khối hiện tại, rồi mã hóa kết quả bằng AES-128 dùng khóa chung (Backbone Key hoặc Session Key). Sau khi xử lý hết toàn bộ khối, giá trị chaining cuối cùng được rút gọn (truncate) 8 octet đầu để tạo Authentication Tag.
CTR mã hóa nội dung
Nonce (IV) được xây dựng từ sequence counter và các tham số trong Secure Wrapper, đảm bảo mỗi telegram có IV duy nhất, không lặp lại. Từ nonce này, hệ thống sinh keystream bằng cách mã hóa nonce ghép với số thứ tự khối qua AES-128, dùng cùng khóa như bước CBC-MAC. Keystream sau đó XOR với plaintext để ra ciphertext.
Khi thiết bị nhận, nó tái tính CBC-MAC trên header và ciphertext nhận được. Nếu tag không khớp, frame bị loại bỏ ngay, đây là lớp bảo vệ chống cả giả mạo và phát lại trong cùng một cơ chế kiểm tra.
Vì sao dùng chung một khóa cho cả CBC-MAC và CTR vẫn an toàn
Một câu hỏi kỹ thuật hay gặp là tại sao CCM dùng cùng một khóa AES-128 cho cả hai bước mã hóa và xác thực mà không làm suy yếu bảo mật. Câu trả lời nằm ở cách nonce được xây dựng: CBC-MAC và CTR sử dụng cùng khóa nhưng với đầu vào khác nhau (CBC-MAC xử lý theo chuỗi khối tuần tự bắt đầu từ chaining value cố định, còn CTR xử lý theo từng khối độc lập gắn với số thứ tự khối trong nonce), nên hai luồng xử lý không bao giờ tạo ra cùng một phép tính AES trên cùng đầu vào. Đây là nguyên lý domain separation, cho phép CCM an toàn dù chỉ dùng một khóa, thay vì phải quản lý hai khóa riêng như một số cơ chế mã hóa cũ hơn.
AES-128 CCM cũng không phải cơ chế riêng của KNX. Chế độ CCM tương tự được dùng trong WPA2 cho Wi-Fi và trong Bluetooth Low Energy, vốn đã qua nhiều năm kiểm chứng thực tế ở quy mô hàng tỷ thiết bị. KNX Association lựa chọn CCM một phần vì tính phổ biến này giúp nhiều nhà sản xuất chip đã có sẵn thư viện và phần cứng hỗ trợ, giảm chi phí triển khai cho hãng thiết bị KNX.
Cơ chế AES-128 CCM này không chỉ dùng cho KNXnet/IP. Trên KNX RF 868 MHz, RF-S Mode cũng dùng đúng thuật toán này để bảo vệ telegram truyền qua sóng vô tuyến, môi trường còn dễ bị nghe lén hơn cả LAN vì không cần truy cập vật lý vào dây. Xem chi tiết cấu trúc Nonce và cách RF-S Mode áp dụng CCM tại
EN 50090-3-4 là gì? Vì sao tiêu chuẩn này quan trọng với KNX RF (868 MHz)?
.
Cấu trúc Secure Wrapper trong KNXnet/IP
Secure Wrapper quấn quanh mỗi KNXnet/IP Tunnelling Frame với 5 thành phần:
Thành phần
Độ dài (octet)
Vai trò
Secure Header
7
ServiceTypeIdentifier nhận biết khung Secure Wrapper, TotalLength, ChannelID của kết nối tunnelling, Sequence Counter chống replay
Secure Control
1
Byte flags xác định độ dài MIC và tham số vận hành CCM
Nonce (IV)
13
Ghép từ Flags, Sequence Counter và trường ngẫu nhiên/timestamp do ETS sinh ra, đảm bảo mỗi khung có IV duy nhất
Encrypted Payload
n (thay đổi)
APDU KNX (Network, Transport, Application Layer) mã hóa bằng AES-CTR
Authentication Tag (MIC)
thường 8
Kết quả CBC-MAC trên header ghép ciphertext, được rút gọn và mã hóa trước khi gắn vào cuối frame
Độ dài MIC có thể tùy chỉnh 4, 6 hoặc 8 octet tùy cấu hình, đánh đổi giữa mức bảo mật và overhead băng thông. Mức 8 octet là lựa chọn phổ biến cho công trình cần độ an toàn cao.
Hiệu năng xử lý thực tế
Mỗi frame CCM cần khoảng 2n+2 lần gọi AES cho n khối dữ liệu (n+1 lần cho CBC-MAC, n+1 lần cho CTR), cộng thêm overhead băng thông khoảng 29-33 octet cho phần Header, Control, Nonce, MIC. Trên MCU có hardware AES accelerator, một frame 1-2 khối xử lý xong trong dưới 1ms, đáp ứng dư tần suất khoảng 10 telegram/giây thường gặp trên KNXnet/IP mà không cần phần cứng phức tạp. Thông số MCU cụ thể (tốc độ xung nhịp, dòng chip) tùy nhà sản xuất thiết bị, cần Tùng xác nhận nếu muốn trích dẫn số liệu cụ thể theo từng dòng sản phẩm KNXStore đang phân phối.
Thiết bị nào thực sự chạy AES-128 CCM trong hệ thống của bạn
Nói lý thuyết mã hóa xong, câu hỏi thực tế của người triển khai luôn là: thiết bị nào trong tủ điện đang thực thi cơ chế này. Với KNXnet/IP Secure, đó luôn là thiết bị đóng vai trò cổng giao tiếp giữa bus KNX và mạng IP, tức IP Interface (Tunnelling) hoặc IP Router, không phải các thiết bị đầu cuối như công tắc hay cảm biến trên bus TP.
Cách nhận biết nhanh một thiết bị có hỗ trợ hay không: xem datasheet có ghi rõ "KNX Security" hoặc "KNX IP Secure" kèm AES-128, và trong ETS6 thiết bị đó cho phép tạo Keyring, nhập FDSK khi thêm vào project. Thiết bị không hỗ trợ sẽ không có các tùy chọn này, dù vẫn hoạt động bình thường ở chế độ không mã hóa.
Trong danh mục KNXStore,
Cổng giao tiếp KNX IP Interface 732 secure Weinzierl
là ví dụ cụ thể cho nhóm thiết bị này: hỗ trợ KNX Security với mã hóa AES-128 đúng cơ chế đã phân tích ở trên, cho phép 8 kết nối KNXnet/IP Tunneling đồng thời, cấp nguồn trực tiếp từ KNX Bus và lắp gọn trong 1 module DIN rail (18mm). Đây là loại thiết bị nên chọn khi cần mở một cổng truy cập IP vào bus KNX từ xa (qua ETS hoặc app điều khiển) mà vẫn giữ được lớp bảo vệ chống nghe lén, giả mạo, phát lại đã nêu ở các phần trên, thay vì dùng IP Interface đời cũ không có Secure rồi phải khoanh vùng rủi ro bằng VPN hoặc tường lửa riêng.
Khi nào có thể tạm chưa cần bật KNX Secure
Với hệ thống chỉ chạy trên bus TP nội bộ, không có kết nối ra ngoài qua IP interface hay router, rủi ro bị nghe lén hoặc giả mạo qua mạng thấp hơn nhiều so với hệ có KNXnet/IP mở ra LAN hoặc Internet. Danh sách đầy đủ các rủi ro cụ thể khi bỏ qua lớp bảo mật này được phân tích tại
KNX Secure là gì? Bảo mật và rủi ro hệ KNX.
. Với công trình dân dụng nhỏ không có kết nối IP ra ngoài, việc bật Secure chủ yếu là phòng xa hơn là bắt buộc ngay. Ngược lại, với bất kỳ hệ thống có KNX IP router/interface kết nối vào mạng LAN chung của tòa nhà (nhất là khi mạng đó có Wi-Fi khách hoặc thiết bị IoT khác), nên bật Secure ngay từ khi commissioning, không đợi phát sinh sự cố mới bổ sung.
Chi phí thực tế khi bật Secure so với khi không bật
Bật KNX Secure không làm tăng chi phí phần cứng nếu thiết bị đã hỗ trợ sẵn tính năng này (hầu hết dòng KNX IP mới từ 2021 trở đi đều có), nhưng làm tăng thời gian lập trình vì kỹ sư phải tạo và quản lý Keyring trong ETS6, nhập FDSK cho từng thiết bị, và kiểm tra lại toàn bộ group address sau khi bật Secure để đảm bảo không thiết bị nào bị rơi khỏi vùng tin cậy. Với dự án đã có kinh nghiệm, bước này thường thêm khoảng vài giờ commissioning cho một hệ trung bình, không đáng kể so với rủi ro nếu bỏ qua trên hệ thống có kết nối ra internet.
Kết luận
AES-128 CCM không phải một khái niệm bảo mật mơ hồ mà là cơ chế cụ thể, kết hợp CBC-MAC và CTR trên cùng một khóa để vừa mã hóa vừa xác thực từng telegram KNXnet/IP, chống được cả nghe lén, giả mạo và phát lại trong một lớp kiểm tra duy nhất. Việc hiểu đúng cơ chế này giúp kỹ sư khi tư vấn dự án trả lời được câu hỏi "bảo mật cụ thể thế nào" thay vì chỉ nói KNX có Secure là an toàn. Với dự án có kết nối KNXnet/IP ra mạng LAN chung của tòa nhà, nên đưa việc bật Secure vào checklist commissioning bắt buộc ngay từ đầu, chọn thiết bị IP Interface/Router có ghi rõ hỗ trợ KNX Security, và không để đến khi có sự cố mới xử lý.
Cần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
AES-128 CCM khác gì so với AES-128 thông thường?
AES-128 CCM không chỉ mã hóa như AES thông thường mà kết hợp đồng thời xác thực (CBC-MAC) và mã hóa (CTR) trong một cơ chế, dùng chung một khóa và một thuật toán AES-128 lõi cho cả hai bước.

Có cần phần cứng đặc biệt để chạy AES-128 CCM trên thiết bị KNX không?
Nên chọn thiết bị có hardware AES accelerator tích hợp để xử lý nhanh và tiết kiệm năng lượng hơn so với xử lý bằng phần mềm thuần trên vi điều khiển tốc độ thấp.

Bật KNX Secure có làm chậm tốc độ phản hồi của hệ thống không?
Với phần cứng có accelerator, thời gian xử lý một frame dưới 1ms, không tạo độ trễ cảm nhận được trong vận hành thực tế so với tần suất telegram thông thường của KNX.

AES-128 CCM có phải cơ chế riêng của KNX Association phát triển không?
Không. CCM là chế độ mã hóa chuẩn đã dùng rộng rãi trong WPA2 và Bluetooth Low Energy trước khi KNX Association áp dụng cho KNXnet/IP Secure, giúp tận dụng phần cứng và thư viện AES đã phổ biến trên thị trường thay vì phát triển thuật toán riêng.

Nếu Sequence Counter bị tràn số (overflow) thì hệ thống xử lý thế nào?
Đây là tình huống hiếm gặp trong vận hành thực tế vì Sequence Counter có không gian giá trị rất lớn, nhưng khi gần đến ngưỡng tràn, thiết bị cần được commissioning lại để reset counter và cấp khóa mới, tránh nguy cơ nonce bị lặp lại.

## Raw MCP

```json
{
  "slug": "vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip",
  "title": "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP",
  "excerpt": "Cơ chế AES-128 CCM và Secure Wrapper bảo vệ KNXnet/IP khỏi nghe lén, giả mạo, phát lại. Cấu trúc frame, hiệu năng xử lý và khuyến nghị triển khai.",
  "coverImage": "/media/d1006141e7a9fdc6179681654baff0f123ad8f436f246b28450af578f8fa7346.jpg",
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
  "publishedAt": "2026-08-04T07:51:12.000Z",
  "categories": [
    {
      "slug": "kien-thuc",
      "name": "Kiến thức"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "AES-128 CCM Trong KNX Secure: Cơ Chế Bảo Vệ KNXnet/IP",
  "seoDescription": "Cơ chế AES-128 CCM và Secure Wrapper bảo vệ KNXnet/IP khỏi nghe lén, giả mạo, phát lại. Cấu trúc frame, hiệu năng xử lý và khuyến nghị triển khai.",
  "faqs": [
    {
      "question": "AES-128 CCM khác gì so với AES-128 thông thường?",
      "answer": "AES-128 CCM không chỉ mã hóa như AES thông thường mà kết hợp đồng thời xác thực (CBC-MAC) và mã hóa (CTR) trong một cơ chế, dùng chung một khóa và một thuật toán AES-128 lõi cho cả hai bước.",
      "position": 0
    },
    {
      "question": "Có cần phần cứng đặc biệt để chạy AES-128 CCM trên thiết bị KNX không?",
      "answer": "Nên chọn thiết bị có hardware AES accelerator tích hợp để xử lý nhanh và tiết kiệm năng lượng hơn so với xử lý bằng phần mềm thuần trên vi điều khiển tốc độ thấp.",
      "position": 1
    },
    {
      "question": "Bật KNX Secure có làm chậm tốc độ phản hồi của hệ thống không?",
      "answer": "Với phần cứng có accelerator, thời gian xử lý một frame dưới 1ms, không tạo độ trễ cảm nhận được trong vận hành thực tế so với tần suất telegram thông thường của KNX.",
      "position": 2
    },
    {
      "question": "AES-128 CCM có phải cơ chế riêng của KNX Association phát triển không?",
      "answer": "Không. CCM là chế độ mã hóa chuẩn đã dùng rộng rãi trong WPA2 và Bluetooth Low Energy trước khi KNX Association áp dụng cho KNXnet/IP Secure, giúp tận dụng phần cứng và thư viện AES đã phổ biến trên thị trường thay vì phát triển thuật toán riêng.",
      "position": 3
    },
    {
      "question": "Nếu Sequence Counter bị tràn số (overflow) thì hệ thống xử lý thế nào?",
      "answer": "Đây là tình huống hiếm gặp trong vận hành thực tế vì Sequence Counter có không gian giá trị rất lớn, nhưng khi gần đến ngưỡng tràn, thiết bị cần được commissioning lại để reset counter và cấp khóa mới, tránh nguy cơ nonce bị lặp lại.",
      "position": 4
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html"
}
```
