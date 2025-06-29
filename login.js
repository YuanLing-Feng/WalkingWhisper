// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取表单元素
    const loginForm = document.getElementById('loginForm');
    
    // 添加提交事件监听器
    loginForm.addEventListener('submit', async function(event) {
        // 阻止表单默认提交行为
        event.preventDefault();
        
        const loginstring = document.getElementById('loginstring').value;
        const password = document.getElementById('password').value;

        if (!loginstring || !password) {
            alert('请输入用户名和密码');
            return;
        }

        try {
            const response = await fetch('https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    loginstring: loginstring,
                    password: password
                })
            });

            const data = await response.json();
            console.log('登录接口返回数据:', data);

            if (data.code === 200) {
                // 登录成功，保存token和user_id
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user_id', data.data.user_id);
                localStorage.setItem('userloginstring', data.data.userloginstring);
                localStorage.setItem('username', data.data.username);
                window.location.href = 'homepage.html';
            } else {
                // 处理其他状态码
                switch (data.code) {
                    case 400:
                        alert('参数错误，请检查输入');
                        break;
                    case 401:
                        alert('用户名或密码错误');
                        break;
                    case 500:
                        alert('服务器内部错误，请稍后重试');
                        break;
                    default:
                        alert(data.message || '未知错误，请稍后重试');
                }
            }
        } catch (error) {
            console.error('登录错误:', error);
            alert('登录失败：' + error.message);
        }
    });
}); 