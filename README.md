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

## Trang tổng hợp bài viết để pin

Để vào trang, truy cập đến đường dẫn: `/pindealbee`

Trang pin choose hỗ trợ các editors có cái nhìn tổng quan về các bài viết, từ trang này có thể chọn trực tiếp một bài viết lên trang chính.

Trang hiển thị các bài viết dưới dạng các dòng dữ liệu.

Giao diện chính trang pin choose
![Button Postion](screenshots/pin-preview.png?raw=true)

Button Pin trong mỗi dòng dữ liệu ở trang preview
![Button Postion](screenshots/button-in-row.png?raw=true)

### Phân quyền cho người dùng

Admin có thể phân quyền cho người dùng để pin bài viết lên trang Dealbee tại `/admin/manage/privileges`

**Ghi chú: Không thể phân quyền Global, chỉ có thể phân quyền cho từng Category cụ thể**

Admin sẽ có toàn quyền pin tất cả các bài viết thuộc bất kỳ chủ đề nào.

Người dùng được phân quyền cho chủ đề nào thì mới pin bài viết thuộc chủ đề đó lên trang Dealbee.

Hỗ trợ phân quyền cho một người dùng hoặc một group cụ thể

![Button Postion](screenshots/add-privileges.png?raw=true)
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

## Trang preview các bài viết trên trang Dealbee

![Button Postion](screenshots/page-preview.png?raw=true)

Các bài viết sẽ được hiển thị dưới dạng các hộp thông tin, chứa thông tin của bài viết đang được gắn vào nó.

Các vị trí chưa có bài viết sẽ có màu sắc nổi bật và khác biệt.

### Phân quyền cho người dùng được vào trang preview

Truy cập đường dẫn: `/pindealbee/preview` hoặc phím tắt từ trang `/pindealbee`

Người dùng chỉ cần là editor-người có thể pin bài viết thuộc tối thiểu một category-đã có thể truy cập vào trang này.

Người dùng có thể xem toàn bộ vị trí và bài viết được gắn vào đó. Tuy nhiên người dùng chỉ có thể thao tác lên vị trí mà đang có bài viết gắn vào đó thuộc chủ đề mà người dùng được phân quyền.
</br>*Ví dụ: Người dùng được phân quyền cho chủ đề 'Thảo luận chung', sẽ chỉ thao tác được các bài viết thuộc chủ đề này*

Đối với các bài viết mà người dùng có thể thao tác, người dùng có thể gỡ bài viết (unpin). Lúc này vị trí sẽ trở thành vị trí trống.

![Button Postion](screenshots/position-kinds.png?raw=true)

### Cập nhật thời gian thực với Socket IO

Việc cập nhật này chỉ áp dụng với trang preview.

Khi có một người dùng khác thao tác lên một vị trí (unpin hoặc thêm mới/update bài viết từ trang pin choose) thì toàn bộ người dùng đang truy cập vào trang pin preview đều được nhận thông báo và view của trang sẽ được cập nhật lại

![Button Postion](screenshots/notification.png?raw=true)
