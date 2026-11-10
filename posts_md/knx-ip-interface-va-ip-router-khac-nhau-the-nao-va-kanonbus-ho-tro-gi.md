---
url: "https://knxstore.vn/knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi.html"
headline: "KNX IP Interface và IP Router: Khác nhau thế nào và Kanonbus hỗ trợ gì?"
description: "Khám phá sự khác biệt giữa KNX IP Interface và IP Router, cách chọn đúng thiết bị cho dự án nhiều tầng, cùng giải pháp Kanonbus tích hợp IP Router."
image: "https://knxstore.vn/media/fa03ef6f31ec2c2420712bce93ad9a2ec8cc34f4a4832617b3dca15dfe93affe.jpg"
datePublished: "2026-07-07T02:15:14.000Z"
dateModified: "2026-07-07T02:15:14.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "KNX"
word_count: 3644
keywords: ["KNX"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "KNX"
    url: "https://knxstore.vn/blogs/knx"
  - name: "KNX IP Interface và IP Router: Khác nhau thế nào và Kanonbus hỗ trợ gì?"
    url: "https://knxstore.vn/knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi.html"
products: [{"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-dieu-hoa-vrv-vrf-kac001", "name": "Bộ điều khiển điều hòa VRV/VRF Kanonbus IP Router/Modbus RTU - KAC001"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-dieu-hoa-vrv-vrf-knx-kac008", "name": "Bộ điều khiển điều hòa KNX Kanonbus - KAC008"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-dieu-hoa-vrv-vrf-knx-kac005", "name": "Bộ điều khiển điều hòa VRV/VRF KNX Kanonbus - KAC005"}, {"url": "https://knxstore.vn/products/bo-dieu-khien-knx-host-kanonbus-kts-box3", "name": "Bộ điều khiển KNX host Kanonbus - KTS-BOX3"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-knx-host", "name": "Bộ điều khiển KNX host Kanonbus - KTS-BOX2"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-knx-host-kts-d3", "name": "Bộ điều khiển KNX host đa năng Kanonbus - KTS-D1, D2, D3"}]
related_links:
  - url: "https://knxstore.vn/line-segment-va-line-coupler-trong-knx-chia-line-the-nao.html"
    slug: "line-segment-va-line-coupler-trong-knx-chia-line-the-nao"
    anchor: "Line Segment Và Line Coupler Trong KNX: Chia Line Thế Nào"
    position: 1
  - url: "https://knxstore.vn/rcu-khach-san-cho-chu-dau-tu-va-me-phan-loai-va-cach-chon.html"
    slug: "rcu-khach-san-cho-chu-dau-tu-va-me-phan-loai-va-cach-chon"
    anchor: "RCU Khách Sạn Cho Chủ Đầu Tư Và ME: Phân Loại Và Cách Chọn."
    position: 2
  - url: "https://knxstore.vn/giam-sat-nang-luong-trong-he-thong-knx-vi-sao-phai-do-dien-truoc-khi-tiet-kiem-dien.html"
    slug: "giam-sat-nang-luong-trong-he-thong-knx-vi-sao-phai-do-dien-truoc-khi-tiet-kiem-dien"
    anchor: "Giám Sát Năng Lượng Trong Hệ Thống KNX: Vì Sao Phải Đo Điện Trước Khi Tiết Kiệm Điện"
    position: 3
  - url: "https://knxstore.vn/atios-ade-kd-vs-elsner-knx-matter-server-nen-chon-bridge-knx-sang-matter-nao.html"
    slug: "atios-ade-kd-vs-elsner-knx-matter-server-nen-chon-bridge-knx-sang-matter-nao"
    anchor: "Atios ADE-KD vs Elsner KNX Matter Server Nên Chọn Bridge KNX Sang Matter Nào"
    position: 4
---

# KNX IP Interface và IP Router: Khác nhau thế nào và Kanonbus hỗ trợ gì?

> Khám phá sự khác biệt giữa KNX IP Interface và IP Router, cách chọn đúng thiết bị cho dự án nhiều tầng, cùng giải pháp Kanonbus tích hợp IP Router.

## Article Body

KNX IP Interface và IP Router: Khác nhau thế nào và Kanonbus hỗ trợ gì?
Nếu bạn đã từng bước vào một dự án tòa nhà 5 tầng với yêu cầu điều khiển chiếu sáng và điều hòa tập trung, chắc chắn câu hỏi này đã xuất hiện: cần cắm IP Interface hay IP Router vào tủ điện? Nghe qua thì gần giống nhau, nhưng chọn nhầm là cả hệ thống không giao tiếp được giữa các tầng, dù ETS đã nạp chương trình xong.
KNX IP Interface và KNX IP Router đều dùng giao thức KNXnet/IP để kết nối bus TP với mạng Ethernet. Điểm khác nhau nằm ở chỗ: một cái chỉ mở cửa cho ETS vào lập trình, cái kia làm backbone thực sự để telegram đi qua giữa các line. Hiểu đúng sự khác biệt này giúp bạn thiết kế topology chính xác ngay từ đầu, tránh phải sửa lại sau khi đã đi dây.
KNX IP Interface là gì và khi nào nên dùng?
KNX IP Interface là thiết bị tạo cầu nối giữa KNX bus TP và mạng Ethernet theo cơ chế point-to-point (tunneling). Nói đơn giản: nó mở một cổng kết nối để laptop chạy ETS có thể "nhìn thấy" bus mà không cần cắm trực tiếp bằng USB hay dây TP.
Giao thức phía IP sử dụng là KNXnet/IP Tunneling, trong đó mỗi kết nối hoạt động như một USB interface ảo. Phần lớn IP Interface trên thị trường hỗ trợ từ 4 đến 10 kết nối tunneling đồng thời, tùy model.
Cơ chế hoạt động KNXnet/IP Tunneling
Khi ETS khởi động scan, nó gửi UDP multicast đến địa chỉ 224.0.23.12 port 3671. IP Interface nhận được gói tin này và phản hồi, ETS nhận ra và hiển thị như một interface khả dụng. Từ đó trở đi, toàn bộ telegram giữa ETS và bus đi qua TCP/IP tunnel này.
Điểm cần lưu ý: IP Interface chỉ forward telegram theo chiều ETS - bus và ngược lại. Nó không có khả năng chuyển tiếp telegram từ line này sang line khác. Đây là giới hạn cốt lõi phân biệt IP Interface với IP Router.
KNXnet/IP Tunneling là gì và tại sao nó quan trọng?
Tunneling là kỹ thuật bọc một giao thức bên trong một giao thức khác để truyền qua mạng mà giao thức gốc không hỗ trợ trực tiếp. Trong KNX, telegram chỉ chạy được trên dây TP vật lý. Tunneling giải quyết bài toán này bằng cách bọc KNX telegram vào gói UDP/IP để đi qua mạng LAN như một packet bình thường.
Hình dung đơn giản: KNX telegram là lá thư viết bằng ngôn ngữ riêng, mạng LAN là hệ thống bưu điện chỉ hiểu IP. Tunneling chính là cái phong bì — bọc lá thư vào trong, ghi địa chỉ IP ra ngoài, gửi đi. Bên kia nhận xong, xé phong bì, lấy lá thư KNX gốc ra dùng.
Theo tài liệu chính thức KNX Association: "KNX telegram được bọc vào TCP/IP và gửi từ ETS đến IP Tunneling interface. Interface này bóc lớp TCP/IP ra và route telegram xuống TP area hoặc TP line bên dưới." Đây là định nghĩa gốc, không có diễn giải thêm.
Tunneling khác Routing thế nào?
Đây là điểm nhiều kỹ sư hay nhầm. Cả hai đều dùng mạng IP để truyền KNX telegram, nhưng mục đích và cơ chế hoàn toàn khác:
Tunneling
Routing
Kiểu kết nối
Point-to-point (unicast)
Multicast (1 nguồn, nhiều đích)
Ai dùng
ETS, Savant, visualization server
IP Router với IP Router khác
Mục đích
Truy cập bus để lập trình/giám sát/điều khiển
Chuyển tiếp telegram giữa các line TP
Tự hoạt động không
Không, cần client kết nối vào
Có, tự chạy 24/7 dù không ai kết nối
Địa chỉ IP đích
Unicast đến IP của IP Interface/Router cụ thể
Multicast 224.0.23.12 đến tất cả Router
Tắt IP Interface đi, hệ thống KNX vẫn chạy bình thường, chỉ mất khả năng lập trình từ xa. Tắt IP Router đi, các line KNX mất kết nối với nhau, hệ thống ngừng hoạt động đúng thiết kế.
Tunneling dùng cho nền tảng điều khiển bên thứ ba
Đây là điểm thực tế quan trọng cho kỹ sư tích hợp. Savant, Control4, Crestron, Home Assistant  tất cả đều kết nối vào KNX thông qua KNXnet/IP Tunneling, không phải Routing. Chúng chiếm một tunneling slot trên IP Interface hoặc IP Router, gửi/nhận telegram KNX theo group address, hoàn toàn giống ETS nhưng ở góc độ runtime thay vì commissioning.
Một IP Router thực tế trong dự án khách sạn có thể phục vụ đồng thời:
Slot 1: ETS của kỹ sư đang commissioning
Slot 2: Savant processor điều khiển chiếu sáng và rèm
Slot 3: Visualization server của quản lý tòa nhà
Slot 4-5: dự phòng cho bảo trì sau này
Lưu ý nhỏ: số tunneling slot có giới hạn tùy model, thường từ 4 đến 10. Nếu dự án cần nhiều client kết nối đồng thời, kiểm tra spec model trước khi chọn.
Một điểm quan trọng từ tài liệu KNX Association: mỗi tunneling slot được gán một địa chỉ vật lý riêng trong topology (ví dụ 1.1.251, 1.1.252...). Địa chỉ này phải nằm đúng area/line với IP Router, và không được trùng với bất kỳ thiết bị nào khác trên bus. ETS tự quản lý việc gán địa chỉ này khi download cấu hình xuống thiết bị.
Ngoài ra, ETS có tùy chọn "heartbeat" cho tunneling connection: khi bật, tunnel duy trì kết nối liên tục mà không cần gửi yêu cầu kết nối mới mỗi lần, giúp tăng hiệu suất đáng kể trong dự án có nhiều client kết nối cùng lúc.
Phù hợp với dự án quy mô nào?
IP Interface phù hợp khi toàn bộ hệ thống nằm trên một line TP duy nhất, thường dưới 64 thiết bị. Ví dụ điển hình: biệt thự đơn lẻ, căn hộ cao cấp, văn phòng nhỏ 1 tầng. Những dự án này không cần routing giữa nhiều line, chỉ cần ETS vào được qua mạng LAN là đủ.
Về chi phí, IP Interface thường rẻ hơn IP Router từ 30 đến 50%, nên nếu dự án thực sự chỉ có 1 line thì không cần đầu tư thêm cho IP Router.
Giới hạn cần biết trước khi chọn
Nếu sau này khách hàng muốn mở rộng thêm line, toàn bộ topology phải thiết kế lại. IP Interface không thể "nâng cấp" thành IP Router bằng cách thay firmware. Đây là hai sản phẩm khác nhau về thiết kế phần cứng.
Ngoài ra, một số IP Interface chỉ cho phép 1 kết nối ETS tại một thời điểm. Nếu dự án cần 2 kỹ sư cùng truy cập bus đồng thời để kiểm tra, cần xem spec kỹ trước khi chọn model.
KNX IP Router là gì và tại sao nó quan trọng hơn trong dự án lớn?
KNX IP Router là thiết bị kết nối nhiều KNX line hoặc area thông qua mạng Ethernet, thay thế cho line coupler TP vật lý truyền thống. Nó sử dụng KNXnet/IP Routing (multicast) để chuyển tiếp telegram giữa các line, với Ethernet làm backbone.
Điểm khác biệt then chốt so với IP Interface: IP Router có filter table, có khả năng quyết định telegram nào được forward qua, telegram nào bị chặn lại. Điều này giúp giảm tải bus ở từng line và tăng tính bảo mật giữa các vùng.
Routing Multicast - backbone kết nối nhiều line
IP Router dùng IP multicast address 224.0.23.12 để broadcast telegram lên mạng LAN. Tất cả IP Router trong cùng subnet đều nhận được telegram này, sau đó mỗi router tự quyết định dựa trên filter table: có cần forward xuống line TP của mình không.
Cơ chế này cho phép nhiều IP Router cùng tồn tại trong một mạng LAN mà không xung đột. Mỗi IP Router mang một địa chỉ vật lý dạng X.Y.0 (ví dụ 1.1.0 cho line 1, 1.2.0 cho line 2) thể hiện đúng vị trí trong topology KNX.
Kịch bản 2 tầng xa nhau không đi được dây KNX
Đây là tình huống thực tế phổ biến nhất: tòa nhà có 2 khu vực cách nhau về khoảng cách hoặc cấu trúc vật lý, không thể kéo dây TP dài hơn 1000m hoặc không có đường dây tới. Giải pháp: đặt 1 IP Router tại mỗi khu vực, kết nối cả hai qua hạ tầng LAN sẵn có.
Telegram từ công tắc khu A gửi group address, IP Router A forward lên LAN multicast, IP Router B nhận và forward xuống bus khu B. Toàn bộ quá trình này xảy ra trong vài millisecond.
Một ETS quản lý toàn bộ - nạp chương trình từ xa
IP Router còn hỗ trợ tunneling mode, tức là cũng làm được việc của IP Interface. Điều này có nghĩa là laptop chạy ETS chỉ cần kết nối vào LAN chung, sau đó có thể truy cập tất cả device trên mọi line TP trong hệ thống, không cần di chuyển vật lý.
Thực tế khi commissioning dự án nhiều tầng, kỹ sư ngồi tại phòng kỹ thuật tầng 1 vẫn nạp được chương trình cho actuator ở tầng 8, miễn là các IP Router đang online và kết nối LAN ổn định.
So sánh trực tiếp IP Interface và IP Router
Bảng so sánh 7 tiêu chí kỹ thuật
Tiêu chí
IP Interface
IP Router
Chức năng chính
ETS tunneling (lập trình/giám sát)
Routing telegram giữa các line
Giao thức IP
KNXnet/IP Tunneling
KNXnet/IP Routing (Multicast) + Tunneling
Số line TP hỗ trợ
1 line duy nhất
Kết nối nhiều line qua backbone IP
Filter table
Không
Có - lọc telegram theo group address
Kết nối đồng thời
4-10 tunnel
5-10 tunnel + routing
Chi phí
Thấp hơn 30-50%
Cao hơn
Cấu hình ETS
Đơn giản
Cần cấu hình địa chỉ vật lý đúng topology
Chi phí và độ phức tạp cấu hình
IP Interface cấu hình gần như tự động: cắm vào LAN, bật DHCP, ETS scan thấy ngay. Không cần gán địa chỉ vật lý đặc biệt vì nó không tham gia vào topology routing.
IP Router thì khác. Địa chỉ vật lý phải được gán đúng theo vị trí trong topology. Nếu IP Router đóng vai trò line coupler thì địa chỉ là 1.1.0. Nếu đóng vai area coupler thì là 1.0.0. Gán sai địa chỉ là telegram không được route đúng chỗ, và debug lỗi này khá mất thời gian. (Thực tế khi thi công hay gặp lỗi này nếu kỹ sư không quen topology KNX.)
Khi nào IP Router thay thế hoàn toàn IP Interface?
Câu trả lời ngắn: khi dự án có từ 2 line TP trở lên. Lúc đó IP Router làm được tất cả những gì IP Interface làm, cộng thêm routing giữa các line. Nếu ngân sách không phải vấn đề, chọn IP Router từ đầu để tránh phải thay thiết bị khi mở rộng sau này.
Nếu chắc chắn 100% dự án chỉ có 1 line và không mở rộng, IP Interface là lựa chọn tiết kiệm hợp lý.
Kanonbus hỗ trợ KNX IP Router ở sản phẩm nào?
Kanonbus không sản xuất IP Router thuần túy như Weinzierl 750 hay MDT SCN-IP100. Thay vào đó, họ tích hợp chức năng IP Router bên trong các host gateway đa năng. Điều này phù hợp với dự án smarthome và khách sạn cỡ vừa, nơi cần gateway điều khiển điều hòa hoặc actuator, đồng thời muốn tiết kiệm chi phí thiết bị.
KAC005 và KAC008 Tích hợp IP Router trong gateway điều hòa
KAC005 và KAC008 là gateway kết nối điều hòa trung tâm (dạng VRV/VRF các hãng Daikin, Toshiba, Mitsubishi Electric, Hitachi, Haier, York...) với hệ thống KNX. Ngoài chức năng gateway điều hòa, cả hai model đều có tích hợp KNX IP Router và bảng lọc (filter table).
Thông số cần lưu ý:
Giao tiếp điều hòa qua chuẩn HBS/XYE hoặc RS485
Kết nối KNX qua bus terminal TP
Kết nối mạng qua cổng RJ45
Nguồn cấp: 12-30V DC
Hỗ trợ tối đa 64 indoor unit (tùy hãng điều hòa)
Sự khác biệt giữa KAC005 và KAC008: KAC008 có thêm cổng RS232 và RS485, phù hợp khi cần tích hợp thêm thiết bị ngoại vi khác ngoài điều hòa.
Ứng dụng thực tế: dự án khách sạn 50 phòng, mỗi phòng có 1 indoor unit Daikin. Gateway KAC005 kết nối trực tiếp với dàn lạnh qua chuẩn HBS, đồng thời làm IP Router backbone kết nối room controller KNX với hệ thống quản lý trung tâm qua LAN.
KTS-BOX2 và KTS-BOX3 All-in-one với IP Router
KTS-BOX2 là host gateway tích hợp nhiều chức năng vào một module DIN rail: relay output 16A (3 kênh), relay output 10A (12 kênh), dimmer 0-10V (6 kênh), RS485 (5 cổng độc lập), cổng KNX TP và cổng RJ45. Phiên bản KTS-BOX3 bổ sung thêm Dali tích hợp, cho phép điều khiển thêm tối đa 64 địa chỉ DALI.
Chức năng KNX IP Router được tích hợp vào firmware, có filter table đầy đủ.
Ứng dụng thực tế: phòng họp hoặc phòng khách sạn cần điều khiển chiếu sáng + điều hòa + rèm cửa tập trung. Thay vì đặt 3-4 module riêng lẻ (relay actuator, dimmer, gateway...), KTS-BOX2 gom tất cả vào 1 module. IP Router tích hợp giúp kết nối phòng này với hệ thống quản lý tầng qua LAN.
KTS-D1 đến D6 Dòng multi-function có IP Router
Dòng KTS-D (D1 đến D6) là multi-function host gateway, toàn bộ 6 model đều tích hợp KNX IP Router và filter table. Các model khác nhau về số cổng RS485 (1 đến 6 cổng) và cổng RS232, cho phép kết nối đồng thời nhiều thiết bị 485 như motor rèm, điều hòa 485, sàn nhiệt.
Dòng này phù hợp cho dự án cần tích hợp nhiều loại thiết bị 485 cùng lúc mà không muốn dùng nhiều gateway riêng lẻ.
Lưu ý kỹ thuật khi triển khai IP Router trong thực tế
Đây là phần mà nhiều dự án gặp vấn đề sau khi lắp xong: hệ thống ETS scan thấy, nhưng telegram không đi được giữa các line, hoặc bị delay bất thường. Thường là do 3 nguyên nhân dưới đây.
Cấu hình IGMP Snooping trên managed switch
KNXnet/IP Routing dùng IP multicast. Nếu switch không hỗ trợ hoặc không bật IGMP Snooping, gói multicast sẽ bị flood toàn bộ mạng LAN, hoặc bị block tùy cấu hình switch. Cả hai trường hợp đều làm IP Router không giao tiếp được với nhau.
Giải pháp: dùng managed switch, bật IGMP Snooping, kiểm tra port nào cần join multicast group 224.0.23.12. Nếu dùng switch không quản lý được (unmanaged), thường cũng hoạt động được vì unmanaged switch flood multicast về tất cả port, nhưng không nên dùng trong môi trường mạng lớn có nhiều traffic.
KNX Association xác nhận thêm: trong cấu trúc mạng phức tạp, multicast không tự động được forward qua switch và router nếu không được cấu hình đúng. Đây là nguyên nhân phổ biến nhất khiến IP Router đã cắm vào nhưng các line vẫn không nói chuyện được với nhau.
Không expose KNX trực tiếp ra internet
Đây là cảnh báo bảo mật từ chính KNX Association: expose KNX interface lên internet công cộng là rủi ro bảo mật nghiêm trọng. Giao thức KNXnet/IP Tunneling không có cơ chế xác thực tích hợp ở phiên bản thông thường, nghĩa là bất kỳ ai biết IP và port đều có thể gửi telegram vào bus.
Giải pháp đúng cho remote access: dùng VPN để tạo tunnel bảo mật từ internet vào LAN nội bộ trước, rồi từ LAN kết nối vào IP Interface/Router như bình thường. Nếu dự án cần remote access thường xuyên cho khách hàng, xem xét dùng thiết bị chuyên dụng như Gira S1 có cơ chế bảo mật riêng qua HTTPS.
Phân vùng VLAN cho KNX IP traffic
Trong tòa nhà lớn có nhiều hệ thống mạng (IT, camera, BMS, KNX), nên đặt KNX IP traffic trên một VLAN riêng. Điều này ngăn multicast KNX flood sang các segment mạng khác và giảm nguy cơ conflict với thiết bị IT.
Cấu hình điển hình: tạo VLAN 100 cho KNX, gán tất cả port kết nối IP Router vào VLAN này, cấu hình inter-VLAN routing có chọn lọc nếu BMS cần đọc dữ liệu từ KNX.
Địa chỉ vật lý đúng topology
IP Router đóng vai line coupler phải có địa chỉ dạng Area.Line.0. Ví dụ: IP Router tầng 1 nối line 1.1 thì địa chỉ là 1.1.0. IP Router tầng 2 nối line 1.2 thì địa chỉ là 1.2.0.
Lỗi hay gặp: gán cùng một địa chỉ vật lý cho 2 IP Router khác nhau trong cùng mạng. ETS sẽ báo conflict và telegram không đi đúng. Kiểm tra bằng cách vào ETS - Bus - Properties - scan địa chỉ hiện tại trước khi download.
Kết luận
KNX IP Interface và KNX IP Router giải quyết hai bài toán khác nhau. IP Interface là cổng vào cho ETS, phù hợp với dự án 1 line đơn giản. IP Router là backbone thực sự, bắt buộc khi hệ thống có nhiều line, nhiều tầng, hoặc có các khu vực không thể kết nối bằng dây TP.
Với dòng sản phẩm Kanonbus, ba nhóm có tích hợp IP Router là KAC005/008, KTS-BOX2/BOX3 và KTS-D1 đến D6. Đây là lựa chọn thực tế cho dự án smarthome và khách sạn cỡ vừa, nơi cần gateway điều hòa hoặc actuator kết hợp với chức năng routing KNX mà không muốn đầu tư thêm module riêng lẻ. KAC001 và KBA2001 không có IP Router, phù hợp cho kịch bản tích hợp Modbus hoặc BACnet thuần.
Thiết kế topology KNX đúng từ đầu sẽ tiết kiệm rất nhiều thời gian debugging sau này. Nếu bạn đang phân vân giữa các lựa chọn cho một dự án cụ thể, đội ngũ kỹ thuật KNXStore sẵn sàng hỗ trợ tư vấn topology và lựa chọn thiết bị phù hợp.
Có thể truy cập KNX từ xa qua internet không?
Được, nhưng phải qua VPN. KNX Association cảnh báo rõ: expose IP Interface hoặc IP Router trực tiếp ra internet là rủi ro bảo mật nghiêm trọng vì KNXnet/IP Tunneling không có xác thực tích hợp ở phiên bản thông thường. Cách đúng: tạo VPN tunnel vào LAN nội bộ trước, sau đó kết nối ETS qua LAN như bình thường. Hoặc dùng thiết bị remote access chuyên dụng như Gira S1.

KNXnet/IP Tunneling là gì và khác Routing thế nào?
KNXnet/IP Tunneling là cơ chế bọc KNX telegram vào gói UDP/IP để truyền qua mạng LAN theo kiểu point-to-point (unicast). Tunneling dùng cho client bên ngoài (ETS, Savant, Control4) muốn truy cập vào bus KNX. Routing (multicast) dùng để IP Router chuyển tiếp telegram tự động giữa các line TP với nhau, hoạt động 24/7 không cần client nào kết nối vào. Tunneling cần client chủ động kết nối, Routing tự chạy độc lập.

KNXnet/IP Tunneling là gì và khác Routing thế nào?
KNXnet/IP Tunneling là cơ chế bọc KNX telegram vào gói UDP/IP để truyền qua mạng LAN theo kiểu point-to-point (unicast). Tunneling dùng cho client bên ngoài (ETS, Savant, Control4) muốn truy cập vào bus KNX. Routing (multicast) dùng để IP Router chuyển tiếp telegram tự động giữa các line TP với nhau, hoạt động 24/7 không cần client nào kết nối vào. Tunneling cần client chủ động kết nối, Routing tự chạy độc lập.

Savant hay Control4 kết nối vào KNX qua cơ chế nào?
Cả hai đều dùng KNXnet/IP Tunneling, chiếm một tunneling slot trên IP Interface hoặc IP Router. Chúng gửi/nhận telegram KNX theo group address giống ETS nhưng ở góc độ runtime điều khiển, không phải commissioning. Không cần gateway trung gian nếu nền tảng đã có native KNX driver, chỉ cần cùng subnet LAN với IP Interface hoặc IP Router.

IP Router có thay thế hoàn toàn IP Interface không?
Có. IP Router hỗ trợ cả tunneling mode, nghĩa là nó làm được tất cả những gì IP Interface làm (cổng vào cho ETS, kết nối visualization server) và thêm routing giữa các line. Sự khác biệt duy nhất là chi phí cao hơn và cấu hình phức tạp hơn. Nếu dự án có từ 2 line trở lên, IP Router là lựa chọn bắt buộc.

Kanonbus KTS-BOX2 có dùng được như IP Router thuần không?
Về mặt chức năng KNXnet/IP Routing thì có. KTS-BOX2 tích hợp IP Router với filter table đầy đủ, ETS nhận diện và cấu hình địa chỉ vật lý bình thường. Tuy nhiên cần lưu ý: KTS-BOX2 là host gateway đa năng, không phải IP Router thuần. Nếu chỉ cần IP Router mà không cần relay hay dimmer, nên xem xét IP Router chuyên dụng từ Weinzierl hoặc MDT để tối ưu chi phí.

Cần bao nhiêu IP Router cho tòa nhà 5 tầng?
Tối thiểu 1 IP Router mỗi line TP. Nếu mỗi tầng là 1 line độc lập thì cần 5 IP Router. Nếu mỗi tầng chia thành 2 line (chiếu sáng và điều hòa riêng) thì cần 10. Số lượng phụ thuộc vào topology thiết kế, không phải số tầng. Quy tắc: mỗi line TP cần 1 IP Router để kết nối vào backbone IP.

ETS có nhận diện IP Router Kanonbus tự động không?
Có, ETS nhận diện IP Router Kanonbus (KTS-BOX2, KAC005, KAC008, dòng KTS-Dx) thông qua multicast scan KNXnet/IP như bất kỳ IP Router nào khác. File ETS (ETS App) cần được download từ KNX Online Catalog và import vào project trước khi cấu hình tham số chi tiết.

## Raw MCP

```json
{
  "slug": "knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi",
  "title": "KNX IP Interface và IP Router: Khác nhau thế nào và Kanonbus hỗ trợ gì?",
  "excerpt": "Khám phá sự khác biệt giữa KNX IP Interface và IP Router, cách chọn đúng thiết bị cho dự án nhiều tầng, cùng giải pháp Kanonbus tích hợp IP Router.",
  "coverImage": "/media/fa03ef6f31ec2c2420712bce93ad9a2ec8cc34f4a4832617b3dca15dfe93affe.jpg",
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
  "publishedAt": "2026-07-07T02:15:14.000Z",
  "categories": [
    {
      "slug": "knx",
      "name": "KNX"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "KNX IP Interface và IP Router: Khác nhau thế nào và Kanonbus hỗ trợ gì?",
  "seoDescription": "Khám phá sự khác biệt giữa KNX IP Interface và IP Router, cách chọn đúng thiết bị cho dự án nhiều tầng, cùng giải pháp Kanonbus tích hợp IP Router.",
  "faqs": [
    {
      "question": "Có thể truy cập KNX từ xa qua internet không?",
      "answer": "Được, nhưng phải qua VPN. KNX Association cảnh báo rõ: expose IP Interface hoặc IP Router trực tiếp ra internet là rủi ro bảo mật nghiêm trọng vì KNXnet/IP Tunneling không có xác thực tích hợp ở phiên bản thông thường. Cách đúng: tạo VPN tunnel vào LAN nội bộ trước, sau đó kết nối ETS qua LAN như bình thường. Hoặc dùng thiết bị remote access chuyên dụng như Gira S1.",
      "position": 0
    },
    {
      "question": "KNXnet/IP Tunneling là gì và khác Routing thế nào?",
      "answer": "KNXnet/IP Tunneling là cơ chế bọc KNX telegram vào gói UDP/IP để truyền qua mạng LAN theo kiểu point-to-point (unicast). Tunneling dùng cho client bên ngoài (ETS, Savant, Control4) muốn truy cập vào bus KNX. Routing (multicast) dùng để IP Router chuyển tiếp telegram tự động giữa các line TP với nhau, hoạt động 24/7 không cần client nào kết nối vào. Tunneling cần client chủ động kết nối, Routing tự chạy độc lập.",
      "position": 1
    },
    {
      "question": "KNXnet/IP Tunneling là gì và khác Routing thế nào?",
      "answer": "KNXnet/IP Tunneling là cơ chế bọc KNX telegram vào gói UDP/IP để truyền qua mạng LAN theo kiểu point-to-point (unicast). Tunneling dùng cho client bên ngoài (ETS, Savant, Control4) muốn truy cập vào bus KNX. Routing (multicast) dùng để IP Router chuyển tiếp telegram tự động giữa các line TP với nhau, hoạt động 24/7 không cần client nào kết nối vào. Tunneling cần client chủ động kết nối, Routing tự chạy độc lập.",
      "position": 2
    },
    {
      "question": "Savant hay Control4 kết nối vào KNX qua cơ chế nào?",
      "answer": "Cả hai đều dùng KNXnet/IP Tunneling, chiếm một tunneling slot trên IP Interface hoặc IP Router. Chúng gửi/nhận telegram KNX theo group address giống ETS nhưng ở góc độ runtime điều khiển, không phải commissioning. Không cần gateway trung gian nếu nền tảng đã có native KNX driver, chỉ cần cùng subnet LAN với IP Interface hoặc IP Router.",
      "position": 3
    },
    {
      "question": "IP Router có thay thế hoàn toàn IP Interface không?",
      "answer": "Có. IP Router hỗ trợ cả tunneling mode, nghĩa là nó làm được tất cả những gì IP Interface làm (cổng vào cho ETS, kết nối visualization server) và thêm routing giữa các line. Sự khác biệt duy nhất là chi phí cao hơn và cấu hình phức tạp hơn. Nếu dự án có từ 2 line trở lên, IP Router là lựa chọn bắt buộc.",
      "position": 4
    },
    {
      "question": "Kanonbus KTS-BOX2 có dùng được như IP Router thuần không?",
      "answer": "Về mặt chức năng KNXnet/IP Routing thì có. KTS-BOX2 tích hợp IP Router với filter table đầy đủ, ETS nhận diện và cấu hình địa chỉ vật lý bình thường. Tuy nhiên cần lưu ý: KTS-BOX2 là host gateway đa năng, không phải IP Router thuần. Nếu chỉ cần IP Router mà không cần relay hay dimmer, nên xem xét IP Router chuyên dụng từ Weinzierl hoặc MDT để tối ưu chi phí.",
      "position": 5
    },
    {
      "question": "Cần bao nhiêu IP Router cho tòa nhà 5 tầng?",
      "answer": "Tối thiểu 1 IP Router mỗi line TP. Nếu mỗi tầng là 1 line độc lập thì cần 5 IP Router. Nếu mỗi tầng chia thành 2 line (chiếu sáng và điều hòa riêng) thì cần 10. Số lượng phụ thuộc vào topology thiết kế, không phải số tầng. Quy tắc: mỗi line TP cần 1 IP Router để kết nối vào backbone IP.",
      "position": 6
    },
    {
      "question": "ETS có nhận diện IP Router Kanonbus tự động không?",
      "answer": "Có, ETS nhận diện IP Router Kanonbus (KTS-BOX2, KAC005, KAC008, dòng KTS-Dx) thông qua multicast scan KNXnet/IP như bất kỳ IP Router nào khác. File ETS (ETS App) cần được download từ KNX Online Catalog và import vào project trước khi cấu hình tham số chi tiết.",
      "position": 7
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi.html"
}
```
