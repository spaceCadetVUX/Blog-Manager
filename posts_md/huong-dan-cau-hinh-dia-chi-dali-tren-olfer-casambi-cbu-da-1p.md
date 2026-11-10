---
url: "https://knxstore.vn/huong-dan-cau-hinh-dia-chi-dali-tren-olfer-casambi-cbu-da-1p.html"
headline: "Hướng dẫn cấu hình địa chỉ DALI trên thiết bị Olfer Casambi CBU-DA-1P"
description: "Hướng dẫn cấu hình địa chỉ DALI trên CBU-DA-1P: truy cập menu Unit Settings, Address Settings, gán địa chỉ, reset và quét thiết bị DALI qua Casambi."
title: "Hướng Dẫn Cấu Hình Địa Chỉ DALI Trên Olfer Casambi CBU-DA-1P"
image: "https://knxstore.vn/media/d7fdc4ca5f235b531e430f1567e7ecb424a0643ae346cc36759bbf05d4bd4f6e.jpg"
datePublished: "2026-08-07T03:06:38.000Z"
dateModified: "2026-08-07T03:06:38.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Chiếu sáng"
word_count: 1542
keywords: ["Chiếu sáng"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Chiếu sáng"
    url: "https://knxstore.vn/blogs/chieu-sang"
  - name: "Hướng dẫn cấu hình địa chỉ DALI trên thiết bị Olfer Casambi CBU-DA-1P"
    url: "https://knxstore.vn/huong-dan-cau-hinh-dia-chi-dali-tren-olfer-casambi-cbu-da-1p.html"
internal_links:
  - url: "https://knxstore.vn/6-loai-cam-bien-quan-trong-trong-he-thong-chieu-sang-thong-minh.html"
    slug: "6-loai-cam-bien-quan-trong-trong-he-thong-chieu-sang-thong-minh"
    anchor: "cảm biến hiện diện/ánh sáng DALI-2"
  - url: "https://knxstore.vn/casambi-khong-ket-noi-homekit-mtb10-matter-bridge-la-giai-phap.html"
    slug: "casambi-khong-ket-noi-homekit-mtb10-matter-bridge-la-giai-phap"
    anchor: "Casambi Matter Bridge MTB10"
  - url: "https://knxstore.vn/thiet-ke-he-chieu-sang-dali-mo-rong-bang-casambi-se-nhu-the-nao.html"
    slug: "thiet-ke-he-chieu-sang-dali-mo-rong-bang-casambi-se-nhu-the-nao"
    anchor: "hệ chiếu sáng DALI mở rộng bằng Casambi"
  - url: "https://knxstore.vn/vi-sao-tinh-tuong-tac-quyet-dinh-hieu-qua-cua-he-thong-chieu-sang-thong-minh.html"
    slug: "vi-sao-tinh-tuong-tac-quyet-dinh-hieu-qua-cua-he-thong-chieu-sang-thong-minh"
    anchor: "tính tương tác của hệ thống chiếu sáng thông minh"
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

# Hướng dẫn cấu hình địa chỉ DALI trên thiết bị Olfer Casambi CBU-DA-1P

> Hướng dẫn cấu hình địa chỉ DALI trên CBU-DA-1P: truy cập menu Unit Settings, Address Settings, gán địa chỉ, reset và quét thiết bị DALI qua Casambi.

## Article Body

CBU-DA-1P là bộ điều khiển DALI thông minh của Olfer, kết hợp Casambi Bluetooth, điều khiển tối đa 50 driver DALI và tích hợp nguồn 100mA. Trước khi vận hành hệ thống, kỹ thuật viên cần cấu hình đúng địa chỉ DALI cho từng thiết bị trên bus, đây là bước bắt buộc để CBU-DA-1P nhận diện và điều khiển chính xác từng driver, cảm biến hoặc nút bấm trong mạng.
CBU-DA-1P Hoạt Động Như Thế Nào?
CBU-DA-1P sử dụng giao tiếp Bluetooth năng lượng thấp để nhận tín hiệu từ ứng dụng Casambi và chuyển đổi thành các lệnh DALI theo cấu hình thiết bị đã chọn. Module này tương thích với
cảm biến hiện diện/ánh sáng DALI-2
và các nút bấm điều khiển, cho phép mở rộng hệ Casambi lên tới các nền tảng smarthome tiêu dùng như Apple Home qua
Casambi Matter Bridge MTB10
mà không cần đổi driver DALI hiện có, đúng như nguyên lý của
hệ chiếu sáng DALI mở rộng bằng Casambi
.
Trong ứng dụng Casambi, việc cấu hình DALI của CBU-DA-1P xoay quanh 2 menu nằm trong phần "Details" khi mở profile thiết bị: "Unit settings" (cài đặt thiết bị) và "Address settings" (cài đặt địa chỉ). Hai menu này cung cấp toàn bộ công cụ để khai thác CBU-DA-1P và hơn 45 profile thiết bị có sẵn:
Unit settings: các thao tác ảnh hưởng đồng thời đến toàn bộ hệ thống trên bus DALI, như quét, gán địa chỉ, reset.
Address settings: các thao tác tùy chỉnh riêng cho từng thiết bị/địa chỉ đã được gán.
Cách Truy Cập Và Sử Dụng Menu "Unit Settings"
Cách truy cập
Để truy cập các menu DALI, trước tiên cần ghép nối CBU-DA-1P với mạng Casambi và đảm bảo thiết bị nằm trong phạm vi Bluetooth. Sau đó thực hiện các bước sau:
Nhấn đúp vào biểu tượng đại diện cho thiết bị CBU-DA-1P trên ứng dụng.
Chọn vào mục "Details".
Chọn mục "Unit Address".
Menu "Unit Settings" sẽ hiện ra, cho phép cấu hình các thiết lập cho thiết bị.
Lưu ý: cần đảm bảo thiết bị đã kết nối với ứng dụng Casambi trước khi thực hiện các bước trên.
Lưu ý: Trước khi thực hiện, hãy đảm bảo thiết bị đã được kết nối với ứng dụng CASAMBI.
Các chức năng trong menu "Unit Settings"
Identify all devices: nhận dạng tất cả các thiết bị bằng cách nhấp nháy tất cả đèn trong 10 giây.
Scan devices and assign an address: quét tất cả các thiết bị và gán địa chỉ cho những thiết bị chưa có; nếu thiết bị đã có địa chỉ, chức năng này không ghi đè lên địa chỉ hiện tại.
Send initialization commands: gửi các lệnh khởi tạo, tương tự khi tải một profile thiết bị Casambi mới.
Reset all devices: khôi phục cấu hình mặc định cho tất cả các thiết bị (không xóa địa chỉ ngắn).
Initialize/Extend DALI addresses: khởi tạo/mở rộng địa chỉ DALI.
Fixture initialization commands: các lệnh khởi tạo thiết bị.
RESET DALI devices: reset tất cả các thiết bị DALI.
Remove DALI addresses: xóa địa chỉ của tất cả các thiết bị.
Re-address DALI devices: tìm kiếm và gán lại địa chỉ ngẫu nhiên cho tất cả các thiết bị được kết nối với bus DALI.
Clear DALI details: xóa thông tin đã lưu của các thiết bị DALI hiển thị ở cuối menu này.
Scan DALI devices: quét tối đa 64 địa chỉ có thể được kết nối với bus DALI và đọc cấu hình, bộ nhớ của chúng.
Tất cả các hành động trong "Unit settings" ảnh hưởng đồng thời đến toàn bộ thiết bị kết nối với bus DALI. Để thao tác trên từng thiết bị/địa chỉ riêng lẻ, kỹ thuật viên cần chuyển sang menu "Address settings".
Cách Truy Cập Và Sử Dụng Menu "Address Settings"
Cách truy cập
Menu này cho phép cài đặt riêng cho từng thiết bị. Để truy cập, trước tiên cần quét tất cả thiết bị đã kết nối với bus DALI để chúng hiển thị trên màn hình, các thiết bị phải được gán địa chỉ trước đó.
Việc quét được thực hiện tự động khi các chức năng "Identify/extend DALI addresses" hoặc "Change DALI device address" hoàn tất. Ngoài ra, có thể quét thủ công bằng cách nhấn vào thanh "Scan DALI devices" để tìm kiếm và cập nhật danh sách thiết bị DALI đang kết nối.
Khi thanh "Scan DALI devices" chuyển sang màu xanh dương và biểu tượng loading xuất hiện ở đầu màn hình, tất cả thiết bị trên bus DALI đang được quét, địa chỉ DALI đang quét hiển thị ở bên phải thanh màu xanh. Dưới thanh màu xanh lá cây, các thiết bị được quét hiển thị với tên "DALI A_". Chạm vào một thiết bị để vào menu "Address settings" của thiết bị đó, sau đó chạm vào "DALI address A_" để mở menu hành động.
Các chức năng trong menu "Address Settings"
Identify the device: nhận dạng thiết bị bằng cách nhấp nháy đèn trong 10 giây.
Identify the group: nhận dạng nhóm bằng cách nhấp nháy các đèn thuộc nhóm đó trong 10 giây.
Change the device address: thay đổi địa chỉ của thiết bị.
Add to group: thêm thiết bị vào nhóm.
Remove from group: xóa thiết bị khỏi nhóm.
Remove device record: xóa thông tin nhà sản xuất (MB0) đang hiển thị trên màn hình, không xóa toàn bộ dữ liệu địa chỉ của thiết bị.
Rescan device: quét lại thiết bị để cập nhật thông tin.
Các thông tin kỹ thuật hiển thị khi chọn từng thiết bị DALI
Khi chạm vào một thiết bị đã quét được (dạng "DALI A_"), màn hình "DALI details" hiển thị đầy đủ thông số để kỹ thuật viên đối chiếu khi debug:
DALI address: địa chỉ ngắn hiện tại của thiết bị (ví dụ A0).
DALI groups: cho biết thiết bị đã được gán vào nhóm DALI nào hay chưa.
DALI status: mã trạng thái và trạng thái bật/tắt hiện tại (ví dụ 04, ON).
GTIN, Serial: mã định danh sản phẩm và số serial theo chuẩn DALI-2.
Device manufacturer, Device model, Device type: thông tin nhà sản xuất fixture DALI đang kết nối (nếu fixture hỗ trợ khai báo).
FW Version, HW Version: phiên bản firmware và hardware của fixture DALI.
Ở cấp độ Unit (trước khi chọn từng thiết bị), CBU-DA-1P còn hiển thị Fixture ID, Fixture mode, Network ID, Unit ID, Firmware, RSSI, Protocol và CPU, các thông số này giúp xác minh đúng thiết bị đang cấu hình khi công trình có nhiều CBU-DA-1P hoạt động song song.
Việc phối hợp đúng giữa "Unit settings" (toàn hệ thống) và "Address settings" (từng thiết bị) giúp CBU-DA-1P nhận diện chính xác từng driver DALI, tránh xung đột địa chỉ khi mở rộng thêm thiết bị, yếu tố quyết định
tính tương tác của hệ thống chiếu sáng thông minh
khi công trình có nhiều nhóm đèn khác nhau.
Kết Luận
Cấu hình đúng địa chỉ DALI trên CBU-DA-1P, thông qua 2 menu Unit Settings và Address Settings, là bước nền tảng để hệ thống Casambi vận hành ổn định trên bus DALI, tránh xung đột địa chỉ khi mở rộng.
C
ần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
CBU-DA-1P điều khiển được tối đa bao nhiêu driver DALI?
Tối đa 50 driver DALI trên một bus, tích hợp nguồn cấp 100mA cho bus DALI.

Khác nhau giữa "Unit settings" và "Address settings" là gì?
Unit settings tác động đồng thời lên toàn bộ thiết bị trên bus DALI (quét, gán địa chỉ, reset toàn hệ thống). Address settings chỉ tác động lên một thiết bị/địa chỉ cụ thể đã được quét.

Vì sao cần quét thiết bị trước khi vào menu Address Settings?
Vì Address settings chỉ hiển thị các thiết bị đã có địa chỉ DALI. Nếu chưa gán địa chỉ, cần chạy "Scan devices and assign an address" ở Unit settings trước.

Gán lại địa chỉ (Re-address) có xóa cấu hình nhóm không?
Re-address DALI devices chỉ gán lại địa chỉ ngẫu nhiên cho các thiết bị, không tự động xóa thông tin nhóm, nhưng nên kiểm tra lại nhóm sau khi re-address để tránh sai lệch.

CBU-DA-1P có tương thích với cảm biến DALI-2 không?
Có. CBU-DA-1P tương thích với cảm biến hiện diện/ánh sáng chuẩn DALI-2 và các nút bấm điều khiển kết nối trên cùng bus.

Nếu quét bus DALI không thấy thiết bị thì kiểm tra gì trước?
Kiểm tra CBU-DA-1P đã ghép nối với mạng Casambi và nằm trong phạm vi Bluetooth, đồng thời xác nhận driver DALI đã được cấp nguồn và đấu nối đúng cực bus DA/DA trước khi chạy lại "Scan DALI devices". "Remove device record" chỉ xóa thông tin nhà sản xuất (MB0) hiển thị trên màn hình, không xóa địa chỉ đã gán của thiết bị.

## Raw MCP

```json
{
  "slug": "huong-dan-cau-hinh-dia-chi-dali-tren-olfer-casambi-cbu-da-1p",
  "title": "Hướng dẫn cấu hình địa chỉ DALI trên thiết bị Olfer Casambi CBU-DA-1P",
  "excerpt": "Hướng dẫn cấu hình địa chỉ DALI trên CBU-DA-1P: truy cập menu Unit Settings, Address Settings, gán địa chỉ, reset và quét thiết bị DALI qua Casambi.",
  "coverImage": "/media/d7fdc4ca5f235b531e430f1567e7ecb424a0643ae346cc36759bbf05d4bd4f6e.jpg",
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
  "publishedAt": "2026-08-07T03:06:38.000Z",
  "categories": [
    {
      "slug": "chieu-sang",
      "name": "Chiếu sáng"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Hướng Dẫn Cấu Hình Địa Chỉ DALI Trên Olfer Casambi CBU-DA-1P",
  "seoDescription": "Hướng dẫn cấu hình địa chỉ DALI trên CBU-DA-1P: truy cập menu Unit Settings, Address Settings, gán địa chỉ, reset và quét thiết bị DALI qua Casambi.",
  "faqs": [
    {
      "question": "CBU-DA-1P điều khiển được tối đa bao nhiêu driver DALI?",
      "answer": "Tối đa 50 driver DALI trên một bus, tích hợp nguồn cấp 100mA cho bus DALI.",
      "position": 0
    },
    {
      "question": "Khác nhau giữa \"Unit settings\" và \"Address settings\" là gì?",
      "answer": "Unit settings tác động đồng thời lên toàn bộ thiết bị trên bus DALI (quét, gán địa chỉ, reset toàn hệ thống). Address settings chỉ tác động lên một thiết bị/địa chỉ cụ thể đã được quét.",
      "position": 1
    },
    {
      "question": "Vì sao cần quét thiết bị trước khi vào menu Address Settings?",
      "answer": "Vì Address settings chỉ hiển thị các thiết bị đã có địa chỉ DALI. Nếu chưa gán địa chỉ, cần chạy \"Scan devices and assign an address\" ở Unit settings trước.",
      "position": 2
    },
    {
      "question": "Gán lại địa chỉ (Re-address) có xóa cấu hình nhóm không?",
      "answer": "Re-address DALI devices chỉ gán lại địa chỉ ngẫu nhiên cho các thiết bị, không tự động xóa thông tin nhóm, nhưng nên kiểm tra lại nhóm sau khi re-address để tránh sai lệch.",
      "position": 3
    },
    {
      "question": "CBU-DA-1P có tương thích với cảm biến DALI-2 không?",
      "answer": "Có. CBU-DA-1P tương thích với cảm biến hiện diện/ánh sáng chuẩn DALI-2 và các nút bấm điều khiển kết nối trên cùng bus.",
      "position": 4
    },
    {
      "question": "Nếu quét bus DALI không thấy thiết bị thì kiểm tra gì trước?",
      "answer": "Kiểm tra CBU-DA-1P đã ghép nối với mạng Casambi và nằm trong phạm vi Bluetooth, đồng thời xác nhận driver DALI đã được cấp nguồn và đấu nối đúng cực bus DA/DA trước khi chạy lại \"Scan DALI devices\". \"Remove device record\" chỉ xóa thông tin nhà sản xuất (MB0) hiển thị trên màn hình, không xóa địa chỉ đã gán của thiết bị.",
      "position": 5
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/huong-dan-cau-hinh-dia-chi-dali-tren-olfer-casambi-cbu-da-1p.html"
}
```
