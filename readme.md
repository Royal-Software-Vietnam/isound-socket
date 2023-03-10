> Author: Tung Hwang
# ISOUND : SOCKET AND STORAGE SERVER

1. Upload:

    - Truy cập 'http://localhost:8888' hoặc máy chủ tương ứng
    
    - Chọn file cần upload và bấm upload, kết quả trả về sẽ hiển thị trên màn hình, truy cập vào đó để xem trước

    - Đối với các client khác, sử dụng POST: http://localhost:8888/upload hoặc máy chủ tương ứng để upload, xem ví dụ dưới đây:

``` html
    <body>
        <h1>Test upload</h1>
        <form>
            <input type="file" name="file">
            <button type="submit">Tải lên</button>
        </form>
        <p class="result"></p>
    </body>
```

``` js
    const form = document.querySelector('form');
    form.addEventListener('submit', uploadFile);

    function uploadFile(event) {
        event.preventDefault();

        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                document.querySelector('.result').innerHTML = 'Link: ' + data
            }).catch(error => {
                console.error('Lỗi khi tải lên tệp', error);
            });
    }
```

