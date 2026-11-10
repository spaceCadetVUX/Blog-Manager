---
url: "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html"
headline: "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus"
description: "Cấu trúc group address chuẩn của KTS0-DALI, vì sao không cần cấu hình ETS phức tạp, và cách gán địa chỉ DALI qua bộ host trung gian."
title: "KTS0-DALI: Cấu Trúc Group Address Và Cách Cấu Hình Qua HOST Webpage"
image: "https://knxstore.vn/media/92068d46df99838ee9ded70e5a096914ecedd71859d9809c6df64031156f79ab.jpg"
datePublished: "2026-08-04T02:57:22.000Z"
dateModified: "2026-08-04T02:57:22.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Chiếu sáng"
word_count: 2751
keywords: ["Chiếu sáng"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Chiếu sáng"
    url: "https://knxstore.vn/blogs/chieu-sang"
  - name: "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus"
    url: "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html"
products: [{"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-knx-dali-gateway-kts0-dali", "name": "Bộ điều khiển KNX DALI gateway Kanonbus - KTS0-DALI"}, {"url": "https://knxstore.vn/products/bo-dieu-khien-knx-host-kanonbus-kts-box3", "name": "Bộ điều khiển KNX host Kanonbus - KTS-BOX3"}, {"url": "https://knxstore.vn/products/kanonbus-bo-dieu-khien-knx-host-kts-d3", "name": "Bộ điều khiển KNX host đa năng Kanonbus - KTS-D1, D2, D3"}, {"url": "https://knxstore.vn/products/lunatone-bo-giao-tiep-chuan-dali-usb", "name": "Bộ giao tiếp USB DALI Lunatone - DALI USB"}, {"url": "https://knxstore.vn/products/lunatone-bo-giao-tiep-tieu-chuan-dali-usb-30ma", "name": "Bộ giao tiếp USB DALI-2 30mA Lunatone - DALI-2 USB 30mA"}]
internal_links:
  - url: "https://knxstore.vn/he-thong-ung-dung-knx.html"
    slug: "he-thong-ung-dung-knx"
    anchor: "hệ thống KNX"
  - url: "https://knxstore.vn/gateway-kba-kanonbus-ket-noi-rs485-knx-vao-bms-toa-nha.html"
    slug: "gateway-kba-kanonbus-ket-noi-rs485-knx-vao-bms-toa-nha"
    anchor: "gateway KBA Kanonbus"
  - url: "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
    slug: "huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx"
    anchor: "ABB qua bài hướng dẫn cấu hình DALI Gateway ABB KNX"
  - url: "https://knxstore.vn/giai-phap-chieu-sang-knx-giao-thuc-kien-truc-ung-dung.html"
    slug: "giai-phap-chieu-sang-knx-giao-thuc-kien-truc-ung-dung"
    anchor: "kiến trúc hệ thống chiếu sáng KNX tổng thể"
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

# Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus

> Cấu trúc group address chuẩn của KTS0-DALI, vì sao không cần cấu hình ETS phức tạp, và cách gán địa chỉ DALI qua bộ host trung gian.

## Article Body

KTS0-DALI là gateway của Kanonbus cho phép một đường KNX TP điều khiển trực tiếp một line DALI, thay vì phải kéo riêng một bộ điều khiển DALI độc lập rồi tích hợp ngược lại vào KNX qua actuator trung gian. Với các dự án có cả công tắc/cảm biến KNX và đèn DALI trên cùng một tầng (khách sạn, văn phòng, showroom), gateway này giúp gọn tủ điện và giảm số line bus phải kéo. Điểm khác với nhiều gateway DALI-KNX khác trên thị trường: KTS0-DALI dùng một cấu trúc group address gần như cố định theo mặc định của Kanonbus, nên không cần thiết kế lại toàn bộ scheme mỗi lần triển khai như một số dòng gateway yêu cầu cấu hình ETS sâu.
KTS0-DALI đóng vai trò gì trong hệ thống KNX-DALI
KTS0-DALI là gateway hai chiều: nhận telegram từ KNX TP (dimming, switching, scene) và chuyển thành lệnh DALI (IEC 62386) cho ballast/driver, đồng thời đọc trạng thái, lỗi ballast, giá trị cảm biến từ line DALI để phản hồi lại lên KNX.
Điểm cần lưu ý khi thiết kế: một cổng DALI trên KTS0-DALI có giới hạn số driver theo chuẩn DALI (tối đa 64 địa chỉ ngắn mỗi line DALI theo IEC 62386). Nếu dự án có nhiều hơn một line DALI trên cùng tầng, cần tính số cổng gateway tương ứng ngay từ bước thiết kế sơ đồ tủ điện, không đợi đến lúc thi công mới phát hiện thiếu cổng. Số cổng DALI thực tế trên mỗi KTS0-DALI cần đối chiếu datasheet theo từng phiên bản trước khi báo cho khách hàng dự án lớn.
Vì sao KTS0-DALI không cần phụ thuộc quá nhiều vào cấu hình ETS
Khác với suy nghĩ thường gặp khi làm việc với gateway DALI-KNX, KTS0-DALI không đòi hỏi kỹ sư thiết kế lại toàn bộ group address từ đầu cho mỗi dự án. Kanonbus đã định nghĩa sẵn một cấu trúc group address chuẩn theo main group mặc định là 7, với các middle group tương ứng cố định cho từng chức năng (switch, dimming, color temperature, RGB...). Việc của kỹ sư khi commissioning chủ yếu là liên kết đúng group address theo bảng chuẩn này với thiết bị điều khiển (công tắc, cảm biến, màn hình cảnh) trong ETS, không phải tự vẽ lại toàn bộ sơ đồ datapoint như với một số gateway khác yêu cầu định nghĩa từng object riêng.
Main group 7 vẫn có thể đổi qua ETS bằng cách sửa digit đầu của group address (dải 0-31) nếu dự án cần main group khác để tránh trùng với cấu trúc group address đang dùng cho các hệ khác trong tòa nhà.
Cấu trúc Group Address chuẩn của KTS0-DALI
Đây là bảng group address gốc theo chuẩn Kanonbus, dùng để tra khi lập trình ETS hoặc khi cần đối chiếu địa chỉ đang gán có đúng chức năng không:
Main group mặc định của toàn bộ bảng trên là 7. Khi kết hợp với KTS main controller có chức năng App, việc gộp nhóm (grouping) có thể thực hiện với group number từ 0 đến 15, không bị bó cứng vào đúng các mốc 200-215 nêu trên.
Giá trị System command tại địa chỉ 250 (Middle group 7) nhận 4 lệnh: 0 để ngắt tiến trình dò địa chỉ hiện tại, 1 để cấp lại địa chỉ hoàn toàn mới cho toàn line, 2 để mở rộng phân bổ địa chỉ khi thêm driver mới vào line đang chạy, 3 để truy vấn danh sách địa chỉ DALI hiện đang được cấp. Đây chính là cơ chế gán địa chỉ DALI thực tế, không phải qua phần mềm bên thứ ba.
Gán địa chỉ DALI phải qua bộ KNX host trung gian
Đây là điểm dễ hiểu nhầm nhất khi làm việc với KTS0-DALI: bản thân gateway này không có giao diện riêng để tự quét địa chỉ DALI trên line của nó. Việc dò và gán địa chỉ DALI thực hiện qua trang quản lý web tích hợp sẵn trên bộ KNX host đóng vai trò trung gian, ví dụ KTS-D3 hoặc KTS-BOX3, không phải trên một IP riêng của KTS0-DALI.
Vì vậy, một hệ thống dùng KTS0-DALI luôn cần tối thiểu một bộ host trong sơ đồ, không thể triển khai KTS0-DALI như một thiết bị đứng độc lập rồi tính sau. Khi lên BOQ cho dự án có KTS0-DALI, cần đưa bộ host vào ngay từ đầu, không phải hạng mục tùy chọn thêm sau:
Quy trình gán địa chỉ thực tế trên web quản lý của host
Truy cập trang quản lý web của bộ host (ví dụ KTS-D3) bằng địa chỉ IP của chính host đó, không phải IP của KTS0-DALI. Trong menu bên trái, mục System có "DALI Config", vào đây để thao tác với các gateway DALI đang gắn vào host.
Nếu là lần đầu khai báo, dùng "Add Gateway" ở thanh trên, nhập Name (đặt tên gợi nhớ, ví dụ "KTS0 DALI") và FirstAddr, trường FirstAddr này phải khớp đúng với Group Address (Main) đã đặt trong ETS cho KTS0-DALI đó (mặc định là 7). Nhập sai FirstAddr, host sẽ không nhận diện đúng gateway để gửi lệnh xuống.
Sau khi thêm, vào trang riêng của gateway đó, có 3 tab Address, Groups, Scenes, và 4 nút thao tác ở dưới:
New allocation: dùng lần đầu tiên hoặc khi cần ghi lại toàn bộ địa chỉ DALI trên line, tương ứng lệnh System command giá trị 1 (cấp lại địa chỉ hoàn toàn mới) trong bảng group address ở trên. Hệ thống hiện dialog cảnh báo rõ "Used for the first time or when rewriting all Dali addresses" trước khi xác nhận, vì hành động này ghi đè toàn bộ địa chỉ hiện có.
Expand allocation: dùng khi thêm driver mới vào line đã có sẵn thiết bị đang chạy, tương ứng giá trị 2 (mở rộng phân bổ), không ảnh hưởng địa chỉ các driver cũ.
Address search: quét lại và hiển thị các địa chỉ DALI hiện đang được cấp, tương ứng giá trị 3 (truy vấn).
Clear All: xóa toàn bộ địa chỉ đã gán trên line, dùng khi cần làm lại từ đầu
Sau khi bấm New allocation và xác nhận, trang hiển thị danh sách ECG (Electronic Control Gear, tức driver/ballast DALI) tìm được, ví dụ "ECG (Total device:1)" kèm icon đèn đổi màu theo trạng thái (xanh là đang bật).
Click vào từng ECG để mở dialog gán Addr, Name, và Group (0~15) cho thiết bị đó, cùng các nút OK để lưu, Scene để gán vào kịch bản, AddrMod để đổi lại địa chỉ nếu cần.
Nếu dự án chưa có bộ host: gán địa chỉ bằng bộ giao tiếp USB DALI
Với dự án chưa lắp bộ host (ví dụ mới đi dây phần chiếu sáng DALI trước, phần KNX host để sau, hoặc công trình nhỏ không có nhu cầu dùng host), vẫn có thể gán địa chỉ và group DALI độc lập bằng một bộ giao tiếp USB DALI cắm vào máy tính, dùng phần mềm dò địa chỉ đi kèm để quét line, gán short address và group cho từng driver theo đúng quy hoạch group đã định (0~15, khớp với cấu trúc group address KNX ở bảng trên):
Sau khi gán xong bằng USB DALI, ngắt bộ giao tiếp ra và đấu lại dây tín hiệu DALI vào KTS0-DALI để đưa vào vận hành như bình thường. KTS0-DALI đọc được cả địa chỉ ngắn và group đã gán sẵn trên line (gateway hiểu cấu trúc DALI group, không chỉ short address), nên không cần phải gán lại lần nữa qua host. Khi nào dự án bổ sung host sau, host vẫn nhận diện đúng các group đã gán từ trước, không cần New allocation lại từ đầu.
Cấu hình qua ETS: những gì thực sự cần làm
Vì cấu trúc group address đã có sẵn theo bảng chuẩn, việc cấu hình ETS cho KTS0-DALI chủ yếu gồm ba bước: nhập thiết bị vào dự án và tải địa chỉ vật lý, liên kết group address chuẩn (theo bảng ở trên) với các thiết bị điều khiển tương ứng, và thiết lập tham số vận hành ở trang "Dali Gateway > General". Không cần định nghĩa lại datapoint hay tự đặt group address từ số 0 như khi làm việc với thiết bị chưa có chuẩn sẵn.
Trang tham số General trong ETS của KTS0-DALI gồm các mục sau:
Tham số
Giá trị/tùy chọn
Ghi chú
Group Address (Main)
Số nguyên, mặc định 7
Đúng như bảng group address chuẩn ở trên
Pause between two DALI-Query (s)
Số giây, mặc định 2
Thời gian nghỉ giữa hai lần truy vấn trạng thái DALI liên tiếp
Switch-on brightness
brightness before last off (và các tùy chọn khác)
Độ sáng khi bật lại đèn, mặc định lấy theo độ sáng trước lúc tắt gần nhất
Fade-time for relative dimming (0-100%)
default setting from ECG (và các tùy chọn khác)
Tốc độ chuyển độ sáng khi dimming tương đối
Fade-time for ECG switching/brightness
default setting from ECG
Tốc độ chuyển khi bật/tắt hoặc đổi độ sáng tuyệt đối
Fade-time for Group switching
Immediately / same as ECG switching
Tốc độ chuyển khi điều khiển theo nhóm
Minimal brightness value
default setting from ECG
Độ sáng tối thiểu cho phép
Maximum brightness value
default setting from ECG
Độ sáng tối đa cho phép
Dimming curve
default setting from ECG
Đường cong điều chỉnh độ sáng
ECG Power On Level
keep unchanged (và các tùy chọn khác)
Trạng thái ECG khi cấp nguồn lại
ECG System Failure
keep unchanged
Hành xử của ECG khi hệ thống lỗi
ECG Color-Temp. when System Failure/recovery
None (và các tùy chọn khác)
Màu nhiệt độ áp dụng khi lỗi hệ thống hoặc khi phục hồi
Phần lớn tham số mặc định lấy theo cấu hình gốc của ECG (electronic control gear, tức driver/ballast DALI), nghĩa là nếu driver đã được nhà sản xuất cấu hình sẵn hợp lý, kỹ sư thường không cần đổi các mục "default setting from ECG" này, chỉ cần chỉnh khi dự án có yêu cầu riêng (ví dụ giới hạn độ sáng tối đa để tiết kiệm điện, hoặc quy định màu nhiệt độ cố định khi mất kết nối).
Đây là trang tham số "General" áp dụng chung cho cả gateway. ETS còn ít nhất một trang tham số khác bên dưới General trong cây cấu hình (theo cấu trúc menu của thiết bị), nhiều khả năng là tham số theo từng kênh/nhóm DALI cụ thể, cần Tùng hoặc Huy cung cấp thêm ảnh chụp trang đó để bổ sung đầy đủ, hiện bài chỉ phản ánh đúng phần đã xác nhận.
Nhấn nút lập trình trên thiết bị để ETS tải địa chỉ vật lý xuống, đèn LED đỏ trên gateway sẽ tắt khi tải xong, đây là dấu hiệu xác nhận trực quan duy nhất ở bước này. Nếu chỉ đổi tham số vận hành sau này, chỉ cần tải lại ứng dụng, không cần tải địa chỉ vật lý lần nữa.
Vận hành và giám sát hàng ngày
Sau khi đã gán địa chỉ xong, việc giám sát vận hành hàng ngày (bật/tắt, theo dõi trạng thái driver) có thể thực hiện ngay trên tab Address của trang quản lý web host, không cần mở lại ETS mỗi lần. Icon đèn đổi màu theo trạng thái thực: xanh là đang bật, xám là đang tắt, đỏ là đèn lỗi. Đây là cách nhanh nhất để kỹ thuật viên bảo trì xác định driver hỏng mà không cần mở đèn kiểm tra thủ công. Dùng trình duyệt không dựa trên IE (Firefox hoặc Chrome) để truy cập, một số bản giao diện cũ trên IE hiển thị sai layout.
KTS0-DALI phù hợp với những hệ thống nào
KTS0-DALI phù hợp nhất với công trình có mật độ đèn DALI lớn trên cùng tầng và cần tích hợp chung vào
hệ thống KNX
đang vận hành ON/OFF, rèm, HVAC, với điều kiện bắt buộc là đã có bộ host trong sơ đồ. Với các dự án đã dùng
gateway KBA Kanonbus
để đưa RS485 vào BMS, KTS0-DALI đóng vai trò tương tự ở phía chiếu sáng, giúp cả tầng chạy trên một backbone KNX TP duy nhất thay vì rời rạc nhiều giao thức.
Với dự án đang cân nhắc giữa nhiều hãng gateway DALI-KNX, có thể đối chiếu thêm cách tiếp cận của
ABB qua bài hướng dẫn cấu hình DALI Gateway ABB KNX
để thấy sự khác biệt về quy trình commissioning giữa hai hãng, và tham khảo
kiến trúc hệ thống chiếu sáng KNX tổng thể
để xác định KTS0-DALI nên đứng ở vị trí nào trong sơ đồ tủ điện.
Kết Luận
Điểm quan trọng nhất cần nhớ khi thiết kế hệ thống dùng KTS0-DALI: gateway này không tự có giao diện quét địa chỉ DALI riêng, phải gán qua web quản lý của bộ host, hoặc bằng bộ giao tiếp USB DALI nếu dự án chưa lắp host. Cấu trúc group address đã có sẵn theo chuẩn giúp việc lập trình ETS nhẹ hơn nhiều gateway khác, và vì KTS0-DALI hiểu đúng cấu trúc DALI group, việc chọn phương án gán địa chỉ nào trước không ảnh hưởng đến khả năng nâng cấp hệ thống về sau.
Liên hệ ngay KNXStore để cập nhật những tài liệu và công nghệ chính xác nhất về thiết bị KNX
Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
Hotline:
0918.918.755
Email:
sales@knxstore.vn
KNXStore
KTS0-DALI có tự quét được địa chỉ DALI mà không cần thiết bị khác không?
Không. Việc dò và gán địa chỉ DALI thực hiện qua trang quản lý web của bộ KNX host trung gian như KTS-D3 hoặc KTS-BOX3 (mục System > DALI Config), không phải qua một giao diện riêng trên KTS0-DALI.

Add Gateway trên web host dùng để làm gì?
Đây là bước khai báo KTS0-DALI vào hệ thống quản lý của host trước khi gán địa chỉ, cần nhập Name và FirstAddr khớp với Group Address (Main) đã đặt trong ETS cho gateway đó.

New allocation và Expand allocation khác nhau thế nào?
New allocation ghi đè toàn bộ địa chỉ hiện có trên line, chỉ dùng lần đầu hoặc khi chấp nhận làm lại từ đầu. Expand allocation chỉ cấp địa chỉ cho driver mới thêm vào, giữ nguyên địa chỉ các driver đang chạy.

Vì sao main group mặc định của KTS0-DALI là 7?
Đây là quy ước mặc định của Kanonbus cho dòng KTS0-DALI, có thể đổi qua ETS bằng cách sửa digit đầu của group address (dải 0-31) nếu dự án cần tránh trùng với cấu trúc group address của hệ khác trong tòa nhà.

Có cần thiết kế lại toàn bộ group address cho mỗi dự án dùng KTS0-DALI không?
Không cần thiết kế lại từ đầu. Cấu trúc group address theo chức năng (switch, dimming, color temperature, RGB, fault, system command) đã được Kanonbus định nghĩa sẵn theo bảng chuẩn, việc của kỹ sư là liên kết đúng group address này với thiết bị điều khiển trong ETS.

KTS0-DALI điều khiển được tối đa bao nhiêu driver trên một cổng DALI?
Theo chuẩn DALI (IEC 62386), một line DALI hỗ trợ tối đa 64 địa chỉ ngắn, khớp với dải 1~64 trong bảng group address của KTS0-DALI. Số cổng DALI thực tế trên từng phiên bản KTS0-DALI cần đối chiếu datasheet trước khi báo cho khách hàng dự án lớn.

Khi thay driver DALI hỏng, có cần gán lại toàn bộ line không?
Không cần. Dùng Expand allocation trên web host (hoặc chức năng dò bổ sung tương tự trên phần mềm USB DALI nếu không có host) thay vì New allocation, các group address điều khiển đã thiết lập cho driver khác trên line vẫn giữ nguyên.

Đã gán địa chỉ bằng USB DALI rồi, sau này thêm host vào có phải làm lại không?
Không cần làm lại từ đầu. KTS0-DALI đọc đúng group đã gán sẵn trên line vì gateway hiểu cấu trúc DALI group, không chỉ short address. Khi thêm host, chỉ cần khai báo gateway qua Add Gateway rồi dùng Address search để đồng bộ danh sách hiện có, không cần New allocation.

## Raw MCP

```json
{
  "slug": "huong-dan-cau-hinh-kts0-dali",
  "title": "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus",
  "excerpt": "Cấu trúc group address chuẩn của KTS0-DALI, vì sao không cần cấu hình ETS phức tạp, và cách gán địa chỉ DALI qua bộ host trung gian.",
  "coverImage": "/media/92068d46df99838ee9ded70e5a096914ecedd71859d9809c6df64031156f79ab.jpg",
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
  "publishedAt": "2026-08-04T02:57:22.000Z",
  "categories": [
    {
      "slug": "chieu-sang",
      "name": "Chiếu sáng"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "KTS0-DALI: Cấu Trúc Group Address Và Cách Cấu Hình Qua HOST Webpage",
  "seoDescription": "Cấu trúc group address chuẩn của KTS0-DALI, vì sao không cần cấu hình ETS phức tạp, và cách gán địa chỉ DALI qua bộ host trung gian.",
  "faqs": [
    {
      "question": "KTS0-DALI có tự quét được địa chỉ DALI mà không cần thiết bị khác không?",
      "answer": "Không. Việc dò và gán địa chỉ DALI thực hiện qua trang quản lý web của bộ KNX host trung gian như KTS-D3 hoặc KTS-BOX3 (mục System > DALI Config), không phải qua một giao diện riêng trên KTS0-DALI.",
      "position": 0
    },
    {
      "question": "Add Gateway trên web host dùng để làm gì?",
      "answer": "Đây là bước khai báo KTS0-DALI vào hệ thống quản lý của host trước khi gán địa chỉ, cần nhập Name và FirstAddr khớp với Group Address (Main) đã đặt trong ETS cho gateway đó.",
      "position": 1
    },
    {
      "question": "New allocation và Expand allocation khác nhau thế nào?",
      "answer": "New allocation ghi đè toàn bộ địa chỉ hiện có trên line, chỉ dùng lần đầu hoặc khi chấp nhận làm lại từ đầu. Expand allocation chỉ cấp địa chỉ cho driver mới thêm vào, giữ nguyên địa chỉ các driver đang chạy.",
      "position": 2
    },
    {
      "question": "Vì sao main group mặc định của KTS0-DALI là 7?",
      "answer": "Đây là quy ước mặc định của Kanonbus cho dòng KTS0-DALI, có thể đổi qua ETS bằng cách sửa digit đầu của group address (dải 0-31) nếu dự án cần tránh trùng với cấu trúc group address của hệ khác trong tòa nhà.",
      "position": 3
    },
    {
      "question": "Có cần thiết kế lại toàn bộ group address cho mỗi dự án dùng KTS0-DALI không?",
      "answer": "Không cần thiết kế lại từ đầu. Cấu trúc group address theo chức năng (switch, dimming, color temperature, RGB, fault, system command) đã được Kanonbus định nghĩa sẵn theo bảng chuẩn, việc của kỹ sư là liên kết đúng group address này với thiết bị điều khiển trong ETS.",
      "position": 4
    },
    {
      "question": "KTS0-DALI điều khiển được tối đa bao nhiêu driver trên một cổng DALI?",
      "answer": "Theo chuẩn DALI (IEC 62386), một line DALI hỗ trợ tối đa 64 địa chỉ ngắn, khớp với dải 1~64 trong bảng group address của KTS0-DALI. Số cổng DALI thực tế trên từng phiên bản KTS0-DALI cần đối chiếu datasheet trước khi báo cho khách hàng dự án lớn.",
      "position": 5
    },
    {
      "question": "Khi thay driver DALI hỏng, có cần gán lại toàn bộ line không?",
      "answer": "Không cần. Dùng Expand allocation trên web host (hoặc chức năng dò bổ sung tương tự trên phần mềm USB DALI nếu không có host) thay vì New allocation, các group address điều khiển đã thiết lập cho driver khác trên line vẫn giữ nguyên.",
      "position": 6
    },
    {
      "question": "Đã gán địa chỉ bằng USB DALI rồi, sau này thêm host vào có phải làm lại không?",
      "answer": "Không cần làm lại từ đầu. KTS0-DALI đọc đúng group đã gán sẵn trên line vì gateway hiểu cấu trúc DALI group, không chỉ short address. Khi thêm host, chỉ cần khai báo gateway qua Add Gateway rồi dùng Address search để đồng bộ danh sách hiện có, không cần New allocation.",
      "position": 7
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html"
}
```
