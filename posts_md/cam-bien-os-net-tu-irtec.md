---
url: "https://knxstore.vn/cam-bien-os-net-tu-irtec.html"
headline: "Tìm hiểu về cảm biến OS-NET từ IR-TEC (Phần 2)"
description: "OS-NET chạy trên nền ZigBee mã hóa AES-128. Tìm hiểu 8 control scheme, cách nhóm EZ-Group, và khóa network an toàn. Tư vấn tại KNXStore."
title: "OS-NET IR-TEC: 8 Kịch Bản Điều Khiển Và Cách Nhóm Cảm Biến"
image: "https://knxstore.vn/media/e59b868bb5915c38bfdf92bd903b059b144ff74157bb45e377e73efb398ee37f.jpg"
datePublished: "2026-08-10T02:02:33.000Z"
dateModified: "2026-08-10T02:02:33.000Z"
author: "Lê Võ Quốc Huy"
publisher: "KNXStore.vn"
articleSection: "Chiếu sáng"
word_count: 2705
keywords: ["Chiếu sáng"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Chiếu sáng"
    url: "https://knxstore.vn/blogs/chieu-sang"
  - name: "Tìm hiểu về cảm biến OS-NET từ IR-TEC (Phần 2)"
    url: "https://knxstore.vn/cam-bien-os-net-tu-irtec.html"
products: [{"url": "https://knxstore.vn/products/ir-tec-cam-bien-hien-dien-dim-0-1-10v-os-net-on-lrd-209", "name": "Cảm biến hiện diện dim 0/1-10V OS-NET IR-TEC - ON-LRD-209S"}, {"url": "https://knxstore.vn/products/ir-tec-cam-bien-os-net-dali-tuong-thich-zhaga-on-mrd-734sz", "name": "Cảm biến OS-NET DALI tương thích Zhaga IR-TEC - ON-MRD-734SZ"}]
internal_links:
  - url: "https://knxstore.vn/cam-bien-os-net-irtec.html"
    slug: "cam-bien-os-net-irtec"
    anchor: "Phần 1"
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

# Tìm hiểu về cảm biến OS-NET từ IR-TEC (Phần 2)

> OS-NET chạy trên nền ZigBee mã hóa AES-128. Tìm hiểu 8 control scheme, cách nhóm EZ-Group, và khóa network an toàn. Tư vấn tại KNXStore.

## Article Body

Trong nhiều năm qua, việc đưa điều khiển thông minh vào chiếu sáng thương mại hoặc công nghiệp vẫn là thách thức lớn: khó kết nối đèn từ nhiều nhà sản xuất, cấu hình phức tạp, phần mềm điều khiển độc quyền khó dùng. OS-NET của IR-TEC giải quyết vấn đề này bằng cảm biến thông minh kết nối không dây. Phần 2 này tập trung vào cơ chế mạng, 8 kịch bản điều khiển, và cách nhóm thiết bị. Phần giới thiệu thiết bị (ONS/ONB/Remote) xem tại
Phần 1
.
OS-NET Chạy Trên Nền Tảng Nào?
OS-NET là mạng mesh không dây chạy trên nền ZigBee (IEEE 802.15.4) đã được IR-TEC tùy biến, hoạt động ở băng tần 2.4-2.5GHz. Toàn bộ lệnh giao tiếp giữa các thiết bị được mã hóa AES-128. Một mạng OS-NET liên kết được tối đa 250 group điều khiển, mỗi thiết bị gán được vào tối đa 4 group cùng lúc.
Cơ chế lõi của OS-NET là
"individual sensing control, group activation"
: mỗi sensor tự cảm biến vùng của nó, nhưng khi phát hiện người sẽ broadcast tín hiệu occupancy cho toàn group để đồng loạt kích hoạt đèn theo scheme đã cài. Đây là điểm khác biệt so với cảm biến độc lập truyền thống, vốn chỉ điều khiển đúng vùng nó đấu dây vào.
Các kịch bản điều khiển của OS-NET
ON-OFF
ON- OFF (Chuyển mạch bật / tắt) là phương thức điều khiển chiếu sáng thông thường nhất của cảm biến OS-NET từ IR-TEC. Các thiết bị điện sẽ được thiết lập kịch bản chiếu sáng cụ thể. Khi ánh sáng từ môi trường cao hơn ngưỡng sáng được cài đặt, đèn vẫn giữ trạng thái tắt dù có phát hiện người di chuyển.
Ngược lại, nếu ánh sáng từ môi trường xung quanh thấp hơn ngưỡng sáng đã thiết lập thì đèn sẽ tự động bật khi cảm biến nhận diện có người. Sau một thời gian, cảm biến không còn ghi nhận chuyển động thì đèn tắt.
Tuy nhiên, sơ đồ chuyển mạch ON - OFF chỉ áp dụng cho các loại đèn có thể điều chỉnh cường độ sáng hoặc các đèn thông thường nhưng không dùng được trong hệ thống chiếu sáng HID.
OSO
Trong cảm biến OS-NET từ IR-TEC, OSO được áp dụng cho những nơi cần ánh sáng liên tục. Khi thiết bị cảm biến nhận diện có người sẽ báo hiệu cho đèn tự động bật. Ánh sáng tăng lên và duy trì cho đến khi người dùng rời khỏi thông qua hệ điều khiển SmartDIM.
Lưu ý: kiểu mạch OSO chỉ dùng với các loại đèn có thể điều chỉnh cường độ sáng (đèn hỗ trợ thiết bị dimmable).
OSLA
OSLA là một trong những cảm biến OS-NET từ IR-TEC thường được dùng trong những không gian yêu cần chiếu sáng tự động như: cầu thang, hành lang,..
Cách OSLA hoạt động như sau:
Vào ban ngày, OSLA sẽ giữ cho đèn trong trạng thái tắt dù có cảm biến hiện diện người hay không.  Đó là do ánh sáng môi trường cao hơn ngưỡng sáng mà người dùng đã thiết lập.
Khi trời tối tức cường độ sáng từ môi trường xung quanh thấp hơn mức sáng đã cài, đèn sẽ bật chế độ ánh sáng nhẹ (Low dim). Nếu cảm biến hiện diện nhận thấy có người đang chuyển động trong khu vực thì đèn sẽ tăng cường độ sáng. Sau khi người đi khỏi, thiết bị chiếu sáng quay lại chế độ ánh sáng thấp để tiết kiệm năng lượng.
Lưu ý: OSLA chỉ phù hợp kết nối với các thiết bị đèn có thể tăng chỉnh cường độ chiếu sáng.
Người dùng có thể thiết lập điều khiển chiếu đèn theo nhu cầu sử dụng thông qua hệ cảm biến OS-NET.
OSLATO
OSLATO là một trong những sơ đồ chiếu sáng thông minh được dùng cho những không gian cần duy trì ánh sáng vừa phải như garage xe, hầm giữ xe,... Thông qua các thiết bị cảm biến OS-NET từ IRTEC, OSLATO cho phép người dùng tùy chỉnh cường độ sáng và phạm vi chiếu sáng theo nhu cầu sử dụng giúp tiết kiệm điện năng.
Hệ thống chiếu sáng sẽ hạn chế hoạt động khi ánh sáng xung quanh cao hơn ngưỡng đã cài đặt. Khi ánh sáng từ môi trường không đủ, đèn sẽ được kích hoạt ở mức sáng dịu. Bộ phận cảm biến phát hiện có chuyển động sẽ làm đèn sáng ở mức cao hơn. Sau một thời gian, đèn sẽ mờ dần và trở về ngưỡng sáng ban đầu hoặc tắt hẳn như đã thiết lập.
OSLATO chỉ tối ưu hiệu quả khi dùng với các thiết bị chiếu sáng có hỗ trợ tùy chỉnh cường độ sáng. Nếu đèn không có dimmable, OSLATO không thể điều khiển đèn chiếu sáng theo kịch bản mờ dần đến sáng rõ theo mục đích sử dụng.
DSVM
Đây là sơ đồ điều khiển cảm biến ánh sáng ban ngày áp dụng cho những không gian cần tự động làm mờ ánh sáng xuống mức thấp trong khoảng thời gian nửa đêm. Nơi thường dùng kiểu mạch này hệ thống đèn đường.
Ánh sáng ban ngày thường cao hơn ngưỡng thiết lập nên đèn sẽ không bật. Khi cường độ sáng từ môi trường xuống thấp, đèn mở và chuyển sang chế độ cường độ sáng cao nếu có chuyển động. Hệ điều khiển SmartDIM sẽ duy trì mức sáng như vậy trong phạm vi đã cài đặt. Vào thời gian nửa đêm, đèn sẽ dần giảm độ sáng.
DSVM cũng như các kịch bản điều khiển chiếu sáng thông minh thông qua cảm biến OS-NET từ IRTECH là cần dùng đèn có khả năng điều chỉnh cường độ sáng. Nếu thiết bị không có dimmable, đèn sẽ chỉ chiếu sáng theo cách bật / tắt thông qua cảm biến ánh sáng ban ngày thông thường.
DSC
DSC là một trong những dạng sơ đồ mạch điều khiển chiếu sáng thông minh áp dụng rộng rãi trong bất kỳ không gian nào yêu cầu tự động chiếu sáng. DSC cũng hoạt động dựa trên nguyên lý ngưỡng sáng môi trường thấp hơn mức cài đặt thì đèn sẽ bật.
Kiểu sơ đồ này cũng hỗ trợ tùy chỉnh ánh sáng từ mờ đến sáng rõ thông qua hệ điều khiển SmartDIM. Do đó, các loại đèn có khả năng chỉnh cường độ sáng mới thích hợp dùng cho mạch DSC.
VSC
Đây là dạng sơ đồ điều khiển chiếu sáng dựa trên kiểm soát cảm biến chỗ trống dùng cho nhu cầu bật đèn thủ công và tắt đèn theo phương thức cảm biến tự động. Người dùng sẽ thao tác trên nút OS-NET để bật nhóm đèn chiếu sáng được chỉ định.
Cảm biến sẽ điều khiển Dim ở mức cao và duy trì mức chiếu sáng tổng thể trong phạm vi đã thiết lập qua điều khiển SmartDIM. Cảm biến sẽ điều khiển thiết bị chiếu sáng kết nối theo sơ đồ OSLATO.
VSC cũng yêu cầu các thiết bị đèn trong mạch có đèn điều chỉnh cường độ sáng. Nếu dùng các loại đèn thông thường, VSC không thể điều khiển đèn từ sáng rõ đến mờ dần rồi tắt hẳn.
OSB
OSB là kịch bản chiếu sáng hoạt động trên cảm biến hiện diện nâng cao trong hệ cảm biến OS -NET từ IR-TEC. OSB thường sử dụng rộng rãi trong các tòa nhà, văn phòng làm việc,...để cung cấp ánh sáng nền.
OSB hạn chế các đèn hoạt động khi cường độ sáng từ môi trường cao hơn ngưỡng thiết lập. Khi trời tối tức ánh sáng xung quanh thấp hơn ngưỡng đã cài, cảm biến sẽ bắt đầu nhận diện chuyển động và sự hiện diện của người dùng. Đèn sẽ được sáng dần đến vị trí mà người dùng muốn đến.
Các khu vực còn lại chỉ sáng ở mức dịu. Khi người cuối cùng rời khỏi phòng, ánh sáng của toàn bộ khu vực sẽ mờ dần và tắt. Để tối ưu hóa hiệu quả hoạt động của mạch OSB, người dùng nên ưu tiên các loại đèn có thể điều chỉnh cường độ sáng.
OS-NET có thể dùng trong các công trình lớn, đòi hỏi chiếu sáng thông minh.
Điều khiển theo nhóm với OS-NET
EZ-Group
Nhóm control của OS-NET là kết hợp giữa group TRANSMITTING và RECEIVING. Khi một sensor phát hiện người, nó phát tín hiệu occupancy kèm số group TRANSMITTING của nó tới các thiết bị có cùng số group RECEIVING để thực thi control. EZ-GROUP gán nhanh transmit = receive cùng số, đủ dùng cho hầu hết ứng dụng thông thường.
Advanced (Nâng Cấp)
Dùng cho logic zone chéo mà EZ-GROUP không đáp ứng được. Ví dụ: khi Zone A có người, đèn Zone A và B cùng sáng; nhưng khi Zone B có người, chỉ đèn Zone B sáng. Cách làm: gán EZ-GROUP riêng cho từng zone, sau đó dùng Advanced để thêm số group của Zone B vào TRANSMITTING của Zone A (hoặc thêm số group Zone A vào RECEIVING của Zone B).
Mẹo Phân Nhóm Thực Tế
Không nhất thiết mọi cảm biến trong cùng khu vực phải chung 1 group. Có thể tách nhóm nếu cần scheme khác nhau cho từng khu.
Khu vực cần đồng loạt kích hoạt (ví dụ toàn bộ 1 phòng) thì gán chung 1 group.
Khu vực nhiều luồng di chuyển (hành lang, sảnh thang máy, lối xe) nên gán các sensor là thành viên của group ở mọi lối đi liên quan, để đèn toàn tuyến sáng đồng thời khi phát hiện người ở bất kỳ điểm nào.
Nút OS-NET Button luôn cần gán vào group của khu vực nó điều khiển.
Ứng Dụng Đa Nhóm: Khi Một Cảm Biến Thuộc Nhiều Group
Một thiết bị OS-NET gán được vào tối đa 4 group cùng lúc, và khi phát hiện người sẽ kích hoạt đồng thời toàn bộ các group nó thuộc về. Ứng dụng điển hình là khu vực có nhiều luồng di chuyển giao nhau, ví dụ lối đi trong nhà xe, hành lang lớn, hoặc sảnh thang máy: cảm biến đặt tại điểm giao nên được gán vào group của tất cả các lối đi liên quan, để đèn toàn tuyến sáng đồng thời ngay khi có người xuất hiện ở bất kỳ nhánh nào, thay vì chỉ sáng đúng đoạn cảm biến phát hiện.
OS-NET Có Điều Khiển Được HVAC Không?
Ngoài chiếu sáng, cảm biến OS-NET có thể dùng để điều khiển hoạt động của quạt thông gió hoặc fan-coil trong hệ HVAC, dựa trên cùng cơ chế cảm biến hiện diện. Đây là ứng dụng mở rộng ngoài chiếu sáng, cần liên hệ trực tiếp bộ phận kinh doanh IR-TEC để xác nhận khả năng tương thích với loại fan-coil/thiết bị HVAC cụ thể trước khi triển khai.
Ứng Dụng Theo Loại Công Trình
Việc chọn control scheme nên dựa theo đặc điểm sử dụng không gian, không chỉ theo sở thích:
Văn phòng mở, khu làm việc chung: ON-OFF cho khu vực đơn giản, hoặc OSB nếu cần ánh sáng nền trước khi cả khu tắt hẳn.
Hành lang, cầu thang: OSLA hoặc OSLATO, ưu tiên duy trì Low Dim thay vì tắt hoàn toàn vì lý do an toàn di chuyển.
Garage, hầm xe: OSLATO, giữ mức sáng dịu trong khoảng TIME OFF trước khi tắt.
Khu vực cần sáng 24/7 (kho, khu vực sản xuất liên tục): OSO.
Đèn đường, chiếu sáng ngoài trời theo khung giờ: DSVM.
Không gian chỉ cần bật tắt tự động theo ánh sáng ban ngày, không cần theo dõi occupancy: DSC.
Phòng họp, phòng cần bật tay nhưng tắt tự động: VSC.
Cách Nhận Biết Thiết Bị Đã Kết Nối Mạng Hay Chưa
Đèn LED trên thiết bị OS-NET là cách nhanh nhất để kiểm tra trạng thái mà không cần remote:
LED xanh dương (BLUE):
thiết bị chưa kết nối mạng nào. ONS ở trạng thái này vẫn điều khiển được đèn nó đấu trực tiếp, nhưng không có group activation. ONB ở trạng thái này không hoạt động được.
LED xanh lá (GREEN), nhấp 2 lần mỗi 2 giây:
thiết bị đã kết nối mạng và đang phát hiện chuyển động của người.
LED nhấp nhanh xen kẽ xanh lá/xanh dương (mỗi 0.2 giây):
thiết bị đang trong quá trình scan và link vào mạng.
Khi test một sensor mới trước khi group chính thức, nếu LED chuyển sang GREEN ngay sau khi upload group tạm, nghĩa là khu vực đã có một mạng OS-NET khác đang mở (unlock) ở gần và sensor bị link nhầm. Cần UNGROUP sensor test ngay để tránh nhiễu group activation giữa 2 công trình.
Lưu Cấu Hình Với EZ-SET Để Tăng Tốc Lắp Đặt Hàng Loạt
Remote SRP-281 lưu được 4 profile EZ-SET, mỗi profile chứa đầy đủ tham số control scheme đã cấu hình trước (control mode, delay, high dim, low dim, ramp up, fade down...). Khi lắp nhiều thiết bị cùng scheme, chỉ cần recall đúng profile và upload liên tiếp cho từng thiết bị, không phải nhập lại tham số từ đầu mỗi lần. Việc lưu/gọi lại EZ-SET có thể thực hiện ngay trên remote mà không cần đứng tại công trình.
Bảo Mật Network: Lock/Unlock Và Auto Lock
Sau khi hoàn tất cấu hình, cần LOCK network để ngăn thay đổi setting không mong muốn và tránh bị liên kết nhầm với mạng OS-NET hàng xóm đang mở (unlock). Trường hợp này có thể gây group activation chéo giữa 2 công trình khác nhau. AUTO LOCK tự động khóa network sau 12 giờ kể từ khi tạo, đề phòng quên khóa tay. Khi cần thêm thiết bị vào mạng đã khóa, phải UNLOCK trước khi group thiết bị mới.
Kết Luận
OS-NET vận hành trên nền ZigBee mã hóa AES-128, cung cấp 8 control scheme từ ON/OFF cơ bản đến DSVM/OSB nâng cao, cùng cơ chế group activation cho phép nhiều cảm biến phối hợp qua EZ-GROUP hoặc Advanced setting. Phần thiết bị cụ thể (ONS, ONB, Remote) xem tại Phần 1.
Cần tư vấn giải pháp cho công trình của bạn? KNXStore.vn - Công ty CP Tích hợp Hệ thống Liên Minh. Địa chỉ:
Văn phòng số SAV5-01.02, Lầu 1, Tháp 5, The Sun Avenue, 28 Mai Chí Thọ, Phường Bình Trưng, TP.HCM
. Hotline:
0918.918.755
. Email:
sales@knxstore.vn
OS-NET có bị nhiễu hoặc xung đột với Wi-Fi/Bluetooth trong công trình không?
OS-NET dùng băng tần 2.4-2.5GHz như Wi-Fi/Bluetooth, nhưng lưu lượng dữ liệu được thiết kế ở mức tối thiểu nên hiếm khi gây xung đột. Nếu công trình có mật độ thiết bị không dây rất cao, độ trễ phản hồi có thể tăng nhẹ.

Vì sao phải LOCK network sau khi cài đặt xong?
Để tránh 2 mạng OS-NET liền kề (ví dụ 2 công trình sát nhau) tự động liên kết chéo, gây group activation sai: đèn khu A bật theo cảm biến khu B.

OSLATO và OSLA khác nhau ở đâu?
OSLA giảm đèn về Low Dim sau delay time và giữ nguyên; OSLATO giảm về Low Dim rồi tiếp tục giảm và tắt hẳn sau khoảng TIME OFF. Dùng cho nơi cần tắt dần chứ không giữ sáng mờ vô thời hạn.

Một cảm biến có thể thuộc nhiều group không?
Có, tối đa 4 group cùng lúc. Ứng dụng điển hình là khu vực giao nhau của nhiều luồng di chuyển như sảnh thang máy.

Nếu mất kết nối mạng, cảm biến còn hoạt động không?
Còn. Mỗi ONS vẫn tự điều khiển đèn nó đấu trực tiếp theo scheme đã cài, chỉ mất khả năng group activation (đồng bộ với cảm biến khác) cho đến khi mạng phục hồi.

EZ-GROUP có đủ dùng cho hầu hết dự án không?
Đủ cho phần lớn ứng dụng thông thường. Chỉ cần dùng Advanced khi có yêu cầu logic zone chéo phức tạp (một zone kích hoạt zone khác nhưng không ngược lại).

## Raw MCP

```json
{
  "slug": "cam-bien-os-net-tu-irtec",
  "title": "Tìm hiểu về cảm biến OS-NET từ IR-TEC (Phần 2)",
  "excerpt": "OS-NET chạy trên nền ZigBee mã hóa AES-128. Tìm hiểu 8 control scheme, cách nhóm EZ-Group, và khóa network an toàn. Tư vấn tại KNXStore.",
  "coverImage": "/media/e59b868bb5915c38bfdf92bd903b059b144ff74157bb45e377e73efb398ee37f.jpg",
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
  "publishedAt": "2026-08-10T02:02:33.000Z",
  "categories": [
    {
      "slug": "chieu-sang",
      "name": "Chiếu sáng"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "OS-NET IR-TEC: 8 Kịch Bản Điều Khiển Và Cách Nhóm Cảm Biến",
  "seoDescription": "OS-NET chạy trên nền ZigBee mã hóa AES-128. Tìm hiểu 8 control scheme, cách nhóm EZ-Group, và khóa network an toàn. Tư vấn tại KNXStore.",
  "faqs": [
    {
      "question": "OS-NET có bị nhiễu hoặc xung đột với Wi-Fi/Bluetooth trong công trình không?",
      "answer": "OS-NET dùng băng tần 2.4-2.5GHz như Wi-Fi/Bluetooth, nhưng lưu lượng dữ liệu được thiết kế ở mức tối thiểu nên hiếm khi gây xung đột. Nếu công trình có mật độ thiết bị không dây rất cao, độ trễ phản hồi có thể tăng nhẹ.",
      "position": 0
    },
    {
      "question": "Vì sao phải LOCK network sau khi cài đặt xong?",
      "answer": "Để tránh 2 mạng OS-NET liền kề (ví dụ 2 công trình sát nhau) tự động liên kết chéo, gây group activation sai: đèn khu A bật theo cảm biến khu B.",
      "position": 1
    },
    {
      "question": "OSLATO và OSLA khác nhau ở đâu?",
      "answer": "OSLA giảm đèn về Low Dim sau delay time và giữ nguyên; OSLATO giảm về Low Dim rồi tiếp tục giảm và tắt hẳn sau khoảng TIME OFF. Dùng cho nơi cần tắt dần chứ không giữ sáng mờ vô thời hạn.",
      "position": 2
    },
    {
      "question": "Một cảm biến có thể thuộc nhiều group không?",
      "answer": "Có, tối đa 4 group cùng lúc. Ứng dụng điển hình là khu vực giao nhau của nhiều luồng di chuyển như sảnh thang máy.",
      "position": 3
    },
    {
      "question": "Nếu mất kết nối mạng, cảm biến còn hoạt động không?",
      "answer": "Còn. Mỗi ONS vẫn tự điều khiển đèn nó đấu trực tiếp theo scheme đã cài, chỉ mất khả năng group activation (đồng bộ với cảm biến khác) cho đến khi mạng phục hồi.",
      "position": 4
    },
    {
      "question": "EZ-GROUP có đủ dùng cho hầu hết dự án không?",
      "answer": "Đủ cho phần lớn ứng dụng thông thường. Chỉ cần dùng Advanced khi có yêu cầu logic zone chéo phức tạp (một zone kích hoạt zone khác nhưng không ngược lại).",
      "position": 5
    }
  ],
  "editedAt": null,
  "url": "https://knxstore.vn/cam-bien-os-net-tu-irtec.html"
}
```
