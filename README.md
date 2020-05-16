# Plugin chức năng chọn một bài viết lên trang chủ Dealbee

Plugin thêm chức năng (cụ thể là một butotn) giúp editor chọn lựa bài post lên trang chủ dealbee.
Plugin chỉ dừng lại ở việc lưu thông tin vị trí bài đăng và bài viết được đặt vào vị trí đó.
Api để lấy dữ liệu này sẽ được cung cấp trong một [plugin](https://github.com/dealbee/nodebb-plugin-thesis-write-api) khác

Vị trí button Pin trong mỗi bài viết</br>
![Button Postion](screenshots/button-position.png?raw=true)

## Dữ liệu về sơ đồ bố trí bài viết trên trang chủ Dealbee

Vì dữ liệu về sơ đồ bố trí bài viết trên trang chủ Dealbee là không cố định, vì vậy dữ liệu này được lưu trong file [positionData](/lib/positionData.js)

Sơ đồ bài viết trong dữ liệu mẫu đang được gom nhóm thành loại (type) và ví trí (position).
Nói một cách dễ hiểu, mỗi loại sẽ có nhiều vị trí.
Cấu trúc dữ liệu là một dữ liệu kiểu json. Sơ đồ bên dưới minh họa cấu trúc dữ liệu:

## Lưu trữ ở cơ sở dữ liệu
Mỗi vị trí lưu trữ bài viết sẽ có key phân biệt để lưu dưới cơ sở dữ liệu của NodeBB, đi kèm là thông tin id (tid) của bài viết được gán vào vị trí đó.
Qui tắc đặt tên key của một vị trí: `pindealbee:{type-id}:{position-id}` (với type-id và position-id được lưu trữ trong file position.js)

Ví dụ:</br>_id: ObjectId("5eb432a1389e5c95d8cbdc8f")</br>_key: pindealbee:type1:5</br>tid: 3

## Trang preview

Để vào trang, truy cập đến đường dẫn: `/pindealbee`

Trang preview hỗ trợ các editors có cái nhìn tổng quan về các bài viết, từ trang này có thể chọn trực tiếp một bài viết lên trang chính.

Trang hiển thị các bài viết dưới dạng các dòng dữ liệu.

Giao diện chính trang pin preview
![Button Postion](screenshots/pindealbee.png?raw=true)

Button Pin trong mỗi dòng dữ liệu ở trang preview
![Button Postion](screenshots/button-in-row.png?raw=true)

### Xác thực vai trò người dùng

Chỉ có một vài loại người dùng mới có thể vào được trang preview này.

Cụ thể chỉ có các loại người dùng sau được vào:
- Admin : Có thể thao tác trên tất cả các bài viết thuộc bất kỳ category nào
- Global Mod: Vai trò như admin
- Local Mod: Là các mod thuộc một (hoặc một vài) category cụ thể, các mod này chỉ có thể thao tác lên các bài viết thuộc category mà mình quản lý

Để tùy chỉnh vai trò của người dùng, truy cập vào đường dẫn (dưới quyền admin): */admin/manage/admins-mods*

### Bộ lọc hỗ trợ

Dữ liệu hiển thị trên trang preview có thể được lọc bằng: category hoặc tên của bài viết

![Button Postion](screenshots/filter.png?raw=true)

Dữ liệu hiển thị có thể được sắp xếp bằng các tiêu chí:
- Newst (default): Từ mới nhất đến cũ nhất
- Oldest: Từ cũ nhất đến mới nhất
- Most liked: Các bài viết được upvote nhiều nhất đến thấp nhất
- Most viewed: Các bài viết được xem nhiều nhất đến thấp nhất 

Giao diện người dùng để chọn vị trí (demo)
![Button Postion](screenshots/pin-choose.png?raw=true)
