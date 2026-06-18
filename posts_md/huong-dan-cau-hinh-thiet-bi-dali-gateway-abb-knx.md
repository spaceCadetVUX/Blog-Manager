---
url: "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
headline: "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX"
description: "Xem ngay bài viết sau để tìm hiểu thêm về cách cấu hình thiết bị DALI Gateway ABB vào hệ thống KNX, giúp điều khiển chiếu sáng thông minh hiệu quả, tiết kiệm và linh hoạt."
og_site_name: "KNX Store"
image: "https://knxstore.vn/assets/image/post/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.jpg"
datePublished: "2025-05-07T22:47:08+07:00"
dateModified: "2025-05-07T22:47:08+07:00"
---

# Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX

> Xem ngay bài viết sau để tìm hiểu thêm về cách cấu hình thiết bị DALI Gateway ABB vào hệ thống KNX, giúp điều khiển chiếu sáng thông minh hiệu quả, tiết kiệm và linh hoạt.

## Raw JSON-LD

```json
[
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html#webpage",
        "url": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html",
        "name": "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX",
        "description": "Xem ngay bài viết sau để tìm hiểu thêm về cách cấu hình thiết bị DALI Gateway ABB vào hệ thống KNX, giúp điều khiển chiếu sáng thông minh hiệu quả, tiết kiệm và linh hoạt.",
        "inLanguage": "vi-VN",
        "datePublished": "2025-05-07T22:47:08+07:00",
        "dateModified": "2025-05-07T22:47:08+07:00",
        "isPartOf": {
          "@id": "https://knxstore.vn/#website"
        },
        "publisher": {
          "@id": "https://knxstore.vn/#organization"
        },
        "mainEntity": {
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html#article"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html#featured-image",
          "url": "https://knxstore.vn/assets/image/post/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.jpg",
          "contentUrl": "https://knxstore.vn/assets/image/post/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.jpg",
          "caption": "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX"
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
              "name": "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX",
              "item": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html"
            }
          ]
        }
      },
      {
        "@type": "BlogPosting",
        "@id": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html#article",
        "mainEntityOfPage": {
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html#webpage"
        },
        "headline": "Hướng dẫn cấu hình thiết bị DALI Gateway ABB KNX",
        "description": "Xem ngay bài viết sau để tìm hiểu thêm về cách cấu hình thiết bị DALI Gateway ABB vào hệ thống KNX, giúp điều khiển chiếu sáng thông minh hiệu quả, tiết kiệm và linh hoạt.",
        "articleBody": "Trong bài viết này, KNXStore sẽ cùng bạn tìm hiểu cách cấu hình DALI Gateway ABB tích hợp vào hệ thống KNX, giúp điều khiển chiếu sáng thông minh hiệu quả, tiết kiệm và linh hoạt. Đây là một tài liệu chuyên sâu nhưng sẽ được trình bày dễ hiểu cho cả người mới lẫn kỹ sư triển khai.\r\n\r\nGiới thiệu tổng quan về hệ thống DALI và KNX\r\n\r\nHệ sinh thái nhà thông minh ngày càng phát triển, và việc tích hợp giữa chuẩn KNX và DALI đang mở ra nhiều cơ hội mới cho việc điều khiển hệ thống chiếu sáng thông minh.\r\n\r\nViệc tích hợp DALI vào mạng KNX giúp điều khiển đèn hiệu quả và đồng bộ với hệ thống cảm biến, nút nhấn, giao diện điều khiển,v.v.. Với tính năng DALI Gateway có trên ABB KNX Gateway, người dùng có thể:\r\n\r\n\r\n\tĐiều khiển trực tiếp các thiết bị chiếu sáng DALI từ hệ thống KNX.\r\n\tGiao tiếp hai chiều giữa các group address KNX và ballast DALI.\r\n\tTối ưu hóa hiệu quả chiếu sáng tùy theo không gian sống và làm việc.\r\n\r\n\r\n\r\n\r\nThiết bị sử dụng – ABB DALI Gateway DG/S2.64.5.1\r\n\r\nThiết bị ABB DALI Gateway DG/S2.64.5.1 cho phép giao tiếp 2 chiều giữa hệ DALI và KNX. Thiết bị hỗ trợ tối đa 64 driver DALI, chia nhóm linh hoạt, tích hợp cảnh chiếu sáng, đổi màu, điều chỉnh độ sáng và phản hồi trạng thái.\r\n\r\n\r\n\r\nBước 1- Cấu hình thiết bị bằng phần mềm i-bus® Tool\r\n\r\nĐể bắt đầu, chúng ta sẽ sử dụng phần mềm i-bus® Tool của ABB để cấu hình thiết bị DALI Gateway. Đây là công cụ miễn phí, hỗ trợ bạn trong việc gán địa chỉ và cấu hình các driver đèn DALI.\r\n\r\nCác bước cấu hình như sau:\r\n\r\n\r\n\tCấp nguồn cho hệ thống. Bạn cần đảm bảo rằng thiết bị DALI Gateway và các driver đèn DALI đều được cấp nguồn đầy đủ.\r\n\tMở phần mềm i-bus® Tool sau khi đã kết nối thiết bị với hệ thống KNX. Lúc này bạn cần lưu ý chọn đúng thiết bị DALI Gateway (trong ví dụ này là DG/S2.64.5.1) trên phần mềm.\r\n\tTiếp theo cần gán địa chỉ cho các driver. Chuyển sang tab DALI, bạn sẽ thấy các ô vuông đại diện cho từng địa chỉ ballast (0-63). Nhấn nút \"Start DALI Adressierung\" để phần mềm tự động quét và gán địa chỉ cho các driver.\r\n\tSau đó bạn có thể tiến hành chọn từng đèn để xác định chính xác từng địa chỉ driver và nhóm chiếu sáng. Lúc này, trong thực tế, đèn được chọn sẽ sáng, và tất cả đèn trong bộ điều khiển sẽ tắt. Bạn có thể kéo từng driver vào các nhóm DALI (G0 đến G15) tuỳ theo cách chia khu vực chiếu sáng.\r\n\tSau khi hoàn tất việc cấu hình, hãy nhấn \"Gateway-Werte übernehmen\" để lưu lại cấu hình vào bộ nhớ thiết bị. Quay lại ETS, tiến hành mapping group address tương ứng cho việc dim, on/off, thay đổi nhiệt độ màu…\r\n\r\n\r\nChú ý:\r\n\r\n\r\n\tKhi cấu hình ở bước 3, các driver nào hoạt động tốt sẽ hiển thị với biểu tượng bóng đèn màu vàng hoặc trắng, nếu thấy dấu X đỏ có nghĩa là thiết bị đang gặp các vấn đề hư hỏng hoặc lỏng dây.\r\n\tBạn cần đảm bảo rằng tất cả các dây kết nối đều ổn định để tránh tình trạng lỗi.\r\n\r\n\r\n\r\n\tNếu gặp bất kỳ vấn đề nào trong quá trình gán địa chỉ, kiểm tra lại kết nối dây hoặc trạng thái của driver.\r\n\r\n\r\n\r\n\r\nBước 2 - Cấu hình logic điều khiển trong ETS\r\n\r\nSau khi đã gán địa chỉ và group DALI, bước tiếp theo là cấu hình logic điều khiển trong phần mềm ETS (Engineering Tool Software) của KNX. Đây chính là lúc chúng ta làm việc trực tiếp với Group Object của DALI Gateway.\r\n\r\n\r\nTrong hệ DALI tích hợp KNX, Group Address đóng vai trò là “ngôn ngữ giao tiếp” giữa các thiết bị điều khiển (nút bấm, cảm biến...) và đèn chiếu sáng thông qua Gateway. Mỗi group address tương ứng với một chức năng cụ thể như: bật/tắt, dim, đổi màu, trạng thái…\r\n\r\nCác nhóm Group Address cơ bản như sau (cho đèn dim DALI DT8):\r\n\r\n\r\n\tSwitch (1-bit). Có chức năng điều khiển bật/tắt đèn, lệnh đơn giản từ phím nhấn, cảm biến hoặc tự động hóa. Thường ứng dụng trong các không gian như phòng ngủ, hành lang, toilet.\r\n\tBrightness Value Output (1 byte). Điều chỉnh các mức sáng một cách cụ thể (0–100%). Phù hợp khi điều khiển qua app, giao diện visualization, giúp người dùng chỉnh độ sáng chính xác hơn.\r\n\tRelative Dimming (4-bit). Có chức năng tăng/ giảm độ sáng bằng cách nhấn giữ nút. Rất phù hợp với nút bấm vật lý dạng “press & hold”.\r\n\tSet Color Temperature (2 byte – DPT 7.600) (Kelvin). Có chức năng điều khiển nhiệt độ màu (CCT) cho đèn DT8 Tunable White. Giá trị tính bằng Kelvin, ví dụ: 2700K (ấm), 4000K (trung tính), 6000K (lạnh).\r\n\tRGB(W) Color Control (1 byte mỗi màu). Có thể điều khiển màu sắc cho đèn DT8 RGBW. Mỗi màu là một group riêng, điều khiển cường độ từ 0–255. Dùng cho led dây RGB, đèn hắt trần, ánh sáng trang trí.\r\n\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tChức năng\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tGroup Object trong Gateway\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tKiểu dữ liệu\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tCông dụng\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tBật/Tắt đèn\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tSwitch\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t1-bit\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tĐiều khiển On/Off cho driver DALI\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tĐiều chỉnh độ sáng (dimming)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tBrightness Value Output\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t1 byte (0–100%)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tGửi giá trị phần trăm độ sáng đến driver\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tDimming giữ nút (tăng/giảm)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tRelative Dimming\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t4-bit\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tNhấn giữ nút để tăng/giảm dần độ sáng\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tĐổi nhiệt độ màu (Tunable White)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tSet color temperature (Kelvin)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t2 byte (DPT 7.600)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tĐiều khiển đèn DT8 loại CCT (trắng ấm – trắng lạnh)\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tĐổi màu RGBW\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tRGB(W) Color Control\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t1 byte mỗi màu\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tĐiều khiển đèn DT8 RGBW từng kênh màu (R, G, B, W)\r\n\t\t\t\r\n\t\t\r\n\t\r\n\r\n\r\nCác thiết bị có những phản hồi trạng thái (status feedback) như sau:\r\n\r\n\r\n\tStatus Switch (1-bit). Trả về trạng thái bật/tắt của driver. Thường dùng để hiển thị trên app, visualization, hoặc đồng bộ với LED báo trên công tắc cảm ứng.\r\n\tStatus Brightness Value (1 byte). Gửi lại mức độ sáng hiện tại dưới dạng phần trăm. Cần thiết khi người dùng điều chỉnh đèn từ nhiều nguồn (phím bấm, cảm biến, app), đảm bảo UI luôn hiển thị đúng.\r\n\tStatus Color Temperature (2 byte – DPT 7.600). Trả về nhiệt độ màu thực tế (Kelvin) đang được driver sử dụng. Hữu ích khi dùng chế độ Tunable White, cần đồng bộ trạng thái trên giao diện người dùng.\r\n\tLamp/Ballast Fault (1-bit hoặc logic). Phát hiện lỗi phần cứng như: driver hỏng, bóng cháy, mất nguồn DALI. Có thể cấu hình để gửi cảnh báo lên BMS hoặc bật đèn cảnh báo trong hệ thống.\r\n\r\n\r\n\r\n\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tTrạng thái\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tGroup Object trong Gateway\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tKiểu dữ liệu\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tCông dụng\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tTrạng thái On/Off\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tStatus Switch\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t1-bit\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tCho biết đèn đang bật hay tắt\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tMức sáng hiện tại\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tStatus Brightness Value\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t1 byte\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tTrả về % độ sáng thực tế\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tNhiệt độ màu (Kelvin)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tStatus Color Temperature\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t2 byte (DPT 7.600)\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tTrả về giá trị nhiệt độ màu đang dùng (Kelvin)\r\n\t\t\t\r\n\t\t\r\n\t\t\r\n\t\t\t\r\n\t\t\tLỗi driver, lỗi nguồn, cháy bóng\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tLamp/Ballast Fault\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t1-bit hoặc logic\r\n\t\t\t\r\n\t\t\t\r\n\t\t\tPhát hiện lỗi đèn cháy, ballast hỏng, mất tín hiệu...\r\n\t\t\t\r\n\t\t\r\n\t\r\n\r\n\r\nDựa vào các group từ 2 loại nhóm trên, bạn có thể dùng để khai báo cho các hệ điều khiển dali khác thông qua các group KNX được gán trong cấu hình ETS5.\r\n\r\nNgoài ra, KNX DALI còn có thể tích hợp với các hệ khác như Savant, Control4, Crestron, Lutron, Home Assistant, Apple Home,v.v..\r\n\r\nCấu hình nâng cao và các thông số đặc biệt\r\n\r\nCấu hình Parameters\r\n\r\n\r\n\r\nNgay trong phần “Parameters”, bạn có thể thay đổi được các thông số cũng như số lượng driver đèn DALI mà chúng ta có thể điều khiển.\r\n\r\n\r\n\r\nCấu hình General\r\n\r\nTại mục General sẽ hiển thị các thông số cấu hình để đáp ứng mọi nhu cầu dự án như:\r\n\r\n\r\n\tInactive wait state on KNX recovery: Đặt thời gian chờ (tính bằng giây) sau khi kết nối KNX bị ngắt rồi phục hồi. Giúp hệ thống ổn định trước khi hoạt động lại.\r\n\tSend stat. val. on inactive wait state: Gửi trạng thái của đèn trong lúc hệ thống đang chờ phục hồi (nên tắt để tránh sai trạng thái).\r\n\tLimit number of KNX telegrams: Giới hạn số lượng telegram KNX gửi ra (bật để tránh spam mạng nếu có nhiều thiết bị cùng phản hồi).\r\n\tEnable manual operation: Cho phép thao tác tay trên thiết bị Gateway (nút nhấn vật lý).\r\n\tBrightness value on exiting manual operation: Chọn giữ lại mức sáng đã điều chỉnh bằng tay hoặc trả về trạng thái do KNX điều khiển trước đó.\r\n\tReset from manual operation to KNX operation: Chọn cách chuyển lại điều khiển về KNX sau khi có can thiệp tay: nhấn nút hoặc tự động.\r\n\tTime for automatic reset: Nếu chọn reset tự động, đây là thời gian chờ trước khi chuyển lại điều khiển về KNX (ví dụ 60 phút).\r\n\tEnable group object \"In operation\": Bật group object gửi trạng thái Gateway đang hoạt động (hữu ích cho giám sát hệ thống).\r\n\tEnable group object \"Request status values\": Cho phép thiết bị khác gửi lệnh yêu cầu Gateway cập nhật trạng thái của các thiết bị DALI.\r\n\tEnable group object \"Gateway supply voltage fault\": Bật báo lỗi nếu nguồn cấp của Gateway bị mất hay bất thường.\r\n\r\n\r\nNgoài ra còn rất nhiều thông số chính trong bộ DG/S2.64.5.1 ABB để giúp nâng cao toàn bộ công dụng mà dali có thể mang lại.\r\n\r\nCấu hình DALI configuration\r\n\r\n\r\n\r\nTại mục “A DALI configuration”, có thể bật các tính năng DALI như nhóm (Group), từng đèn (Ballast), chiếu sáng khẩn cấp (Emergency), Scene, hiệu ứng (Sequence). Tùy chỉnh trước khi hệ thống tạo group object.\r\n\r\nCài đặt “A Output” để tiến hành cấu hình các hành vi khi bật/tắt, dim đèn, fade time.\r\n\r\n\r\n\tStatus: Trả trạng thái On/Off, độ sáng, nhiệt độ màu.\r\n\tFault: Trả thông tin lỗi đèn, lỗi điện áp, lỗi driver.\r\n\tFunctions: Kích hoạt tính năng burn-in, slave offset, thời lượng sử dụng,...\r\n\tColor functions: Điều khiển màu RGB, trắng ấm/lạnh (CCT), bao gồm HCL & Dim2Warm.\r\n\r\n\r\nCài đặt trong “A Group/ballast x template” được dùng để tạo cấu hình mẫu cho nhiều ballast cùng loại.\r\n\r\n\r\n\tStatus template: Mẫu phản hồi trạng thái.\r\n\tFault template: Mẫu xử lý lỗi.\r\n\tFunctions template: Mẫu chức năng phụ trợ (runtime, standby,...).\r\n\tSlave template: Gán đèn phụ đi theo đèn chính.\r\n\tStaircase lighting template: Chiếu sáng theo thời gian như cầu thang, hành lang.\r\n\tColor temperature Tc template: Giới hạn, định dạng, thời gian chuyển đổi nhiệt độ màu cho đèn Tunable White.\r\n\tRGB(W) color control template: Gán thông số cho đèn RGBW như fade time, group, thứ tự kênh,...\r\n\r\n\r\nCài đặt trong “A Groups > G1…”  được dùng để cấu hình riêng cho từng nhóm G1–G16 nếu bạn không dùng template.\r\n\r\n\r\n\tStatus: Trả trạng thái nhóm.\r\n\tFault: Trả lỗi cho nhóm.\r\n\tFunctions: Chức năng nâng cao cho nhóm.\r\n\tColor temperature Tc: Điều chỉnh riêng nhiệt độ màu cho từng group.\r\n\r\n\r\nSau khi hoàn tất mọi bước cấu hình và đảm bảo thiết bị hoạt động ổn định theo đúng yêu cầu sử dụng, hệ thống DALI Gateway ABB giờ đây đã sẵn sàng để hoạt động trong mạng lưới KNX.\r\n\r\nViệc tích hợp này sẽ giúp toàn bộ hệ thống chiếu sáng sử dụng DALI trở thành một mắt xích trong mạng lưới KNX Smarthome/Smart Building. Người dùng có thể dễ dàng điều khiển đèn bằng mọi phương tiện quen thuộc có sử dụng KNX: Từ nút nhấn cảm ứng, cảm biến chuyển động, màn hình điều khiển trung tâm cho đến điện thoại thông minh hoặc thậm chí là một câu lệnh với trợ lý ảo (Alexa, Google Assistant, Siri nếu có Matter Gateway).\r\n\r\nĐiều kỳ diệu hơn cả là khả năng hệ thống tự cảm được bối cảnh và phản ứng theo những kịch bản ánh sáng được thiết kế tinh tế:\r\n\r\n\r\n\tKhi có người vào phòng, ánh sáng tự động bật ở mức 70%, với sắc vàng ấm (3000K).\r\n\tVào buổi trưa, hệ thống giảm bớt cường độ sáng để tiết kiệm điện, chuyển sang tông trung tính.\r\n\tKhi nhấn nút “Scene Relax”, ánh sáng dịu xuống còn 40%, nhiệt độ màu 2700K để tạo nên không gian thư giãn.\r\n\r\n\r\nChính sự kết hợp giữa ABB DALI Gateway DG/S2.64.5.1 và giao thức KNX giúp lập trình viên, kỹ sư hay người vận hành dễ dàng tạo nên một hệ thống chiếu sáng vừa hiệu quả, dễ bảo trì, lại có khả năng mở rộng linh hoạt trong tương lai.\r\n\r\nKhông chỉ dừng lại ở đèn chiếu sáng, toàn bộ hệ thống KNX còn có thể tích hợp thêm các thành phần khác như rèm cửa tự động, điều hòa không khí (HVAC), âm thanh đa vùng,v.v.. Tất cả sẽ được điều phối trong cùng một nền tảng thống nhất.\r\n\r\nMột lần triển khai đúng – sử dụng bền vững – mở rộng dễ dàng. Đó là lý do vì sao giải pháp KNX kết hợp DALI luôn là lựa chọn hàng đầu trong các công trình cao cấp, từ biệt thự hiện đại cho đến khách sạn, văn phòng thông minh.\r\n",
        "articleSection": "Hướng dẫn",
        "keywords": [],
        "inLanguage": "vi-VN",
        "datePublished": "2025-05-07T22:47:08+07:00",
        "dateModified": "2025-05-07T22:47:08+07:00",
        "url": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html",
        "image": {
          "@id": "https://knxstore.vn/huong-dan-cau-hinh-thiet-bi-dali-gateway-abb-knx.html#featured-image"
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
