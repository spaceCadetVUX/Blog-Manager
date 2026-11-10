---
url: "https://knxstore.vn/line-segment-va-line-coupler-trong-knx-chia-line-the-nao.html"
headline: "Line Segment Và Line Coupler Trong KNX: Chia Line Thế Nào"
description: "Phân biệt Line Segment và Line Coupler trong KNX: giới hạn 64 thiết bị, repeater, filter table, tải bus. Cách chia line từ biệt thự đến tòa nhà 20 tầng."
image: "https://knxstore.vn/media/43727b1cf9c7bdc4d6b884b3b550e8b2d1088555c765441b6881bba2d049ae00.avif"
datePublished: "2026-11-02T06:13:00.000Z"
dateModified: "2026-11-02T06:22:04.706Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "KNX"
word_count: 2939
keywords: ["KNX"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "KNX"
    url: "https://knxstore.vn/blogs/knx"
  - name: "Line Segment Và Line Coupler Trong KNX: Chia Line Thế Nào"
    url: "https://knxstore.vn/line-segment-va-line-coupler-trong-knx-chia-line-the-nao.html"
products: [{"url": "https://knxstore.vn/products/bo-ghep-noi-knx-line-coupler-repeater-kanonbus-ktelc", "name": "Bộ ghép nối KNX Line Coupler / Repeater Kanonbus KTELC"}, {"url": "https://knxstore.vn/products/bo-dinh-tuyen-knx-ip-router-kanonbus-kteipc", "name": "Bộ định tuyến KNX IP Router Kanonbus KTEIPC"}, {"url": "https://knxstore.vn/products/legrand-bo-dinh-tuyen-ip-002638", "name": "Bộ định tuyến IP KNX Legrand - 002638"}, {"url": "https://knxstore.vn/products/bo-ghep-he-thong-bus-knx", "name": "Bộ ghép hệ thống bus KNX Ekinex - EK-BA1-TP"}, {"url": "https://knxstore.vn/products/bo-mo-rong-64-dia-chi-knx", "name": "Bộ mở rộng 64 địa chỉ KNX LineCoupler 650 Weinzierl"}, {"url": "https://knxstore.vn/products/weinzierl-cong-giao-tiep-ip-he-thong-knx", "name": "Cổng giao tiếp KNX IP Interface 732 secure Weinzierl - 5248"}]
internal_links:
  - url: "https://knxstore.vn/knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi.html"
    slug: "knx-ip-interface-va-ip-router-khac-nhau-the-nao-va-kanonbus-ho-tro-gi"
    anchor: "KNX IP Interface và IP Router khác nhau thế nào"
related_links:
  - url: "https://knxstore.vn/rcu-khach-san-cho-chu-dau-tu-va-me-phan-loai-va-cach-chon.html"
    slug: "rcu-khach-san-cho-chu-dau-tu-va-me-phan-loai-va-cach-chon"
    anchor: "RCU Khách Sạn Cho Chủ Đầu Tư Và ME: Phân Loại Và Cách Chọn."
    position: 1
  - url: "https://knxstore.vn/giam-sat-nang-luong-trong-he-thong-knx-vi-sao-phai-do-dien-truoc-khi-tiet-kiem-dien.html"
    slug: "giam-sat-nang-luong-trong-he-thong-knx-vi-sao-phai-do-dien-truoc-khi-tiet-kiem-dien"
    anchor: "Giám Sát Năng Lượng Trong Hệ Thống KNX: Vì Sao Phải Đo Điện Trước Khi Tiết Kiệm Điện"
    position: 2
  - url: "https://knxstore.vn/atios-ade-kd-vs-elsner-knx-matter-server-nen-chon-bridge-knx-sang-matter-nao.html"
    slug: "atios-ade-kd-vs-elsner-knx-matter-server-nen-chon-bridge-knx-sang-matter-nao"
    anchor: "Atios ADE-KD vs Elsner KNX Matter Server Nên Chọn Bridge KNX Sang Matter Nào"
    position: 3
  - url: "https://knxstore.vn/giai-phap-dieu-khien-khach-san-thong-minh-voi-kts-box3.html"
    slug: "giai-phap-dieu-khien-khach-san-thong-minh-voi-kts-box3"
    anchor: "Giải Pháp Điều Khiển Khách Sạn Thông Minh Với KTS-BOX3"
    position: 4
---

# Line Segment Và Line Coupler Trong KNX: Chia Line Thế Nào

> Phân biệt Line Segment và Line Coupler trong KNX: giới hạn 64 thiết bị, repeater, filter table, tải bus. Cách chia line từ biệt thự đến tòa nhà 20 tầng.

## Article Body

Cấu trúc địa chỉ Area.Line.Device và vị trí của Line Segment
Địa chỉ vật lý KNX gồm 16 bit chia thành ba phần: Area (4 bit), Line (4 bit) và Device (8 bit), viết dạng 1.1.5. Line Segment không phải một cấp địa chỉ thứ tư. Đây là cách chia vật lý bên trong một Line, và thiết bị trên các segment vẫn dùng chung dải địa chỉ x.y.z của line đó.
Area, Main line, Line: ai nối với ai
Cấp
Địa chỉ
Nối cái gì
Backbone line
0.0.x
Các Area với nhau
Backbone coupler (Area coupler)
x.0.0
Backbone với main line của Area x
Main line
x.0.y
Các Line trong Area x
Line coupler
x.y.0
Main line với Line y
Line
x.y.z
Thiết bị bus, tối đa 4 segment khi dùng repeater
Main line là Line 0 của mỗi Area, nên nó thuộc về Area đó. Thứ nối các Area với nhau là backbone line 0.0. Hai khái niệm này hay bị gộp làm một, và bảng thuật ngữ bên dưới giải thích vì sao.
Một khái niệm, nhiều tên gọi
Tài liệu của các hãng gọi cùng một thứ bằng nhiều tên khác nhau:
Tên bạn có thể gặp
Nghĩa trong KNX
Region, Area, Bereich
Area (số đầu của địa chỉ)
Regional coupler, Area coupler, Backbone coupler, BC
Coupler ở x.0.0
Area line, Backbone
Đường 0.0.x nối các Area
Main line
Line 0 của mỗi Area, x.0.y
Line coupler, LC
Coupler ở x.y.0
Line repeater, Repeater
Thiết bị nối các segment trong cùng một line
Quy tắc đặt địa chỉ cần nhớ
Địa chỉ x.y.0 dành cho coupler, thiết bị thường dùng x.y.1 trở lên. Địa chỉ 0.0.0 không dùng. Địa chỉ 15.15.255 là địa chỉ mặc định của thiết bị chưa nạp, nên không gán cho thiết bị thật, vì khi thay thiết bị mới chưa nạp bạn sẽ bị trùng địa chỉ.
Line Segment: nối dài một line bằng Line Repeater
Line Segment là gì? Line Segment là một đoạn bus KNX TP có nguồn riêng, nối với đoạn khác trong cùng một line qua Line Repeater. Repeater khuếch đại và chuyển tiếp mọi telegram, không lọc, nên các segment của một line hoạt động như một đường bus duy nhất về mặt logic.
Giới hạn: 64 chỗ mỗi segment, 4 segment mỗi line
Mỗi segment có tối đa 64 chỗ, tính cả coupler và repeater đấu vào nó. Một line dùng 3 repeater sẽ có 4 segment. Bảng đếm chỗ cho một line có Line Coupler ở trên và 3 repeater:
Segment
64 chỗ gồm
Thiết bị thường tối đa
1
Line coupler + 3 repeater
60
2
1 repeater
63
3
1 repeater
63
4
1 repeater
63
Tổng
249 thiết bị, cộng 3 repeater và 1 coupler, tức 253 địa chỉ
Con số 60 ở segment 1 hay bị bỏ qua khi lập bảng dự toán. Nếu coupler và 3 repeater cùng đấu vào segment 1, chúng chiếm 4 trong 64 chỗ. Không có line coupler phía trên thì segment 1 còn 61 thiết bị.
Repeater đấu song song từ segment 1, không đấu nối tiếp (repeater sau repeater). Cách đánh địa chỉ x.y.64, x.y.128, x.y.192 cho repeater chỉ là quy ước để đánh dấu đầu dải mỗi segment. Địa chỉ không quyết định thiết bị nằm trên segment nào về điện.
Nguồn và dây: mỗi segment một PSU
Một repeater gồm hai nửa cách ly điện. Nửa Main lấy nguồn từ segment phía trên, nửa Sub lấy nguồn từ segment phía dưới. Repeater chỉ truyền dữ liệu, không truyền nguồn. Vì vậy mỗi segment cần một nguồn KNX kèm choke riêng, và không được nối chung đầu ra của hai nguồn.
Giới hạn dây của mỗi segment theo chuẩn KNX TP: tổng chiều dài dây không quá 1.000 m, từ nguồn đến thiết bị xa nhất không quá 350 m, giữa hai thiết bị bất kỳ không quá 700 m.
Về dòng, cộng dòng thực tế của từng thiết bị theo datasheet rồi so với định mức nguồn. Khuyến nghị thiết kế của chúng tôi là giữ tổng ở khoảng 70 đến 80% định mức. Với nguồn 640 mA, đó là khoảng 450 đến 510 mA. Segment 1 có repeater còn phải cộng thêm dòng nửa Main của từng repeater, nên thực tế nên để khoảng 50 đến 55 thiết bị chứ không dùng hết 60.
Repeater không lọc, Segment Coupler có lọc
Repeater là profile cũ của KNX, thường tích hợp trong line coupler TP/TP. KNX Association hiện có profile Segment Coupler: vẫn nối dài một line với địa chỉ x.y.z, nhưng có filter table. Khác biệt thực tế:
Tiêu chí
Repeater
Segment Coupler
Lọc telegram
Không, chuyển tiếp tất cả
Có, chỉ chuyển telegram liên quan
Tải bus
Mọi segment chịu chung tải của cả line
Thấp hơn
Phù hợp
Hệ cũ, trường hợp đặc biệt
Hệ mới, ưu tiên khi có thể
Nhiều line coupler TP/TP đời cũ chỉ có hai chế độ: Area/Line coupler và Repeater, không có Segment Coupler. Kanonbus KTELC là một ví dụ: trong ETS bạn chọn Function as là Area/line coupler hoặc Repeater. Điều này không làm KTELC kém đi cho dự án vừa, nhưng cần biết trước khi cam kết với tư vấn rằng "segment có lọc".
Line Coupler: tách line để tách tải
Line Coupler là gì? Line Coupler là thiết bị nối main line với một line, có cách ly điện và filter table. Nó chỉ cho telegram đi qua khi group address của telegram đó có thiết bị nhận ở phía bên kia. Nhờ vậy lưu lượng của mỗi line được giữ trong line đó.
Filter table do ETS sinh
Filter table là ma trận bit trong bộ nhớ coupler, một bit cho một group address. Bit bằng 1 thì telegram được chuyển sang line kia, bằng 0 thì bị bỏ. ETS tự sinh bảng này khi project có đủ thiết bị gửi và thiết bị nhận, rồi nạp xuống coupler cùng lúc download.
Lỗi hay gặp nhất khi vận hành là sửa group address rồi quên download lại coupler. Hai thiết bị ở hai line khác nhau, cùng một group address, nhưng lệnh không qua. Checklist nhanh: object của hai thiết bị đã cùng group address chưa, đã download lại cả hai coupler chưa, tab chiều đi có để Block không, và dùng Group Monitor trên main line để xác định lệnh dừng ở chiều nào.
Với thiết bị ngoài ETS như visualization, gateway hay server logic, ETS không biết chúng cần group address nào. Cách sạch nhất là tạo một dummy application trên line nơi client kết nối, link mọi group address client dùng, rồi để ETS tự tính filter table.
Lưu ý nhỏ: nhiều coupler không mở rộng filter table cho main group 16 đến 31, ETS sẽ cảnh báo. Dự án lớn nên ưu tiên main group 0 đến 15, hoặc hỏi hãng về extended filter table trước khi chọn coupler.
Thiết lập coupler khuyến nghị
Loại telegram
Khuyến nghị
Group telegram
Filter
Physical addressed telegram
Route (Block thì không lập trình qua coupler được)
Broadcast
Route
Repetition khi lỗi
Normal
Đừng bàn giao với coupler ở chế độ Route all. Telegram tràn sang line không có thiết bị nhận sẽ không được ACK, và coupler lặp lại thêm 3 lần. Theo tài liệu KNX Association, một line đang ở 70% tải mà có hai line cùng Route all thì tải lý thuyết vượt xa 100%, thực tế mất telegram và trễ. Route all chỉ dùng cho test ngắn có kiểm soát.
Tải bus: con số quyết định chọn cách nào
KNX TP chạy 9,6 kbit/s, mỗi lúc một telegram. Một group telegram ngắn, tính cả khoảng nghỉ và ACK, chiếm khoảng 20 ms, tức khoảng 40 đến 50 telegram mỗi giây trên một line.
Lấy ví dụ 240 thiết bị, mỗi thiết bị gửi trung bình 1 telegram mỗi 10 giây, tổng 24 telegram mỗi giây. Nếu gom tất cả vào một line bốn segment bằng repeater, bus chịu khoảng 50% tải. Nếu chia thành 4 line qua line coupler có lọc, mỗi line chỉ khoảng 12% tải. Nguồn telegram thường không phải lệnh người dùng, mà là cảm biến gửi định kỳ, status feedback, dimming và nhất là visualization polling. Giảm polling đôi khi hiệu quả hơn thêm coupler.
Các hàm thời gian thực như dimming hay presence điều khiển đèn không nên đi xuyên nhiều line. Mỗi coupler cộng thêm vài phần mười giây.
Chọn Line Segment, Line Coupler TP hay Line Coupler IP
Câu trả lời ngắn: Segment khi cùng một khu chức năng mà thiếu chỗ hoặc dây quá dài. Coupler khi có nhiều khu riêng cần tách tải. TP khi chỉ có vài line và ngân sách thấp, IP khi dự án lớn hoặc có visualization và BMS.
Line Segment
Line Coupler TP/TP
Line Coupler IP
Bản chất
Nối dài một line
Tách line, main line là TP
Tách line, main line là LAN
Thiết bị
Repeater hoặc Segment Coupler
Coupler TP
KNX IP Router
Địa chỉ
x.y.64, x.y.128... (quy ước)
x.y.0 và x.0.0
x.y.0
Lọc telegram
Repeater: không
Có
Có
Phù hợp
Biệt thự, sàn rộng, xưởng dài, ngoài trời
3 đến 8 line, ít telegram xuyên line
Cao tầng, khách sạn, văn phòng có BMS
Không có "repeater IP" theo chuẩn. IP router luôn là coupler ở x.y.0, nghĩa là tạo ra một line mới. Muốn thêm thiết bị cùng khu thì dùng repeater TP, muốn thêm khu ở xa có LAN thì thêm một IP router.
Khi nào Line Segment là lựa chọn đúng
Segment hợp lý khi một khu chức năng vượt 64 thiết bị mà bạn không muốn đổi địa chỉ, khi dây một segment vượt 1.000 m (nhà xưởng, hầm xe, chiếu sáng cảnh quan), khi line có nhiều màn hình cảm ứng hoặc keypad LED ngốn dòng, hoặc khi cần cách ly điện một phần cho dây ngoài trời, nhà phụ, cổng để hạn chế sét lan truyền và chập do ẩm. Mở rộng hệ đang chạy cũng là một lý do: thêm áp mái hay khu mới mà không đụng filter table của line khác.
Không dùng segment khi lưu lượng đã cao, khi cần phân vùng quản lý hay bảo mật, khi cần trên 4 segment, hoặc trên main line và backbone (repeater không được đặt ở đó). Trường hợp đó, tách line.
Khi nào chọn Coupler TP, khi nào chọn IP Router
Coupler TP đủ dùng khi topology gọn, toàn bộ hạ tầng là TP và không cần lập trình ETS qua mạng. IP Router cần khi backbone dài, nhiều line, lưu lượng giữa các line cao, hoặc kỹ sư muốn nạp chương trình từ xa qua LAN. Chi tiết khác biệt giữa router và interface xem bài
KNX IP Interface và IP Router khác nhau thế nào
.
Cần nhớ hai điều với backbone IP. Thứ nhất, LAN nhanh nhưng line TP đích vẫn chạy 9,6 kbit/s. Thứ hai, router dùng multicast 224.0.23.12 (port 3671), nên switch phải có IGMP snooping và querier, nếu không multicast tràn khắp mạng.
Các thiết bị thường dùng trong topology này gồm line coupler TP có chế độ repeater, IP router của Kanonbus và Legrand, và nguồn KNX cho từng line hay segment:
KTELC lấy nguồn từ bus (nửa Main tối đa 15 mA, nửa Sub 3 mA), nên không cần nguồn phụ, nhưng cần tính vào tải của PSU. KTEIPC dùng nguồn ngoài 9 đến 30 V DC, cấu hình qua web và lọc telegram theo main group, nên group address phải chia theo khu ngay từ đầu.
Hai ví dụ chia line
Biệt thự 3 tầng, 120 thiết bị: dùng Line Segment
Một line đủ 64 chỗ không chứa nổi 120 thiết bị. Giữ nguyên Line 1.1, chia thành 2 segment: segment 1 cho nhà chính, segment 2 cho tầng 3 và sân vườn. Cần một repeater đặt ở địa chỉ 1.1.64 và thêm một nguồn KNX cho segment 2. Không cần IP router, không cần thêm line trong ETS, và toàn bộ 120 thiết bị vẫn nằm trong line 1.1.
Với quy mô này, tải bus thường thấp. Telegram trong nhà ở ít, cảm biến không gửi dày. Đây là chỗ repeater đơn giản và rẻ nhất.
Tòa 20 tầng, mỗi tầng 10 phòng: dùng IP Router theo tầng
Giả sử văn phòng hoặc khách sạn, mỗi phòng có keypad, presence và thermostat, cộng actuator và gateway DALI ở tủ tầng, khoảng 45 đến 50 thiết bị mỗi tầng. Một line cho mỗi tầng, nối lên backbone IP bằng một IP router ở địa chỉ x.y.0:
Area 1: tầng 1 đến 10, Line 1.1 đến 1.10, còn 1.11 đến 1.15 để dự phòng.
Area 2: tầng 11 đến 20, Line 2.1 đến 2.10.
Area 3: hầm, mái và khu kỹ thuật, line 3.x riêng với PSU và IP router riêng.
Tổng cộng khoảng 22 đến 23 IP router, 22 đến 23 nguồn KNX và khoảng 1.050 thiết bị. Chia bằng segment cho cả tòa là sai hướng: một line chỉ chứa tối đa 253 địa chỉ, repeater không lọc, và không đặt được trên main line.
Chia group address theo main group là tầng, middle group là chức năng, sub group là phòng hoặc kênh. Dự án 20 tầng sẽ cần main group trên 15, nên chọn router hỗ trợ extended filter table hoặc lọc theo từng group address. Kênh lệnh trung tâm như All Off nên có main group riêng.
Tòa nhà này cũng cần một IP interface hoặc cổng lập trình ETS trong tủ trung tâm, đặt VLAN riêng cho KNX, và bật KNX IP Secure nếu thiết bị hỗ trợ. Đội thi công nên nạp physical address tại tủ, còn kỹ sư nạp application qua LAN, vì ETS dùng telegram physical addressed để đi qua router theo địa chỉ line mà không phụ thuộc filter table.
Sai lầm hay gặp khi chia line
Quên download lại coupler sau khi đổi group address. Lệnh bị chặn dù thiết bị đúng, và đây là lỗi hay gặp nhất khi vận hành.
Dùng repeater nối tiếp. Repeater phải đấu song song từ segment 1. Nối tiếp phá cấu trúc topology và vượt giới hạn 4 segment.
Thiếu nguồn cho segment hoặc line mới thêm. Segment mới thêm không có PSU thì LED phía Sub của repeater không sáng, và đội thi công thường mất cả buổi dò dây trước khi nhận ra.
Để coupler ở Route all khi bàn giao. Hệ vẫn chạy khi ít người dùng, rồi nghẽn khi có nhiều thiết bị và nhiều telegram định kỳ.
Đặt group address không theo khu. Telegram buộc phải đi xuyên nhiều line, filter table gần như vô dụng và coupler chỉ còn tác dụng cách ly điện.
Dùng hết chỗ trên segment. Chừa khoảng 20% số chỗ và dòng nguồn để mở rộng sau này, nhất là segment 1 có repeater.
Kết luận
Line Segment mở rộng một line mà không lọc, hợp cho cùng một khu thiếu chỗ hoặc dây dài. Line Coupler tách line có lọc, hợp cho nhiều khu cần tách tải. Hệ KNX lớn gần như luôn kết hợp cả hai: line coupler IP cho từng tầng hoặc khu, và repeater ở vài line đặc biệt. Quyết định chia line đúng từ đầu rẻ hơn rất nhiều so với chia lại sau khi đã đấu dây và nạp xong ETS.
Cần tư vấn giải pháp cho công trình của bạn?
KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
Line Segment và Line Coupler khác nhau ở điểm nào?
Line Segment nối dài một line bằng repeater, nên mọi telegram trong line đi qua tất cả segment và địa chỉ vẫn là x.y.z của cùng một line. Line Coupler tách một line riêng với địa chỉ x.y.0, có cách ly điện và filter table nên chỉ chuyển telegram liên quan.

Một line KNX TP có tối đa bao nhiêu thiết bị?
Tối đa 4 segment, mỗi segment 64 chỗ tính cả coupler và repeater. Với một line có line coupler và 3 repeater, còn khoảng 249 thiết bị thường. Khuyến nghị thiết kế là giữ dưới 50 thiết bị mỗi line để chừa 20% dự phòng.

Mỗi segment có cần nguồn KNX riêng không?
Có. Repeater chỉ truyền dữ liệu, không truyền nguồn. Mỗi segment cần một nguồn KNX kèm choke riêng, và không được nối chung đầu ra của hai nguồn.

Có repeater IP không?
Không có repeater IP theo chuẩn. IP router luôn là coupler ở địa chỉ x.y.0 và tạo ra một line mới. Muốn mở rộng cùng một line thì dùng repeater TP.

Một thiết bị ở line 1.1 điều khiển được thiết bị ở line 2.3 không?
Được, miễn là hai thiết bị cùng group address và các coupler trên đường đi đều cho telegram qua. Nếu ETS đã đưa group address vào filter table và bạn download lại các coupler liên quan, telegram sẽ đi. Nếu quên download, lệnh sẽ bị chặn.

Nên chọn Line Segment hay Line Coupler cho nhà ở?
Nhà ở dưới 64 thiết bị chỉ cần một line. Nhà 80 đến 150 thiết bị thường dùng Line Segment vì lưu lượng thấp và chi phí gọn. Nhà nhiều khu, nhiều chức năng độc lập hoặc có visualization thì tách line bằng Line Coupler để tách tải.

## Raw MCP

```json
{
  "slug": "line-segment-va-line-coupler-trong-knx-chia-line-the-nao",
  "title": "Line Segment Và Line Coupler Trong KNX: Chia Line Thế Nào",
  "excerpt": "Line đã đủ 64 thiết bị mà khách vừa yêu cầu thêm 20 điểm nữa. Bạn nối thêm một Line Segment bằng repeater, hay tách hẳn một line mới bằng Line Coupler? Cả hai đều mở rộng được hệ KNX TP, nhưng khác nhau ở điểm quan trọng nhất: telegram có bị lọc hay không.",
  "coverImage": "/media/43727b1cf9c7bdc4d6b884b3b550e8b2d1088555c765441b6881bba2d049ae00.avif",
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
  "publishedAt": "2026-11-02T06:13:00.000Z",
  "categories": [
    {
      "slug": "knx",
      "name": "KNX"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Line Segment Và Line Coupler Trong KNX: Chia Line Thế Nào",
  "seoDescription": "Phân biệt Line Segment và Line Coupler trong KNX: giới hạn 64 thiết bị, repeater, filter table, tải bus. Cách chia line từ biệt thự đến tòa nhà 20 tầng.",
  "faqs": [
    {
      "question": "Line Segment và Line Coupler khác nhau ở điểm nào?",
      "answer": "Line Segment nối dài một line bằng repeater, nên mọi telegram trong line đi qua tất cả segment và địa chỉ vẫn là x.y.z của cùng một line. Line Coupler tách một line riêng với địa chỉ x.y.0, có cách ly điện và filter table nên chỉ chuyển telegram liên quan.",
      "position": 0
    },
    {
      "question": "Một line KNX TP có tối đa bao nhiêu thiết bị?",
      "answer": "Tối đa 4 segment, mỗi segment 64 chỗ tính cả coupler và repeater. Với một line có line coupler và 3 repeater, còn khoảng 249 thiết bị thường. Khuyến nghị thiết kế là giữ dưới 50 thiết bị mỗi line để chừa 20% dự phòng.",
      "position": 1
    },
    {
      "question": "Mỗi segment có cần nguồn KNX riêng không?",
      "answer": "Có. Repeater chỉ truyền dữ liệu, không truyền nguồn. Mỗi segment cần một nguồn KNX kèm choke riêng, và không được nối chung đầu ra của hai nguồn.",
      "position": 2
    },
    {
      "question": "Có repeater IP không?",
      "answer": "Không có repeater IP theo chuẩn. IP router luôn là coupler ở địa chỉ x.y.0 và tạo ra một line mới. Muốn mở rộng cùng một line thì dùng repeater TP.",
      "position": 3
    },
    {
      "question": "Một thiết bị ở line 1.1 điều khiển được thiết bị ở line 2.3 không?",
      "answer": "Được, miễn là hai thiết bị cùng group address và các coupler trên đường đi đều cho telegram qua. Nếu ETS đã đưa group address vào filter table và bạn download lại các coupler liên quan, telegram sẽ đi. Nếu quên download, lệnh sẽ bị chặn.",
      "position": 4
    },
    {
      "question": "Nên chọn Line Segment hay Line Coupler cho nhà ở?",
      "answer": "Nhà ở dưới 64 thiết bị chỉ cần một line. Nhà 80 đến 150 thiết bị thường dùng Line Segment vì lưu lượng thấp và chi phí gọn. Nhà nhiều khu, nhiều chức năng độc lập hoặc có visualization thì tách line bằng Line Coupler để tách tải.",
      "position": 5
    }
  ],
  "editedAt": "2026-11-02T06:22:04.706Z",
  "url": "https://knxstore.vn/line-segment-va-line-coupler-trong-knx-chia-line-the-nao.html"
}
```
