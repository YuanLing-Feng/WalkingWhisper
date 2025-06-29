// 全局音频停止函数
function stopAllAudio() {
    window.isManuallyStopped = true;
    setTimeout(() => { window.isManuallyStopped = false; }, 500);
    console.log('开始停止所有音频...');
    
    // 策略1: 停止录音音频播放 - 查找所有可能的audio-player-placeholder
    const audioPlayerPlaceholders = document.querySelectorAll('.audio-player-placeholder');
    console.log('找到的audio-player-placeholder数量:', audioPlayerPlaceholders.length);
    audioPlayerPlaceholders.forEach((placeholder, index) => {
        console.log(`检查第${index + 1}个audio-player-placeholder:`, placeholder);
        if (placeholder.audio) {
            try {
                placeholder.audio.onerror = null; // 移除onerror
                placeholder.audio.pause();
                placeholder.audio.currentTime = 0;
                // 不要清空src
                placeholder.audio = null;
            } catch (error) {
                console.error('停止录音音频时出错:', error);
            }
            placeholder.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px; color: #fff;">🎵</span>
                    <span style="color: #fff;">点击播放录音</span>
                </div>
            `;
        } else {
            console.log(`第${index + 1}个placeholder没有audio对象`);
        }
    });
    
    // 策略2: 停止下载音频播放
    if (window.currentPlayingAudio) {
        try {
            window.currentPlayingAudio.onerror = null;
            window.currentPlayingAudio.pause();
            window.currentPlayingAudio.currentTime = 0;
            // 不要清空src
            window.currentPlayingAudio = null;
        } catch (error) {
            console.error('停止下载音频时出错:', error);
        }
    } else {
        console.log('没有找到window.currentPlayingAudio');
    }
    
    // 策略3: 停止所有HTML5音频元素
    const allAudioElements = document.querySelectorAll('audio');
    console.log('找到的HTML5音频元素数量:', allAudioElements.length);
    allAudioElements.forEach((audio, index) => {
        try {
            audio.onerror = null;
            audio.pause();
            audio.currentTime = 0;
            // 不要清空src
        } catch (error) {
            console.error(`停止第${index + 1}个HTML5音频元素时出错:`, error);
        }
    });
    
    // 策略4: 停止所有通过Audio构造函数创建的音频对象
    if (window.audioCache) {
        Object.values(window.audioCache).forEach((audio, index) => {
            try {
                audio.onerror = null;
                audio.pause();
                audio.currentTime = 0;
                // 不要清空src
            } catch (error) {
                console.error(`停止缓存的第${index + 1}个音频时出错:`, error);
            }
        });
        window.audioCache = {};
    }
    
    // 策略5: 重置所有播放按钮状态
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach((btn, index) => {
        if (btn.textContent === '⏹') {
            btn.textContent = '▶';
        }
    });
    
    // 策略6: 强制停止所有媒体播放（最后的保险）
    try {
        if (navigator.mediaSession && navigator.mediaSession.playbackState) {
            navigator.mediaSession.playbackState = 'none';
        }
    } catch (error) {
        console.error('强制停止媒体播放时出错:', error);
    }
    
    console.log('所有音频已停止');
}

// 全局测试函数
window.testAudioStop = function() {
    console.log('=== 测试音频停止功能 ===');
    console.log('当前页面状态:');
    console.log('- audio-player-placeholder数量:', document.querySelectorAll('.audio-player-placeholder').length);
    console.log('- 播放按钮数量:', document.querySelectorAll('.play-btn').length);
    console.log('- HTML5音频元素数量:', document.querySelectorAll('audio').length);
    console.log('- window.currentPlayingAudio:', window.currentPlayingAudio);
    console.log('- window.audioCache:', window.audioCache);
    
    // 查找所有audio-player-placeholder并检查它们的audio属性
    document.querySelectorAll('.audio-player-placeholder').forEach((placeholder, index) => {
        console.log(`第${index + 1}个placeholder:`, {
            element: placeholder,
            hasAudio: !!placeholder.audio,
            audio: placeholder.audio,
            innerHTML: placeholder.innerHTML,
            isPlaying: placeholder.audio ? !placeholder.audio.paused : false
        });
    });
    
    // 检查所有播放按钮状态
    document.querySelectorAll('.play-btn').forEach((btn, index) => {
        console.log(`第${index + 1}个播放按钮:`, {
            text: btn.textContent,
            disabled: btn.disabled,
            isStopButton: btn.textContent === '⏹'
        });
    });
    
    // 检查音频缓存
    if (window.audioCache) {
        Object.entries(window.audioCache).forEach(([key, audio]) => {
            console.log(`缓存音频 ${key}:`, {
                audio: audio,
                paused: audio.paused,
                currentTime: audio.currentTime,
                src: audio.src
            });
        });
    }
    
    // 执行停止操作
    console.log('=== 执行停止操作 ===');
    stopAllAudio();
    
    console.log('=== 停止后的状态 ===');
    console.log('- audio-player-placeholder数量:', document.querySelectorAll('.audio-player-placeholder').length);
    console.log('- 播放按钮数量:', document.querySelectorAll('.play-btn').length);
    console.log('- HTML5音频元素数量:', document.querySelectorAll('audio').length);
    console.log('- window.currentPlayingAudio:', window.currentPlayingAudio);
    console.log('- window.audioCache:', window.audioCache);
    
    // 再次检查所有audio-player-placeholder
    document.querySelectorAll('.audio-player-placeholder').forEach((placeholder, index) => {
        console.log(`停止后第${index + 1}个placeholder:`, {
            element: placeholder,
            hasAudio: !!placeholder.audio,
            audio: placeholder.audio,
            innerHTML: placeholder.innerHTML
        });
    });
    
    // 再次检查所有播放按钮状态
    document.querySelectorAll('.play-btn').forEach((btn, index) => {
        console.log(`停止后第${index + 1}个播放按钮:`, {
            text: btn.textContent,
            disabled: btn.disabled,
            isStopButton: btn.textContent === '⏹'
        });
    });
    
    console.log('=== 测试完成 ===');
};

window.onload = async function() {
    // 添加修改状态跟踪变量
    let pendingChanges = {
        no: null,
        marker_name: null,
        isShow: null
    };
    let changeTimeout = null;
    const CHANGE_DELAY = 1000; // 1秒延迟
    const VISIBILITY_CHANGE_DELAY = 300; // 0.3秒延迟，用于visibility按钮
    let visibilityBtnDisabled = false; // 控制visibility按钮是否禁用

    // 川美虎溪校区的坐标 [29.602764, 106.297512]
    var map = L.map('map', {
        center: [29.602764, 106.297512],
        zoom: 15,           // 设置初始缩放级别，16级可以看到校园主要建筑
        minZoom: 14,       // 限制最小缩放级别，防止缩小太多
        maxZoom: 19,       // 设置最大缩放级别
        // maxBounds: [       // 限制地图平移范围，大约是校园周边区域
        //     [29.599684, 106.290526], // 西南角29.598684, 106.293526
        //     [29.615211, 106.301158]  // 东北角29.607211, 106.304158
        // ]
    });

    // 添加OpenStreetMap底图
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // 创建切换按钮
    const toggleButton = L.control({ position: 'topright' });
    toggleButton.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
            <button id="toggle-hidden-markers" title="显示/隐藏标记点" style="
                width: 30px;
                height: 30px;
                background: white;
                border: 2px solid rgba(0,0,0,0.2);
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #666;
            ">👁️</button>
        `;
        return div;
    };
    toggleButton.addTo(map);

    // 存储所有标记点对象
    let markers = [];
    let locations = [];
    let showHiddenMarkers = false; // 控制是否显示隐藏的标记点

    // 立即执行初始化
    (async function initialize() {
        try {
            const user_id = localStorage.getItem('user_id');
            if (!user_id) {
                window.location.href = 'index.html';
                return;
            }

            // 获取并显示用户名
            const username = localStorage.getItem('username');
            if (username) {
                const userHeader = document.querySelector('.user-header h1');
                if (userHeader) {
                    userHeader.textContent = username;
                }
            }

            // 获取并显示作品名
            const workName = localStorage.getItem('workName');
            if (workName) {
                const workNameElement = document.getElementById('work-name');
                if (workNameElement) {
                    workNameElement.textContent = workName;
                }
            }

            // 添加退出登录按钮事件监听器
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    // 清除本地存储的用户信息
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('username');
                    localStorage.removeItem('workName');
                    localStorage.removeItem('brief_intro');
                    localStorage.removeItem('markersData');
                    localStorage.removeItem('recordsList');
                    
                    // 跳转到登录页面
                    window.location.href = 'index.html';
                });
            }

            console.log('开始获取位置标记...');
            const response = await fetch(`https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/get/locationMarkers?user_id=${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('位置标记数据:', data);

            if (data.code === 200 && data.data) {
                // 处理返回的位置标记数据
                // locations = data.data.markers;
                
                // // 从 localStorage 获取已保存的显示状态
                // const savedMarkersData = JSON.parse(localStorage.getItem('markersData'));
                // if (savedMarkersData && savedMarkersData.markers) {
                //     locations.forEach(location => {
                //         const savedLocation = savedMarkersData.markers.find(m => m.marker_id === location.marker_id);
                //         if (savedLocation) {
                //             location.isShow = savedLocation.isShow;
                //         }
                //     });
                // }
                if (data.data.markers.length == 0)
                    return;
                
                // 存储到 localStorage
                try {
                    localStorage.setItem('workName',data.data.workname);
                    localStorage.setItem('brief_intro',data.data.brief_intro);
                    localStorage.setItem('markersData', JSON.stringify(data.data.markers));
                    console.log('所有位置标记数据已存储到localStorage');
                } catch (error) {
                    console.error('存储数据失败:', error);
                }

                locations = JSON.parse(localStorage.getItem('markersData') || '[]');

                // 在地图上显示标记点
                locations.forEach(location => {
                    const marker = createMarker(location);
                    markers.push(marker);
                    
                    // 根据 isShow 状态决定是否显示标记点
                    // if (!location.isShow) {
                    //     marker.remove();
                    // }
                });

                // 更新第一个可见标记点的信息
                const firstVisibleLocation = locations.find(loc => loc.isShow);
                if (firstVisibleLocation) {
                    // const currentLocationNo = firstVisibleLocation.marker_id;
                    updateGPSInfo(
                        firstVisibleLocation.latitude,
                        firstVisibleLocation.longitude,
                        firstVisibleLocation.no,
                        firstVisibleLocation.marker_name,
                        firstVisibleLocation.isShow
                    );
                }
            } else {
                console.error('获取位置标记失败:', data.message);
            }
        } catch (error) {
            console.error('初始化错误:', error);
        }
    })();

    let currentMarker = null; // 存储当前选中的标记点

    // 添加输入框事件监听
    function bindEventListeners() {
        const noInput = document.getElementById('location-no');
        const nameInput = document.getElementById('location-name');
        const visibilityBtn = document.getElementById('toggle-marker-visibility');

        // 移除旧的事件监听器
        if (noInput) {
            const newNoInput = noInput.cloneNode(true);
            noInput.parentNode.replaceChild(newNoInput, noInput);
            newNoInput.addEventListener('change', function() {
                const currentValue = this.value;
                console.log('marker_no changed:', currentValue);
                // 获取当前显示的GPS坐标
                const gpsP = document.querySelector('.gps-coordinates p');
                if (!gpsP) return;
                const gpsText = gpsP.textContent;
                const match = gpsText.match(/GPS Point: ([\d.]+), ([\d.]+)/);
                if (!match) return;
                const [_, latitude, longitude] = match;
                handleMarkerChange('no', currentValue, latitude, longitude);
            });
        }

        if (nameInput) {
            const newNameInput = nameInput.cloneNode(true);
            nameInput.parentNode.replaceChild(newNameInput, nameInput);
            newNameInput.addEventListener('input', function() {
                const currentValue = this.value;
                console.log('marker_name changed:', currentValue);
                // 获取当前显示的GPS坐标
                const gpsP = document.querySelector('.gps-coordinates p');
                if (!gpsP) return;
                const gpsText = gpsP.textContent;
                const match = gpsText.match(/GPS Point: ([\d.]+), ([\d.]+)/);
                if (!match) return;
                const [_, latitude, longitude] = match;
                handleMarkerChange('marker_name', currentValue, latitude, longitude);
            });
        }

        if (visibilityBtn) {
            const newVisibilityBtn = visibilityBtn.cloneNode(true);
            visibilityBtn.parentNode.replaceChild(newVisibilityBtn, visibilityBtn);
            newVisibilityBtn.addEventListener('click', async function() {
                if (visibilityBtnDisabled) {
                    console.log('Visibility button is disabled, ignoring click');
                    return;
                }

                const isCurrentlyShow = this.classList.contains('show');
                console.log('isShow changed:', !isCurrentlyShow);
                
                // 立即禁用按钮
                visibilityBtnDisabled = true;
                
                // 获取当前显示的GPS坐标
                const gpsP = document.querySelector('.gps-coordinates p');
                if (!gpsP) return;
                const gpsText = gpsP.textContent;
                const match = gpsText.match(/GPS Point: ([\d.]+), ([\d.]+)/);
                if (!match) return;
                const [_, latitude, longitude] = match;
                
                // 立即发送请求
                await handleVisibilityChange(!isCurrentlyShow, latitude, longitude);
                
                // 更新按钮状态
                if (isCurrentlyShow) {
                    this.innerHTML = '<i class="fas fa-eye-slash"></i> 显示标记点';
                    this.className = 'visibility-btn hide';
                } else {
                    this.innerHTML = '<i class="fas fa-eye"></i> 隐藏标记点';
                    this.className = 'visibility-btn show';
                }
                
                // 1秒后重新启用按钮
                setTimeout(() => {
                    visibilityBtnDisabled = false;
                }, 1000);
            });
        }
    }

    // 更新GPS信息的函数
    function updateGPSInfo(latitude, longitude, markerNo, markerName, isShow) {
        // 恢复GPS信息区显示
        let gpsInfo = document.querySelector('.gps-info');
        if (gpsInfo) gpsInfo.style.display = '';
        // 更新GPS坐标显示
        const gpsP = document.querySelector('.gps-coordinates p');
        if (gpsP) {
            gpsP.textContent = `GPS Point: ${latitude}, ${longitude}`;
        }
        // 更新编号和名称
        const noInput = document.getElementById('location-no');
        if (noInput) noInput.value = markerNo;
        const nameInput = document.getElementById('location-name');
        if (nameInput) nameInput.value = markerName || '';
        // 更新按钮
        const visibilityBtn = document.getElementById('toggle-marker-visibility');
        if (visibilityBtn) {
            if (isShow) {
                visibilityBtn.innerHTML = '<i class="fas fa-eye"></i> 隐藏标记点';
                visibilityBtn.className = 'visibility-btn show';
            } else {
                visibilityBtn.innerHTML = '<i class="fas fa-eye-slash"></i> 显示标记点';
                visibilityBtn.className = 'visibility-btn hide';
            }
        }
        // 切换区域可交互性，插入/移除遮罩
        const recordingList = document.querySelector('.recording-list');
        function setOverlay(container, show) {
            if (!container) return;
            // 先移除所有已存在的遮罩，避免重复
            container.querySelectorAll('.disabled-overlay').forEach(el => el.remove());
            if (show) {
                const overlay = document.createElement('div');
                overlay.className = 'disabled-overlay';
                container.appendChild(overlay);
            }
        }
        setOverlay(gpsInfo, !isShow);
        // setOverlay(recordingList, !isShow);

        // 在更新GPS信息后重新绑定事件监听器
        bindEventListeners();
    }

    // 在页面加载完成后绑定事件监听器
    window.addEventListener('load', bindEventListeners);

    // 添加修改检测和提交函数
    function handleMarkerChange(field, value, latitude, longitude) {
        // 更新待修改状态
        pendingChanges[field] = value;
        
        // 清除之前的定时器
        if (changeTimeout) {
            clearTimeout(changeTimeout);
        }
        
        // 设置新的定时器
        changeTimeout = setTimeout(async () => {
            try {
                const user_id = localStorage.getItem('user_id');
                if (!user_id) {
                    window.location.href = 'index.html';
                    return;
                }

                // 获取当前选中的标记点信息
                const markersData = JSON.parse(localStorage.getItem('markersData') || '[]');
                if (!markersData || !Array.isArray(markersData)) return;
                
                // 使用经纬度查找标记点
                const marker = markersData.find(m => 
                    parseFloat(m.latitude) === parseFloat(latitude) && 
                    parseFloat(m.longitude) === parseFloat(longitude)
                );
                if (!marker) return;

                // 准备要发送的数据
                const updateData = {
                    user_id: user_id,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    // marker_id: marker.marker_id,
                    no: field === 'no' ? value : document.getElementById('location-no').value,
                    name: field === 'marker_name' ? value : document.getElementById('location-name').value,
                    isShow: field === 'isShow' ? value : document.getElementById('toggle-marker-visibility').classList.contains('show')
                };

                console.log('handleMarkerChange - field:', field, 'value:', value);
                console.log('handleMarkerChange - updateData:', updateData);

                // 发送更新请求
                const response = await fetch('https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/edit/markerInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });

                const data = await response.json();
                if (data.code === 200) {
                    console.log('位置标记更新成功');
                    console.log('message:', data.message);
                    // 更新本地存储
                    if (markersData && Array.isArray(markersData)) {
                        const marker = markersData.find(m => 
                            parseFloat(m.latitude) === parseFloat(latitude) && 
                            parseFloat(m.longitude) === parseFloat(longitude)
                        );
                        if (marker) {
                            marker.marker_name = updateData.marker_name;
                            marker.isShow = updateData.isShow;
                            // marker.marker_id = updateData.marker_id;
                            if (field === 'no') {
                                marker.no = value;
                            }
                            if (field === 'marker_name') {
                                marker.marker_name = value;
                            }
                            console.log('Updated marker in localStorage:', marker);
                            localStorage.setItem('markersData', JSON.stringify(markersData));
                        }
                    }
                    // 刷新地图显示
                    updateMarkersVisibility();
                } else {
                    console.error('更新位置标记失败:', data.message);
                    alert('更新失败：' + data.message);
                }
            } catch (error) {
                console.error('更新位置标记错误:', error);
                alert('更新失败：' + error.message);
            }
            
            // 重置待修改状态
            pendingChanges = {
                no: null,
                marker_name: null,
                isShow: null
            };
        }, CHANGE_DELAY);
    }

    // 添加visibility按钮的立即处理函数
    async function handleVisibilityChange(newIsShow, latitude, longitude) {
        try {
            const user_id = localStorage.getItem('user_id');
            if (!user_id) {
                window.location.href = 'index.html';
                return;
            }

            // 获取当前选中的标记点信息
            const markersData = JSON.parse(localStorage.getItem('markersData') || '[]');
            if (!markersData || !Array.isArray(markersData)) return;
            
            // 使用经纬度查找标记点
            const marker = markersData.find(m => 
                parseFloat(m.latitude) === parseFloat(latitude) && 
                parseFloat(m.longitude) === parseFloat(longitude)
            );
            if (!marker) return;

            // 准备要发送的数据
            const updateData = {
                user_id: user_id,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                // marker_id: marker.marker_id,
                no: document.getElementById('location-no').value,
                name: document.getElementById('location-name').value,
                isShow: newIsShow
            };

            console.log('Sending visibility update data:', updateData);

            // 发送更新请求
            const response = await fetch('https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/edit/markerInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            if (data.code === 200) {
                console.log('位置标记更新成功');
                console.log('message:', data.message);
                // 更新本地存储
                if (markersData && Array.isArray(markersData)) {
                    const marker = markersData.find(m => 
                        parseFloat(m.latitude) === parseFloat(latitude) && 
                        parseFloat(m.longitude) === parseFloat(longitude)
                    );
                    if (marker) {
                        marker.marker_name = updateData.marker_name;
                        marker.isShow = updateData.isShow;
                        // marker.marker_id = updateData.marker_id;
                        localStorage.setItem('markersData', JSON.stringify(markersData));
                    }
                }
                // 刷新地图显示
                updateMarkersVisibility();
                
                // 根据isShow状态设置面板样式
                const gpsInfo = document.querySelector('.gps-info');
                const recordingList = document.querySelector('.recording-list');
                
                function setOverlay(container, show) {
                    if (!container) return;
                    // 先移除所有已存在的遮罩，避免重复
                    container.querySelectorAll('.disabled-overlay').forEach(el => el.remove());
                    if (show) {
                        const overlay = document.createElement('div');
                        overlay.className = 'disabled-overlay';
                        // 设置样式，让visibility按钮可交互
                        overlay.style.pointerEvents = 'none';
                        container.appendChild(overlay);
                        
                        // 确保visibility按钮在遮罩之上且可交互
                        const visibilityBtn = container.querySelector('#toggle-marker-visibility');
                        if (visibilityBtn) {
                            visibilityBtn.style.position = 'relative';
                            visibilityBtn.style.zIndex = '1000';
                            visibilityBtn.style.pointerEvents = 'auto';
                        }
                    } else {
                        // 恢复visibility按钮的样式
                        const visibilityBtn = container.querySelector('#toggle-marker-visibility');
                        if (visibilityBtn) {
                            visibilityBtn.style.position = '';
                            visibilityBtn.style.zIndex = '';
                            visibilityBtn.style.pointerEvents = '';
                        }
                    }
                }
                
                // 设置GPS信息区域的遮罩
                setOverlay(gpsInfo, !newIsShow);
                // 设置录音列表区域的遮罩
                // setOverlay(recordingList, !newIsShow);
                
            } else {
                console.error('更新位置标记失败:', data.message);
                alert('更新失败：' + data.message);
            }
        } catch (error) {
            console.error('更新位置标记错误:', error);
            alert('更新失败：' + error.message);
        }
    }

    // 创建标记点的函数
    function createMarker(location) {
        const marker = L.marker([parseFloat(location.latitude), parseFloat(location.longitude)])
            .addTo(map);
        
        marker.on('click', async function() {
            console.log('Marker被点击，准备停止所有音频');
            // 停止所有正在播放的音频
            stopAllAudio();
            console.log('Marker点击事件中的stopAllAudio调用完成');
            
            // 新增：点击marker时隐藏右侧内容区
            const rightColumn = document.querySelector('.right-column');
            if (rightColumn) {
                rightColumn.style.display = 'none';
                // 清空图片和文本内容
                const imagePlaceholder = rightColumn.querySelector('.image-placeholder');
                if (imagePlaceholder) {
                    imagePlaceholder.innerHTML = '<span style="color: #999;"></span>\n<div class="audio-player-placeholder" style="background: rgba(128, 128, 128, 0.2); border: 1px solid #ddd; height: 50px; display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; right: 0;"><span style="color: #fff;">暂无录音</span></div>';
                }
                const textContent = rightColumn.querySelector('.text-content');
                if (textContent) {
                    textContent.innerHTML = '<span style="color: #999; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">请点击一条录音记录</span>';
                }
            }
            console.log('marker clicked', location);
            currentMarker = marker;
            updateGPSInfo(
                location.latitude,
                location.longitude,
                location.no,
                location.marker_name,
                location.isShow
            );

            // 清空现有列表
            document.querySelector('.recording-list').innerHTML = '';

            // 清除所有选中状态
            document.querySelectorAll('.recording-item').forEach(recordingItem => {
                recordingItem.classList.remove('selected');
            });

            try {
                const user_id = localStorage.getItem('user_id');
                if (!user_id) {
                    throw new Error('未登录');
                }

                const response = await fetch(`https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/get/recordsList?user_id=${user_id}&latitude=${parseFloat(location.latitude)}&longitude=${parseFloat(location.longitude)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('获取录音记录失败');
                }

                const result = await response.json();
                console.log('获取录音记录接口返回数据:', result);
                
                if (result.code === 200 && Array.isArray(result.data)) {
                    // 将recordsList存储到localStorage
                    try {
                        localStorage.setItem('recordsList', JSON.stringify(result.data));
                        console.log('录音记录数据已存储到localStorage');
                    } catch (error) {
                        console.error('存储录音记录数据失败:', error);
                    }

                    // 按record_time从新到旧排序
                    const sortedRecords = result.data.sort((a, b) => {
                        return new Date(b.record_time) - new Date(a.record_time);
                    });

                    // 更新录音列表显示
                    const recordingList = document.querySelector('.recording-list');
                    recordingList.innerHTML = '';

                    sortedRecords.forEach(record => {
                        const item = document.createElement('div');
                        item.className = 'recording-item';
                        item.innerHTML = `
                            <div class="recording-item-main">
                                <input type="checkbox" ${record.isPlay ? 'checked' : ''}>
                                <span class="record-time">${record.record_time}</span>
                                <div class="record-name-wrapper">
                                    <span class="record-name" contenteditable="true">${record.record_notes || '未命名录音'}</span>
                                    <button class="record-name-toggle" tabindex="-1"></button>
                                </div>
                                <span class="audio-controls">
                                    <span class="audio-icon">🎵</span>
                                    <button class="play-btn">▶</button>
                                </span>
                            </div>
                            <div class="range-container">
                                <div class="double-slider"></div>
                                <div class="range-values">
                                    <span class="inner-value">${record.play_range.inner_radius}</span>
                                    <span class="outer-value">${record.play_range.outer_radius}</span>
                                </div>
                            </div>
                            <select class="play-mode-select">
                                <option value="false" ${!record.isLoop ? 'selected' : ''}>播完即止</option>
                                <option value="true" ${record.isLoop ? 'selected' : ''}>循环播放</option>
                            </select>
                        `;
                        recordingList.appendChild(item);

                        // 新增：点击recording-item时显示右侧内容区
                        item.addEventListener('click', function() {
                            const rightColumn = document.querySelector('.right-column');
                            if (rightColumn) rightColumn.style.display = '';
                        }, true);

                        // 为录音项目添加点击事件
                        item.addEventListener('click', async function(e) {
                            // 如果点击的是可交互元素，则不执行
                            // if (e.target.closest('input[type="checkbox"]') || 
                            //     e.target.closest('.record-name') || 
                            //     e.target.closest('.record-name-toggle') ||
                            //     e.target.closest('.audio-controls') ||
                            //     e.target.closest('.play-btn') ||
                            //     e.target.closest('.play-mode-select') ||
                            //     e.target.closest('.double-slider') ||
                            //     e.target.closest('.noUi-handle')) {
                            //     return;
                            // }

                            console.log('Record item被点击，准备停止所有音频');
                            // 停止所有正在播放的音频
                            stopAllAudio();
                            console.log('Record item点击事件中的stopAllAudio调用完成');

                            // 移除所有录音项目的选中状态
                            document.querySelectorAll('.recording-item').forEach(recordingItem => {
                                recordingItem.classList.remove('selected');
                            });

                            // 为当前点击的项目添加选中状态
                            item.classList.add('selected');

                            // 重置右侧内容区为"获取中"状态
                            const rightColumn = document.querySelector('.right-column');
                            if (rightColumn) {
                                rightColumn.style.display = '';
                                
                                // 重置图片区域
                                const imagePlaceholder = rightColumn.querySelector('.image-placeholder');
                                if (imagePlaceholder) {
                                    imagePlaceholder.innerHTML = '<span style="color: #999;">获取图片中...</span>';
                                }
                                
                                // 重置音频播放器区域
                                const audioPlayerPlaceholder = rightColumn.querySelector('.audio-player-placeholder');
                                if (audioPlayerPlaceholder) {
                                    audioPlayerPlaceholder.innerHTML = '<span style="color: #999;">获取音频中...</span>';
                                    audioPlayerPlaceholder.onclick = null; // 清除点击事件
                                }
                                
                                // 重置文本内容区域
                                const textContent = rightColumn.querySelector('.text-content');
                                if (textContent) {
                                    textContent.innerHTML = '<span style="color: #999; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">获取文本中...</span>';
                                }
                            }

                            try {
                                const user_id = localStorage.getItem('user_id');
                                if (!user_id) {
                                    throw new Error('未登录');
                                }

                                console.log('获取录音图片和音频 - record_id:', record.record_id);
                                
                                // 同时调用两个接口
                                const [picResponse, audioResponse] = await Promise.all([
                                    fetch(`https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/get/getpic?user_id=${user_id}&record_id=${record.record_id}`, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }),
                                    fetch(`https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/get/getaudio?user_id=${user_id}&record_id=${record.record_id}`, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                ]);

                                const picResult = await picResponse.json();
                                const audioResult = await audioResponse.json();
                                // console.log('发送录音图片请求:', "getaudio?user_id="+user_id+"&record_id="+record.record_id);
                                console.log('获取录音图片响应:', picResult);
                                console.log('获取录音音频响应:', audioResult);

                                // 处理图片数据
                                if (picResult.code === 200 && picResult.data) {
                                    // console.log('开始处理图片数据:', picResult.data);
                                    
                                    // 更新图片
                                    const imageGallery = document.querySelector('.image-gallery');
                                    // console.log('找到image-gallery:', imageGallery);
                                    
                                    const imagePlaceholder = imageGallery.querySelector('.image-placeholder');
                                    // console.log('找到image-placeholder:', imagePlaceholder);
                                    
                                    if (picResult.data.img) {
                                        console.log('找到图片数据，长度:', picResult.data.img.length);
                                        
                                        // 清空image-placeholder
                                        imagePlaceholder.innerHTML = '';
                                        
                                        // 创建图片元素
                                        const img = document.createElement('img');
                                        img.src = `data:image/jpeg;base64,${picResult.data.img}`;
                                        // 不设置任何style，让CSS控制宽高和object-fit
                                        // img.style.width = '100%';
                                        // img.style.height = '100%';
                                        // img.style.objectFit = 'contain';
                                        
                                        // 添加图片加载事件
                                        img.onload = function() {
                                            console.log('图片加载成功');
                                        };
                                        img.onerror = function() {
                                            console.error('图片加载失败');
                                        };
                                        
                                        // 添加图片
                                        imagePlaceholder.appendChild(img);
                                        // console.log('图片已添加到DOM');
                                        
                                        // 使用现有的音频播放器，而不是创建新的
                                        const audioPlayerPlaceholder = imagePlaceholder.querySelector('.audio-player-placeholder');
                                        if (!audioPlayerPlaceholder) {
                                            // console.log('未找到现有的音频播放器，创建一个新的');
                                            // 只有在找不到现有播放器时才创建新的
                                            const newAudioPlayerPlaceholder = document.createElement('div');
                                            newAudioPlayerPlaceholder.className = 'audio-player-placeholder';
                                            newAudioPlayerPlaceholder.style.cssText = 'background: rgba(128, 128, 128, 0.2); border: 1px solid #ddd; height: 50px; display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; right: 0;';
                                            newAudioPlayerPlaceholder.innerHTML = '<span style="color: #fff;">暂无录音</span>';
                                            
                                            // 将音频播放器添加到image-placeholder
                                            imagePlaceholder.appendChild(newAudioPlayerPlaceholder);
                                            // console.log('新的音频播放器已添加到DOM（有图片情况）');
                                        }
                                    } else {
                                        console.log('没有图片数据');
                                        imagePlaceholder.innerHTML = '<span style="color: #999;">记录设备未上传图片数据</span>';
                                        
                                        // 使用现有的音频播放器，而不是创建新的
                                        const audioPlayerPlaceholder = imagePlaceholder.querySelector('.audio-player-placeholder');
                                        if (!audioPlayerPlaceholder) {
                                            // console.log('未找到现有的音频播放器，创建一个新的');
                                            // 只有在找不到现有播放器时才创建新的
                                            const newAudioPlayerPlaceholder = document.createElement('div');
                                            newAudioPlayerPlaceholder.className = 'audio-player-placeholder';
                                            newAudioPlayerPlaceholder.style.cssText = 'background: rgba(128, 128, 128, 0.2); border: 1px solid #ddd; height: 50px; display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; right: 0;';
                                            newAudioPlayerPlaceholder.innerHTML = '<span style="color: #fff;">暂无录音</span>';
                                            
                                            // 将音频播放器添加到image-placeholder
                                            imagePlaceholder.appendChild(newAudioPlayerPlaceholder);
                                            // console.log('新的音频播放器已添加到DOM（无图片情况）');
                                        }
                                    }

                                    // 更新文本内容
                                    const textContent = document.querySelector('.text-content');
                                    // console.log('找到text-content:', textContent);
                                    // console.log('prompts数据:', picResult.data.prompts);
                                    
                                    if (textContent && picResult.data.prompts) {
                                        // console.log('设置文本内容:', picResult.data.prompts);
                                        // 检查文本是否只有一行（不包含换行符）
                                        const isSingleLine = !picResult.data.prompts.includes('\n') && !picResult.data.prompts.includes('\r');
                                        
                                        if (isSingleLine) {
                                            // 单行文本居中显示
                                            textContent.innerHTML = `<span style="color: #333; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">${picResult.data.prompts}</span>`;
                                        } else {
                                            // 多行文本正常显示
                                            textContent.innerHTML = `<span style="color: #333;">${picResult.data.prompts}</span>`;
                                        }
                                    } else if (textContent) {
                                        // console.log('没有prompts数据，显示占位符');
                                        textContent.innerHTML = '<span style="color: #999; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">未获取到文本记录</span>';
                                    }
                                } else {
                                    console.error('获取录音图片失败:', picResult.message);
                                    // 如果获取图片失败，显示错误信息
                                    const imagePlaceholder = document.querySelector('.image-placeholder');
                                    if (imagePlaceholder) {
                                        imagePlaceholder.innerHTML = '<span style="color: #999;">获取图片失败</span>';
                                    }
                                    
                                    const textContent = document.querySelector('.text-content');
                                    if (textContent) {
                                        textContent.innerHTML = '<span style="color: #999; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">获取文本失败</span>';
                                    }
                                }

                                // 处理音频数据
                                if (audioResult.code === 200 && audioResult.data && audioResult.data.audio) {
                                    // 存储新音频前，先清除所有 audio_ 前缀的 localStorage 项
                                    Object.keys(localStorage).forEach(key => {
                                        if (key.startsWith('audio_')) {
                                            localStorage.removeItem(key);
                                        }
                                    });
                                    // 将音频数据存储到localStorage
                                    localStorage.setItem(`audio_${record.record_id}`, audioResult.data.audio);
                                    console.log('音频数据已暂存 - record_id:', record.record_id);
                                    
                                    // 更新音频播放器显示 - 重新查找audio-player-placeholder
                                    const audioPlayerPlaceholder = document.querySelector('.audio-player-placeholder');
                                    // console.log('找到音频播放器:', audioPlayerPlaceholder);
                                    
                                    if (audioPlayerPlaceholder) {
                                        // console.log('更新音频播放器显示');
                                        audioPlayerPlaceholder.innerHTML = `
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <span style="font-size: 24px; color: #fff;">🎵</span>
                                                <span style="color: #fff;">点击播放录音</span>
                                            </div>
                                        `;
                                        
                                        // 为音频播放器添加点击事件
                                        let audio = null;
                                        audioPlayerPlaceholder.onclick = function() {
                                            // console.log('音频播放器被点击');
                                            if (!audio) {
                                                try {
                                                    // 从localStorage获取音频数据
                                                    const audioData = localStorage.getItem(`audio_${record.record_id}`);
                                                    if (!audioData) {
                                                        alert('音频数据不存在');
                                                        return;
                                                    }
                                                    
                                                    console.log('开始处理音频数据');
                                                    console.log('音频数据长度:', audioData.length);
                                                    console.log('音频数据前50个字符:', audioData.substring(0, 50));
                                                    
                                                    // 检查音频数据是否为空或过短
                                                    if (!audioData || audioData.length < 100) {
                                                        console.error('音频数据为空或过短');
                                                        alert('音频数据无效');
                                                        return;
                                                    }
                                                    
                                                    // 尝试直接使用base64数据创建音频
                                                    console.log('尝试直接播放base64音频数据');
                                                    const audioUrl = `data:audio/wav;base64,${audioData}`;
                                                    
                                                    audio = new Audio();
                                                    
                                                    // 将audio对象存储到audioPlayerPlaceholder上，以便全局停止函数能够访问
                                                    audioPlayerPlaceholder.audio = audio;
                                                    
                                                    // 添加音频加载事件
                                                    audio.onloadstart = () => console.log('音频开始加载');
                                                    audio.oncanplay = () => console.log('音频可以播放');
                                                    audio.onerror = (e) => {
                                                        if (window.isManuallyStopped) return;
                                                        console.error('直接播放base64失败，尝试PCM转换');
                                                        console.error('音频错误详情:', audio.error);
                                                        console.error('音频错误代码:', audio.error ? audio.error.code : 'unknown');
                                                        
                                                        // 如果直接播放失败，尝试PCM转换
                                                        tryPCMConversion(audioData, record.record_id);
                                                    };
                                                    
                                                    audio.onended = () => {
                                                        console.log('音频播放结束');
                                                        audioPlayerPlaceholder.innerHTML = `
                                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                                <span style="font-size: 24px; color: #fff;">🎵</span>
                                                                <span style="color: #fff;">点击播放录音</span>
                                                            </div>
                                                        `;
                                                        audioPlayerPlaceholder.audio = null;
                                                        audio = null;
                                                    };
                                                    
                                                    // 设置音频源
                                                    audio.src = audioUrl;
                                                    
                                                    // 等待音频加载完成后再播放
                                                    audio.oncanplaythrough = () => {
                                                        if (window.isManuallyStopped) {
                                                            console.log('打断后不自动播放');
                                                            return;
                                                        }
                                                        // 音频加载完成后自动播放
                                                        audio.play()
                                                            .then(() => {
                                                                // console.log('音频开始播放');
                                                                audioPlayerPlaceholder.innerHTML = `
                                                                    <div style="display: flex; align-items: center; gap: 10px;">
                                                                        <span style="font-size: 24px; color: #fff;">⏸</span>
                                                                        <span style="color: #fff;">点击暂停</span>
                                                                    </div>
                                                                `;
                                                            })
                                                            .catch(error => {
                                                                // console.error('播放音频失败:', error);
                                                                alert('无法播放音频文件：' + error.message);
                                                            });
                                                    };
                                                    
                                                } catch (error) {
                                                    // console.error('音频处理错误:', error);
                                                    alert('音频处理失败：' + error.message);
                                                    return;
                                                }
                                            } else {
                                                // 音频对象已存在，切换播放/暂停状态
                                                // 确保引用正确
                                                audioPlayerPlaceholder.audio = audio;
                                                
                                                if (audio.paused) {
                                                    audio.play()
                                                        .then(() => {
                                                            // console.log('音频恢复播放');
                                                            audioPlayerPlaceholder.innerHTML = `
                                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                                    <span style="font-size: 24px; color: #fff;">⏸</span>
                                                                    <span style="color: #fff;">点击暂停</span>
                                                                </div>
                                                            `;
                                                        })
                                                        .catch(error => {
                                                            // console.error('播放音频失败:', error);
                                                            alert('无法播放音频文件：' + error.message);
                                                        });
                                                } else {
                                                    audio.pause();
                                                    // console.log('音频已暂停');
                                                    audioPlayerPlaceholder.innerHTML = `
                                                        <div style="display: flex; align-items: center; gap: 10px;">
                                                            <span style="font-size: 24px; color: #fff;">🎵</span>
                                                            <span style="color: #fff;">点击播放录音</span>
                                                        </div>
                                                    `;
                                                }
                                            }
                                        };
                                        
                                        // PCM转换函数
                                        function tryPCMConversion(audioData, recordId) {
                                            try {
                                                console.log('开始PCM转换');
                                                
                                                // 将base64编码的PCM数据转换为WAV格式
                                                const pcmData = atob(audioData);
                                                console.log('PCM数据长度:', pcmData.length);
                                                console.log('PCM数据前10字节:', Array.from(pcmData.slice(0, 10).split('').map(c => c.charCodeAt(0))));
                                                
                                                // 检查PCM数据是否有效
                                                if (pcmData.length === 0) {
                                                    throw new Error('PCM数据解码后为空');
                                                }
                                                
                                                const wavData = convertPCMToWAV(pcmData, 16000);
                                                console.log('WAV数据长度:', wavData.byteLength);
                                                
                                                // 检查WAV数据是否有效
                                                if (wavData.byteLength < 44) {
                                                    throw new Error('WAV数据生成失败，数据过短');
                                                }
                                                
                                                // 创建WAV格式的音频Blob
                                                const audioBlob = new Blob([wavData], { type: 'audio/wav' });
                                                console.log('音频Blob大小:', audioBlob.size, 'bytes');
                                                
                                                const audioUrl = URL.createObjectURL(audioBlob);
                                                console.log('创建WAV音频URL:', audioUrl);
                                                
                                                // 创建新的音频对象
                                                const newAudio = new Audio();
                                                
                                                // 将新音频对象存储到audioPlayerPlaceholder上
                                                audioPlayerPlaceholder.audio = newAudio;
                                                
                                                newAudio.onloadstart = () => console.log('PCM转换音频开始加载');
                                                newAudio.oncanplay = () => console.log('PCM转换音频可以播放');
                                                newAudio.onerror = (e) => {
                                                    if (window.isManuallyStopped) return;
                                                    console.error('PCM转换音频加载错误:', e);
                                                    console.error('音频错误详情:', newAudio.error);
                                                    alert('音频格式不支持或数据损坏，无法播放');
                                                };
                                                
                                                newAudio.onended = () => {
                                                    console.log('PCM转换音频播放结束');
                                                    audioPlayerPlaceholder.innerHTML = `
                                                        <div style="display: flex; align-items: center; gap: 10px;">
                                                            <span style="font-size: 24px; color: #fff;">🎵</span>
                                                            <span style="color: #fff;">点击播放录音</span>
                                                        </div>
                                                    `;
                                                    audioPlayerPlaceholder.audio = null;
                                                    URL.revokeObjectURL(audioUrl);
                                                    audio = null;
                                                };
                                                
                                                newAudio.oncanplaythrough = () => {
                                                    if (window.isManuallyStopped) {
                                                        console.log('打断后不自动播放(PCM)');
                                                        return;
                                                    }
                                                    console.log('PCM转换音频完全加载，开始播放');
                                                    newAudio.play()
                                                        .then(() => {
                                                            console.log('PCM转换音频开始播放');
                                                            audio = newAudio;
                                                            audioPlayerPlaceholder.innerHTML = `
                                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                                    <span style="font-size: 24px; color: #fff;">⏸</span>
                                                                    <span style="color: #fff;">点击暂停</span>
                                                                </div>
                                                            `;
                                                        })
                                                        .catch(error => {
                                                            console.error('PCM转换音频播放失败:', error);
                                                            alert('无法播放音频文件：' + error.message);
                                                        });
                                                };
                                                
                                                newAudio.src = audioUrl;
                                                
                                            } catch (error) {
                                                console.error('PCM转换失败:', error);
                                                alert('音频处理失败：' + error.message);
                                            }
                                        }
                                    } else {
                                        console.error('未找到音频播放器元素');
                                    }
                                } else {
                                    console.error('获取录音音频失败:', audioResult.message);
                                    // 如果没有音频数据，显示获取失败状态
                                    const audioPlayerPlaceholder = document.querySelector('.audio-player-placeholder');
                                    if (audioPlayerPlaceholder) {
                                        audioPlayerPlaceholder.innerHTML = `
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <span style="font-size: 24px; color: #fff;">🔇</span>
                                                <span style="color: #fff;">获取音频失败</span>
                                            </div>
                                        `;
                                        audioPlayerPlaceholder.onclick = null;
                                    }
                                }
                            } catch (error) {
                                console.error('获取录音数据错误:', error);
                                
                                // 显示获取失败状态
                                const rightColumn = document.querySelector('.right-column');
                                if (rightColumn) {
                                    // 重置图片区域为错误状态
                                    const imagePlaceholder = rightColumn.querySelector('.image-placeholder');
                                    if (imagePlaceholder) {
                                        imagePlaceholder.innerHTML = '<span style="color: #999;">获取图片失败</span>';
                                    }
                                    
                                    // 重置音频播放器区域为错误状态
                                    const audioPlayerPlaceholder = rightColumn.querySelector('.audio-player-placeholder');
                                    if (audioPlayerPlaceholder) {
                                        audioPlayerPlaceholder.innerHTML = `
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <span style="font-size: 24px; color: #fff;">🔇</span>
                                                <span style="color: #fff;">获取音频失败</span>
                                            </div>
                                        `;
                                        audioPlayerPlaceholder.onclick = null;
                                    }
                                    
                                    // 重置文本内容区域为错误状态
                                    const textContent = rightColumn.querySelector('.text-content');
                                    if (textContent) {
                                        textContent.innerHTML = '<span style="color: #999; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">获取文本失败</span>';
                                    }
                                }
                            }
                        });

                        // 防抖函数
                        function debounce(func, wait) {
                            let timeout;
                            return function executedFunction(...args) {
                                const later = () => {
                                    clearTimeout(timeout);
                                    func(...args);
                                };
                                clearTimeout(timeout);
                                timeout = setTimeout(later, wait);
                            };
                        }

                        // 创建一个通用的更新函数
                        async function updateAudioSetting(updateData) {
                            try {
                                const user_id = localStorage.getItem('user_id');
                                if (!user_id) {
                                    throw new Error('未登录');
                                }

                                // 获取当前录音记录的完整数据
                                const recordsList = JSON.parse(localStorage.getItem('recordsList') || '[]');
                                const currentRecord = recordsList.find(r => r.record_id === record.record_id);
                                
                                if (!currentRecord) {
                                    throw new Error('未找到录音记录');
                                }

                                // 从DOM元素中获取当前的最新值
                                const checkbox = item.querySelector('input[type="checkbox"]');
                                const playModeSelect = item.querySelector('.play-mode-select');
                                const recordName = item.querySelector('.record-name');
                                const innerValue = item.querySelector('.inner-value');
                                const outerValue = item.querySelector('.outer-value');

                                // 构建完整的请求数据，包含所有字段的最新值
                                const requestData = {
                                    user_id: user_id,
                                    record_id: record.record_id,
                                    isPlay: checkbox ? checkbox.checked : currentRecord.isPlay,
                                    isLoop: playModeSelect ? (playModeSelect.value === 'true') : currentRecord.isLoop,
                                    play_range: {
                                        inner_radius: innerValue ? parseInt(innerValue.textContent) : currentRecord.play_range.inner_radius,
                                        outer_radius: outerValue ? parseInt(outerValue.textContent) : currentRecord.play_range.outer_radius
                                    },
                                    record_notes: recordName ? recordName.textContent.trim() : (currentRecord.record_notes || ''),
                                    // record_time: currentRecord.record_time
                                };

                                // 用最新的修改数据覆盖对应字段
                                Object.assign(requestData, updateData);

                                // console.log('updateAudioSetting - record_id:', record.record_id);
                                // console.log('updateAudioSetting - updateData:', updateData);
                                console.log('updateAudioSetting - 完整请求数据:', requestData);

                                const response = await fetch('https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/edit/audioSetting', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(requestData)
                                });

                                const result = await response.json();
                                console.log('更新响应:', result);
                                // console.log('更新消息:', result.message);

                                if (result.code === 200) {
                                    // 更新本地存储中的数据
                                    if (recordsList) {
                                        const targetRecord = recordsList.find(r => r.record_id === record.record_id);
                                        if (targetRecord) {
                                            Object.assign(targetRecord, updateData);
                                            localStorage.setItem('recordsList', JSON.stringify(recordsList));
                                        }
                                    }
                                    return true;
                                } else {
                                    throw new Error(result.message || '更新失败');
                                }
                            } catch (error) {
                                console.error('更新错误:', error);
                                alert('更新失败：' + error.message);
                                return false;
                            }
                        }

                        // 使用防抖包装更新函数
                        const debouncedUpdate = debounce(updateAudioSetting, 500); // 500ms 延迟

                        // 监听checkbox变化
                        const checkbox = item.querySelector('input[type="checkbox"]');
                        checkbox.addEventListener('change', async function() {
                            const isChecked = this.checked;
                            const success = await updateAudioSetting({ isPlay: isChecked }); // checkbox 不需要防抖
                            if (!success) {
                                this.checked = !isChecked;
                            }
                        });

                        // 监听录音名称变化（使用防抖）
                        const recordName = item.querySelector('.record-name');
                        let originalName; // 存储原始名称
                        let pendingUpdate = null; // 存储待更新的数据
                        
                        recordName.addEventListener('focus', function() {
                            originalName = this.textContent.trim();
                        });

                        recordName.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                this.blur(); // 回车时失焦
                            }
                        });

                        recordName.addEventListener('input', function(e) {
                            // 只在有换行符时才处理
                            if (/[\r\n]/.test(this.textContent)) {
                                // 去除换行
                                const newText = this.textContent.replace(/[\r\n]+/g, '');
                                this.textContent = newText;
                                // 恢复光标到末尾
                                setTimeout(() => {
                                    const selection = window.getSelection();
                                    const range = document.createRange();
                                    range.selectNodeContents(this);
                                    range.collapse(false);
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                }, 0);
                            }
                            pendingUpdate = { record_notes: this.textContent.trim() };
                            debouncedUpdate(pendingUpdate);
                        });

                        recordName.addEventListener('blur', function() {
                            // 失焦时让内容从头显示
                            this.scrollLeft = 0;
                        });

                        recordName.addEventListener('blur', async function() {
                            const newName = this.textContent.trim();
                            if (newName !== originalName && pendingUpdate) {
                                // 如果还有待更新的数据，立即发送
                                const success = await updateAudioSetting(pendingUpdate);
                                if (!success) {
                                    this.textContent = originalName;
                                }
                                pendingUpdate = null;
                            }
                        });

                        // 展开按钮功能
                        const expandBtn = item.querySelector('.record-name-toggle');
                        expandBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                            
                            // 创建弹窗
                            const modalOverlay = document.createElement('div');
                            modalOverlay.className = 'modal-overlay';
                            
                            const currentText = recordName.textContent.trim();
                            
                            modalOverlay.innerHTML = `
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h3 class="modal-title">编辑录音名称</h3>
                                        <button class="modal-close">&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <textarea class="modal-textarea" maxlength="500" placeholder="请输入录音名称（最多500字）">${currentText}</textarea>
                                        <div class="char-count">0/500</div>
                                    </div>
                                    <div class="modal-footer">
                                        <button class="modal-btn modal-btn-cancel">取消</button>
                                        <button class="modal-btn modal-btn-confirm">确定修改</button>
                                    </div>
                                </div>
                            `;
                            
                            document.body.appendChild(modalOverlay);
                            
                            const textarea = modalOverlay.querySelector('.modal-textarea');
                            const charCount = modalOverlay.querySelector('.char-count');
                            const closeBtn = modalOverlay.querySelector('.modal-close');
                            const cancelBtn = modalOverlay.querySelector('.modal-btn-cancel');
                            const confirmBtn = modalOverlay.querySelector('.modal-btn-confirm');
                            
                            // 更新字符计数
                            function updateCharCount() {
                                const count = textarea.value.length;
                                charCount.textContent = `${count}/500`;
                                if (count >= 500) {
                                    charCount.classList.add('limit');
                                } else {
                                    charCount.classList.remove('limit');
                                }
                            }
                            
                            // 初始化字符计数
                            updateCharCount();
                            
                            // 监听文本变化
                            textarea.addEventListener('input', updateCharCount);
                            
                            // 关闭弹窗函数
                            function closeModal() {
                                document.body.removeChild(modalOverlay);
                            }
                            
                            // 关闭按钮事件
                            closeBtn.addEventListener('click', closeModal);
                            cancelBtn.addEventListener('click', closeModal);
                            
                            // 点击遮罩层关闭
                            modalOverlay.addEventListener('click', function(e) {
                                if (e.target === modalOverlay) {
                                    closeModal();
                                }
                            });
                            
                            // 确定修改按钮事件
                            confirmBtn.addEventListener('click', async function() {
                                const newText = textarea.value.trim();
                                
                                // 更新录音名称
                                const btn = recordName.querySelector('.record-name-toggle');
                                recordName.innerHTML = '';
                                recordName.append(document.createTextNode(newText));
                                if (btn) recordName.appendChild(btn);
                                
                                // 发送更新请求
                                const success = await updateAudioSetting({ record_notes: newText });
                                if (!success) {
                                    // 如果更新失败，恢复原文本
                                    recordName.textContent = currentText;
                                    alert('更新失败，请重试');
                                }
                                
                                closeModal();
                            });
                            
                            // 聚焦到文本框
                            textarea.focus();
                            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                        });

                        // 音频控制区域点击事件
                        const audioControls = item.querySelector('.audio-controls');
                        audioControls.addEventListener('click', function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                            
                            // 创建音频操作弹窗
                            const modalOverlay = document.createElement('div');
                            modalOverlay.className = 'modal-overlay';
                            
                            modalOverlay.innerHTML = `
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h3 class="modal-title">音频操作</h3>
                                        <button class="modal-close">&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <p style="margin: 0 0 20px 0; color: #666;">请选择要执行的操作：</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button class="modal-btn modal-btn-download">下载创作音频</button>
                                        <button class="modal-btn modal-btn-submit">提交创作音频</button>
                                    </div>
                                </div>
                            `;
                            
                            document.body.appendChild(modalOverlay);
                            
                            const closeBtn = modalOverlay.querySelector('.modal-close');
                            const downloadBtn = modalOverlay.querySelector('.modal-btn-download');
                            const submitBtn = modalOverlay.querySelector('.modal-btn-submit');
                            
                            // 关闭弹窗函数
                            function closeModal() {
                                document.body.removeChild(modalOverlay);
                            }
                            
                            // 关闭按钮事件
                            closeBtn.addEventListener('click', closeModal);
                            
                            // 点击遮罩层关闭
                            modalOverlay.addEventListener('click', function(e) {
                                if (e.target === modalOverlay) {
                                    closeModal();
                                }
                            });
                            
                            // 下载创作音频按钮事件
                            downloadBtn.addEventListener('click', async function() {
                                console.log('下载创作音频 - record_id:', record.record_id);
                                
                                try {
                                    const user_id = localStorage.getItem('user_id');
                                    if (!user_id) {
                                        alert('用户未登录');
                                        return;
                                    }
                                    
                                    // 显示下载状态
                                    downloadBtn.disabled = true;
                                    downloadBtn.textContent = '下载中...';
                                    
                                    // 构建下载URL
                                    const downloadUrl = `https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/edit/downloadCreatedAudio?user_id=${user_id}&record_id=${record.record_id}`;
                                    
                                    // 发起下载请求
                                    const response = await fetch(downloadUrl, {
                                        method: 'GET',
                                        headers: {
                                            // 'Accept': 'audio/mpeg,audio/*,*/*'
                                            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                                            'Accept': '*/*',
                                            'Host': 'nyw6vsud2p.ap-northeast-1.awsapprunner.com',
                                            'Connection': 'keep-alive'

                                        }
                                    });
                                    
                                    // console.log('下载响应状态:', response.status);
                                    // console.log('下载响应头:', response.headers);
                                    
                                    if (!response.ok) {
                                        throw new Error(`下载失败: ${response.status} ${response.statusText}`);
                                    }
                                    
                                    // 检查响应类型
                                    const contentType = response.headers.get('Content-Type');
                                    const contentDisposition = response.headers.get('Content-Disposition');
                                    
                                    // console.log('Content-Type:', contentType);
                                    // console.log('Content-Disposition:', contentDisposition);
                                    
                                    if (!contentType || !contentType.includes('audio/')) {
                                        throw new Error('服务器返回的不是音频文件');
                                    }
                                    
                                    // 获取文件名
                                    let filename = 'audio.mp3';
                                    if (contentDisposition) {
                                        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
                                        if (filenameMatch) {
                                            filename = filenameMatch[1];
                                        }
                                    }
                                    
                                    // 获取音频数据
                                    const audioBlob = await response.blob();
                                    console.log('音频Blob大小:', audioBlob.size, 'bytes');
                                    
                                    if (audioBlob.size === 0) {
                                        throw new Error('下载的音频文件为空');
                                    }
                                    
                                    // 创建下载链接
                                    const downloadUrl2 = URL.createObjectURL(audioBlob);
                                    const downloadLink = document.createElement('a');
                                    downloadLink.href = downloadUrl2;
                                    downloadLink.download = filename;
                                    downloadLink.style.display = 'none';
                                    
                                    // 触发下载
                                    document.body.appendChild(downloadLink);
                                    downloadLink.click();
                                    document.body.removeChild(downloadLink);
                                    
                                    // 清理URL对象
                                    setTimeout(() => {
                                        URL.revokeObjectURL(downloadUrl2);
                                    }, 1000);
                                    
                                    console.log('音频下载成功:', filename);
                                    alert('音频下载成功！');
                                    
                                } catch (error) {
                                    console.error('下载音频失败:', error);
                                    alert('下载失败：未上传音频文件');
                                } finally {
                                    // 恢复按钮状态
                                    downloadBtn.disabled = false;
                                    downloadBtn.textContent = '下载创作音频';
                                }
                                
                                closeModal();
                            });
                            
                            // 提交创作音频按钮事件
                            submitBtn.addEventListener('click', function() {
                                console.log('提交创作音频 - record_id:', record.record_id);
                                
                                // 创建文件输入元素
                                const fileInput = document.createElement('input');
                                fileInput.type = 'file';
                                fileInput.accept = '.mp3,.wav';
                                fileInput.style.display = 'none';
                                
                                // 添加文件选择事件
                                fileInput.addEventListener('change', function(e) {
                                    const file = e.target.files[0];
                                    if (file) {
                                        // 检查文件类型
                                        if (!file.type.match('audio/(mp3|wav)') && 
                                            !file.name.toLowerCase().endsWith('.mp3') && 
                                            !file.name.toLowerCase().endsWith('.wav')) {
                                            alert('请选择MP3或WAV格式的音频文件');
                                            return;
                                        }
                                        
                                        // 生成音频文件路径
                                        const audioFilePath = file.path || URL.createObjectURL(file);
                                        
                                        // 存储选中的文件和路径（覆盖之前的文件）
                                        submitBtn.selectedFile = file;
                                        submitBtn.audioFilePath = audioFilePath;
                                        
                                        console.log('选择的文件信息:', {
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            path: audioFilePath
                                        });
                                        
                                        // 显示文件信息
                                        const modalBody = modalOverlay.querySelector('.modal-body');
                                        modalBody.innerHTML = `
                                            <p style="margin: 0 0 20px 0; color: #666;">请选择要执行的操作：</p>
                                            <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
                                                <p style="margin: 0; color: #333; font-weight: bold;">已选择文件：</p>
                                                <p style="margin: 5px 0 0 0; color: #666;">${file.name}</p>
                                                <p style="margin: 5px 0 0 0; color: #666;">大小：${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                <p style="margin: 5px 0 0 0; color: #666;">路径：${audioFilePath}</p>
                                            </div>
                                        `;
                                        
                                        // 更新按钮区域（如果还没有更新的话）
                                        const modalFooter = modalOverlay.querySelector('.modal-footer');
                                        if (!modalFooter.querySelector('.modal-btn-reselect')) {
                                            modalFooter.innerHTML = `
                                                <button class="modal-btn modal-btn-cancel">取消</button>
                                                <button class="modal-btn modal-btn-reselect">重新选择文件</button>
                                                <button class="modal-btn modal-btn-submit">提交音频文件</button>
                                            `;
                                            
                                            // 重新绑定按钮事件
                                            const cancelBtn = modalOverlay.querySelector('.modal-btn-cancel');
                                            const reselectBtn = modalOverlay.querySelector('.modal-btn-reselect');
                                            const newSubmitBtn = modalOverlay.querySelector('.modal-btn-submit');
                                            
                                            cancelBtn.addEventListener('click', closeModal);
                                            
                                            // 存储fileInput引用，避免重复创建
                                            modalOverlay.fileInput = fileInput;
                                            
                                            reselectBtn.addEventListener('click', function() {
                                                // 使用已存储的fileInput，避免重复创建
                                                if (modalOverlay.fileInput) {
                                                    document.body.appendChild(modalOverlay.fileInput);
                                                    modalOverlay.fileInput.click();
                                                    document.body.removeChild(modalOverlay.fileInput);
                                                }
                                            });
                                            
                                            // 使用一次性事件监听器，避免重复绑定
                                            newSubmitBtn.addEventListener('click', function submitHandler() {
                                                // 使用当前存储的最新文件和路径
                                                if (submitBtn.selectedFile && submitBtn.audioFilePath) {
                                                    // 临时禁用按钮，防止重复点击
                                                    newSubmitBtn.disabled = true;
                                                    newSubmitBtn.textContent = '上传中...';
                                                    
                                                    uploadAudioFile(submitBtn.selectedFile, record, newSubmitBtn, submitBtn.audioFilePath, closeModal);
                                                }
                                            });
                                        } else {
                                            // 如果按钮已经存在，只更新提交按钮的文件引用
                                            const newSubmitBtn = modalOverlay.querySelector('.modal-btn-submit');
                                            
                                            // 移除所有现有的事件监听器
                                            const newSubmitBtnClone = newSubmitBtn.cloneNode(true);
                                            newSubmitBtn.parentNode.replaceChild(newSubmitBtnClone, newSubmitBtn);
                                            
                                            // 添加新的事件监听器
                                            newSubmitBtnClone.addEventListener('click', function submitHandler() {
                                                // 使用当前存储的最新文件和路径
                                                if (submitBtn.selectedFile && submitBtn.audioFilePath) {
                                                    // 临时禁用按钮，防止重复点击
                                                    newSubmitBtnClone.disabled = true;
                                                    newSubmitBtnClone.textContent = '上传中...';
                                                    
                                                    uploadAudioFile(submitBtn.selectedFile, record, newSubmitBtnClone, submitBtn.audioFilePath, closeModal);
                                                }
                                            });
                                        }
                                    }
                                });
                                
                                // 触发文件选择
                                document.body.appendChild(fileInput);
                                fileInput.click();
                                document.body.removeChild(fileInput);
                            });
                        });

                        // 播放按钮事件 - 阻止冒泡到audio-controls
                        const playBtn = item.querySelector('.play-btn');
                        
                        // 创建播放控制函数
                        async function handlePlayButtonClick(e) {
                            e.stopPropagation(); // 阻止事件冒泡到audio-controls
                            console.log('播放按钮被点击 - record_id:', record.record_id);
                            
                            try {
                                const user_id = localStorage.getItem('user_id');
                                if (!user_id) {
                                    alert('用户未登录');
                                    return;
                                }
                                
                                // 检查缓存中是否已有该音频
                                const cacheKey = `audio_cache_${record.record_id}`;
                                let cachedAudio = window.audioCache ? window.audioCache[cacheKey] : null;
                                
                                if (cachedAudio) {
                                    console.log('使用缓存的音频文件 - record_id:', record.record_id);
                                    
                                    // 如果当前有音频在播放，先停止
                                    if (window.currentPlayingAudio && window.currentPlayingAudio !== cachedAudio) {
                                        window.currentPlayingAudio.pause();
                                        window.currentPlayingAudio.currentTime = 0;
                                    }
                                    
                                    // 保存当前播放的音频引用
                                    window.currentPlayingAudio = cachedAudio;
                                    
                                    // 检查当前按钮状态来决定操作
                                    if (playBtn.textContent === '⏹') {
                                        // 当前是停止状态，执行停止操作
                                        console.log('执行停止操作');
                                        cachedAudio.pause();
                                        cachedAudio.currentTime = 0;
                                        playBtn.textContent = '▶';
                                    } else {
                                        // 当前是播放状态，执行播放操作
                                        console.log('执行播放操作');
                                        cachedAudio.currentTime = 0;
                                        try {
                                            await cachedAudio.play();
                                            playBtn.textContent = '⏹';
                                        } catch (playError) {
                                            console.error('播放失败:', playError);
                                            playBtn.textContent = '▶';
                                        }
                                    }
                                    
                                    return;
                                }
                                
                                // 显示加载状态
                                const originalText = playBtn.textContent;
                                playBtn.textContent = '⏳';
                                playBtn.disabled = true;
                                
                                // 构建下载URL
                                const downloadUrl = `https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/edit/downloadCreatedAudio?user_id=${user_id}&record_id=${record.record_id}`;
                                
                                // 发起请求获取音频文件
                                const response = await fetch(downloadUrl, {
                                    method: 'GET',
                                    headers: {
                                        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                                        'Accept': '*/*',
                                        'Host': 'nyw6vsud2p.ap-northeast-1.awsapprunner.com',
                                        'Connection': 'keep-alive'
                                    }
                                });
                                
                                // console.log('获取音频响应状态:', response.status);
                                // console.log('获取音频响应头:', response.headers);
                                
                                if (!response.ok) {
                                    throw new Error(`获取音频失败: ${response.status} ${response.statusText}`);
                                }
                                
                                // 检查响应类型
                                const contentType = response.headers.get('Content-Type');
                                console.log('Content-Type:', contentType);
                                
                                if (!contentType || !contentType.includes('audio/')) {
                                    throw new Error('服务器返回的不是音频文件');
                                }
                                
                                // 获取音频数据
                                const audioBlob = await response.blob();
                                console.log('音频Blob大小:', audioBlob.size, 'bytes');
                                
                                if (audioBlob.size === 0) {
                                    throw new Error('获取的音频文件为空');
                                }
                                
                                // 创建音频URL
                                const audioUrl = URL.createObjectURL(audioBlob);
                                
                                // 创建音频元素
                                const audio = new Audio();
                                
                                // 设置音频事件监听器
                                audio.onloadstart = () => {
                                    console.log('音频开始加载');
                                    playBtn.textContent = '⏳';
                                };
                                
                                audio.oncanplay = () => {
                                    console.log('音频可以播放');
                                    playBtn.disabled = false;
                                };
                                
                                audio.onended = () => {
                                    console.log('音频播放结束');
                                    playBtn.textContent = '▶';
                                };
                                
                                audio.onerror = (e) => {
                                    if (window.isManuallyStopped) return;
                                    console.error('音频播放错误:', e);
                                    console.error('音频错误详情:', audio.error);
                                    playBtn.textContent = '▶';
                                    playBtn.disabled = false;
                                    alert('音频播放失败，请重试');
                                    
                                    // 从缓存中移除错误的音频
                                    if (window.audioCache && window.audioCache[cacheKey]) {
                                        delete window.audioCache[cacheKey];
                                    }
                                };
                                
                                // 设置音频源
                                audio.src = audioUrl;
                                
                                // 如果当前有音频在播放，先停止
                                if (window.currentPlayingAudio && window.currentPlayingAudio !== audio) {
                                    window.currentPlayingAudio.pause();
                                    window.currentPlayingAudio.currentTime = 0;
                                }
                                
                                // 保存当前播放的音频引用
                                window.currentPlayingAudio = audio;
                                
                                // 初始化音频缓存对象（如果不存在）
                                if (!window.audioCache) {
                                    window.audioCache = {};
                                }
                                
                                // 将音频添加到缓存
                                window.audioCache[cacheKey] = audio;
                                console.log('音频已缓存 - record_id:', record.record_id);
                                
                                // 第一次下载成功后自动播放音频
                                try {
                                    await audio.play();
                                    playBtn.textContent = '⏹';
                                } catch (playError) {
                                    console.error('自动播放失败:', playError);
                                    playBtn.textContent = '▶';
                                }
                                
                            } catch (error) {
                                console.error('获取或播放音频失败:', error);
                                
                                // 检查是否是下载失败的情况
                                let errorMessage = '获取音频失败：' + error.message;
                                
                                // 检查HTTP状态码
                                if (error.message.includes('404')) {
                                    errorMessage = '未上传音频文件';
                                } else if (error.message.includes('403')) {
                                    errorMessage = '未上传音频文件';
                                }
                                
                                alert(errorMessage);
                                
                                // 恢复按钮状态
                                playBtn.textContent = '▶';
                                playBtn.disabled = false;
                            }
                        }
                        
                        // 绑定事件监听器（只绑定一次）
                        playBtn.addEventListener('click', handlePlayButtonClick);

                        // 监听播放模式变化
                        const playModeSelect = item.querySelector('.play-mode-select');
                        playModeSelect.addEventListener('change', async function() {
                            const isLoop = this.value === 'true';
                            const success = await updateAudioSetting({ isLoop: isLoop }); // select 不需要防抖
                            if (!success) {
                                this.value = !isLoop;
                            }
                        });

                        // 初始化并监听范围滑块变化
                        const slider = item.querySelector('.double-slider');
                        const innerValue = item.querySelector('.inner-value');
                        const outerValue = item.querySelector('.outer-value');
                        
                        const sliderConfig = {
                            start: [record.play_range.inner_radius, record.play_range.outer_radius],
                            connect: true,
                            range: {
                                'min': 0,
                                'max': 50
                            },
                            step: 1,
                            margin: 1
                        };

                        noUiSlider.create(slider, sliderConfig);

                        // 使用防抖处理滑块值的更新
                        let sliderPendingUpdate = null;
                        
                        slider.noUiSlider.on('slide', function(values) {
                            const inner = Math.round(values[0]);
                            const outer = Math.round(values[1]);
                            
                            // 更新显示的值
                            innerValue.textContent = inner;
                            outerValue.textContent = outer;
                            
                            // 使用防抖发送更新
                            sliderPendingUpdate = {
                                play_range: {
                                    inner_radius: inner,
                                    outer_radius: outer
                                }
                            };
                            debouncedUpdate(sliderPendingUpdate);
                        });

                        // 滑块停止时确保最终值被保存
                        slider.noUiSlider.on('change', async function(values) {
                            const inner = Math.round(values[0]);
                            const outer = Math.round(values[1]);
                            
                            if (sliderPendingUpdate) {
                                const success = await updateAudioSetting(sliderPendingUpdate);
                            if (!success) {
                                // 恢复原始状态
                                this.set([record.play_range.inner_radius, record.play_range.outer_radius]);
                                innerValue.textContent = record.play_range.inner_radius;
                                outerValue.textContent = record.play_range.outer_radius;
                                }
                                sliderPendingUpdate = null;
                            }
                        });
                    });
                } else {
                    throw new Error(result.message || '获取录音记录失败');
                }
            } catch (error) {
                console.error('获取录音记录错误:', error);
                alert('获取录音记录失败：' + error.message);
                if (error.message.includes('请重新登录')) {
                    window.location.href = 'index.html';
                }
            }
        });

        return marker;
    }

    // 更新标记点显示状态的函数
    function updateMarkersVisibility() {
        // 从 localStorage 获取 markersData
        const markersData = JSON.parse(localStorage.getItem('markersData') || '[]');
        if (!markersData || !Array.isArray(markersData)) return;

        // 清除所有现有标记点
        markers.forEach(marker => {
            if (map.hasLayer(marker)) {
                marker.remove();
            }
        });
        markers = [];

        // 根据显示模式添加标记点
        markersData.forEach(location => {
            if (showHiddenMarkers || location.isShow) {
                const marker = createMarker(location);
                markers.push(marker);
                marker.addTo(map);
            }
        });
    }

    // 添加切换按钮点击事件
    document.getElementById('toggle-hidden-markers').addEventListener('click', function() {
        showHiddenMarkers = !showHiddenMarkers;
        // 切换按钮图标
        if (showHiddenMarkers) {
            this.innerHTML = '<span class="material-icons">visibility</span>';
        } else {
            this.innerHTML = '<span class="material-icons">visibility_off</span>';
        }
        updateMarkersVisibility();
    });

    // 初始化按钮图标
    document.getElementById('toggle-hidden-markers').innerHTML = showHiddenMarkers ? '<span class="material-icons">visibility</span>' : '<span class="material-icons">visibility_off</span>';

    // 将base64转换为Blob的辅助函数
    function base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    }

    // PCM转WAV的辅助函数
    function convertPCMToWAV(pcmData, sampleRate) {
        console.log('开始转换PCM到WAV，采样率:', sampleRate);
        console.log('PCM数据类型:', typeof pcmData);
        console.log('PCM数据长度:', pcmData.length);
        
        const buffer = new ArrayBuffer(44 + pcmData.length);
        const view = new DataView(buffer);

        // RIFF标识
        writeString(view, 0, 'RIFF');
        // 文件长度
        view.setUint32(4, 36 + pcmData.length, true);
        // WAVE标识
        writeString(view, 8, 'WAVE');
        // fmt标识
        writeString(view, 12, 'fmt ');
        // fmt块长度
        view.setUint32(16, 16, true);
        // 音频格式（1表示PCM）
        view.setUint16(20, 1, true);
        // 声道数
        view.setUint16(22, 1, true);
        // 采样率
        view.setUint32(24, sampleRate, true);
        // 字节率 (采样率 * 声道数 * 位深度/8)
        view.setUint32(28, sampleRate * 1 * 2, true);
        // 块对齐 (声道数 * 位深度/8)
        view.setUint16(32, 1 * 2, true);
        // 位深度
        view.setUint16(34, 16, true);
        // data标识
        writeString(view, 36, 'data');
        // data块长度
        view.setUint32(40, pcmData.length, true);

        // 写入PCM数据
        const pcmView = new Uint8Array(buffer, 44);
        
        // 处理PCM数据
        if (typeof pcmData === 'string') {
            // 如果是字符串，转换为字节数组
            console.log('处理字符串类型的PCM数据');
            for (let i = 0; i < pcmData.length; i++) {
                pcmView[i] = pcmData.charCodeAt(i) & 0xFF;
            }
        } else if (pcmData instanceof Uint8Array) {
            // 如果已经是Uint8Array，直接复制
            console.log('处理Uint8Array类型的PCM数据');
            pcmView.set(pcmData);
        } else if (pcmData instanceof ArrayBuffer) {
            // 如果是ArrayBuffer，转换为Uint8Array
            console.log('处理ArrayBuffer类型的PCM数据');
            const tempArray = new Uint8Array(pcmData);
            pcmView.set(tempArray);
        } else {
            // 其他情况，尝试转换
            console.log('处理其他类型的PCM数据');
            const pcmArray = new Uint8Array(pcmData);
            pcmView.set(pcmArray);
        }

        console.log('WAV文件生成完成，总大小:', buffer.byteLength);
        console.log('WAV头部信息:');
        console.log('- RIFF标识:', String.fromCharCode(...new Uint8Array(buffer, 0, 4)));
        console.log('- 文件长度:', view.getUint32(4, true));
        console.log('- WAVE标识:', String.fromCharCode(...new Uint8Array(buffer, 8, 4)));
        console.log('- 采样率:', view.getUint32(24, true));
        console.log('- 声道数:', view.getUint16(22, true));
        console.log('- 位深度:', view.getUint16(34, true));
        console.log('- PCM数据长度:', view.getUint32(40, true));

        return buffer;
    }

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    // 上传音频文件的函数
    function uploadAudioFile(file, record, submitBtn, audioFilePath, closeModal) {
        try {
            // 检查文件是否有效
            if (!file) {
                throw new Error('文件对象为空');
            }

            // raw_file.type = 'audio/mp3'
            // const file = new File([raw_file], raw_file.name, { type: "audio/mp3" });
            
            console.log('文件信息:', {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                path: audioFilePath
            });
            
            // 检查文件大小
            if (file.size === 0) {
                throw new Error('文件大小为0，请选择有效的音频文件');
            }
            
            // 检查文件类型
            if (!file.type.match('audio/(mp3|wav)') && 
                !file.name.toLowerCase().endsWith('.mp3') && 
                !file.name.toLowerCase().endsWith('.wav')) {
                throw new Error('请选择MP3或WAV格式的音频文件');
            }
            
            const user_id = localStorage.getItem('user_id');
            if (!user_id) {
                throw new Error('未登录');
            }
            
            // 获取当前选中的标记点位置
            const gpsP = document.querySelector('.gps-coordinates p');
            let latitude = 0, longitude = 0;
            if (gpsP) {
                const gpsText = gpsP.textContent;
                const match = gpsText.match(/GPS Point: ([\d.]+), ([\d.]+)/);
                if (match) {
                    latitude = parseFloat(match[1]);
                    longitude = parseFloat(match[2]);
                }
            }
            
            // 如果无法从GPS显示获取，尝试从markersData获取
            if (latitude === 0 && longitude === 0) {
                const markersData = JSON.parse(localStorage.getItem('markersData') || '[]');
                const currentMarker = markersData.find(m => m.marker_id === record.record_id);
                if (currentMarker) {
                    latitude = parseFloat(currentMarker.latitude || 0);
                    longitude = parseFloat(currentMarker.longitude || 0);
                }
            }
            
            console.log('获取到的GPS坐标:', { latitude, longitude });
            
            // 创建FormData用于文件上传
            const formData = new FormData();
            formData.append('audio_file', file);
            formData.append('record_id', record.record_id);
            formData.append('user_id', user_id);
            formData.append('latitude', latitude.toString());
            formData.append('longitude', longitude.toString());
            
            // 检查FormData内容
            console.log('FormData内容:');
            for (let [key, value] of formData.entries()) {
                if (key === 'audio_file') {
                    console.log(key, ':', formData.get('audio_file'), file.size, 'bytes');
            } else {
                    console.log(key, ':', value);
                }
            }
            
            // 更新按钮状态
            submitBtn.textContent = '上传中...';
            submitBtn.disabled = true;
            
            fetch('https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/edit/uploadCreatedAudio', {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data'
                    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                    'Accept': '*/*',
                    'Host': 'nyw6vsud2p.ap-northeast-1.awsapprunner.com',
                    'Connection':'keep-alive'
                },
                body: formData
            })
            .then(response => {
                console.log('响应状态:', response.status);
                console.log('响应头:', response.headers);
                
                if (!response.ok) {
                    throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
                }
                
                return response.json();
            })
            .then(result => {
                console.log('服务器响应:', result);
                
                if (result.code === 200) {
                    alert('音频上传成功！');
                    // 调用传入的closeModal函数
                    if (typeof closeModal === 'function') {
                        closeModal();
                    }
                } else {
                    throw new Error(result.message || '上传失败');
                }
            })
            .catch(error => {
                console.error('上传错误:', error);
                
                // 根据错误类型显示不同的错误信息
                let errorMessage = '上传失败';
                if (error.message.includes('HTTP错误')) {
                    errorMessage = `服务器错误: ${error.message}`;
                } else if (error.message.includes('NoneType')) {
                    errorMessage = '服务器处理文件时出错，请检查文件格式是否正确';
                } else {
                    errorMessage = error.message;
                }
                
                alert(errorMessage);
                // 恢复按钮状态，让用户可以重新尝试
                submitBtn.textContent = '提交音频文件';
                submitBtn.disabled = false;
            });
            
        } catch (error) {
            console.error('上传错误:', error);
            alert('上传失败：' + error.message);
            // 恢复按钮状态，让用户可以重新尝试
            submitBtn.textContent = '提交音频文件';
            submitBtn.disabled = false;
        }
    }

    // 作品信息修改弹窗功能
    function initWorkEditModal() {
        const workNameElement = document.getElementById('work-name');
        const modal = document.getElementById('edit-work-modal');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-edit');
        const confirmBtn = document.getElementById('confirm-edit');
        const worknameInput = document.getElementById('edit-workname');
        const briefIntroInput = document.getElementById('edit-brief-intro');
        const resultDiv = document.getElementById('edit-result');

        // 点击作品名打开弹窗
        if (workNameElement) {
            workNameElement.addEventListener('click', function() {
                // 填充当前值
                const currentWorkName = localStorage.getItem('workName') || '';
                const currentBriefIntro = localStorage.getItem('brief_intro') || '';
                
                worknameInput.value = currentWorkName;
                briefIntroInput.value = currentBriefIntro;
                
                // 隐藏之前的结果
                resultDiv.style.display = 'none';
                resultDiv.className = 'edit-result';
                
                // 显示弹窗
                modal.style.display = 'flex';
            });
        }

        // 关闭弹窗
        function closeModal() {
            modal.style.display = 'none';
        }

        // 点击关闭按钮
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // 点击取消按钮
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        // 点击确认修改按钮
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async function() {
                const newWorkName = worknameInput.value.trim();
                const newBriefIntro = briefIntroInput.value.trim();
                const currentWorkName = localStorage.getItem('workName') || '';
                const currentBriefIntro = localStorage.getItem('brief_intro') || '';

                // 检查是否有变化
                if (newWorkName === currentWorkName && newBriefIntro === currentBriefIntro) {
                    showResult('没有检测到任何修改', 'error');
                    return;
                }

                // 检查作品名是否为空
                if (!newWorkName) {
                    showResult('作品名不能为空', 'error');
                    return;
                }

                try {
                    const user_id = localStorage.getItem('user_id');
                    if (!user_id) {
                        showResult('用户未登录', 'error');
                        return;
                    }

                    const response = await fetch('https://nyw6vsud2p.ap-northeast-1.awsapprunner.com/api/v1/user/editWorkInfo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: user_id,
                            workname: newWorkName,
                            brief_intro: newBriefIntro
                        })
                    });

                    const data = await response.json();
                    console.log('修改作品信息响应:', data);

                    if (data.code === 200) {
                        // 更新本地存储
                        localStorage.setItem('workName', newWorkName);
                        localStorage.setItem('brief_intro', newBriefIntro);
                        
                        // 更新页面显示
                        const workNameElement = document.getElementById('work-name');
                        if (workNameElement) {
                            workNameElement.textContent = newWorkName;
                        }
                        
                        showResult('修改成功！', 'success');
                        
                        // 2秒后关闭弹窗
                        setTimeout(closeModal, 2000);
                    } else {
                        showResult(data.message || '修改失败', 'error');
                    }
                } catch (error) {
                    console.error('修改作品信息错误:', error);
                    showResult('网络错误，请稍后重试', 'error');
                }
            });
        }

        // 显示结果信息
        function showResult(message, type) {
            resultDiv.textContent = message;
            resultDiv.className = `edit-result ${type}`;
            resultDiv.style.display = 'block';
        }

        // 点击弹窗外部关闭
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // 初始化作品编辑弹窗
    initWorkEditModal();

    // 页面初始化时确保右侧内容区隐藏
    const rightColumn = document.querySelector('.right-column');
    if (rightColumn) {
        rightColumn.style.display = 'none';
    }
    
    // 清除所有录音项目的选中状态
    document.querySelectorAll('.recording-item').forEach(recordingItem => {
        recordingItem.classList.remove('selected');
    });
} 