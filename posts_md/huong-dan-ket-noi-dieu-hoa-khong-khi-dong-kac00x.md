---
url: "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html"
headline: "Hướng dẫn kết nối điều hòa không khí - Dòng KAC00X"
description: "Hướng dẫn kết nối dòng KAC001, KAC005, KAC008 với điều hòa không khí các hãng như Daikin, Toshiba, Mitubishi, Hitachi,..."
og_site_name: "KNX Store"
image: "https://knxstore.vn/assets/image/post/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.jpg"
datePublished: "2025-04-09T15:40:50+07:00"
dateModified: "2025-04-09T15:40:50+07:00"
articleSection: "Hướng dẫn"
word_count: 1307
mentions: ["Aqara", "Apple Home"]
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Blogs"
    url: "https://knxstore.vn/blogs"
  - name: "Hướng dẫn"
    url: "https://knxstore.vn/blogs/huong-dan"
  - name: "Hướng dẫn kết nối điều hòa không khí - Dòng KAC00X"
    url: "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html"
internal_links:
  - url: "https://knxstore.vn/huong-dan-cap-nhat-firmware-va-main-program-kanonbus-kac005-moi-nhat-2026.html"
    slug: "huong-dan-cap-nhat-firmware-va-main-program-kanonbus-kac005-moi-nhat-2026"
    anchor: "Hướng Dẫn Cập Nhật Firmware Và Main Program Kanonbus KAC005 Mới Nhất 2026"
  - url: "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
    slug: "huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx"
    anchor: "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX"
  - url: "https://knxstore.vn/huong-dan-ket-noi-rem-cua-tu-dong-rs485.html"
    slug: "huong-dan-ket-noi-rem-cua-tu-dong-rs485"
    anchor: "Hướng dẫn kết nối rèm cửa tự động RS485"
  - url: "https://knxstore.vn/cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx.html"
    slug: "cac-phuong-an-dieu-khien-rem-cua-tu-dong-cho-smarthome-knx"
    anchor: "Các phương án điều khiển rèm cửa tự động cho Smarthome KNX"
  - url: "https://knxstore.vn/giai-phap-dieu-khien-hvac-vrv-vrf-tu-he-thong-smarthome-va-bms.html"
    slug: "giai-phap-dieu-khien-hvac-vrv-vrf-tu-he-thong-smarthome-va-bms"
    anchor: "Hệ thống điều khiển HVAC là gì? Giải pháp nào điều khiển VRV/VRF cho hệ thống Smarthome?"
---

# Hướng dẫn kết nối điều hòa không khí - Dòng KAC00X

> Hướng dẫn kết nối dòng KAC001, KAC005, KAC008 với điều hòa không khí các hãng như Daikin, Toshiba, Mitubishi, Hitachi,...

## Article Body

Bộ điều khiển trung tâm dòng KAC00X được kết nối trực tiếp với thiết bị chính và tương ứng với dàn nóng hoặc dàn lạnh thông qua giao thức HBS/XYE của điều hòa không khí trung tâm.

​Bài viết này cung cấp hướng dẫn chi tiết về cách kết nối và điều khiển hệ thống điều hòa không khí dòng KAC00X, giúp bạn tích hợp hiệu quả vào hệ thống tự động hóa tòa nhà. Ngoài ra, phương pháp này cũng có thể áp dụng tương tự cho các thiết bị điều khiển khác khi cần kết nối vào hệ thống Casambi, mở rộng khả năng tích hợp cho nhiều loại thiết bị khác nhau.​

Lựa chọn sản phẩm

Các sản phẩm trong dòng FEW Host của Kanontec được chia thành ba dòng là KAC001, KAC005 và KAC008. Mỗi dòng hỗ trợ kết nối trực tiếp với bốn loại bus nội bộ của các hệ thống điều hòa trung tâm của Daikin/Toshiba/Mitsubishi Electric/Hitachi (HBS - HVAC Bus System). Chi tiết như sau:


	
		
			Mã sản phẩm
			Mô tả kết nối
			Tính năng
		
		
			KAC001-(DK/TB/MSE/HT)
			1xHBS
			1xRS485
			- RS485/Modbus RTU
			- Logic control
		
		
			KAC005-(DK/TB/MSE/HT)
			1xHBS
			1xAPP
			1xKNX
			- IOS/Android/PC software
			- Cloud server features
			- HBS air conditioner direct connection (U1/U2)
			- KNX/EIB interface
			- Logic control
		
		
			KAC008-(DK/TB/MSE/HT)
			1xHBS
			1xAPP
			1xKNX
			1xRS485
			1xRS232
			- IOS/Android/PC software
			- Cloud server features
			- HBS air conditioner direct connection (U1/U2)
			- KNX/EIB interface
			- Logic control
			- Various protocols based on RS485
			- Various protocols based on RS232
			- Logic control
		
	


Tổng quan về bus điều hòa không khí

Hiện nay, các thương hiệu điều hòa không khí cơ bản sử dụng giao thức bus HBS (HVAC Bus System) như một tiêu chuẩn để trao đổi dữ liệu trong các hệ thống điều hòa không khí.

Các thương hiệu bus điều hòa không khí VRV/VRF được hỗ trợ bởi các sản phẩm trong dòng KAC được mô tả như sau:


	
		
			Thương hiệu
			Tên bus
			Cổng kết nối
			Phân cực bus (dương hoặc âm)
			Số lượng dàn lạnh hỗ trợ
		
		
			Daikin
			D3 Net
			F1, F2
			not
			32
		
		
			Toshiba
			TCC Link
			U1, U2
			not
			32
		
		
			Mitsubishi Electric
			M-Net
			TB3/TB7
			not
			32
		
		
			Hitachi
			H-Link/H-Link2
			1, 2
			not
			32
		
	


Tổng quan về điều hòa không khí

Bằng cách sử dụng các sản phẩm gateway dòng KAC, hệ thống nhà thông minh hoặc hệ thống tự động hóa tòa nhà có thể quản lý và điều khiển trực tiếp hệ thống điều hòa trung tâm.

Hỗ trợ các mã sản phẩm (mã dàn nóng)

Phù hợp cho các hệ thống điều hòa trung tâm có hệ thống bus, vui lòng tham khảo bộ phận bán hàng hoặc hỗ trợ kỹ thuật trước bán hàng của chúng tôi để biết thông tin chi tiết.

Sơ đồ kết nối

KAC thường kết nối U1 và U2 với A và B của cổng kết nối trên dàn nóng của máy điều hòa không khí, mà không phân biệt cực dương và cực âm. Nếu không tiện, nó cũng có thể được kết nối với A và B trên dàn lạnh được lắp đặt trong nhà.





Thiết lập địa chỉ cho điều hòa không khí

Thiết lập địa chỉ dàn lạnh (1~50)

Thiết lập địa chỉ cho máy điều hòa trung tâm phải được thiết lập bằng cách xoay núm vặn trên bo mạch hoặc remote gắn tường trong nhà. Liên hệ đơn vị cung cấp điều hòa để được hỗ trợ thiết lập địa chỉ theo mã sản phẩm.

Xem địa chỉ dàn lạnh

Trong trạng thái tắt của dàn lạnh, bạn sẽ thấy một nút kiểm tra ở góc dưới bên phải của bộ điều khiển dây hoặc remote gắn tường.

Ban đầu, nó sẽ hiển thị 00, và sau vài giây, nó sẽ hiển thị địa chỉ của dàn lạnh.

Để thoát, nhấn nút nguồn.

Lưu ý: Nếu có các thiết bị điều khiển trung tâm khác trong hệ thống, hãy lưu ý rằng địa chỉ không được trùng lặp.

Các bước thực hiện kết nối thiết bị

Kết nối dây

Kết nối U1,U2 của KAC với A,B của board mạch.

Địa chỉ điều hòa không khí

Địa chỉ được thiết lập ở mục thiết lập địa chỉ ở trên.

Khởi động lại tất cả dàn nóng, dàn lạnh và KAC

Lưu ý: Sau khi KAC được cấp nguồn, sẽ có quá trình tự kiểm tra, hiện tượng là đèn đỏ và đèn xanh nhấp nháy đồng bộ trong 0,5 giây. Nếu tự kiểm tra thất bại (ví dụ, có vấn đề với dây điều hòa không khí), hãy đợi 30 giây và lặp lại quá trình tự kiểm tra.

Sử dụng bảng giá trị tích hợp hoặc ứng dụng để hoàn thành việc tích hợp hệ thống. (Xem các mục Bảng giá trị tích hợp bên dưới)

Bảng giá trị tích hợp

Bảng giá trị Modbus


	
		
			Dàn lạnh
			Chức năng
			Điều khiển
			Giá trị điều khiển
			Giá trị trạng thái
		
		
			n
			n=1~16
			ON/OFF
			1=ON, 0=OFF
			0x03/0x06
			40002+(n-1)*10
			0x04
			30002+(n-1)*10
		
		
			Mode Choice
			0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto
			0x03/0x06
			40003+(n-1)*10
			0x04
			30003+(n-1)*10
		
		
			Set Temperature
			SAME
			0x03/0x06
			40004+(n-1)*10
			0x04
			30004+(n-1)*10
		
		
			Fan Speed
			0=Auto, 1=L, 2=M, 3=H
			0x03/0x06
			40005+(n-1)*10
			0x04
			30005+(n-1)*10
		
		
			Room Temperature
			SAME
			-
			-
			0x04
			30006+(n-1)*10
		
		
			n
			n=17~32
			ON/OFF
			1=ON, 0=OFF
			0x03/0x06
			40258+(n-17)*10
			0x04
			30258+(n-17)*10
		
		
			Mode Choice
			0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto
			0x03/0x06
			40259+(n-17)*10
			0x04
			30259+(n-17)*10
		
		
			Set Temperature
			SAME
			0x03/0x06
			40260+(n-17)*10
			0x04
			30260+(n-17)*10
		
		
			Fan Speed
			0=Auto, 1=L, 2=M, 3=H
			0x03/0x06
			40261+(n-17)*10
			0x04
			30261+(n-17)*10
		
		
			Room Temperature
			SAME
			-
			-
			0x04
			30262+(n-17)*10
		
	


Bảng giá trị KNX/EIB


	
		
			Dàn lạnh
			Chức năng
			Điều khiển
			Giá trị điều khiển
			Giá trị trạng thái
		
		
			n
			n=1~16
			ON/OFF
			1=ON, 0=OFF
			EIS1
			14/0/1+(n-1)*10
			EIS1
			15/0/1+(n-1)*10
		
		
			Mode Choice
			0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto
			EIS6
			14/0/2+(n-1)*10
			EIS6
			15/0/2+(n-1)*10
		
		
			Set Temperature
			SAME
			EIS5
			14/0/3+(n-1)*10
			EIS5
			15/0/3+(n-1)*10
		
		
			Fan Speed
			0=Auto, 1=L, 2=M, 3=H
			EIS6
			14/0/4+(n-1)*10
			EIS6
			15/0/4+(n-1)*10
		
		
			Room Temperature
			SAME
			-
			-
			EIS5
			15/0/5+(n-1)*10
		
		
			n
			n=17~32
			ON/OFF
			1=ON, 0=OFF
			EIS1
			14/1/1+(n-17)*10
			EIS1
			15/1/1+(n-17)*10
		
		
			Mode Choice
			0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto
			EIS6
			14/1/2+(n-17)*10
			EIS6
			15/1/2+(n-17)*10
		
		
			Set Temperature
			SAME
			EIS5
			14/1/3+(n-17)*10
			EIS5
			15/1/3+(n-17)*10
		
		
			Fan Speed
			0=Auto, 1=L, 2=M, 3=H
			EIS6
			14/1/4+(n-17)*10
			EIS6
			15/1/4+(n-17)*10
		
		
			Room Temperature
			SAME
			-
			-
			EIS5
			15/1/5+(n-17)*10
		
	


Bảng giá trị BACnet


	
		
			Dàn lạnh
			Chức năng
			Kiểu đối tượng
			Thể hiện đối tượng
			Giá trị
		
		
			1
			ON/OFF Set
			Binary Output[4]
			1
			1=ON; 0=OFF
		
		
			ON/OFF Status
			Binary input[3]
			1
			1=ON; 0=OFF
		
		
			Fan Speed Set
			Multi-state Output[14]
			1
			4=H; 3=M; 2=L; 1=AUTO
		
		
			Fan Speed Status
			Multi-state Input[13]
			1
			4=H; 3=M; 2=L; 1=AUTO
		
		
			Fan Louver Set
			Multi-state Output[14]
			129
			 
		
		
			Fan Louver Status
			Multi-state Input[13]
			129
			 
		
		
			Operating Mode Set
			Multi-state Output[14]
			257
			1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto
		
		
			Operating Mode Status
			Multi-state Input[13]
			257
			1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto
		
		
			Temperature set
			Analog-Value[1]
			1
			 
		
		
			Temperature set Status
			Analog-Input[0]
			1
			 
		
		
			Current Temperature
			Analog-Input[0]
			129
			 
		
		
			Error Code
			Multi-state Input[13]
			385
			See attachment
		
		
			2
			ON/OFF Set
			Binary Output[4]
			2
			1=ON; 0=OFF
		
		
			ON/OFF Status
			Binary input[3]
			2
			1=ON; 0=OFF
		
		
			Fan Speed Set
			Multi-state Output[14]
			2
			4=H; 3=M; 2=L; 1=AUTO
		
		
			Fan Speed Status
			Multi-state Input[13]
			2
			4=H; 3=M; 2=L; 1=AUTO
		
		
			Fan Louver Set
			Multi-state Output[14]
			130
			 
		
		
			Fan Louver Status
			Multi-state Input[13]
			130
			 
		
		
			Operating Mode Set
			Multi-state Output[14]
			258
			1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto
		
		
			Operating Mode Status
			Multi-state Input[13]
			258
			1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto
		
		
			Temperature set
			Analog-Value[1]
			2
			 
		
		
			Temperature set Status
			Analog-Input[0]
			2
			 
		
		
			Current Temperature
			Analog-Input[0]
			130
			 
		
		
			Error Code
			Multi-state Input[13]
			386
			See attachment
		
		
			n
			ON/OFF Set
			Binary Output[4]
			n
			1=ON; 0=OFF
		
		
			ON/OFF Status
			Binary input[3]
			n
			1=ON; 0=OFF
		
		
			Fan Speed Set
			Multi-state Output[14]
			n
			4=H; 3=M; 2=L; 1=AUTO
		
		
			Fan Speed Status
			Multi-state Input[13]
			n
			4=H; 3=M; 2=L; 1=AUTO
		
		
			Fan Louver Set
			Multi-state Output[14]
			n+128
			 
		
		
			Fan Louver Status
			Multi-state Input[13]
			n+128
			 
		
		
			Operating Mode Set
			Multi-state Output[14]
			n+256
			1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto
		
		
			Operating Mode Status
			Multi-state Input[13]
			n+256
			1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto
		
		
			Temperature set
			Analog-Value[1]
			1
			 
		
		
			Temperature set Status
			Analog-Input[0]
			1
			 
		
		
			Current Temperature
			Analog-Input[0]
			n+128
			 
		
		
			Error Code
			Multi-state Input[13]
			n+384
			See attachment

## Raw JSON-LD

```json
[
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html#webpage",
        "url": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html",
        "name": "Hướng dẫn kết nối điều hòa không khí - Dòng KAC00X",
        "description": "Hướng dẫn kết nối dòng KAC001, KAC005, KAC008 với điều hòa không khí các hãng như Daikin, Toshiba, Mitubishi, Hitachi,...",
        "inLanguage": "vi-VN",
        "datePublished": "2025-04-09T15:40:50+07:00",
        "dateModified": "2025-04-09T15:40:50+07:00",
        "isPartOf": {
          "@id": "https://knxstore.vn/#website"
        },
        "publisher": {
          "@id": "https://knxstore.vn/#organization"
        },
        "mainEntity": {
          "@id": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html#article"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html#featured-image",
          "url": "https://knxstore.vn/assets/image/post/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.jpg",
          "contentUrl": "https://knxstore.vn/assets/image/post/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.jpg",
          "caption": "Hướng dẫn kết nối điều hòa không khí - Dòng KAC00X"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Trang chủ",
              "item": "https://knxstore.vn/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blogs",
              "item": "https://knxstore.vn/blogs"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Hướng dẫn",
              "item": "https://knxstore.vn/blogs/huong-dan"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "Hướng dẫn kết nối điều hòa không khí - Dòng KAC00X",
              "item": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html"
            }
          ]
        }
      },
      {
        "@type": "BlogPosting",
        "@id": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html#article",
        "mainEntityOfPage": {
          "@id": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html#webpage"
        },
        "headline": "Hướng dẫn kết nối điều hòa không khí - Dòng KAC00X",
        "description": "Hướng dẫn kết nối dòng KAC001, KAC005, KAC008 với điều hòa không khí các hãng như Daikin, Toshiba, Mitubishi, Hitachi,...",
        "articleBody": "Bộ điều khiển trung tâm dòng KAC00X được kết nối trực tiếp với thiết bị chính và tương ứng với dàn nóng hoặc dàn lạnh thông qua giao thức HBS/XYE của điều hòa không khí trung tâm.\r\n\r\n​Bài viết này cung cấp hướng dẫn chi tiết về cách kết nối và điều khiển hệ thống điều hòa không khí dòng KAC00X, giúp bạn tích hợp hiệu quả vào hệ thống tự động hóa tòa nhà. Ngoài ra, phương pháp này cũng có thể áp dụng tương tự cho các thiết bị điều khiển khác khi cần kết nối vào hệ thống Casambi, mở rộng khả năng tích hợp cho nhiều loại thiết bị khác nhau.​\r\n\r\nLựa chọn sản phẩm\r\n\r\nCác sản phẩm trong dòng FEW Host của Kanontec được chia thành ba dòng là KAC001, KAC005 và KAC008. Mỗi dòng hỗ trợ kết nối trực tiếp với bốn loại bus nội bộ của các hệ thống điều hòa trung tâm của Daikin/Toshiba/Mitsubishi Electric/Hitachi (HBS - HVAC Bus System). Chi tiết như sau:\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\tMã sản phẩm\r\n\t\t\tMô tả kết nối\r\n\t\t\tTính năng\r\n\t\t\r\n\t\t\r\n\t\t\tKAC001-(DK/TB/MSE/HT)\r\n\t\t\t1xHBS\r\n\t\t\t1xRS485\r\n\t\t\t- RS485/Modbus RTU\r\n\t\t\t- Logic control\r\n\t\t\r\n\t\t\r\n\t\t\tKAC005-(DK/TB/MSE/HT)\r\n\t\t\t1xHBS\r\n\t\t\t1xAPP\r\n\t\t\t1xKNX\r\n\t\t\t- IOS/Android/PC software\r\n\t\t\t- Cloud server features\r\n\t\t\t- HBS air conditioner direct connection (U1/U2)\r\n\t\t\t- KNX/EIB interface\r\n\t\t\t- Logic control\r\n\t\t\r\n\t\t\r\n\t\t\tKAC008-(DK/TB/MSE/HT)\r\n\t\t\t1xHBS\r\n\t\t\t1xAPP\r\n\t\t\t1xKNX\r\n\t\t\t1xRS485\r\n\t\t\t1xRS232\r\n\t\t\t- IOS/Android/PC software\r\n\t\t\t- Cloud server features\r\n\t\t\t- HBS air conditioner direct connection (U1/U2)\r\n\t\t\t- KNX/EIB interface\r\n\t\t\t- Logic control\r\n\t\t\t- Various protocols based on RS485\r\n\t\t\t- Various protocols based on RS232\r\n\t\t\t- Logic control\r\n\t\t\r\n\t\r\n\r\n\r\nTổng quan về bus điều hòa không khí\r\n\r\nHiện nay, các thương hiệu điều hòa không khí cơ bản sử dụng giao thức bus HBS (HVAC Bus System) như một tiêu chuẩn để trao đổi dữ liệu trong các hệ thống điều hòa không khí.\r\n\r\nCác thương hiệu bus điều hòa không khí VRV/VRF được hỗ trợ bởi các sản phẩm trong dòng KAC được mô tả như sau:\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\tThương hiệu\r\n\t\t\tTên bus\r\n\t\t\tCổng kết nối\r\n\t\t\tPhân cực bus (dương hoặc âm)\r\n\t\t\tSố lượng dàn lạnh hỗ trợ\r\n\t\t\r\n\t\t\r\n\t\t\tDaikin\r\n\t\t\tD3 Net\r\n\t\t\tF1, F2\r\n\t\t\tnot\r\n\t\t\t32\r\n\t\t\r\n\t\t\r\n\t\t\tToshiba\r\n\t\t\tTCC Link\r\n\t\t\tU1, U2\r\n\t\t\tnot\r\n\t\t\t32\r\n\t\t\r\n\t\t\r\n\t\t\tMitsubishi Electric\r\n\t\t\tM-Net\r\n\t\t\tTB3/TB7\r\n\t\t\tnot\r\n\t\t\t32\r\n\t\t\r\n\t\t\r\n\t\t\tHitachi\r\n\t\t\tH-Link/H-Link2\r\n\t\t\t1, 2\r\n\t\t\tnot\r\n\t\t\t32\r\n\t\t\r\n\t\r\n\r\n\r\nTổng quan về điều hòa không khí\r\n\r\nBằng cách sử dụng các sản phẩm gateway dòng KAC, hệ thống nhà thông minh hoặc hệ thống tự động hóa tòa nhà có thể quản lý và điều khiển trực tiếp hệ thống điều hòa trung tâm.\r\n\r\nHỗ trợ các mã sản phẩm (mã dàn nóng)\r\n\r\nPhù hợp cho các hệ thống điều hòa trung tâm có hệ thống bus, vui lòng tham khảo bộ phận bán hàng hoặc hỗ trợ kỹ thuật trước bán hàng của chúng tôi để biết thông tin chi tiết.\r\n\r\nSơ đồ kết nối\r\n\r\nKAC thường kết nối U1 và U2 với A và B của cổng kết nối trên dàn nóng của máy điều hòa không khí, mà không phân biệt cực dương và cực âm. Nếu không tiện, nó cũng có thể được kết nối với A và B trên dàn lạnh được lắp đặt trong nhà.\r\n\r\n\r\n\r\n\r\n\r\nThiết lập địa chỉ cho điều hòa không khí\r\n\r\nThiết lập địa chỉ dàn lạnh (1~50)\r\n\r\nThiết lập địa chỉ cho máy điều hòa trung tâm phải được thiết lập bằng cách xoay núm vặn trên bo mạch hoặc remote gắn tường trong nhà. Liên hệ đơn vị cung cấp điều hòa để được hỗ trợ thiết lập địa chỉ theo mã sản phẩm.\r\n\r\nXem địa chỉ dàn lạnh\r\n\r\nTrong trạng thái tắt của dàn lạnh, bạn sẽ thấy một nút kiểm tra ở góc dưới bên phải của bộ điều khiển dây hoặc remote gắn tường.\r\n\r\nBan đầu, nó sẽ hiển thị 00, và sau vài giây, nó sẽ hiển thị địa chỉ của dàn lạnh.\r\n\r\nĐể thoát, nhấn nút nguồn.\r\n\r\nLưu ý: Nếu có các thiết bị điều khiển trung tâm khác trong hệ thống, hãy lưu ý rằng địa chỉ không được trùng lặp.\r\n\r\nCác bước thực hiện kết nối thiết bị\r\n\r\nKết nối dây\r\n\r\nKết nối U1,U2 của KAC với A,B của board mạch.\r\n\r\nĐịa chỉ điều hòa không khí\r\n\r\nĐịa chỉ được thiết lập ở mục thiết lập địa chỉ ở trên.\r\n\r\nKhởi động lại tất cả dàn nóng, dàn lạnh và KAC\r\n\r\nLưu ý: Sau khi KAC được cấp nguồn, sẽ có quá trình tự kiểm tra, hiện tượng là đèn đỏ và đèn xanh nhấp nháy đồng bộ trong 0,5 giây. Nếu tự kiểm tra thất bại (ví dụ, có vấn đề với dây điều hòa không khí), hãy đợi 30 giây và lặp lại quá trình tự kiểm tra.\r\n\r\nSử dụng bảng giá trị tích hợp hoặc ứng dụng để hoàn thành việc tích hợp hệ thống. (Xem các mục Bảng giá trị tích hợp bên dưới)\r\n\r\nBảng giá trị tích hợp\r\n\r\nBảng giá trị Modbus\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\tDàn lạnh\r\n\t\t\tChức năng\r\n\t\t\tĐiều khiển\r\n\t\t\tGiá trị điều khiển\r\n\t\t\tGiá trị trạng thái\r\n\t\t\r\n\t\t\r\n\t\t\tn\r\n\t\t\tn=1~16\r\n\t\t\tON/OFF\r\n\t\t\t1=ON, 0=OFF\r\n\t\t\t0x03/0x06\r\n\t\t\t40002+(n-1)*10\r\n\t\t\t0x04\r\n\t\t\t30002+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tMode Choice\r\n\t\t\t0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto\r\n\t\t\t0x03/0x06\r\n\t\t\t40003+(n-1)*10\r\n\t\t\t0x04\r\n\t\t\t30003+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tSet Temperature\r\n\t\t\tSAME\r\n\t\t\t0x03/0x06\r\n\t\t\t40004+(n-1)*10\r\n\t\t\t0x04\r\n\t\t\t30004+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed\r\n\t\t\t0=Auto, 1=L, 2=M, 3=H\r\n\t\t\t0x03/0x06\r\n\t\t\t40005+(n-1)*10\r\n\t\t\t0x04\r\n\t\t\t30005+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tRoom Temperature\r\n\t\t\tSAME\r\n\t\t\t-\r\n\t\t\t-\r\n\t\t\t0x04\r\n\t\t\t30006+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tn\r\n\t\t\tn=17~32\r\n\t\t\tON/OFF\r\n\t\t\t1=ON, 0=OFF\r\n\t\t\t0x03/0x06\r\n\t\t\t40258+(n-17)*10\r\n\t\t\t0x04\r\n\t\t\t30258+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tMode Choice\r\n\t\t\t0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto\r\n\t\t\t0x03/0x06\r\n\t\t\t40259+(n-17)*10\r\n\t\t\t0x04\r\n\t\t\t30259+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tSet Temperature\r\n\t\t\tSAME\r\n\t\t\t0x03/0x06\r\n\t\t\t40260+(n-17)*10\r\n\t\t\t0x04\r\n\t\t\t30260+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed\r\n\t\t\t0=Auto, 1=L, 2=M, 3=H\r\n\t\t\t0x03/0x06\r\n\t\t\t40261+(n-17)*10\r\n\t\t\t0x04\r\n\t\t\t30261+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tRoom Temperature\r\n\t\t\tSAME\r\n\t\t\t-\r\n\t\t\t-\r\n\t\t\t0x04\r\n\t\t\t30262+(n-17)*10\r\n\t\t\r\n\t\r\n\r\n\r\nBảng giá trị KNX/EIB\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\tDàn lạnh\r\n\t\t\tChức năng\r\n\t\t\tĐiều khiển\r\n\t\t\tGiá trị điều khiển\r\n\t\t\tGiá trị trạng thái\r\n\t\t\r\n\t\t\r\n\t\t\tn\r\n\t\t\tn=1~16\r\n\t\t\tON/OFF\r\n\t\t\t1=ON, 0=OFF\r\n\t\t\tEIS1\r\n\t\t\t14/0/1+(n-1)*10\r\n\t\t\tEIS1\r\n\t\t\t15/0/1+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tMode Choice\r\n\t\t\t0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto\r\n\t\t\tEIS6\r\n\t\t\t14/0/2+(n-1)*10\r\n\t\t\tEIS6\r\n\t\t\t15/0/2+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tSet Temperature\r\n\t\t\tSAME\r\n\t\t\tEIS5\r\n\t\t\t14/0/3+(n-1)*10\r\n\t\t\tEIS5\r\n\t\t\t15/0/3+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed\r\n\t\t\t0=Auto, 1=L, 2=M, 3=H\r\n\t\t\tEIS6\r\n\t\t\t14/0/4+(n-1)*10\r\n\t\t\tEIS6\r\n\t\t\t15/0/4+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tRoom Temperature\r\n\t\t\tSAME\r\n\t\t\t-\r\n\t\t\t-\r\n\t\t\tEIS5\r\n\t\t\t15/0/5+(n-1)*10\r\n\t\t\r\n\t\t\r\n\t\t\tn\r\n\t\t\tn=17~32\r\n\t\t\tON/OFF\r\n\t\t\t1=ON, 0=OFF\r\n\t\t\tEIS1\r\n\t\t\t14/1/1+(n-17)*10\r\n\t\t\tEIS1\r\n\t\t\t15/1/1+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tMode Choice\r\n\t\t\t0=COOL, 1=HEAT, 2=Fan, 3=DRY, 4=Auto\r\n\t\t\tEIS6\r\n\t\t\t14/1/2+(n-17)*10\r\n\t\t\tEIS6\r\n\t\t\t15/1/2+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tSet Temperature\r\n\t\t\tSAME\r\n\t\t\tEIS5\r\n\t\t\t14/1/3+(n-17)*10\r\n\t\t\tEIS5\r\n\t\t\t15/1/3+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed\r\n\t\t\t0=Auto, 1=L, 2=M, 3=H\r\n\t\t\tEIS6\r\n\t\t\t14/1/4+(n-17)*10\r\n\t\t\tEIS6\r\n\t\t\t15/1/4+(n-17)*10\r\n\t\t\r\n\t\t\r\n\t\t\tRoom Temperature\r\n\t\t\tSAME\r\n\t\t\t-\r\n\t\t\t-\r\n\t\t\tEIS5\r\n\t\t\t15/1/5+(n-17)*10\r\n\t\t\r\n\t\r\n\r\n\r\nBảng giá trị BACnet\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\tDàn lạnh\r\n\t\t\tChức năng\r\n\t\t\tKiểu đối tượng\r\n\t\t\tThể hiện đối tượng\r\n\t\t\tGiá trị\r\n\t\t\r\n\t\t\r\n\t\t\t1\r\n\t\t\tON/OFF Set\r\n\t\t\tBinary Output[4]\r\n\t\t\t1\r\n\t\t\t1=ON; 0=OFF\r\n\t\t\r\n\t\t\r\n\t\t\tON/OFF Status\r\n\t\t\tBinary input[3]\r\n\t\t\t1\r\n\t\t\t1=ON; 0=OFF\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\t1\r\n\t\t\t4=H; 3=M; 2=L; 1=AUTO\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t1\r\n\t\t\t4=H; 3=M; 2=L; 1=AUTO\r\n\t\t\r\n\t\t\r\n\t\t\tFan Louver Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\t129\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tFan Louver Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t129\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tOperating Mode Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\t257\r\n\t\t\t1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto\r\n\t\t\r\n\t\t\r\n\t\t\tOperating Mode Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t257\r\n\t\t\t1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto\r\n\t\t\r\n\t\t\r\n\t\t\tTemperature set\r\n\t\t\tAnalog-Value[1]\r\n\t\t\t1\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tTemperature set Status\r\n\t\t\tAnalog-Input[0]\r\n\t\t\t1\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tCurrent Temperature\r\n\t\t\tAnalog-Input[0]\r\n\t\t\t129\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tError Code\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t385\r\n\t\t\tSee attachment\r\n\t\t\r\n\t\t\r\n\t\t\t2\r\n\t\t\tON/OFF Set\r\n\t\t\tBinary Output[4]\r\n\t\t\t2\r\n\t\t\t1=ON; 0=OFF\r\n\t\t\r\n\t\t\r\n\t\t\tON/OFF Status\r\n\t\t\tBinary input[3]\r\n\t\t\t2\r\n\t\t\t1=ON; 0=OFF\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\t2\r\n\t\t\t4=H; 3=M; 2=L; 1=AUTO\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t2\r\n\t\t\t4=H; 3=M; 2=L; 1=AUTO\r\n\t\t\r\n\t\t\r\n\t\t\tFan Louver Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\t130\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tFan Louver Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t130\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tOperating Mode Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\t258\r\n\t\t\t1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto\r\n\t\t\r\n\t\t\r\n\t\t\tOperating Mode Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t258\r\n\t\t\t1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto\r\n\t\t\r\n\t\t\r\n\t\t\tTemperature set\r\n\t\t\tAnalog-Value[1]\r\n\t\t\t2\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tTemperature set Status\r\n\t\t\tAnalog-Input[0]\r\n\t\t\t2\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tCurrent Temperature\r\n\t\t\tAnalog-Input[0]\r\n\t\t\t130\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tError Code\r\n\t\t\tMulti-state Input[13]\r\n\t\t\t386\r\n\t\t\tSee attachment\r\n\t\t\r\n\t\t\r\n\t\t\tn\r\n\t\t\tON/OFF Set\r\n\t\t\tBinary Output[4]\r\n\t\t\tn\r\n\t\t\t1=ON; 0=OFF\r\n\t\t\r\n\t\t\r\n\t\t\tON/OFF Status\r\n\t\t\tBinary input[3]\r\n\t\t\tn\r\n\t\t\t1=ON; 0=OFF\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\tn\r\n\t\t\t4=H; 3=M; 2=L; 1=AUTO\r\n\t\t\r\n\t\t\r\n\t\t\tFan Speed Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\tn\r\n\t\t\t4=H; 3=M; 2=L; 1=AUTO\r\n\t\t\r\n\t\t\r\n\t\t\tFan Louver Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\tn+128\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tFan Louver Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\tn+128\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tOperating Mode Set\r\n\t\t\tMulti-state Output[14]\r\n\t\t\tn+256\r\n\t\t\t1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto\r\n\t\t\r\n\t\t\r\n\t\t\tOperating Mode Status\r\n\t\t\tMulti-state Input[13]\r\n\t\t\tn+256\r\n\t\t\t1=Cool; 2=Heat; 3=Fan; 4=Dry; 5=Auto\r\n\t\t\r\n\t\t\r\n\t\t\tTemperature set\r\n\t\t\tAnalog-Value[1]\r\n\t\t\t1\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tTemperature set Status\r\n\t\t\tAnalog-Input[0]\r\n\t\t\t1\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tCurrent Temperature\r\n\t\t\tAnalog-Input[0]\r\n\t\t\tn+128\r\n\t\t\t \r\n\t\t\r\n\t\t\r\n\t\t\tError Code\r\n\t\t\tMulti-state Input[13]\r\n\t\t\tn+384\r\n\t\t\tSee attachment\r\n\t\t\r\n\t\r\n\r\n",
        "articleSection": "Hướng dẫn",
        "keywords": [],
        "inLanguage": "vi-VN",
        "datePublished": "2025-04-09T15:40:50+07:00",
        "dateModified": "2025-04-09T15:40:50+07:00",
        "url": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html",
        "image": {
          "@id": "https://knxstore.vn/huong-dan-ket-noi-dieu-hoa-khong-khi-dong-kac00x.html#featured-image"
        },
        "publisher": {
          "@id": "https://knxstore.vn/#organization"
        },
        "isPartOf": {
          "@id": "https://knxstore.vn/#website"
        },
        "about": {
          "@type": "Thing",
          "name": "Nhà thông minh",
          "description": "Giải pháp smarthome và thiết bị thông minh"
        },
        "mentions": [
          {
            "@type": "Thing",
            "name": "Aqara"
          },
          {
            "@type": "Thing",
            "name": "Apple Home"
          }
        ],
        "contentLocation": {
          "@type": "Country",
          "name": "Việt Nam",
          "identifier": "VN"
        },
        "locationCreated": {
          "@type": "City",
          "name": "TP. Hồ Chí Minh",
          "containedInPlace": {
            "@type": "Country",
            "name": "Việt Nam"
          }
        }
      }
    ]
  }
]
```
