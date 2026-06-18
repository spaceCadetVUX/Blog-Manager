---
url: "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html"
headline: "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP"
description: "Khám phá cơ chế AES-128 CCM và Secure Wrapper trong KNXnet/IP. Giải pháp toàn diện giúp chống nghe lén, giả mạo và tấn công phát lại cho hệ thống KNX Secure tại KNXStore."
og_site_name: "KNX Store"
image: "https://knxstore.vn/assets/image/post/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.jpg"
datePublished: "2026-02-01T15:45:01+07:00"
dateModified: "2026-02-01T15:45:01+07:00"
articleSection: "Kiến thức"
word_count: 1456
mentions: ["Aqara", "Apple Home"]
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Blogs"
    url: "https://knxstore.vn/blogs"
  - name: "Kiến thức"
    url: "https://knxstore.vn/blogs/kien-thuc"
  - name: "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP"
    url: "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html"
internal_links:
  - url: "https://knxstore.vn/ic-la-gi-vai-tro-cua-ic-trong-thiet-bi-smarthome.html"
    slug: "ic-la-gi-vai-tro-cua-ic-trong-thiet-bi-smarthome"
    anchor: "IC là gì? Vai trò của IC trong thiết bị Smarthome"
  - url: "https://knxstore.vn/nfc-la-gi-vi-sao-smarthome-hien-dai-deu-tich-hop-cong-nghe-nay.html"
    slug: "nfc-la-gi-vi-sao-smarthome-hien-dai-deu-tich-hop-cong-nghe-nay"
    anchor: "NFC là gì? Vì sao smarthome hiện đại đều tích hợp công nghệ này?"
  - url: "https://knxstore.vn/spi-la-gi-ung-dung-spi-led-controller-trong-led-rgbw.html"
    slug: "spi-la-gi-ung-dung-spi-led-controller-trong-led-rgbw"
    anchor: "SPI là gì? Ứng dụng SPI LED Controller trong LED RGBW"
  - url: "https://knxstore.vn/10-bi-quyet-de-so-huu-mang-thread-on-dinh-muot-ma-cho-smarthome.html"
    slug: "10-bi-quyet-de-so-huu-mang-thread-on-dinh-muot-ma-cho-smarthome"
    anchor: "10 bí quyết để sở hữu mạng Thread ổn định, mượt mà cho Smarthome"
  - url: "https://knxstore.vn/5-buoc-thiet-lap-nha-thong-minh-theo-chuan-matter.html"
    slug: "5-buoc-thiet-lap-nha-thong-minh-theo-chuan-matter"
    anchor: "5 bước thiết lập nhà thông minh theo chuẩn Matter"
  - url: "https://knxstore.vn/faq-giai-dap-cac-cau-hoi-thuong-gap-ve-tieu-chuan-matter.html"
    slug: "faq-giai-dap-cac-cau-hoi-thuong-gap-ve-tieu-chuan-matter"
    anchor: "FAQ: Giải đáp các câu hỏi thường gặp về tiêu chuẩn Matter"
  - url: "https://knxstore.vn/homey-gioi-thieu-phien-ban-self-hosted-server.html"
    slug: "homey-gioi-thieu-phien-ban-self-hosted-server"
    anchor: "Homey giới thiệu phiên bản Self-Hosted Server"
  - url: "https://knxstore.vn/thiet-bi-nao-tuong-thich-voi-matter.html"
    slug: "thiet-bi-nao-tuong-thich-voi-matter"
    anchor: "Thiết bị nào tương thích với Matter?"
  - url: "https://knxstore.vn/vi-sao-hien-tai-chua-co-camera-an-ninh-tuong-thich-matter.html"
    slug: "vi-sao-hien-tai-chua-co-camera-an-ninh-tuong-thich-matter"
    anchor: "Vì sao hiện tại chưa có camera an ninh tương thích Matter?"
  - url: "https://knxstore.vn/top-7-hub-matter-cho-nha-thong-minh.html"
    slug: "top-7-hub-matter-cho-nha-thong-minh"
    anchor: "Top 7 bộ điều khiển trung tâm nhà thông minh Matter"
---

# AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP

> Khám phá cơ chế AES-128 CCM và Secure Wrapper trong KNXnet/IP. Giải pháp toàn diện giúp chống nghe lén, giả mạo và tấn công phát lại cho hệ thống KNX Secure tại KNXStore.

## Article Body

Vai trò của AES-128 CCM trong bảo vệ truyền thông KNX/IP

Với sự phát triển mạnh mẽ của các hệ thống KNX hỗ trợ giao tiếp qua mạng IP, nhu cầu bảo vệ toàn vẹn và bí mật của các telegram KNXnet/IP trở nên hết sức cấp thiết. Mạng IP vốn mang tính mở, có thể bị tấn công nghe trộm, chỉnh sửa hay phát lại gói tin, dẫn đến nguy cơ an toàn cho toàn bộ hệ thống tự động hóa. 



Để khắc phục, KNXnet/IP Secure đã áp dụng AES-128 CCM, một cơ chế kết hợp mã hóa (AES-CTR) và xác thực (AES-CBC-MAC) trong cùng một bước, đảm bảo cả confidentiality, integrity và authentication cho từng telegram.

Bối cảnh và thách thức bảo mật trên KNX/IP

Mạng KNXnet/IP mở rộng hạ tầng KNX truyền thống (TP1, PL, RF) sang mạng IP, tận dụng được băng thông cao và khả năng tích hợp linh hoạt với các hệ thống IT hiện đại. Tuy nhiên, bản chất mở của mạng IP cũng đồng thời khiến các telegram KNX dễ bị can thiệp khi lưu thông qua LAN hoặc Internet, chúng không còn được bảo vệ như trên đường truyền TP1 kín trước đây.



Những mối đe dọa chính đối với KNXnet/IP bao gồm:


	Nghe lén (Eavesdropping): Kẻ tấn công có thể thu thập và giải mã nội dung telegram, từ đó lấy cắp thông tin hoặc dò ra cấu hình hệ thống.
	Chỉnh sửa/Giả mạo (Tampering/Spoofing): Telegram bị thay đổi trực tiếp hoặc gắn thêm các gói tin giả, khiến thiết bị thực thi lệnh không mong muốn.
	Tấn công phát lại (Replay Attack): Kẻ xấu ghi lại telegram hợp lệ rồi phát lại sau, khiến hệ thống lặp lại hành động cũ mà không có sự đồng ý của người dùng


Để khắc phục các lỗ hổng này, KNXnet/IP Secure định nghĩa cơ chế Secure Wrapper sử dụng AES-128 CCM kết hợp mã hóa và xác thực từng telegram, đảm bảo cả confidentiality, integrity và authentication khi truyền qua IP.

Nguyên lý hoạt động của AES-128 CCM (CTR & CBC-MAC)

AES-128 CCM là cơ chế Authenticated Encryption kết hợp hai bước chính để vừa mã hóa, vừa xác thực dữ liệu.



CBC-MAC – Tạo Authentication Tag

Associated Data (A): các trường header của Secure Wrapper (phiên bản, độ dài, sequence counter, control field…) chỉ để xác thực, không mã hóa.



Khởi tạo: CV₀ = 0¹²⁸ (128 bit zero).

Xử lý khối: với mỗi khối Aᵢ (16 octets).



CV_i (Chaining Value khi đã xử lý tới khối thứ i): là giá trị trung gian của CBC-MAC.

CV_{i-1}: Chaining Value từ khối trước (i–1); với CV₀ khởi tạo bằng 128 bit 0.

Aᵢ: Khối dữ liệu đầu vào thứ i; trong CCM, trước hết là các khối của Associated Data (header), sau đó là các khối của plaintext.

⊕: Phép XOR bit-theo-bit.

AES₁₂₈(…): Mã hóa khối 128-bit với khóa chung (Backbone Key / Session Key).

Tiếp tục với plaintext (P): xử lý tương tự để thu được CV_final.

Authentication Tag: lấy t = 8 octets đầu của CV_final.

Mỗi bước, ta xor giá trị chaining trước đó với khối dữ liệu, rồi mã hóa kết quả bằng AES. Sau khi xử lý hết toàn bộ khối A và P, giá trị CV cuối cùng được rút gọn (truncation) để tạo Authentication Tag.

CTR – Mã hóa dữ liệu

Xây dựng Nonce (IV): kết hợp sequence counter và các tham số trong Secure Wrapper, đảm bảo mỗi telegram có IV duy nhất.

Sinh keystream: cho i = 1…n.



Mã hóa: với mỗi khối Pᵢ.



sinh ra ciphertext C.

KSᵢ: Khối keystream thứ i, dùng để mã hóa plaintext khối i.

Nonce ∥ i: Nonce (hay IV) dài 13–15 octets do Secure Wrapper sinh ra, ghép với số thứ tự khối i (counter) để thành 16 octets.

Mỗi KSᵢ được sinh bằng cách mã hóa nonce ∥ i qua AES₁₂₈ với cùng khóa như CBC-MAC

Tổng hợp và kiểm tra

Gắn tag: append Authentication Tag vào cuối ciphertext.

Giải mã & Xác thực: thiết bị nhận tái tính CBC-MAC trên header + ciphertext; nếu tag không khớp, frame bị loại bỏ (bảo vệ integrity & replay)

Với cơ chế này, mỗi telegram KNXnet/IP được bảo vệ đồng thời về bí mật, toàn vẹn và xác thực, đáp ứng yêu cầu bảo mật cho truyền thông KNX/IP.

Cấu trúc Secure Wrapper trong KNXnet/IP

Secure Wrapper quấn quanh mỗi KNXnet/IP Tunnelling Frame, đảm bảo cả mã hóa và xác thực (AES-128 CCM). Cấu trúc này bao gồm 5 thành phần:




	
		
			
			Thành phần
			
			
			Độ dài (octets)
			
			
			Mô tả
			
		
		
			
			1. Secure Header
			
			
			7
			
			
			•ServiceTypeIdentifier (2) – nhận biết khung Secure Wrapper
			
		
		
			
			• TotalLength (2) – độ dài toàn khung tính cả

			  MIC
			
		
		
			
			• ChannelID (1) – ID kết nối tunnelling
			
		
		
			
			• Sequence Counter (1) – bộ đếm tăng liên tục,

			  chống replay
			
		
		
			
			2. Secure Control
			
			
			1
			
			
			• Flags (bit field) – chỉ định độ dài MIC, chế độ vận hành CCM, v.v.
			
		
		
			
			3. Nonce (IV)
			
			
			13
			
			
			• Ghép từ Flags, Sequence Counter và một trường ngẫu nhiên/timestamp do ETS sinh ra.
			
		
		
			
			4. Encrypted Payload
			
			
			n
			
			
			• APDU KNX(Network Layer + Transport + Application Layer) mã hóa bằng AES-CTR
			
		
		
			
			5.Authentication Tag
			
			
			t (thường 8)
			
			
			• MIC =Trunct(CBC-MAC(Header ∥ Ciphertext)) 

			 
			
		
	


Secure Header


	ServiceTypeIdentifier (2 octets): nhận biết đây là khung Secure Wrapper.
	TotalLength (2 octets): tổng độ dài khung (từ ServiceTypeIdentifier đến hết MIC).
	ChannelID (1 octet): ID phiên tunnelling đã mở.
	Sequence Counter (1 octet): tăng dần để chống replay.


Secure Control (1 octet)

Byte flags:


	L (bits 0–2): xác định độ dài MIC = 2·L+2 octets.
	M (bits 3–7): thông số tham số nonce/CCM.


Nonce (IV) (13 octets)


	Bao gồm: Flags (1), Sequence Counter (1) và Random/Counter Field (11–12).
	Đảm bảo mỗi khung có IV duy nhất dùng cho cả CTR và CBC-MAC.


Encrypted Payload (n octets)


	Toàn bộ APDU KNX (Network + Transport + Application Layers).
	Mã hóa bằng AES-CTR với keystream sinh từ Nonce và Backbone Key.


Authentication Tag (MIC) (t octets, thường 8)


	Truncate t octets đầu của kết quả CBC-MAC trên (Header ∥ Control ∥ Nonce ∥ Ciphertext).
	Tag này sau đó cũng được mã hóa (XOR với keystream S₀) trước khi gắn vào cuối frame.


Lợi ích và đánh giá hiệu năng của AES-128 CCM

Lợi ích bảo mật

AES-128 CCM trên KNXnet/IP đồng thời đảm bảo tính bí mật thông qua AES-CTR, tính toàn vẹn và xác thực nhờ CBC-MAC, đồng thời chống phát lại bằng Sequence Counter và Nonce luôn thay đổi. Việc dùng chung engine AES-128 cho cả hai bước giúp giảm thiểu phức tạp firmware, trong khi cho phép tùy biến độ dài MIC (4, 6 hoặc 8 octets) để cân bằng giữa mức độ bảo mật và overhead.



Đánh giá hiệu năng xử lý

Mỗi frame CCM yêu cầu khoảng 2n+2 lần gọi AES cho n khối dữ liệu (n+1 lần cho CBC-MAC và n+1 lần cho CTR) và thêm overhead băng thông ~29–33 octets (Header, Control, Nonce, MIC). Trên MCU 32 MHz với hardware AES accelerator, toàn bộ xử lý cho một frame 1–2 khối hoàn thành trong dưới 1 ms, thoải mái đáp ứng tần suất ≤ 10 telegram/s của KNXnet/IP mà không cần phần cứng phức tạp.

Kết luận và khuyến nghị triển khai KNX Secure tại KNXStore

Với sự kết hợp giữa mã hóa AES-128 CCM và cơ chế Secure Wrapper, KNX Secure đảm bảo tính bí mật, toàn vẹn và chống phát lại (anti-replay) cho mọi telegram khi truyền qua mạng IP.

Khuyến nghị triển khai hiệu quả tại KNXStore:


	Ưu tiên thiết bị phần cứng mạnh mẽ: Lựa chọn các dòng KNX IP và Data Secure tích hợp sẵn bộ tăng tốc phần cứng (AES-128 hardware accelerator) để tối ưu tốc độ xử lý và tiết kiệm năng lượng.
	Quản lý khóa an toàn qua ETS: Sử dụng phần mềm ETS để tự động sinh và quản lý chặt chẽ các loại khóa bảo mật (Backbone Key cho IP Secure và Device Key cho Data Secure).
	Tùy chỉnh độ bảo mật (MIC): Linh hoạt điều chỉnh độ dài mã xác thực MIC (4, 6 hoặc 8 octets) để cân bằng giữa mức độ rủi ro và băng thông hệ thống.
	Giải pháp bảo mật đa lớp: Triển khai đồng thời cả KNX IP Secure và Data Secure để bảo vệ toàn diện dữ liệu từ hạ tầng IP xuống tận các phân đoạn TP1/PL/RF.
	Vận hành & Giám sát: Chú trọng đào tạo kỹ thuật viên về giám sát số thứ tự (Sequence Counter) và xử lý sự cố lỗi thẻ (Tag mismatch) để hệ thống vận hành ổn định, loại bỏ hoàn toàn nguy cơ giả mạo.

## Raw JSON-LD

```json
[
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html#webpage",
        "url": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html",
        "name": "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP",
        "description": "Khám phá cơ chế AES-128 CCM và Secure Wrapper trong KNXnet/IP. Giải pháp toàn diện giúp chống nghe lén, giả mạo và tấn công phát lại cho hệ thống KNX Secure tại KNXStore.",
        "inLanguage": "vi-VN",
        "datePublished": "2026-02-01T15:45:01+07:00",
        "dateModified": "2026-02-01T15:45:01+07:00",
        "isPartOf": {
          "@id": "https://knxstore.vn/#website"
        },
        "publisher": {
          "@id": "https://knxstore.vn/#organization"
        },
        "mainEntity": {
          "@id": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html#article"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html#featured-image",
          "url": "https://knxstore.vn/assets/image/post/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.jpg",
          "contentUrl": "https://knxstore.vn/assets/image/post/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.jpg",
          "caption": "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP"
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
              "name": "Kiến thức",
              "item": "https://knxstore.vn/blogs/kien-thuc"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP",
              "item": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html"
            }
          ]
        }
      },
      {
        "@type": "BlogPosting",
        "@id": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html#article",
        "mainEntityOfPage": {
          "@id": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html#webpage"
        },
        "headline": "AES-128 CCM là gì? Cơ chế bảo mật tối ưu cho giao thức KNX/IP",
        "description": "Khám phá cơ chế AES-128 CCM và Secure Wrapper trong KNXnet/IP. Giải pháp toàn diện giúp chống nghe lén, giả mạo và tấn công phát lại cho hệ thống KNX Secure tại KNXStore.",
        "articleBody": "Vai trò của AES-128 CCM trong bảo vệ truyền thông KNX/IP\r\n\r\nVới sự phát triển mạnh mẽ của các hệ thống KNX hỗ trợ giao tiếp qua mạng IP, nhu cầu bảo vệ toàn vẹn và bí mật của các telegram KNXnet/IP trở nên hết sức cấp thiết. Mạng IP vốn mang tính mở, có thể bị tấn công nghe trộm, chỉnh sửa hay phát lại gói tin, dẫn đến nguy cơ an toàn cho toàn bộ hệ thống tự động hóa. \r\n\r\n\r\n\r\nĐể khắc phục, KNXnet/IP Secure đã áp dụng AES-128 CCM, một cơ chế kết hợp mã hóa (AES-CTR) và xác thực (AES-CBC-MAC) trong cùng một bước, đảm bảo cả confidentiality, integrity và authentication cho từng telegram.\r\n\r\nBối cảnh và thách thức bảo mật trên KNX/IP\r\n\r\nMạng KNXnet/IP mở rộng hạ tầng KNX truyền thống (TP1, PL, RF) sang mạng IP, tận dụng được băng thông cao và khả năng tích hợp linh hoạt với các hệ thống IT hiện đại. Tuy nhiên, bản chất mở của mạng IP cũng đồng thời khiến các telegram KNX dễ bị can thiệp khi lưu thông qua LAN hoặc Internet, chúng không còn được bảo vệ như trên đường truyền TP1 kín trước đây.\r\n\r\n\r\n\r\nNhững mối đe dọa chính đối với KNXnet/IP bao gồm:\r\n\r\n\r\n\tNghe lén (Eavesdropping): Kẻ tấn công có thể thu thập và giải mã nội dung telegram, từ đó lấy cắp thông tin hoặc dò ra cấu hình hệ thống.\r\n\tChỉnh sửa/Giả mạo (Tampering/Spoofing): Telegram bị thay đổi trực tiếp hoặc gắn thêm các gói tin giả, khiến thiết bị thực thi lệnh không mong muốn.\r\n\tTấn công phát lại (Replay Attack): Kẻ xấu ghi lại telegram hợp lệ rồi phát lại sau, khiến hệ thống lặp lại hành động cũ mà không có sự đồng ý của người dùng\r\n\r\n\r\nĐể khắc phục các lỗ hổng này, KNXnet/IP Secure định nghĩa cơ chế Secure Wrapper sử dụng AES-128 CCM kết hợp mã hóa và xác thực từng telegram, đảm bảo cả confidentiality, integrity và authentication khi truyền qua IP.\r\n\r\nNguyên lý hoạt động của AES-128 CCM (CTR & CBC-MAC)\r\n\r\nAES-128 CCM là cơ chế Authenticated Encryption kết hợp hai bước chính để vừa mã hóa, vừa xác thực dữ liệu.\r\n\r\n\r\n\r\nCBC-MAC – Tạo Authentication Tag\r\n\r\nAssociated Data (A): các trường header của Secure Wrapper (phiên bản, độ dài, sequence counter, control field…) chỉ để xác thực, không mã hóa.\r\n\r\n\r\n\r\nKhởi tạo: CV₀ = 0¹²⁸ (128 bit zero).\r\n\r\nXử lý khối: với mỗi khối Aᵢ (16 octets).\r\n\r\n\r\n\r\nCV_i (Chaining Value khi đã xử lý tới khối thứ i): là giá trị trung gian của CBC-MAC.\r\n\r\nCV_{i-1}: Chaining Value từ khối trước (i–1); với CV₀ khởi tạo bằng 128 bit 0.\r\n\r\nAᵢ: Khối dữ liệu đầu vào thứ i; trong CCM, trước hết là các khối của Associated Data (header), sau đó là các khối của plaintext.\r\n\r\n⊕: Phép XOR bit-theo-bit.\r\n\r\nAES₁₂₈(…): Mã hóa khối 128-bit với khóa chung (Backbone Key / Session Key).\r\n\r\nTiếp tục với plaintext (P): xử lý tương tự để thu được CV_final.\r\n\r\nAuthentication Tag: lấy t = 8 octets đầu của CV_final.\r\n\r\nMỗi bước, ta xor giá trị chaining trước đó với khối dữ liệu, rồi mã hóa kết quả bằng AES. Sau khi xử lý hết toàn bộ khối A và P, giá trị CV cuối cùng được rút gọn (truncation) để tạo Authentication Tag.\r\n\r\nCTR – Mã hóa dữ liệu\r\n\r\nXây dựng Nonce (IV): kết hợp sequence counter và các tham số trong Secure Wrapper, đảm bảo mỗi telegram có IV duy nhất.\r\n\r\nSinh keystream: cho i = 1…n.\r\n\r\n\r\n\r\nMã hóa: với mỗi khối Pᵢ.\r\n\r\n\r\n\r\nsinh ra ciphertext C.\r\n\r\nKSᵢ: Khối keystream thứ i, dùng để mã hóa plaintext khối i.\r\n\r\nNonce ∥ i: Nonce (hay IV) dài 13–15 octets do Secure Wrapper sinh ra, ghép với số thứ tự khối i (counter) để thành 16 octets.\r\n\r\nMỗi KSᵢ được sinh bằng cách mã hóa nonce ∥ i qua AES₁₂₈ với cùng khóa như CBC-MAC\r\n\r\nTổng hợp và kiểm tra\r\n\r\nGắn tag: append Authentication Tag vào cuối ciphertext.\r\n\r\nGiải mã & Xác thực: thiết bị nhận tái tính CBC-MAC trên header + ciphertext; nếu tag không khớp, frame bị loại bỏ (bảo vệ integrity & replay)\r\n\r\nVới cơ chế này, mỗi telegram KNXnet/IP được bảo vệ đồng thời về bí mật, toàn vẹn và xác thực, đáp ứng yêu cầu bảo mật cho truyền thông KNX/IP.\r\n\r\nCấu trúc Secure Wrapper trong KNXnet/IP\r\n\r\nSecure Wrapper quấn quanh mỗi KNXnet/IP Tunnelling Frame, đảm bảo cả mã hóa và xác thực (AES-128 CCM). Cấu trúc này bao gồm 5 thành phần:\r\n\r\n\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tThành phần\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tĐộ dài (octets)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tMô tả\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t1. Secure Header\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t7\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t•ServiceTypeIdentifier (2) – nhận biết khung Secure Wrapper\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t• TotalLength (2) – độ dài toàn khung tính cả\r\n\r\n\t\t\t  MIC\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t• ChannelID (1) – ID kết nối tunnelling\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t• Sequence Counter (1) – bộ đếm tăng liên tục,\r\n\r\n\t\t\t  chống replay\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t2. Secure Control\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t1\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t• Flags (bit field) – chỉ định độ dài MIC, chế độ vận hành CCM, v.v.\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t3. Nonce (IV)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t13\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t• Ghép từ Flags, Sequence Counter và một trường ngẫu nhiên/timestamp do ETS sinh ra.\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t4. Encrypted Payload\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tn\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t• APDU KNX(Network Layer + Transport + Application Layer) mã hóa bằng AES-CTR\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\t5.Authentication Tag\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tt (thường 8)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t• MIC =Trunct(CBC-MAC(Header ∥ Ciphertext)) \r\n\r\n\t\t\t \r\n\t\t\t\r\n\t\t\r\n\t\r\n\r\n\r\nSecure Header\r\n\r\n\r\n\tServiceTypeIdentifier (2 octets): nhận biết đây là khung Secure Wrapper.\r\n\tTotalLength (2 octets): tổng độ dài khung (từ ServiceTypeIdentifier đến hết MIC).\r\n\tChannelID (1 octet): ID phiên tunnelling đã mở.\r\n\tSequence Counter (1 octet): tăng dần để chống replay.\r\n\r\n\r\nSecure Control (1 octet)\r\n\r\nByte flags:\r\n\r\n\r\n\tL (bits 0–2): xác định độ dài MIC = 2·L+2 octets.\r\n\tM (bits 3–7): thông số tham số nonce/CCM.\r\n\r\n\r\nNonce (IV) (13 octets)\r\n\r\n\r\n\tBao gồm: Flags (1), Sequence Counter (1) và Random/Counter Field (11–12).\r\n\tĐảm bảo mỗi khung có IV duy nhất dùng cho cả CTR và CBC-MAC.\r\n\r\n\r\nEncrypted Payload (n octets)\r\n\r\n\r\n\tToàn bộ APDU KNX (Network + Transport + Application Layers).\r\n\tMã hóa bằng AES-CTR với keystream sinh từ Nonce và Backbone Key.\r\n\r\n\r\nAuthentication Tag (MIC) (t octets, thường 8)\r\n\r\n\r\n\tTruncate t octets đầu của kết quả CBC-MAC trên (Header ∥ Control ∥ Nonce ∥ Ciphertext).\r\n\tTag này sau đó cũng được mã hóa (XOR với keystream S₀) trước khi gắn vào cuối frame.\r\n\r\n\r\nLợi ích và đánh giá hiệu năng của AES-128 CCM\r\n\r\nLợi ích bảo mật\r\n\r\nAES-128 CCM trên KNXnet/IP đồng thời đảm bảo tính bí mật thông qua AES-CTR, tính toàn vẹn và xác thực nhờ CBC-MAC, đồng thời chống phát lại bằng Sequence Counter và Nonce luôn thay đổi. Việc dùng chung engine AES-128 cho cả hai bước giúp giảm thiểu phức tạp firmware, trong khi cho phép tùy biến độ dài MIC (4, 6 hoặc 8 octets) để cân bằng giữa mức độ bảo mật và overhead.\r\n\r\n\r\n\r\nĐánh giá hiệu năng xử lý\r\n\r\nMỗi frame CCM yêu cầu khoảng 2n+2 lần gọi AES cho n khối dữ liệu (n+1 lần cho CBC-MAC và n+1 lần cho CTR) và thêm overhead băng thông ~29–33 octets (Header, Control, Nonce, MIC). Trên MCU 32 MHz với hardware AES accelerator, toàn bộ xử lý cho một frame 1–2 khối hoàn thành trong dưới 1 ms, thoải mái đáp ứng tần suất ≤ 10 telegram/s của KNXnet/IP mà không cần phần cứng phức tạp.\r\n\r\nKết luận và khuyến nghị triển khai KNX Secure tại KNXStore\r\n\r\nVới sự kết hợp giữa mã hóa AES-128 CCM và cơ chế Secure Wrapper, KNX Secure đảm bảo tính bí mật, toàn vẹn và chống phát lại (anti-replay) cho mọi telegram khi truyền qua mạng IP.\r\n\r\nKhuyến nghị triển khai hiệu quả tại KNXStore:\r\n\r\n\r\n\tƯu tiên thiết bị phần cứng mạnh mẽ: Lựa chọn các dòng KNX IP và Data Secure tích hợp sẵn bộ tăng tốc phần cứng (AES-128 hardware accelerator) để tối ưu tốc độ xử lý và tiết kiệm năng lượng.\r\n\tQuản lý khóa an toàn qua ETS: Sử dụng phần mềm ETS để tự động sinh và quản lý chặt chẽ các loại khóa bảo mật (Backbone Key cho IP Secure và Device Key cho Data Secure).\r\n\tTùy chỉnh độ bảo mật (MIC): Linh hoạt điều chỉnh độ dài mã xác thực MIC (4, 6 hoặc 8 octets) để cân bằng giữa mức độ rủi ro và băng thông hệ thống.\r\n\tGiải pháp bảo mật đa lớp: Triển khai đồng thời cả KNX IP Secure và Data Secure để bảo vệ toàn diện dữ liệu từ hạ tầng IP xuống tận các phân đoạn TP1/PL/RF.\r\n\tVận hành & Giám sát: Chú trọng đào tạo kỹ thuật viên về giám sát số thứ tự (Sequence Counter) và xử lý sự cố lỗi thẻ (Tag mismatch) để hệ thống vận hành ổn định, loại bỏ hoàn toàn nguy cơ giả mạo.\r\n\r\n",
        "articleSection": "Kiến thức",
        "keywords": [],
        "inLanguage": "vi-VN",
        "datePublished": "2026-02-01T15:45:01+07:00",
        "dateModified": "2026-02-01T15:45:01+07:00",
        "url": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html",
        "image": {
          "@id": "https://knxstore.vn/vai-tro-cua-aes-128-ccm-trong-bao-ve-truyen-thong-knx-ip.html#featured-image"
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
