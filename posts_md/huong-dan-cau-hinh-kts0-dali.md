---
url: "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html"
headline: "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus"
description: "KTS0-DALI là một thiết bị điều khiển ánh sáng thông minh, cho phép quản lý và điều chỉnh hệ thống chiếu sáng DALI (Digital Addressable Lighting Interface). Bài viết này sẽ hướng dẫn bạn từng bước cấu hình KTS0-DALI để tối ưu hóa hiệu suất chiếu sáng."
title: "Hướng dẫn cấu hình KTS0-DALI"
og_site_name: "KNX Store"
image: "https://knxstore.vn/assets/image/post/huong-dan-cau-hinh-kts0-dali.jpg"
datePublished: "2025-02-24T11:17:51+07:00"
dateModified: "2025-02-24T11:17:51+07:00"
articleSection: "Chiếu sáng"
word_count: 799
mentions: ["Aqara", "Apple Home"]
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Blogs"
    url: "https://knxstore.vn/blogs"
  - name: "Chiếu sáng"
    url: "https://knxstore.vn/blogs/chieu-sang"
  - name: "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus"
    url: "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html"
internal_links:
  - url: "https://knxstore.vn/casambi-khong-ket-noi-homekit-mtb10-matter-bridge-la-giai-phap.html"
    slug: "casambi-khong-ket-noi-homekit-mtb10-matter-bridge-la-giai-phap"
    anchor: "Casambi không kết nối HomeKit? MTB10 Matter Bridge là giải pháp"
  - url: "https://knxstore.vn/nfc-trong-he-thong-chieu-sang-thong-minh-hoat-dong-nhu-the-nao.html"
    slug: "nfc-trong-he-thong-chieu-sang-thong-minh-hoat-dong-nhu-the-nao"
    anchor: "NFC có được sử dụng trong hệ thống chiếu sáng thông minh không?"
  - url: "https://knxstore.vn/thiet-ke-he-chieu-sang-dali-mo-rong-bang-casambi-se-nhu-the-nao.html"
    slug: "thiet-ke-he-chieu-sang-dali-mo-rong-bang-casambi-se-nhu-the-nao"
    anchor: "Thiết kế hệ chiếu sáng DALI mở rộng bằng Casambi sẽ như thế nào?"
  - url: "https://knxstore.vn/casambi-case-study-chieu-sang-dali-trong-cong-trinh-di-san-giardino-palazzo-pfanner.html"
    slug: "casambi-case-study-chieu-sang-dali-trong-cong-trinh-di-san-giardino-palazzo-pfanner"
    anchor: "Casambi Case Study | Chiếu sáng DALI trong công trình di sản Giardino Palazzo Pfanner"
  - url: "https://knxstore.vn/casambi-case-study-chieu-sang-khong-gian-showroom-blum-experience-center.html"
    slug: "casambi-case-study-chieu-sang-khong-gian-showroom-blum-experience-center"
    anchor: "Casambi Case Study | Chiếu sáng không gian showroom Blum Experience Center"
  - url: "https://knxstore.vn/cct-la-gi-trong-chieu-sang.html"
    slug: "cct-la-gi-trong-chieu-sang"
    anchor: "CCT là gì trong chiếu sáng?"
  - url: "https://knxstore.vn/chi-so-ugr-la-gi.html"
    slug: "chi-so-ugr-la-gi"
    anchor: "Chỉ số UGR là gì"
  - url: "https://knxstore.vn/su-khac-biet-giua-cong-nghe-dmx512-va-spi-la-gi.html"
    slug: "su-khac-biet-giua-cong-nghe-dmx512-va-spi-la-gi"
    anchor: "LED Dây Pixel SPI vs DMX512 Khác Nhau Thế Nào?"
  - url: "https://knxstore.vn/6-loai-cam-bien-quan-trong-trong-he-thong-chieu-sang-thong-minh.html"
    slug: "6-loai-cam-bien-quan-trong-trong-he-thong-chieu-sang-thong-minh"
    anchor: "6 loại cảm biến quan trọng trong hệ thống chiếu sáng thông minh"
  - url: "https://knxstore.vn/vi-sao-tinh-tuong-tac-quyet-dinh-hieu-qua-cua-he-thong-chieu-sang-thong-minh.html"
    slug: "vi-sao-tinh-tuong-tac-quyet-dinh-hieu-qua-cua-he-thong-chieu-sang-thong-minh"
    anchor: "Vì sao tính tương tác quyết định hiệu quả của hệ thống chiếu sáng thông minh?"
---

# Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus

> KTS0-DALI là một thiết bị điều khiển ánh sáng thông minh, cho phép quản lý và điều chỉnh hệ thống chiếu sáng DALI (Digital Addressable Lighting Interface). Bài viết này sẽ hướng dẫn bạn từng bước cấu hình KTS0-DALI để tối ưu hóa hiệu suất chiếu sáng.

## Article Body

Bài viết này sẽ hướng dẫn bạn từng bước cấu hình KTS0-DALI để tối ưu hóa hiệu suất chiếu sáng.

KTS0-DALI là một thiết bị điều khiển ánh sáng thông minh, cho phép quản lý và điều chỉnh hệ thống chiếu sáng DALI (Digital Addressable Lighting Interface). Nói cách khác, KTS0-DALI đóng vai trò như một cầu nối giữa hệ thống DALI và các hệ thống điều khiển khác thông qua giao diện hệ thống nhà thông minh.

Bước 1 - Cấu hình với ETS

Nhập dự án ETS

Chọn tệp dự án ETS phù hợp và nhập vào ETS5.

Thêm thiết bị vào dự án

Thêm thiết bị KTS0-DALI vào dự án đã tạo trong ETS5.

Tải địa chỉ vật lý


	Nhấn nút lập trình trên thiết bị và sử dụng ETS5 để tải địa chỉ vật lý vào thiết bị.
	Sau khi tải xong, đèn LED màu đỏ sẽ tắt.


Cấu hình thông số thiết bị


	Mở cơ sở dữ liệu của thiết bị và cấu hình các tham số cần thiết.
	Tiến hành tải ứng dụng để áp dụng các cấu hình.


Thay đổi địa chỉ vật lý

Nếu cần thay đổi địa chỉ vật lý của thiết bị, lặp lại bước 3.

Cập nhật tham số

Sau khi thay đổi các tham số, lặp lại bước 4 để kích hoạt các chức năng mới.

Cấu hình thông số khác

Tại cơ sở dữ liệu ETS của KTS0-DALI, bạn có thể thiết lập các tham số như địa chỉ nhóm, độ sáng mở, tốc độ điều chỉnh ánh sáng, và đường cong điều chỉnh.

Bước 2 - Sử dụng KTS với trình duyệt web

Trình duyệt web

Sử dụng trình duyệt không dựa trên IE như Firefox hoặc Chrome để thực hiện các cài đặt.

Địa chỉ đăng nhập

Mở trình duyệt và truy cập địa chỉ: 192.168.1.232/dali/ (nếu có thay đổi, hãy dùng địa chỉ IP mới).

Thêm KTS0-DALI

Nhấn nút “+” để thêm KTS0-DALI vào hệ thống.

Quản lý thiết bị

Nhấn vào gateway đã thêm để truy cập các chức năng:


	Phân bổ địa chỉ: Chọn giữa “Phân bổ mới” cho hệ thống DALI mới hoặc “Phân bổ mở rộng” cho việc bảo trì hệ thống DALI hiện có.
	Tìm kiếm địa chỉ: Tìm kiếm các thiết bị DALI hiện có và hiển thị chúng trên trang.


Điều khiển ánh sáng


	Nhấn ngắn vào biểu tượng đèn để bật/tắt đèn. Nhấn lâu để nhóm đèn lại và điều khiển từ trang “Thông tin nhóm”.
	Màu sắc biểu tượng:
	
		Màu xanh: Đèn đang bật.
		Màu xám: Đèn đang tắt.
		Màu đỏ: Đèn gặp sự cố.
		Viền đỏ: Bộ điều khiển gặp sự cố.
		Màu đỏ + viền đỏ: Cả đèn và bộ điều khiển đều gặp sự cố.
	
	


Lưu ý: Địa chỉ 192.168.1.232 là địa chỉ mặc định của KTS. Nếu đã thay đổi, hãy sử dụng địa chỉ IP mới.

Bước 3 - Gán Địa Chỉ DALI bằng DALI-Cockpit

Chuẩn bị phần cứng


	USB-DALI Lunatone: Kết nối thiết bị USB-DALI vào cổng USB của máy tính.
	Dây tín hiệu DALI: Gắn dây tín hiệu DALI của hệ thống vào đầu vào của USB-DALI Lunatone.


Cài đặt phần mềm DALI-Cockpit


	Tải và cài đặt phần mềm DALI-Cockpit từ trang web chính thức.
	Mở phần mềm sau khi cài đặt hoàn tất.


Kết nối với thiết bị DALI


	Trong DALI-Cockpit, chọn “Kết nối” để bắt đầu quét các thiết bị DALI trong hệ thống.
	Bạn cần đảm bảo rằng phần mềm đã nhận diện tất cả các thiết bị DALI hiện có.


Đọc địa chỉ và gán nhóm điều khiển


	Sau khi quét xong, phần mềm sẽ hiển thị danh sách các thiết bị DALI và địa chỉ của chúng.
	Chọn thiết bị mà bạn muốn gán địa chỉ hoặc nhóm điều khiển.
	Sử dụng thông tin từ file đính kèm để gán nhóm điều khiển theo mong muốn (Group Address).


Lưu cài đặt


	Sau khi gán nhóm điều khiển, nhấn “Lưu” để cập nhật các thay đổi vào thiết bị DALI.
	Kiểm tra xem tất cả các thiết bị đã được cấu hình đúng theo nhóm điều khiển đã chọn.


Kết nối lại với KTS0-DALI

Sau khi hoàn tất gán địa chỉ và nhóm điều khiển, ngắt kết nối USB-DALI Lunatone và gắn lại dây tín hiệu DALI vào KTS0-DALI. KTS0-DALI sẽ tự động nhận diện và điều khiển các nhóm mà bạn đã gán.

Kiểm tra hoạt động

Sau khi hoàn tất các bước cấu hình trên, bạn có thể mở phần mềm điều khiển của KTS0-DALI để kiểm tra xem các nhóm điều khiển đã hoạt động đúng theo mong muốn hay chưa. Nếu cần thiết, điều chỉnh lại các tham số trong phần mềm DALI-Cockpit và lặp lại quá trình lưu.

## Raw JSON-LD

```json
[
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html#webpage",
        "url": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html",
        "name": "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus",
        "description": "KTS0-DALI là một thiết bị điều khiển ánh sáng thông minh, cho phép quản lý và điều chỉnh hệ thống chiếu sáng DALI (Digital Addressable Lighting Interface). Bài viết này sẽ hướng dẫn bạn từng bước cấu hình KTS0-DALI để tối ưu hóa hiệu suất chiếu sáng.",
        "inLanguage": "vi-VN",
        "datePublished": "2025-02-24T11:17:51+07:00",
        "dateModified": "2025-02-24T11:17:51+07:00",
        "isPartOf": {
          "@id": "https://knxstore.vn/#website"
        },
        "publisher": {
          "@id": "https://knxstore.vn/#organization"
        },
        "mainEntity": {
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html#article"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html#featured-image",
          "url": "https://knxstore.vn/assets/image/post/huong-dan-cau-hinh-kts0-dali.jpg",
          "contentUrl": "https://knxstore.vn/assets/image/post/huong-dan-cau-hinh-kts0-dali.jpg",
          "caption": "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus"
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
              "name": "Chiếu sáng",
              "item": "https://knxstore.vn/blogs/chieu-sang"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus",
              "item": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html"
            }
          ]
        }
      },
      {
        "@type": "BlogPosting",
        "@id": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html#article",
        "mainEntityOfPage": {
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html#webpage"
        },
        "headline": "Hướng dẫn cấu hình thiết bị KTS0-DALI thương hiệu Kanonbus",
        "description": "KTS0-DALI là một thiết bị điều khiển ánh sáng thông minh, cho phép quản lý và điều chỉnh hệ thống chiếu sáng DALI (Digital Addressable Lighting Interface). Bài viết này sẽ hướng dẫn bạn từng bước cấu hình KTS0-DALI để tối ưu hóa hiệu suất chiếu sáng.",
        "articleBody": "Bài viết này sẽ hướng dẫn bạn từng bước cấu hình KTS0-DALI để tối ưu hóa hiệu suất chiếu sáng.\r\n\r\nKTS0-DALI là một thiết bị điều khiển ánh sáng thông minh, cho phép quản lý và điều chỉnh hệ thống chiếu sáng DALI (Digital Addressable Lighting Interface). Nói cách khác, KTS0-DALI đóng vai trò như một cầu nối giữa hệ thống DALI và các hệ thống điều khiển khác thông qua giao diện hệ thống nhà thông minh.\r\n\r\nBước 1 - Cấu hình với ETS\r\n\r\nNhập dự án ETS\r\n\r\nChọn tệp dự án ETS phù hợp và nhập vào ETS5.\r\n\r\nThêm thiết bị vào dự án\r\n\r\nThêm thiết bị KTS0-DALI vào dự án đã tạo trong ETS5.\r\n\r\nTải địa chỉ vật lý\r\n\r\n\r\n\tNhấn nút lập trình trên thiết bị và sử dụng ETS5 để tải địa chỉ vật lý vào thiết bị.\r\n\tSau khi tải xong, đèn LED màu đỏ sẽ tắt.\r\n\r\n\r\nCấu hình thông số thiết bị\r\n\r\n\r\n\tMở cơ sở dữ liệu của thiết bị và cấu hình các tham số cần thiết.\r\n\tTiến hành tải ứng dụng để áp dụng các cấu hình.\r\n\r\n\r\nThay đổi địa chỉ vật lý\r\n\r\nNếu cần thay đổi địa chỉ vật lý của thiết bị, lặp lại bước 3.\r\n\r\nCập nhật tham số\r\n\r\nSau khi thay đổi các tham số, lặp lại bước 4 để kích hoạt các chức năng mới.\r\n\r\nCấu hình thông số khác\r\n\r\nTại cơ sở dữ liệu ETS của KTS0-DALI, bạn có thể thiết lập các tham số như địa chỉ nhóm, độ sáng mở, tốc độ điều chỉnh ánh sáng, và đường cong điều chỉnh.\r\n\r\nBước 2 - Sử dụng KTS với trình duyệt web\r\n\r\nTrình duyệt web\r\n\r\nSử dụng trình duyệt không dựa trên IE như Firefox hoặc Chrome để thực hiện các cài đặt.\r\n\r\nĐịa chỉ đăng nhập\r\n\r\nMở trình duyệt và truy cập địa chỉ: 192.168.1.232/dali/ (nếu có thay đổi, hãy dùng địa chỉ IP mới).\r\n\r\nThêm KTS0-DALI\r\n\r\nNhấn nút “+” để thêm KTS0-DALI vào hệ thống.\r\n\r\nQuản lý thiết bị\r\n\r\nNhấn vào gateway đã thêm để truy cập các chức năng:\r\n\r\n\r\n\tPhân bổ địa chỉ: Chọn giữa “Phân bổ mới” cho hệ thống DALI mới hoặc “Phân bổ mở rộng” cho việc bảo trì hệ thống DALI hiện có.\r\n\tTìm kiếm địa chỉ: Tìm kiếm các thiết bị DALI hiện có và hiển thị chúng trên trang.\r\n\r\n\r\nĐiều khiển ánh sáng\r\n\r\n\r\n\tNhấn ngắn vào biểu tượng đèn để bật/tắt đèn. Nhấn lâu để nhóm đèn lại và điều khiển từ trang “Thông tin nhóm”.\r\n\tMàu sắc biểu tượng:\r\n\t\r\n\t\tMàu xanh: Đèn đang bật.\r\n\t\tMàu xám: Đèn đang tắt.\r\n\t\tMàu đỏ: Đèn gặp sự cố.\r\n\t\tViền đỏ: Bộ điều khiển gặp sự cố.\r\n\t\tMàu đỏ + viền đỏ: Cả đèn và bộ điều khiển đều gặp sự cố.\r\n\t\r\n\t\r\n\r\n\r\nLưu ý: Địa chỉ 192.168.1.232 là địa chỉ mặc định của KTS. Nếu đã thay đổi, hãy sử dụng địa chỉ IP mới.\r\n\r\nBước 3 - Gán Địa Chỉ DALI bằng DALI-Cockpit\r\n\r\nChuẩn bị phần cứng\r\n\r\n\r\n\tUSB-DALI Lunatone: Kết nối thiết bị USB-DALI vào cổng USB của máy tính.\r\n\tDây tín hiệu DALI: Gắn dây tín hiệu DALI của hệ thống vào đầu vào của USB-DALI Lunatone.\r\n\r\n\r\nCài đặt phần mềm DALI-Cockpit\r\n\r\n\r\n\tTải và cài đặt phần mềm DALI-Cockpit từ trang web chính thức.\r\n\tMở phần mềm sau khi cài đặt hoàn tất.\r\n\r\n\r\nKết nối với thiết bị DALI\r\n\r\n\r\n\tTrong DALI-Cockpit, chọn “Kết nối” để bắt đầu quét các thiết bị DALI trong hệ thống.\r\n\tBạn cần đảm bảo rằng phần mềm đã nhận diện tất cả các thiết bị DALI hiện có.\r\n\r\n\r\nĐọc địa chỉ và gán nhóm điều khiển\r\n\r\n\r\n\tSau khi quét xong, phần mềm sẽ hiển thị danh sách các thiết bị DALI và địa chỉ của chúng.\r\n\tChọn thiết bị mà bạn muốn gán địa chỉ hoặc nhóm điều khiển.\r\n\tSử dụng thông tin từ file đính kèm để gán nhóm điều khiển theo mong muốn (Group Address).\r\n\r\n\r\nLưu cài đặt\r\n\r\n\r\n\tSau khi gán nhóm điều khiển, nhấn “Lưu” để cập nhật các thay đổi vào thiết bị DALI.\r\n\tKiểm tra xem tất cả các thiết bị đã được cấu hình đúng theo nhóm điều khiển đã chọn.\r\n\r\n\r\nKết nối lại với KTS0-DALI\r\n\r\nSau khi hoàn tất gán địa chỉ và nhóm điều khiển, ngắt kết nối USB-DALI Lunatone và gắn lại dây tín hiệu DALI vào KTS0-DALI. KTS0-DALI sẽ tự động nhận diện và điều khiển các nhóm mà bạn đã gán.\r\n\r\nKiểm tra hoạt động\r\n\r\nSau khi hoàn tất các bước cấu hình trên, bạn có thể mở phần mềm điều khiển của KTS0-DALI để kiểm tra xem các nhóm điều khiển đã hoạt động đúng theo mong muốn hay chưa. Nếu cần thiết, điều chỉnh lại các tham số trong phần mềm DALI-Cockpit và lặp lại quá trình lưu.\r\n",
        "articleSection": "Chiếu sáng",
        "keywords": [],
        "inLanguage": "vi-VN",
        "datePublished": "2025-02-24T11:17:51+07:00",
        "dateModified": "2025-02-24T11:17:51+07:00",
        "url": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html",
        "image": {
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-kts0-dali.html#featured-image"
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
