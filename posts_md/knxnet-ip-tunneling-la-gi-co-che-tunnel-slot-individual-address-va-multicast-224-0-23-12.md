---
url: "https://knxstore.vn/knxnet-ip-tunneling-la-gi-co-che-tunnel-slot-individual-address-va-multicast-224-0-23-12.html"
headline: "KNXnet/IP Tunneling Là Gì: Cơ Chế Tunnel Slot, Individual Address Và Multicast 224.0.23.12"
description: "Giải thích cơ chế KNXnet/IP Tunneling, vì sao mỗi tunnel cần Individual Address riêng, vai trò multicast 224.0.23.12, và ví dụ thực tế từ thiết bị KNXStore."
title: "KNXnet/IP Tunneling Là Gì: Tunnel Slot, IA Và Multicast 224.0.23.12"
image: "https://knxstore.vn/media/6311763f8e67a6efe1d479d0e9c3d94fe89a57f3c99c872b70cda84c8ee6a8bb.png"
datePublished: "2026-10-02T03:11:00.000Z"
dateModified: "2026-11-04T08:04:37.615Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
word_count: 1960
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "KNXnet/IP Tunneling Là Gì: Cơ Chế Tunnel Slot, Individual Address Và Multicast 224.0.23.12"
    url: "https://knxstore.vn/knxnet-ip-tunneling-la-gi-co-che-tunnel-slot-individual-address-va-multicast-224-0-23-12.html"
products: [{"url": "https://knxstore.vn/products/bo-dinh-tuyen-knx-ip-router-kanonbus-kteipc", "name": "Bộ định tuyến KNX IP Router Kanonbus KTEIPC"}, {"url": "https://knxstore.vn/products/weinzierl-cong-giao-tiep-ip-he-thong-knx", "name": "Cổng giao tiếp KNX IP Interface 732 secure Weinzierl - 5248"}, {"url": "https://knxstore.vn/products/legrand-bo-dinh-tuyen-ip-002638", "name": "Bộ định tuyến IP KNX Legrand - 002638"}, {"url": "https://knxstore.vn/products/gateway-knx-qua-matter-matter-sang-knx-1home-server-knx-pro", "name": "Gateway KNX qua Matter, Matter sang KNX 1Home Server KNX Pro"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-knx-host-kts-d3", "name": "Bộ điều khiển KNX host đa năng Kanonbus - KTS-D1, D2, D3"}, {"url": "https://knxstore.vn/products/atios-knx-bridge-ho-tro-apple-homekit-ade-kd", "name": "Bộ chuyển đổi KNX Matter Apple Homekit và Google Home, KNX DALI 2.0 Atios - ADE-KD"}]
internal_links:
  - url: "https://knxstore.vn/atios-ade-kd-vs-elsner-knx-matter-server-nen-chon-bridge-knx-sang-matter-nao.html"
    slug: "atios-ade-kd-vs-elsner-knx-matter-server-nen-chon-bridge-knx-sang-matter-nao"
    anchor: "Atios ADE-KD so với Elsner KNX Matter Server nên chọn bridge KNX sang Matter nào"
  - url: "https://knxstore.vn/knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi.html"
    slug: "knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi"
    anchor: "KNX IP Interface và IP Router khác nhau thế nào"
  - url: "https://knxstore.vn/nhung-rui-ro-khi-he-thong-knx-khong-duoc-bao-mat-dung-cach.html"
    slug: "nhung-rui-ro-khi-he-thong-knx-khong-duoc-bao-mat-dung-cach"
    anchor: "KNX Secure là gì và những rủi ro khi hệ KNX không được bảo mật đúng cách"
related_links: []
---

# KNXnet/IP Tunneling Là Gì: Cơ Chế Tunnel Slot, Individual Address Và Multicast 224.0.23.12

> Giải thích cơ chế KNXnet/IP Tunneling, vì sao mỗi tunnel cần Individual Address riêng, vai trò multicast 224.0.23.12, và ví dụ thực tế từ thiết bị KNXStore.

## Article Body

Tunneling Là Gì: Kết Nối Điểm-Điểm Cho Từng Client Vào Bus
KNXnet/IP Tunneling là cơ chế kết nối unicast, điểm-điểm, cho một client cụ thể (ETS, Savant, Homey, hoặc phần mềm visualization) xuyên qua một thiết bị IP để truy cập vào bus KNX. Theo tài liệu KNX Basic Course của KNX Association, đây chính là "well-known gateway function" mà ETS dùng để lập trình từ xa qua IP, và một building central có thể kết nối đồng thời tới nhiều gateway cùng lúc, nhân tổng băng thông xử lý lên.
Khác Với Routing Ở Điểm Nào
Tunneling và Routing giải quyết hai bài toán khác nhau hoàn toàn. Tunneling phục vụ client muốn vào bus để đọc, ghi hoặc lập trình. Routing phục vụ việc chuyển tiếp telegram giữa các line hoặc area với nhau, đóng vai trò line coupler hoặc backbone coupler nhưng chạy qua IP thay vì dây TP. Một IP Interface thuần chỉ làm được Tunneling, còn IP Router làm được cả hai, cộng thêm filter table để lọc và chặn telegram đúng chỗ.
ETS, Savant, Homey Đều Là Client Tunnel
Dù khác nhau về chức năng cuối cùng, ETS, Savant và Homey đều kết nối vào bus KNX theo cùng một cơ chế: tunnel vào IP Interface hoặc IP Router, chiếm một khe kết nối (tunnel slot), gửi và nhận telegram theo group address giống như một thiết bị thật trên bus. Không có gateway trung gian riêng nào khác cho từng nền tảng, tất cả dùng chung chuẩn KNXnet/IP Tunneling.
Vì Sao Mỗi Tunnel Cần Một Individual Address Riêng
Khi client gửi telegram xuống bus qua tunnel, telegram đó phải mang một Source Address hợp lệ. Nếu hai client dùng chung một Individual Address, bus sẽ ghi nhận xung đột địa chỉ, và phản hồi (response telegram) không biết gửi về đúng client nào. Vì vậy, thiết bị IP cấp sẵn nhiều "khe" tunnel, mỗi khe một Individual Address riêng.
Cơ Chế Source Address Khi Client Gửi Telegram
Theo tài liệu Additional Interfaces của KNX Association, mỗi tunnel bổ sung (additional interface) có Individual Address nằm cùng Area.Line với thiết bị IP, chỉ khác phần device number cuối. Area và Line không sửa được cho các địa chỉ bổ sung này, chỉ phần device number được chọn trong dải còn trống của line, và ETS quản lý các địa chỉ đó như địa chỉ tạm thời có thể cấp phát lại.
Ví Dụ Thực Tế: Số Tunnel Khác Nhau Theo Từng Thiết Bị
Số lượng tunnel slot tối đa hoàn toàn do nhà sản xuất quy định, không có chuẩn chung bắt buộc. Theo manual chính hãng, Weinzierl KNX IP Interface 732 secure hỗ trợ tối đa 8 kết nối KNXnet/IP Tunneling đồng thời, còn Elsner KNX Matter Server (cùng dòng với 1Home Server) chỉ hỗ trợ tối đa 4 kết nối tunnel đồng thời. Cách đánh số device number cho từng tunnel cũng tùy hãng: có thiết bị đặt liền kề ngay sau địa chỉ chính (ví dụ thiết bị 1.1.10 với tunnel 1.1.11 đến 1.1.18), có thiết bị lại đặt ở cuối dải line (ví dụ 1.1.252 đến 1.1.255), miễn không trùng với thiết bị thật nào khác trong cùng line.
Multicast 224.0.23.12: Nền Tảng Của KNXnet/IP Routing
Khác với Tunneling dùng unicast, Routing dùng multicast. Một IP Router muốn gửi telegram liên-line sẽ gửi qua địa chỉ multicast vào Ethernet, mọi IP Router khác đang nghe cùng địa chỉ đó đều nhận và tự quyết định dựa trên filter table hoặc địa chỉ line có nên forward tiếp hay chặn lại.
Vì Sao Là Địa Chỉ Cố Định, Đăng Ký Với IANA
224.0.23.12 là địa chỉ multicast dành riêng cho KNXnet/IP, nằm trong khối AD-HOC Block I (224.0.2.0 đến 224.0.255.255) của registry multicast IANA, đăng ký dưới tên KNXnet/IP với KNX Association là tổ chức kiểm soát. Địa chỉ này được nạp sẵn trong firmware mọi IP Router, nên các thiết bị đa hãng vẫn tương thích với nhau ngay từ đầu mà không cần cấu hình thêm.
Khi Nào Nên Đổi Sang Multicast Khác
Địa chỉ multicast có thể đổi trong giới hạn dải cho phép, chủ yếu dùng để tách nhiều hệ KNX độc lập cùng chạy trên một LAN (hệ A giữ 224.0.23.12, hệ B đổi sang địa chỉ khác). Theo khuyến nghị IANA, nếu cần đổi, nên chọn trong dải 239.0.0.0 đến 239.255.255.255 (Administratively Scoped Block, dành cho mạng nội bộ) thay vì chọn tùy ý trong dải 224.x để tránh đụng các nhóm multicast khác đã đăng ký.
Yêu Cầu Hạ Tầng Mạng Khi Dùng Routing
Switch và router trong LAN phải hỗ trợ xử lý multicast (IGMP), nếu không chắc nên bàn trước với quản trị mạng. Multicast không dùng được qua Internet, ngoại trừ khi đi qua kết nối VPN, đây là lưu ý chính thức từ KNX Association khi khuyến cáo không nên expose IP Router ra internet công khai.
IP Router Có Thể Thay Thế Line Coupler Hay Backbone Coupler
KNX Basic Course phân biệt rõ ba kịch bản triển khai IP Router. Case 1, IP Router thay thế line coupler, toàn bộ main line và cả backbone line chuyển sang chạy trên Ethernet. Case 2, IP Router chỉ thay thế backbone coupler, line coupler TP vật lý vẫn giữ nguyên, chỉ phần backbone chuyển sang LAN. Case 3 là kết hợp cả hai, nhưng tài liệu khuyến cáo chỉ nên dùng trong trường hợp ngoại lệ vì độ phức tạp cấu hình tăng lên đáng kể.
Trong thực tế triển khai tại Việt Nam, dòng Kanonbus KTS-D1 đến D3 cũng tích hợp sẵn chức năng IP Router cùng filter table, bên cạnh vai trò host gateway đa năng (relay, dimmer, RS485). Đây là lựa chọn phù hợp cho dự án smarthome và khách sạn cỡ vừa muốn gộp luôn chức năng routing vào thiết bị đang cần mua, thay vì đầu tư thêm một IP Router chuyên dụng riêng.
Bảo Mật Tunnel: Mỗi Kênh Có Thể Có Mật Khẩu Riêng
Khi bật KNX Secure Tunneling, thiết bị không chỉ mã hóa đường truyền mà còn quản lý quyền truy cập theo từng tunnel riêng biệt, không dùng chung một lớp bảo mật cho tất cả client.
FDSK, Tool Key Và Certificate Hoạt Động Thế Nào
Theo tài liệu KNX Secure Devices của KNX Association, mỗi thiết bị secure có một FDSK (Factory Default Setup Key) duy nhất, cố định, không sửa hay xóa được. Tool Key là khóa ETS dùng để giao tiếp với thiết bị khi secure mode bật, mặc định bằng FDSK và có thể reset lại qua master reset. ETS lấy FDSK thông qua certificate, một mã 25 ký tự in trên thiết bị kèm QR code, chứa cả serial number lẫn FDSK. Sau khi thêm certificate vào project, ETS tự động gán Tool Key, người dùng không tự sửa hay nhìn thấy giá trị này theo cách thủ công.
Nếu secure tunneling được kích hoạt, ETS tự sinh một mật khẩu riêng biệt cho từng tunnel, xem được trong mục cấu hình khi chọn từng kết nối. Cơ chế này cho phép cấp quyền khác nhau cho từng client, ví dụ ETS của kỹ sư dùng một mật khẩu, Savant hay Homey dùng mật khẩu khác, thay vì chia sẻ chung một lớp xác thực cho mọi kết nối.
Ví Dụ Thực Tế Trên Atios KNX Bridge
Atios ADE-KD là ví dụ cụ thể cho thấy IP Secure và Data Secure có thể bật đồng thời trên cùng một thiết bị, không loại trừ nhau. Thiết bị còn có thêm một lớp kiểm soát remote access riêng bằng token: chỉ những token đang hoạt động mới kết nối được qua Cloud Interface, tách biệt hoàn toàn với cơ chế mật khẩu theo từng tunnel cục bộ.
Giới Hạn Thực Tế Khi Dùng Nhiều Tunnel Đồng Thời
Ethernet nhanh không tự cứu được nếu thiết bị gửi telegram quá dày, hoặc telegram từ tất cả line dồn vào một line duy nhất. KNX Basic Course ví von tình huống này giống "1000 làn đường nhưng tất cả xe cùng muốn ra một lối thoát một làn", đây không phải vấn đề riêng của KNX mà là giới hạn chung của mọi mạng dữ liệu dạng mesh. Giải pháp thực tế là giảm cyclic send, bật send-on-change kèm deadband, cấu hình filter table đúng, và tách thiết bị gây flood sang line riêng thay vì trông chờ băng thông Ethernet gánh hết.
Xem thêm
Atios ADE-KD so với Elsner KNX Matter Server nên chọn bridge KNX sang Matter nào
nếu cần so sánh chi tiết hơn 2 thiết bị đã nhắc ở phần tunnel slot phía trên. Với dự án cần hiểu sâu hơn sự khác biệt giữa IP Interface và IP Router trước khi chọn thiết bị, tham khảo
KNX IP Interface và IP Router khác nhau thế nào
. Còn nếu dự án chưa bật KNX Secure, nên đọc thêm
KNX Secure là gì và những rủi ro khi hệ KNX không được bảo mật đúng cách
trước khi cấu hình tunnel cho dự án có remote access.
Kết Luận
KNXnet/IP Tunneling phục vụ client truy cập bus qua một Individual Address riêng biệt, còn Routing dùng multicast 224.0.23.12 để chuyển tiếp telegram giữa các line. Hiểu đúng 2 cơ chế này giúp chọn đúng thiết bị (IP Interface hay IP Router), tính đủ số tunnel slot cần thiết, và cấu hình bảo mật phù hợp ngay từ đầu dự án.
Liên hệ KNXStore.vn nếu cần tư vấn chọn thiết bị IP Interface hoặc IP Router phù hợp với quy mô dự án cụ thể.
KNXnet/IP Tunneling và Routing có dùng chung một địa chỉ IP không?
Không. Tunneling là kết nối unicast tới địa chỉ IP cụ thể của từng thiết bị, còn Routing dùng địa chỉ multicast chung (mặc định 224.0.23.12) để mọi IP Router cùng nghe một lúc.

Một thiết bị IP Interface hết tunnel slot thì client tiếp theo bị gì?
Client tiếp theo bị từ chối kết nối, dạng thông báo "no more connections". Cần giải phóng bớt slot đang dùng hoặc chuyển sang thiết bị có nhiều slot hơn.

Đổi Individual Address chính của thiết bị có ảnh hưởng tới các tunnel đã cấu hình không?
Không, nếu vẫn giữ nguyên Area.Line. Các tunnel chỉ bị ảnh hưởng khi đổi sang Line khác, lúc đó toàn bộ địa chỉ kể cả tunnel phải dịch chuyển theo.

Có bắt buộc dùng IP Router thay vì IP Interface khi dự án có nhiều line không?
Nên dùng IP Router khi dự án có từ 2 line trở lên, vì IP Router làm được cả tunneling lẫn routing, còn IP Interface chỉ làm được tunneling và không chuyển tiếp telegram giữa các line.

Có thể dùng chung một địa chỉ multicast cho 2 hệ KNX độc lập trên cùng LAN không?
Không nên. Nếu hai hệ dùng chung 224.0.23.12, IP Router của hệ này sẽ nhận nhầm telegram của hệ kia. Nên đổi multicast address của một trong hai hệ sang giá trị khác trong dải cho phép.

KNX Secure có bắt buộc phải bật trên mọi tunnel không?
Không bắt buộc, nhưng nên bật khi tunnel đó phục vụ remote access qua internet. Với tunnel chỉ dùng trong mạng LAN nội bộ không tiếp xúc internet, rủi ro thấp hơn nhiều.

Savant hay Homey có tốn tunnel slot vĩnh viễn không?
Có, nếu kết nối duy trì liên tục 24/7 như một hệ điều khiển trung tâm. Cần tính trước số slot cần dùng cho các hệ chạy thường trực, chừa lại slot cho ETS hoặc kỹ thuật viên bảo trì sau này.

## Raw MCP

```json
{
  "slug": "knxnet-ip-tunneling-la-gi-co-che-tunnel-slot-individual-address-va-multicast-224-0-23-12",
  "title": "KNXnet/IP Tunneling Là Gì: Cơ Chế Tunnel Slot, Individual Address Và Multicast 224.0.23.12",
  "excerpt": "Nhiều SI khi mới làm quen với KNX IP hay gộp chung hai khái niệm Tunneling và Routing, dẫn đến chọn sai thiết bị hoặc cấu hình sai địa chỉ multicast khi dự án mở rộng. Bài này giải thích đúng cơ chế KNXnet/IP Tunneling, vì sao mỗi kết nối tunnel bắt buộc phải có Individual Address riêng, vai trò của địa chỉ multicast 224.0.23.12 trong Routing, kèm số liệu thật từ thiết bị KNXStore đang phân phối.",
  "coverImage": "/media/6311763f8e67a6efe1d479d0e9c3d94fe89a57f3c99c872b70cda84c8ee6a8bb.png",
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
  "publishedAt": "2026-10-02T03:11:00.000Z",
  "categories": [],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "KNXnet/IP Tunneling Là Gì: Tunnel Slot, IA Và Multicast 224.0.23.12",
  "seoDescription": "Giải thích cơ chế KNXnet/IP Tunneling, vì sao mỗi tunnel cần Individual Address riêng, vai trò multicast 224.0.23.12, và ví dụ thực tế từ thiết bị KNXStore.",
  "faqs": [
    {
      "question": "KNXnet/IP Tunneling và Routing có dùng chung một địa chỉ IP không?",
      "answer": "Không. Tunneling là kết nối unicast tới địa chỉ IP cụ thể của từng thiết bị, còn Routing dùng địa chỉ multicast chung (mặc định 224.0.23.12) để mọi IP Router cùng nghe một lúc.",
      "position": 0
    },
    {
      "question": "Một thiết bị IP Interface hết tunnel slot thì client tiếp theo bị gì?",
      "answer": "Client tiếp theo bị từ chối kết nối, dạng thông báo \"no more connections\". Cần giải phóng bớt slot đang dùng hoặc chuyển sang thiết bị có nhiều slot hơn.",
      "position": 1
    },
    {
      "question": "Đổi Individual Address chính của thiết bị có ảnh hưởng tới các tunnel đã cấu hình không?",
      "answer": "Không, nếu vẫn giữ nguyên Area.Line. Các tunnel chỉ bị ảnh hưởng khi đổi sang Line khác, lúc đó toàn bộ địa chỉ kể cả tunnel phải dịch chuyển theo.",
      "position": 2
    },
    {
      "question": "Có bắt buộc dùng IP Router thay vì IP Interface khi dự án có nhiều line không?",
      "answer": "Nên dùng IP Router khi dự án có từ 2 line trở lên, vì IP Router làm được cả tunneling lẫn routing, còn IP Interface chỉ làm được tunneling và không chuyển tiếp telegram giữa các line.",
      "position": 3
    },
    {
      "question": "Có thể dùng chung một địa chỉ multicast cho 2 hệ KNX độc lập trên cùng LAN không?",
      "answer": "Không nên. Nếu hai hệ dùng chung 224.0.23.12, IP Router của hệ này sẽ nhận nhầm telegram của hệ kia. Nên đổi multicast address của một trong hai hệ sang giá trị khác trong dải cho phép.",
      "position": 4
    },
    {
      "question": "KNX Secure có bắt buộc phải bật trên mọi tunnel không?",
      "answer": "Không bắt buộc, nhưng nên bật khi tunnel đó phục vụ remote access qua internet. Với tunnel chỉ dùng trong mạng LAN nội bộ không tiếp xúc internet, rủi ro thấp hơn nhiều.",
      "position": 5
    },
    {
      "question": "Savant hay Homey có tốn tunnel slot vĩnh viễn không?",
      "answer": "Có, nếu kết nối duy trì liên tục 24/7 như một hệ điều khiển trung tâm. Cần tính trước số slot cần dùng cho các hệ chạy thường trực, chừa lại slot cho ETS hoặc kỹ thuật viên bảo trì sau này.",
      "position": 6
    }
  ],
  "editedAt": "2026-11-04T08:04:37.615Z",
  "url": "https://knxstore.vn/knxnet-ip-tunneling-la-gi-co-che-tunnel-slot-individual-address-va-multicast-224-0-23-12.html"
}
```
