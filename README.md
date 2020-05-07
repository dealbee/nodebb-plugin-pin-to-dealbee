# Plugin chức năng chọn một bài viết lên trang chủ Dealbee

Plugin thêm chức năng (cụ thể là một butotn) giúp editor chọn lựa bài post lên trang chủ dealbee

## Dữ liệu về sơ đồ bố trí bài viết trên trang chủ Dealbee

Vì dữ liệu về sơ đồ bố trí bài viết trên trang chủ Dealbee là không cố định, vì vậy dữ liệu này được lưu trong file [positionData](/lib/positionData.js)

Sơ đồ bài viết trong dữ liệu mẫu đang được gom nhóm thành loại (type) và ví trí (position).
Nói một cách dễ hiểu, mỗi loại sẽ có nhiều vị trí.
Cấu trúc dữ liệu là một dữ liệu kiểu json. Sơ đồ bên dưới minh họa cấu trúc dữ liệu:

## Lưu trữ ở cơ sở dữ liệu
Mỗi vị trí lưu trữ bài viết sẽ có key phân biệt để lưu dưới cơ sở dữ liệu của NodeBB, đi kèm là thông tin id (tid) của bài viết được gán vào vị trí đó.
Qui tắc đặt tên key của một vị trí: `pindealbee:{type-id}:{position-id}` (với type-id và position-id được lưu trữ trong file position.js)
Ví dụ:
_id: ObjectId("5eb432a1389e5c95d8cbdc8f")
_key: pindealbee:type1:5
tid: 3

## Screenshots
### Vị trí button Pin
![Button Postion](screenshots/button-position.png?raw=true)

### Giao diện người dùng để chọn vị trí (demo)
![Button Postion](screenshots/pin-preview.png?raw=true)