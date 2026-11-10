---
url: "https://knxstore.vn/dimmer-triac-va-dimmer-mosfet.html"
headline: "Dimmer TRIAC và Dimmer MOSFET – Sự khác biệt về kỹ thuật cắt pha Dimmer"
description: "Đâu là điểm khác biệt giữa dimmer Triac và dimmer Mosfet?  Đèn LED nhấp nháy khi dim không phải do bóng hay người lắp, mà do cách cắt pha điện. Xem ngay bài viết sau để biết câu trả lời!"
image: "https://knxstore.vn/media/b006856ff4f0899c4ae7ef23cc8f0f590c08b23b57f21e60ac9e1761b3520ce9.jpg"
datePublished: "2025-07-07T03:17:49.000Z"
dateModified: "2025-07-07T03:17:49.000Z"
publisher: "KNXStore.vn"
articleSection: "Chiếu sáng"
word_count: 1665
keywords: ["Chiếu sáng"]
source: "mcp"
breadcrumb:
  - name: "Trang chủ"
    url: "https://knxstore.vn/"
  - name: "Tin tức"
    url: "https://knxstore.vn/blogs"
  - name: "Chiếu sáng"
    url: "https://knxstore.vn/blogs/chieu-sang"
  - name: "Dimmer TRIAC và Dimmer MOSFET – Sự khác biệt về kỹ thuật cắt pha Dimmer"
    url: "https://knxstore.vn/dimmer-triac-va-dimmer-mosfet.html"
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

# Dimmer TRIAC và Dimmer MOSFET – Sự khác biệt về kỹ thuật cắt pha Dimmer

> Đâu là điểm khác biệt giữa dimmer Triac và dimmer Mosfet?  Đèn LED nhấp nháy khi dim không phải do bóng hay người lắp, mà do cách cắt pha điện. Xem ngay bài viết sau để biết câu trả lời!

## Article Body

Trong thiết kế hệ thống chiếu sáng điều chỉnh độ sáng (dimming), bạn có bao giờ gặp trường hợp đèn LED bị nhấp nháy khi dim về ánh sáng thấp, hay điều chỉnh không mượt?
Nguyên nhân chính thường nằm ở loại dimmer được sử dụng:
Dimmer TRIAC – cắt pha đầu (leading-edge)
Dimmer MOSFET – cắt pha cuối (trailing-edge)
Hãy cùng nhau tìm hiểu sự khác biệt kỹ thuật cốt lõi giữa hai công nghệ này và tại sao điều đó lại quan trọng với đèn LED hiện đại.
Khái niệm cắt pha là gì?
Dimmer hoạt động bằng cách cắt bớt một phần của sóng điện AC 50/60Hz để giảm năng lượng đưa vào tải (đèn). Cách cắt này có 2 kiểu chính:
Cắt pha đầu (Leading-edge): ngắt phần đầu sóng
Cắt pha cuối (Trailing-edge): ngắt phần cuối sóng
Dimmer TRIAC là gì? Nguyên lý hoạt động như thế nào?
Khái niệm dimmer triac
Dimmer TRIAC là loại dimmer sử dụng linh kiện TRIAC (Triode for Alternating Current) để điều chỉnh độ sáng bằng cách cắt pha đầu của mỗi nửa chu kỳ điện xoay chiều (AC). Kỹ thuật này được gọi là leading-edge dimming, nghĩa là cắt "mép đầu" của sóng sin.
Dimmer loại này ra đời từ rất sớm, được sử dụng rộng rãi cho đèn sợi đốt, quạt điện, biến áp từ và các tải cảm đơn giản.
Nguyên lý hoạt động của dimmer triac
TRIAC là một linh kiện bán dẫn có khả năng dẫn dòng theo cả hai chiều dòng điện AC.Trong mạch dimmer, TRIAC không được bật ngay tại điểm zero-crossing, mà thay vào đó, trì hoãn bật tại một thời điểm xác định trong mỗi nửa chu kỳ (do mạch RC + DIAC điều khiển).Từ thời điểm kích hoạt (trigger point) đến hết nửa chu kỳ, TRIAC dẫn dòng. Khi dòng điện qua TRIAC về gần 0, nó tự động tắt (do đặc tính của TRIAC).
Ưu điểm và nhược điểm của dimmer triac
Dimmer sử dụng TRIAC có thiết kế mạch đơn giản, chi phí thấp và linh kiện dễ tìm, rất phù hợp cho các ứng dụng cơ bản. Loại dimmer này hoạt động hiệu quả với các tải cảm hoặc điện trở thuần như đèn sợi đốt, máy sưởi điện và biến áp từ. Nhờ cách điều khiển cắt pha đầu, nó giúp tiết kiệm điện năng bằng cách giảm công suất đầu vào mà không cần mạch điều khiển phức tạp. Ngoài ra, dimmer TRIAC có thể triển khai mà không cần bộ xử lý hay vi điều khiển, rất tiện lợi cho các mạch analog hoặc ứng dụng dân dụng.
Tuy nhiên, dimmer TRIAC lại bộc lộ nhiều hạn chế khi sử dụng với tải điện tử hiện đại như đèn LED hoặc compact. Do đặc tính không cấp điện ngay từ đầu chu kỳ, dòng đầu vào bị gián đoạn khiến mạch driver LED dễ bị reset liên tục, gây ra hiện tượng nhấp nháy khó chịu. Ngoài ra, việc cắt sóng với sườn lên gắt làm tăng nhiễu điện từ (EMI) và có thể phát ra tiếng "buzz" khi hoạt động. Dimmer TRIAC cũng khó kiểm soát chính xác độ sáng ở mức thấp, làm giảm chất lượng ánh sáng tổng thể trong các ứng dụng cần độ ổn định cao.
Dimmer MOSFET là gì? Nguyên lý hoạt động như thế nào?
Khái niệm dimmer MOSFET
Dimmer MOSFET là loại dimmer hiện đại sử dụng linh kiện bán dẫn như MOSFET hoặc IGBT để điều chỉnh độ sáng bằng phương pháp cắt pha cuối (trailing-edge dimming). Nghĩa là thay vì cắt bỏ phần đầu của mỗi nửa chu kỳ AC, dimmer này sẽ cấp điện đầu chu kỳ và ngắt dòng ở cuối chu kỳ. Phương pháp này đặc biệt phù hợp với tải điện tử như đèn LED, giúp duy trì hiệu suất ổn định và giảm tối đa hiện tượng nhấp nháy, nhiễu điện.
Nguyên lý hoạt động của dimmer Mosfet
Trong mạch trailing-edge dimmer, hai MOSFET được đấu ngược cực (back-to-back) để cho phép dẫn dòng hai chiều trên tải AC. Ngay khi điện áp xoay chiều bắt đầu mỗi nửa chu kỳ (zero-crossing), mạch điều khiển sẽ bật MOSFET ngay lập tức, cho phép dòng đi qua. Sau một khoảng thời gian định trước (tùy theo mức dim), MOSFET sẽ được tắt chủ động, cắt phần cuối chu kỳ. Nhờ khả năng điều khiển chính xác thời điểm bật/tắt, loại dimmer này tạo ra dạng sóng đầu ra rất “mượt”, giúp tải hoạt động ổn định hơn.
Ưu điểm và nhược điểm
Dimmer MOSFET mang lại nhiều lợi thế rõ rệt, đặc biệt là khi sử dụng với các tải điện tử như đèn LED hoặc đèn compact (CFL). Nhờ cắt pha ở cuối chu kỳ và cấp điện ngay từ đầu, nó giúp duy trì nguồn năng lượng liên tục cho driver LED, loại bỏ hoàn toàn hiện tượng nhấp nháy hoặc khởi động lại. Dạng sóng được điều chế bởi MOSFET có sườn điện áp mềm hơn, giúp giảm nhiễu điện từ (EMI) và tránh gây tiếng ồn (buzz). Bên cạnh đó, khả năng điều khiển chính xác bằng vi điều khiển hoặc tín hiệu PWM giúp việc dim sáng trở nên mượt mà, yên tĩnh và hiệu quả hơn rất nhiều so với công nghệ TRIAC truyền thống.
Nhược điểm của dimmer MOSFET là độ phức tạp mạch cao hơn, đòi hỏi phải có mạch điều khiển chính xác và đồng bộ với điểm zero-crossing của điện áp AC. Việc điều khiển bật/tắt MOSFET cần có timer, vi điều khiển, hoặc IC chuyên dụng, khiến chi phí và yêu cầu thiết kế tăng lên. Ngoài ra, do MOSFET không thể tự tắt như TRIAC, hệ thống điều khiển phải chủ động điều phối toàn bộ chu trình hoạt động, làm tăng độ khó trong thiết kế và lập trình, đặc biệt trong các ứng dụng DIY hoặc hệ thống chiếu sáng dân dụng giá rẻ.
So sánh kỹ thuật giữa dimmer TRIAC và dimmer MOSFET
Tiêu chí
Dimmer TRIAC (Cắt pha đầu)
Dimmer MOSFET (Cắt pha cuối)
Phương pháp cắt pha
Leading-edge – Cắt đầu chu kỳ AC
Trailing-edge – Cắt cuối chu kỳ AC
Linh kiện chính
TRIAC + DIAC / Opto-triac
2 MOSFET (back-to-back) hoặc IGBT + mạch điều khiển
Điểm kích (Trigger)
Trễ sau zero-crossing
Bật ngay zero-crossing, tắt trễ
Tắt thiết bị
Tự tắt khi dòng về 0
Tắt chủ động bằng mạch điều khiển
Tải tương thích
Tải cảm hoặc điện trở (đèn sợi đốt, quạt)
Tải điện tử (đèn LED, CFL, SMPS...)
Tương thích LED
Kém, dễ gây nhấp nháy, reset driver
Rất tốt, ổn định và mượt mà
Khả năng điều chỉnh mượt
Kém ở mức sáng thấp, dễ giật
Rất mượt và chính xác
Nhiễu điện từ (EMI)
Cao – do sườn lên gắt
Thấp – do sườn xuống mềm
Tiếng ồn (Buzzing)
Có thể xuất hiện
Hầu như không có
Chi phí linh kiện
Rẻ, dễ tìm
Cao hơn, cần mạch điều khiển
Độ phức tạp mạch
Đơn giản – mạch analog cơ bản
Phức tạp hơn – cần MCU/PWM/IC đồng bộ
Ứng dụng phổ biến
Nhà dân, đèn sợi đốt cũ
Chiếu sáng LED, chiếu sáng thông minh
Vì sao TRIAC làm LED nhấp nháy, còn MOSFET thì không?
Khi điều chỉnh độ sáng đèn LED bằng dimmer, rất nhiều người gặp tình trạng đèn nhấp nháy, nhất là khi giảm sáng xuống mức thấp. Nguyên nhân chính nằm ở loại mạch dimmer bạn đang sử dụng: TRIAC (cắt pha đầu) hoặc MOSFET (cắt pha cuối).
Dimmer dùng TRIAC hoạt động bằng cách trì hoãn việc cấp điện sau mỗi điểm zero của sóng AC, tức là nó cắt bỏ phần đầu chu kỳ điện áp. Điều này khiến nguồn cấp cho đèn không đều, và driver LED (bên trong bóng đèn) không nhận đủ năng lượng để hoạt động ổn định, đặc biệt là ở mức dim thấp. Kết quả là tụ trong driver không sạc đủ, hoặc mạch điều khiển bị “reset” liên tục → gây ra hiện tượng nhấp nháy.
Ngược lại, dimmer MOSFET hoạt động theo cách cắt phần cuối chu kỳ điện áp AC, nghĩa là cấp điện ngay từ đầu chu kỳ, rồi mới tắt đi sau một thời điểm xác định. Nhờ đó, driver LED luôn nhận được năng lượng đầu vào ổn định, tụ điện sạc đầy đủ, và toàn bộ mạch nguồn hoạt động mượt mà. Kết quả là ánh sáng LED đều, không nhấp nháy, không gây tiếng ồn.
Ngoài ra, dimmer MOSFET có thể điều khiển chính xác hơn bằng vi điều khiển hoặc mạch PWM, cho phép cắt pha mượt, giảm nhiễu điện từ (EMI) và loại bỏ hẳn các vấn đề như tiếng "buzz" hoặc nhấp nháy ở độ sáng thấp.
Vậy nên chọn dimmer Triac hay dimmer Mosfet?
Dimmer TRIAC cắt pha đầu tuy phổ biến và giá rẻ, nhưng ngày càng bộc lộ nhiều điểm yếu khi dùng với đèn LED hiện đại, như nhấp nháy, nhiễu điện và hiệu suất kém. Trong khi đó, dimmer MOSFET cắt pha cuối (trailing-edge) lại là giải pháp ưu việt hơn hẳn và cho khả năng điều khiển ánh sáng ổn định, mượt mà, không gây nhấp nháy và tương thích tốt với hầu hết LED driver hiện đại.
Nếu bạn đang xây dựng hệ thống chiếu sáng thông minh, không gian ánh sáng chuyên nghiệp, hoặc muốn đảm bảo hiệu suất và tuổi thọ tối đa cho đèn LED, thì việc chọn đúng loại dimmer là rất quan trọng.
Để tìm mua dimmer chuẩn MOSFET, driver tương thích LED, hay thiết bị điều khiển chiếu sáng hiện đại, bạn có thể tham khảo tại KNXStore – đơn vị chuyên cung cấp giải pháp chiếu sáng chuyên nghiệp, tương thích KNX, DALI, DMX và các chuẩn điều khiển hiện đại.

## Raw MCP

```json
{
  "slug": "dimmer-triac-va-dimmer-mosfet",
  "title": "Dimmer TRIAC và Dimmer MOSFET – Sự khác biệt về kỹ thuật cắt pha Dimmer",
  "excerpt": "Đâu là điểm khác biệt giữa dimmer Triac và dimmer Mosfet?  Đèn LED nhấp nháy khi dim không phải do bóng hay người lắp, mà do cách cắt pha điện. Xem ngay bài viết sau để biết câu trả lời!",
  "coverImage": "/media/b006856ff4f0899c4ae7ef23cc8f0f590c08b23b57f21e60ac9e1761b3520ce9.jpg",
  "authorName": null,
  "author": null,
  "publishedAt": "2025-07-07T03:17:49.000Z",
  "categories": [
    {
      "slug": "chieu-sang",
      "name": "Chiếu sáng"
    }
  ],
  "b2c": false,
  "status": "PUBLISHED",
  "seoTitle": "Dimmer TRIAC và Dimmer MOSFET – Sự khác biệt về kỹ thuật cắt pha Dimmer",
  "seoDescription": "Đâu là điểm khác biệt giữa dimmer Triac và dimmer Mosfet?  Đèn LED nhấp nháy khi dim không phải do bóng hay người lắp, mà do cách cắt pha điện. Xem ngay bài viết sau để biết câu trả lời!",
  "faqs": [],
  "editedAt": null,
  "url": "https://knxstore.vn/dimmer-triac-va-dimmer-mosfet.html"
}
```
