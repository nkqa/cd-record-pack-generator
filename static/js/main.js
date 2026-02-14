// 加载动画
function startLoading() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) loader.style.display = 'flex';
}

function completeLoading() {
    const loader = document.getElementById('loadingOverlay');
    if (loader) loader.style.display = 'none';
}

startLoading();

// 监听错误，即使有资源加载失败也继续
window.onerror = function() {
    // 不做特殊处理，让加载继续
};

// 加载函数
async function loadResources() {
    console.log('开始加载资源');
    
    const loadingBar = document.getElementById('loadingBar');
    
    // 模拟加载进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        if (progress > 100) {
            clearInterval(interval);
            // 延迟一点时间再隐藏遮罩，让用户看到加载完成的状态
            setTimeout(() => {
                completeLoading();
            }, 500);
        } else {
            if (loadingBar) {
                loadingBar.style.width = `${progress}%`;
            }
        }
    }, 100);
}

// 切换介绍部分的显示/隐藏
function toggleInfo() {
    const content = document.querySelector('.info-content');
    const icon = document.querySelector('.toggle-icon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
}

// 平滑滚动到指定元素
function smoothScroll(elementId) {
    // 确保信息部分已展开
    const infoContent = document.querySelector('.info-content');
    if (infoContent && infoContent.style.display === 'none') {
        infoContent.style.display = 'block';
        const icon = document.querySelector('.toggle-icon');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }
    }

    const element = document.getElementById(elementId);
    if (element) {
        // 自定义平滑滚动实现（强制使用，不依赖浏览器支持）
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000; // 滚动持续时间（毫秒）
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // 缓动函数，使滚动更自然
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
}

// 根据窗口宽高比设置背景图片
function setBackgroundByAspectRatio() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    // 如果宽大于高，使用桌面版背景，否则使用移动版背景
    if (aspectRatio > 1) {
        document.body.style.backgroundImage = "url('./static/img/bg/pc.webp')";
    } else {
        document.body.style.backgroundImage = "url('./static/img/bg/mobile.webp')";
    }
}

// 页面加载时设置背景和加载资源
async function initApp() {
    setBackgroundByAspectRatio();
    await loadResources();
}

initApp();

// 窗口大小改变时重新设置背景
window.onresize = function() {
    setBackgroundByAspectRatio();
};

// 生成UUID函数
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 使用AudioContext检测音频时长
function getAudioDuration(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.decodeAudioData(e.target.result, function(buffer) {
                resolve(buffer.duration);
                audioContext.close();
            }, function(error) {
                reject(error);
                audioContext.close();
            });
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}

// 显示错误模态框
function showErrorModal(message) {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeErrorBtn = document.getElementById('closeErrorBtn');
    const modalTitle = errorModal.querySelector('h3');
    
    if (errorModal && errorMessage && closeErrorBtn) {
        errorMessage.textContent = message;
        
        // 设置标题
        if (modalTitle) {
            modalTitle.textContent = i18n.t('errors.error', '错误');
        }
        
        // 设置按钮文本
        closeErrorBtn.textContent = i18n.t('modal.confirm', '确定');
        
        errorModal.style.display = 'block';
        
        // 关闭模态框
        closeErrorBtn.onclick = function() {
            errorModal.style.display = 'none';
        };
        
        // 点击模态框外部关闭
        window.onclick = function(event) {
            if (event.target === errorModal) {
                errorModal.style.display = 'none';
            }
        };
    }
}

// 显示音频转换进度模态框
function showConversionModal(sourceFileName, targetFileName) {
    const conversionModal = document.getElementById('conversionModal');
    const conversionMessage = document.getElementById('conversionMessage');
    
    if (conversionModal && conversionMessage) {
        conversionMessage.textContent = `${i18n.t('modal.conversion.processing', 'Converting')} ${sourceFileName} ${i18n.t('modal.conversion.to', 'to')} ${targetFileName}`;
        
        // 设置模态框标题
        const modalTitle = conversionModal.querySelector('h3');
        if (modalTitle) {
            modalTitle.textContent = i18n.t('modal.conversion.title', '音频转换');
        }
        
        // 添加或更新进度百分比显示
        let progressText = conversionModal.querySelector('.progress-text');
        if (!progressText) {
            progressText = document.createElement('div');
            progressText.className = 'progress-text';
            progressText.style.textAlign = 'center';
            progressText.style.marginTop = '10px';
            progressText.style.fontSize = '14px';
            progressText.style.color = '#666';
            const progressContainer = conversionModal.querySelector('.conversion-progress');
            if (progressContainer) {
                progressContainer.appendChild(progressText);
            }
        }
        progressText.textContent = '0%';
        
        conversionModal.style.display = 'block';
    }
}

// 隐藏音频转换进度模态框
function hideConversionModal() {
    const conversionModal = document.getElementById('conversionModal');
    if (conversionModal) {
        conversionModal.style.display = 'none';
    }
}

// 更新音频转换进度
function updateConversionProgress(progress) {
    const conversionModal = document.getElementById('conversionModal');
    if (conversionModal) {
        const progressBar = conversionModal.querySelector('.progress-bar');
        const progressText = conversionModal.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
    }
}

// 当前正在进行的音频转换信息
let currentConversionInfo = null;

// 取消转换函数
function cancelConversion() {
    if (currentConversionInfo) {
        // 停止音频播放
        if (currentConversionInfo.audio) {
            currentConversionInfo.audio.pause();
            currentConversionInfo.audio.currentTime = 0;
        }
        
        // 清除定时器
        if (currentConversionInfo.progressInterval) {
            clearInterval(currentConversionInfo.progressInterval);
        }
        if (currentConversionInfo.timeoutId) {
            clearTimeout(currentConversionInfo.timeoutId);
        }
        
        // 关闭AudioContext
        if (currentConversionInfo.audioContext) {
            currentConversionInfo.audioContext.close();
        }
        
        // 释放URL对象
        if (currentConversionInfo.audioUrl) {
            URL.revokeObjectURL(currentConversionInfo.audioUrl);
        }
        
        // 隐藏转换模态框
        hideConversionModal();
        
        // 重置当前转换信息
        currentConversionInfo = null;
        
        console.log('音频转换已取消');
    }
}

// 初始化取消转换按钮
function initCancelConversionBtn() {
    const cancelBtn = document.getElementById('cancelConversionBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // 显示确认弹窗
            const deleteModal = document.getElementById('deleteModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = deleteModal.querySelector('p');
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            
            if (deleteModal && modalTitle && modalMessage && confirmBtn) {
                // 修改模态框内容
                modalTitle.textContent = i18n.t('modal.confirm_cancel', '确认取消');
                modalMessage.textContent = i18n.t('modal.confirm_cancel_message', '确定要取消当前的音频转换吗？');
                
                // 保存原始的确认按钮点击事件
                const originalConfirmClick = confirmBtn.onclick;
                
                // 设置新的确认按钮点击事件
                confirmBtn.onclick = function() {
                    // 取消转换
                    cancelConversion();
                    
                    // 关闭确认模态框
                    deleteModal.style.display = 'none';
                    
                    // 恢复原始的确认按钮点击事件
                    confirmBtn.onclick = originalConfirmClick;
                };
                
                // 显示确认模态框
                deleteModal.style.display = 'block';
            }
        });
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    initCancelConversionBtn();
});

// 音频文件时长限制（秒）
const audioDurationLimits = {
    'oggFile_11': 70, // 1:10
    'oggFile_13': 175, // 2:55
    'oggFile_5': 180, // 3:00
    'oggFile_blocks': 340, // 5:40
    'oggFile_cat': 180, // 3:00
    'oggFile_creator': 170, // 2:50
    'oggFile_creator_music_box': 70, // 1:10
    'oggFile_mall': 195, // 3:15
    'oggFile_mellohi': 96, // 1:36
    'oggFile_otherside': 196, // 3:16
    'oggFile_pigstep_master': 148, // 2:28
    'oggFile_precipice': 299, // 4:59
    'oggFile_relic': 219, // 3:39
    'oggFile_stal': 151, // 2:31
    'oggFile_strad': 188, // 3:08
    'oggFile_wait': 238, // 3:58
    'oggFile_ward': 251, // 4:11
    'oggFile_chirp': 185, // 3:05
    'oggFile_far': 170, // 2:50
    'oggFile_tears': 175, // 2:55
    'oggFile_lava_chicken': 135 // 2:15
};

// 为每个文件上传按钮添加事件监听器
const fileInputs = [
    { id: 'oggFile_11', btnId: 'fileBtnText_11', targetName: '11.ogg' },
    { id: 'oggFile_13', btnId: 'fileBtnText_13', targetName: '13.ogg' },
    { id: 'oggFile_5', btnId: 'fileBtnText_5', targetName: '5.ogg' },
    { id: 'oggFile_blocks', btnId: 'fileBtnText_blocks', targetName: 'blocks.ogg' },
    { id: 'oggFile_cat', btnId: 'fileBtnText_cat', targetName: 'cat.ogg' },
    { id: 'oggFile_creator', btnId: 'fileBtnText_creator', targetName: 'creator.ogg' },
    { id: 'oggFile_creator_music_box', btnId: 'fileBtnText_creator_music_box', targetName: 'creator_music_box.ogg' },
    { id: 'oggFile_mall', btnId: 'fileBtnText_mall', targetName: 'mall.ogg' },
    { id: 'oggFile_mellohi', btnId: 'fileBtnText_mellohi', targetName: 'mellohi.ogg' },
    { id: 'oggFile_otherside', btnId: 'fileBtnText_otherside', targetName: 'otherside.ogg' },
    { id: 'oggFile_pigstep_master', btnId: 'fileBtnText_pigstep_master', targetName: 'pigstep_master.ogg' },
    { id: 'oggFile_precipice', btnId: 'fileBtnText_precipice', targetName: 'precipice.ogg' },
    { id: 'oggFile_relic', btnId: 'fileBtnText_relic', targetName: 'relic.ogg' },
    { id: 'oggFile_stal', btnId: 'fileBtnText_stal', targetName: 'stal.ogg' },
    { id: 'oggFile_strad', btnId: 'fileBtnText_strad', targetName: 'strad.ogg' },
    { id: 'oggFile_wait', btnId: 'fileBtnText_wait', targetName: 'wait.ogg' },
    { id: 'oggFile_ward', btnId: 'fileBtnText_ward', targetName: 'ward.ogg' },
    { id: 'oggFile_chirp', btnId: 'fileBtnText_chirp', targetName: 'chirp.ogg' },
    { id: 'oggFile_far', btnId: 'fileBtnText_far', targetName: 'far.ogg' },
    { id: 'oggFile_tears', btnId: 'fileBtnText_tears', targetName: 'tears.ogg' },
    { id: 'oggFile_lava_chicken', btnId: 'fileBtnText_lava_chicken', targetName: 'lava_chicken.ogg' }
];

// 保存每个音频文件的上一次成功上传信息
// 保存上一次成功上传的音频文件信息
window.lastValidAudioFiles = {};

// 保存每个文件输入的上一次选择的文件信息
const lastSelectedFiles = {};

// 当前要删除的元素信息
let currentDeleteTarget = null;
let currentDeleteType = null;

// 使用Web Audio API和MediaRecorder API将音频转换为浏览器支持的格式
async function convertAudioToOgg(file, targetName, progressCallback) {
    return new Promise((resolve, reject) => {
        try {
            console.log('开始音频转换:', file.name, '->', targetName);
            
            // 检查文件类型
            if (!file.type.startsWith('audio/')) {
                console.error('不是音频文件:', file.type);
                reject(new Error('不是音频文件'));
                return;
            }
            
            // 优化：使用URL.createObjectURL替代FileReader，更快
            const audioUrl = URL.createObjectURL(file);
            const audio = new Audio();
            audio.src = audioUrl;
            
            audio.oncanplaythrough = function() {
                console.log('音频加载完成，开始处理');
                
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const source = audioContext.createMediaElementSource(audio);
                    const destination = audioContext.createMediaStreamDestination();
                    
                    // 直接连接，减少中间处理
                    source.connect(destination);
                    
                    // 检测浏览器支持的音频格式
                    let mimeType = 'audio/ogg; codecs=vorbis';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = 'audio/webm; codecs=opus';
                        if (!MediaRecorder.isTypeSupported(mimeType)) {
                            mimeType = 'audio/mp4; codecs=aac';
                            if (!MediaRecorder.isTypeSupported(mimeType)) {
                                console.error('浏览器不支持任何音频录制格式');
                                reject(new Error('浏览器不支持音频录制'));
                                audioContext.close();
                                URL.revokeObjectURL(audioUrl);
                                return;
                            }
                        }
                    }
                    console.log('使用音频格式:', mimeType);
                    
                    // 优化：配置MediaRecorder，使用合适的比特率
                    const recorder = new MediaRecorder(destination.stream, {
                        mimeType: mimeType,
                        audioBitsPerSecond: 64000 // 降低比特率，提高转换速度
                    });
                    
                    const chunks = [];
                    
                    // 优化：减少日志输出
                    recorder.ondataavailable = function(event) {
                        if (event.data.size > 0) {
                            chunks.push(event.data);
                        }
                    };
                    
                    recorder.onstop = function() {
                        console.log('录制完成，收集到', chunks.length, '个数据块');
                        
                        try {
                            // 创建Blob
                            const blob = new Blob(chunks, { type: mimeType });
                            console.log('创建Blob成功:', blob.size, 'bytes');
                            
                            // 无论录制格式如何，都使用目标文件名（.ogg）
                            const convertedFile = new File([blob], targetName, {
                                type: 'audio/ogg',
                                lastModified: Date.now()
                            });
                            
                            console.log('音频转换成功:', convertedFile.name, convertedFile.size, 'bytes');
                            resolve(convertedFile);
                        } catch (error) {
                            console.error('创建文件失败:', error);
                            reject(new Error('创建文件失败'));
                        } finally {
                            audioContext.close();
                            URL.revokeObjectURL(audioUrl);
                            // 重置当前转换信息
                            currentConversionInfo = null;
                        }
                    };
                    
                    recorder.onerror = function(error) {
                        console.error('音频录制失败:', error);
                        reject(new Error('音频录制失败'));
                        audioContext.close();
                        URL.revokeObjectURL(audioUrl);
                        // 重置当前转换信息
                        currentConversionInfo = null;
                    };
                    
                    // 优化：减少超时时间
                    const timeoutId = setTimeout(() => {
                        console.error('音频录制超时');
                        recorder.stop();
                        reject(new Error('音频录制超时'));
                        audioContext.close();
                        URL.revokeObjectURL(audioUrl);
                        // 重置当前转换信息
                        currentConversionInfo = null;
                    }, audio.duration * 1000 + 3000); // 音频时长 + 3秒缓冲
                    
                    // 优化：设置时间片，可能提高性能
                    recorder.start(500); // 每500ms获取一次数据
                    
                    // 真实进度更新：基于音频播放时间
                    const totalDuration = audio.duration;
                    let lastProgress = 0;
                    
                    // 每100ms更新一次进度
                    const progressInterval = setInterval(() => {
                        if (audio.currentTime > 0 && totalDuration > 0) {
                            const progress = (audio.currentTime / totalDuration) * 90; // 只到90%，留10%给后续处理
                            if (progress > lastProgress && progress <= 90) {
                                lastProgress = progress;
                                if (progressCallback) {
                                    progressCallback(progress);
                                }
                            }
                        }
                    }, 100);
                    
                    // 更新当前转换信息
                    currentConversionInfo = {
                        audio: audio,
                        audioContext: audioContext,
                        audioUrl: audioUrl,
                        progressInterval: progressInterval,
                        timeoutId: timeoutId,
                        recorder: recorder
                    };
                    
                    // 开始播放音频
                    audio.play().catch(error => {
                        console.error('音频播放失败:', error);
                        clearInterval(progressInterval);
                        reject(new Error('音频播放失败'));
                        audioContext.close();
                        URL.revokeObjectURL(audioUrl);
                        // 重置当前转换信息
                        currentConversionInfo = null;
                    });
                    
                    // 当音频播放结束时停止录制
                    audio.onended = function() {
                        console.log('音频播放结束，停止录制');
                        clearInterval(progressInterval);
                        clearTimeout(timeoutId);
                        // 更新进度到95%
                        if (progressCallback) {
                            progressCallback(95);
                        }
                        recorder.stop();
                    };
                    
                } catch (error) {
                    console.error('处理音频失败:', error);
                    reject(new Error('处理音频失败'));
                    URL.revokeObjectURL(audioUrl);
                    // 重置当前转换信息
                    currentConversionInfo = null;
                }
            };
            
            audio.onerror = function(error) {
                console.error('音频加载失败:', error);
                reject(new Error('音频加载失败'));
                URL.revokeObjectURL(audioUrl);
                // 重置当前转换信息
                currentConversionInfo = null;
            };
            
        } catch (error) {
            console.error('音频转换失败:', error);
            reject(new Error('音频转换失败'));
            // 重置当前转换信息
            currentConversionInfo = null;
        }
    });
}

// 为每个音频文件输入添加事件监听器
fileInputs.forEach(inputInfo => {
    const input = document.getElementById(inputInfo.id);
    const btnText = document.getElementById(inputInfo.btnId);
    
    if (input && btnText) {
        input.addEventListener('change', async function() {
            const file = this.files[0];
            const status = document.getElementById('status');
            const deleteBtn = this.parentElement.querySelector('.delete-btn');
            const descInput = document.getElementById(`desc_${inputInfo.id.replace('oggFile_', '')}`);
            
            // 隐藏全局错误提示
            status.textContent = '';
            status.className = 'status';
            
            if (file) {
                // 检查是否是新文件
                const inputId = inputInfo.id;
                const isNewFile = !lastSelectedFiles[inputId] || 
                                lastSelectedFiles[inputId].name !== file.name ||
                                lastSelectedFiles[inputId].size !== file.size ||
                                lastSelectedFiles[inputId].lastModified !== file.lastModified;
                
                if (!isNewFile) {
                    console.log('文件未变化，跳过处理:', file.name);
                    return;
                }
                
                // 保存当前文件信息
                lastSelectedFiles[inputId] = {
                    name: file.name,
                    size: file.size,
                    lastModified: file.lastModified
                };
                try {
                    let finalFile = file;
                    let isConverted = false;
                    
                    // 检查两个独立的开关状态
                    const audioProcessingToggle = document.getElementById('audioProcessingToggle');
                    const durationCheckToggle = document.getElementById('durationCheckToggle');
                    const isAudioConversionEnabled = audioProcessingToggle ? audioProcessingToggle.checked : false; // 默认关闭
                    const isDurationCheckEnabled = durationCheckToggle ? durationCheckToggle.checked : true; // 默认开启
                    
                    // 检查音频时长（如果时长检查开关开启）
                    if (isDurationCheckEnabled) {
                        // 检查音频时长
                        const duration = await getAudioDuration(file);
                        const limit = audioDurationLimits[inputInfo.id];
                        
                        if (duration > limit) {
                            const minutes = Math.floor(limit / 60);
                            const seconds = limit % 60;
                            showErrorModal(`${i18n.t('errors.duration_exceeded', '错误：音频时长不能超过')} ${minutes}:${seconds.toString().padStart(2, '0')}`);
                            
                            // 重置文件输入元素的值，确保不保留错误文件的信息
                            input.value = '';
                            
                            // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                            const inputId = inputInfo.id;
                            if (lastSelectedFiles[inputId]) {
                                delete lastSelectedFiles[inputId];
                            }
                            
                            // 保持上一次成功上传的文件
                            if (window.lastValidAudioFiles[inputInfo.id]) {
                                const lastValidFile = window.lastValidAudioFiles[inputInfo.id];
                                btnText.textContent = `${i18n.t('upload.selected_audio', '已选择音频：')}${lastValidFile.name}`;
                                if (deleteBtn) {
                                    deleteBtn.style.display = 'block';
                                }
                                
                                // 保持上一次的描述
                                if (descInput) {
                                    descInput.value = lastValidFile.description;
                                }
                            } else {
                                btnText.textContent = i18n.t('upload.select_audio', '选择音频（不上传即为保持原版音乐）');
                                if (deleteBtn) {
                                    deleteBtn.style.display = 'none';
                                }
                                
                                // 清空描述输入框
                                if (descInput) {
                                    descInput.value = '';
                                }
                            }
                            return;
                        }
                    }
                    
                    // 检查音频格式并转换（如果格式转换开关开启）
                    if (isAudioConversionEnabled) {
                        // 如果不是ogg格式，尝试转换
                        if (!file.name.endsWith('.ogg')) {
                            try {
                                console.log('开始处理非ogg音频文件:', file.name);
                                
                                // 检查浏览器是否支持MediaRecorder API
                                if (typeof MediaRecorder === 'undefined') {
                                    console.log('浏览器不支持MediaRecorder API');
                                    throw new Error('浏览器不支持音频转换');
                                }
                                
                                // 显示转换进度模态框
                                showConversionModal(file.name, inputInfo.targetName);
                                
                                // 更新进度为0%
                                updateConversionProgress(0);
                                
                                // 执行转换，传入进度更新回调
                                console.log('执行音频转换');
                                finalFile = await convertAudioToOgg(file, inputInfo.targetName, updateConversionProgress);
                                isConverted = true;
                                console.log('音频转换成功');
                                
                                // 更新进度为100%
                                updateConversionProgress(100);
                                
                                // 延迟一点时间再隐藏模态框，让用户看到转换完成的状态
                                setTimeout(() => {
                                    hideConversionModal();
                                }, 500);
                            } catch (error) {
                                console.error('音频转换失败:', error);
                                
                                // 隐藏转换进度模态框
                                hideConversionModal();
                                
                                // 检查是否是浏览器不支持的问题
                                if (error.message.includes('浏览器不支持') || error.message.includes('Failed to construct \'MediaRecorder\'')) {
                                    // 降级方案：直接使用原始文件
                                    console.log('降级到使用原始文件');
                                    showErrorModal(`${i18n.t('errors.error', '警告')}：${i18n.t('errors.browser_not_support_conversion', '浏览器不支持音频转换，将直接使用原始文件')}`);
                                    finalFile = file;
                                    isConverted = false;
                                } else {
                                    // 其他错误
                                showErrorModal(`${i18n.t('errors.error', '错误')}：${i18n.t('errors.audio_conversion_failed', '音频转换失败，请确保上传的是有效的音频文件')}`);
                                
                                // 重置文件输入元素的值，确保不保留错误文件的信息
                                input.value = '';
                                
                                // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                                const inputId = inputInfo.id;
                                if (lastSelectedFiles[inputId]) {
                                    delete lastSelectedFiles[inputId];
                                }
                                
                                // 保持上一次成功上传的文件
                                if (window.lastValidAudioFiles[inputInfo.id]) {
                                    const lastValidFile = window.lastValidAudioFiles[inputInfo.id];
                                    btnText.textContent = `${i18n.t('upload.selected_audio', '已选择音频：')}${lastValidFile.name}`;
                                    if (deleteBtn) {
                                        deleteBtn.style.display = 'block';
                                    }
                                    
                                    // 保持上一次的描述
                                    if (descInput) {
                                        descInput.value = lastValidFile.description;
                                    }
                                } else {
                                    btnText.textContent = i18n.t('upload.select_audio', '选择音频（不上传即为保持原版音乐）');
                                    if (deleteBtn) {
                                        deleteBtn.style.display = 'none';
                                    }
                                    
                                    // 清空描述输入框
                                    if (descInput) {
                                        descInput.value = '';
                                    }
                                }
                                return;
                                }
                            }
                        } else {
                            console.log('使用原始ogg文件:', file.name);
                        }
                    } else {
                        // 音频转换开关关闭，直接使用原始文件
                        if (!file.name.endsWith('.ogg')) {
                            showErrorModal(i18n.t('errors.ogg_format_disabled', '错误：非ogg格式'));
                            
                            // 重置文件输入元素的值，确保不保留错误文件的信息
                            input.value = '';
                            
                            // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                            const inputId = inputInfo.id;
                            if (lastSelectedFiles[inputId]) {
                                delete lastSelectedFiles[inputId];
                            }
                            
                            // 保持上一次成功上传的文件
                            if (window.lastValidAudioFiles[inputInfo.id]) {
                                const lastValidFile = window.lastValidAudioFiles[inputInfo.id];
                                btnText.textContent = `${i18n.t('upload.selected_audio', '已选择音频：')}${lastValidFile.name}`;
                                if (deleteBtn) {
                                    deleteBtn.style.display = 'block';
                                }
                                
                                // 保持上一次的描述
                                if (descInput) {
                                    descInput.value = lastValidFile.description;
                                }
                            } else {
                                btnText.textContent = i18n.t('upload.select_audio', '选择音频（不上传即为保持原版音乐）');
                                if (deleteBtn) {
                                    deleteBtn.style.display = 'none';
                                }
                                
                                // 清空描述输入框
                                if (descInput) {
                                    descInput.value = '';
                                }
                            }
                            return;
                        }
                    }
                    
                    // 保存当前有效的文件信息
                    // 提取文件名（不含任何扩展名）
                    const originalFileName = file.name;
                    const fileNameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
                    window.lastValidAudioFiles[inputInfo.id] = {
                        file: finalFile,
                        name: finalFile.name,
                        description: fileNameWithoutExt,
                        targetName: inputInfo.targetName, // 保存目标文件名
                        isConverted: isConverted
                    };
                    
                    if (isConverted) {
                        btnText.textContent = `${i18n.t('upload.selected_audio', '已选择音频：')}${file.name}${i18n.t('upload.converted', '（已转换）')}`;
                    } else {
                        btnText.textContent = `${i18n.t('upload.selected_audio', '已选择音频：')}${file.name}`;
                    }
                    if (deleteBtn) {
                        deleteBtn.style.display = 'block';
                    }
                    
                    // 自动填入文件名（不含扩展名）到描述输入框
                    if (descInput) {
                        descInput.value = fileNameWithoutExt;
                    }
                } catch (error) {
                    console.error('文件处理失败:', error);
                    showErrorModal(`${i18n.t('errors.error', '错误')}：${i18n.t('errors.file_processing_failed', '文件处理失败，请重试')}`);
                    
                    // 保持上一次成功上传的文件
                    if (window.lastValidAudioFiles[inputInfo.id]) {
                        const lastValidFile = window.lastValidAudioFiles[inputInfo.id];
                        btnText.textContent = `${i18n.t('upload.selected_audio', '已选择音频：')}${lastValidFile.name}`;
                        if (deleteBtn) {
                            deleteBtn.style.display = 'block';
                        }
                        
                        // 保持上一次的描述
                        if (descInput) {
                            descInput.value = lastValidFile.description;
                        }
                    } else {
                        btnText.textContent = i18n.t('upload.select_audio', '选择音频（不上传即为保持原版音乐）');
                        if (deleteBtn) {
                            deleteBtn.style.display = 'none';
                        }
                        
                        // 清空描述输入框
                        if (descInput) {
                            descInput.value = '';
                        }
                    }
                }
            } else {
                // 如果用户取消选择文件，保持上一次成功上传的音频
                if (window.lastValidAudioFiles[inputInfo.id]) {
                    const lastValidFile = window.lastValidAudioFiles[inputInfo.id];
                    btnText.textContent = `${i18n.t('upload.selected_audio', '已选择音频：')}${lastValidFile.name}`;
                    if (deleteBtn) {
                        deleteBtn.style.display = 'block';
                    }
                    
                    // 保持上一次的描述
                    if (descInput) {
                        descInput.value = lastValidFile.description;
                    }
                } else {
                    btnText.textContent = i18n.t('upload.select_audio', '选择音频（不上传即为保持原版音乐）');
                    if (deleteBtn) {
                        deleteBtn.style.display = 'none';
                    }
                    
                    // 清空描述输入框
                    if (descInput) {
                        descInput.value = '';
                    }
                }
            }
        });
    }
});



// 图片文件输入信息
const imageFileInputs = [
    { id: 'imageFile_11', btnId: 'imageBtnText_11', previewId: 'imagePreview_11', targetName: 'music_disc_11.png' },
    { id: 'imageFile_13', btnId: 'imageBtnText_13', previewId: 'imagePreview_13', targetName: 'music_disc_13.png' },
    { id: 'imageFile_5', btnId: 'imageBtnText_5', previewId: 'imagePreview_5', targetName: 'music_disc_5.png' },
    { id: 'imageFile_blocks', btnId: 'imageBtnText_blocks', previewId: 'imagePreview_blocks', targetName: 'music_disc_blocks.png' },
    { id: 'imageFile_cat', btnId: 'imageBtnText_cat', previewId: 'imagePreview_cat', targetName: 'music_disc_cat.png' },
    { id: 'imageFile_creator', btnId: 'imageBtnText_creator', previewId: 'imagePreview_creator', targetName: 'music_disc_creator.png' },
    { id: 'imageFile_creator_music_box', btnId: 'imageBtnText_creator_music_box', previewId: 'imagePreview_creator_music_box', targetName: 'music_disc_creator_music_box.png' },
    { id: 'imageFile_mall', btnId: 'imageBtnText_mall', previewId: 'imagePreview_mall', targetName: 'music_disc_mall.png' },
    { id: 'imageFile_mellohi', btnId: 'imageBtnText_mellohi', previewId: 'imagePreview_mellohi', targetName: 'music_disc_mellohi.png' },
    { id: 'imageFile_otherside', btnId: 'imageBtnText_otherside', previewId: 'imagePreview_otherside', targetName: 'music_disc_otherside.png' },
    { id: 'imageFile_pigstep_master', btnId: 'imageBtnText_pigstep_master', previewId: 'imagePreview_pigstep_master', targetName: 'music_disc_pigstep.png' },
    { id: 'imageFile_precipice', btnId: 'imageBtnText_precipice', previewId: 'imagePreview_precipice', targetName: 'music_disc_precipice.png' },
    { id: 'imageFile_relic', btnId: 'imageBtnText_relic', previewId: 'imagePreview_relic', targetName: 'music_disc_relic.png' },
    { id: 'imageFile_stal', btnId: 'imageBtnText_stal', previewId: 'imagePreview_stal', targetName: 'music_disc_stal.png' },
    { id: 'imageFile_strad', btnId: 'imageBtnText_strad', previewId: 'imagePreview_strad', targetName: 'music_disc_strad.png' },
    { id: 'imageFile_wait', btnId: 'imageBtnText_wait', previewId: 'imagePreview_wait', targetName: 'music_disc_wait.png' },
    { id: 'imageFile_ward', btnId: 'imageBtnText_ward', previewId: 'imagePreview_ward', targetName: 'music_disc_ward.png' },
    { id: 'imageFile_chirp', btnId: 'imageBtnText_chirp', previewId: 'imagePreview_chirp', targetName: 'music_disc_chirp.png' },
    { id: 'imageFile_far', btnId: 'imageBtnText_far', previewId: 'imagePreview_far', targetName: 'music_disc_far.png' },
    { id: 'imageFile_tears', btnId: 'imageBtnText_tears', previewId: 'imagePreview_tears', targetName: 'music_disc_tears.png' },
    { id: 'imageFile_lava_chicken', btnId: 'imageBtnText_lava_chicken', previewId: 'imagePreview_lava_chicken', targetName: 'music_disc_lava_chicken.png' }
];

// 保存每个图片文件的上一次成功上传信息
// 保存上一次成功上传的图片文件信息
window.lastValidImageFiles = {};

// 保存每个图片文件输入的上一次选择的文件信息
const lastSelectedImageFiles = {};

// 辅助函数：同时显示/隐藏删除和编辑按钮
function toggleImageButtons(inputInfo, show) {
    try {
        const input = document.getElementById(inputInfo.id);
        if (!input) return;
        
        const deleteBtn = input.parentElement.parentElement.querySelector('.delete-btn');
        const editBtn = document.getElementById('editBtn_' + inputInfo.id);
        
        if (show) {
            if (deleteBtn) deleteBtn.style.display = 'block';
            if (editBtn) editBtn.style.display = 'inline-block';
        } else {
            if (deleteBtn) deleteBtn.style.display = 'none';
            if (editBtn) editBtn.style.display = 'none';
        }
    } catch (e) {
        // 忽略错误
    }
}

// 为每个图片文件输入添加事件监听器
imageFileInputs.forEach(inputInfo => {
    const input = document.getElementById(inputInfo.id);
    const btnText = document.getElementById(inputInfo.btnId);
    const preview = document.getElementById(inputInfo.previewId);
    
    if (input && btnText && preview) {
        input.addEventListener('change', function() {
            const file = this.files[0];
            const deleteBtn = this.parentElement.parentElement.querySelector('.delete-btn');
            const editBtn = document.getElementById('editBtn_' + inputInfo.id);
            
            if (file) {
                // 检查是否是新文件
                const inputId = inputInfo.id;
                const isNewFile = !lastSelectedImageFiles[inputId] || 
                                lastSelectedImageFiles[inputId].name !== file.name ||
                                lastSelectedImageFiles[inputId].size !== file.size ||
                                lastSelectedImageFiles[inputId].lastModified !== file.lastModified;
                
                if (!isNewFile) {
                    console.log('文件未变化，跳过处理:', file.name);
                    return;
                }
                
                // 保存当前文件信息
                lastSelectedImageFiles[inputId] = {
                    name: file.name,
                    size: file.size,
                    lastModified: file.lastModified
                };
                
                try {
                    // 检查自动转换图片格式开关
                    const autoConvertToggle = document.getElementById('autoConvertToggle');
                    const isAutoConvertEnabled = autoConvertToggle ? autoConvertToggle.checked : true;
                    
                    // 检查文件类型
                    if (!file.type.startsWith('image/')) {
                        showErrorModal(i18n.t('errors.must_be_image', '选择的必须是图片'));
                        
                        // 重置文件输入元素的值，确保不保留错误文件的信息
                        input.value = '';
                        
                        // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                        const inputId = inputInfo.id;
                        if (lastSelectedFiles[inputId]) {
                            delete lastSelectedFiles[inputId];
                        }
                        
                        // 保持上一次成功上传的图片
                        if (window.lastValidImageFiles[inputInfo.id]) {
                            const lastValidFile = window.lastValidImageFiles[inputInfo.id];
                            btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${lastValidFile.name}`;
                            toggleImageButtons(inputInfo, true);
                            
                            // 显示上一次的预览
                            if (lastValidFile.preview) {
                                preview.innerHTML = `<img src="${lastValidFile.preview}" style="width: 100%; height: 100%; object-fit: contain;">`;
                            }
                        } else {
                            btnText.textContent = i18n.t('upload.item_image', '物品展示图');
                            toggleImageButtons(inputInfo, false);
                            
                            // 清空预览
                            preview.innerHTML = '';
                        }
                        return;
                    }
                    
                    // 如果自动转换开关关闭，检查是否是png格式
                    if (!isAutoConvertEnabled && !file.name.endsWith('.png')) {
                        showErrorModal(i18n.t('errors.must_be_png', '格式必须是png'));
                        
                        // 重置文件输入元素的值，确保不保留错误文件的信息
                        input.value = '';
                        
                        // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                        const inputId = inputInfo.id;
                        if (lastSelectedFiles[inputId]) {
                            delete lastSelectedFiles[inputId];
                        }
                        
                        // 保持上一次成功上传的图片
                        if (window.lastValidImageFiles[inputInfo.id]) {
                            const lastValidFile = window.lastValidImageFiles[inputInfo.id];
                            btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${lastValidFile.name}`;
                            toggleImageButtons(inputInfo, true);
                            
                            // 显示上一次的预览
                            if (lastValidFile.preview) {
                                preview.innerHTML = `<img src="${lastValidFile.preview}" style="width: 100%; height: 100%; object-fit: contain;">`;
                            }
                        } else {
                            btnText.textContent = i18n.t('upload.item_image', '物品展示图');
                            toggleImageButtons(inputInfo, false);
                            
                            // 清空预览
                            preview.innerHTML = '';
                        }
                        return;
                    }
                    
                    // 生成预览
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const previewUrl = e.target.result;
                        preview.innerHTML = `<img src="${previewUrl}" style="width: 100%; height: 100%; object-fit: contain;">`;
                        
                        // 检查是否需要转换格式
                        if (isAutoConvertEnabled && !file.name.endsWith('.png')) {
                            // 显示转换进度条
                            const progressContainer = document.createElement('div');
                            progressContainer.id = 'conversionProgress';
                            progressContainer.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.5);
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                z-index: 9999;
                                color: white;
                            `;
                            progressContainer.innerHTML = `
                                <h3>正在转换图片格式...</h3>
                                <div style="width: 50%; height: 20px; background-color: #f3f3f3; border-radius: 10px; overflow: hidden; margin: 20px 0;">
                                    <div id="progressBar" style="width: 0%; height: 100%; background-color: #4CAF50; transition: width 0.3s ease;"></div>
                                </div>
                                <div id="progressText">0%</div>
                            `;
                            document.body.appendChild(progressContainer);
                            
                            // 模拟进度更新
                            let progress = 0;
                            const interval = setInterval(() => {
                                progress += 10;
                                const progressBar = document.getElementById('progressBar');
                                const progressText = document.getElementById('progressText');
                                if (progressBar && progressText) {
                                    progressBar.style.width = `${progress}%`;
                                    progressText.textContent = `${progress}%`;
                                }
                                
                                if (progress >= 100) {
                                    clearInterval(interval);
                                }
                            }, 100);
                            
                            // 使用Canvas转换为png，像素调整将在打包时进行
                            const img = new Image();
                            img.onload = function() {
                                // 创建Canvas，保持原始尺寸
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                
                                // 绘制图片
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, img.width, img.height);
                                
                                canvas.toBlob(function(blob) {
                                    const convertedFile = new File([blob], inputInfo.targetName, {
                                        type: 'image/png',
                                        lastModified: Date.now()
                                    });
                                    
                                    // 保存当前有效的图片信息
                                    window.lastValidImageFiles[inputInfo.id] = {
                                        file: convertedFile,
                                        name: convertedFile.name,
                                        originalName: file.name,
                                        preview: previewUrl,
                                        targetName: inputInfo.targetName,
                                        isConverted: true,
                                        isResized: false
                                    };
                                    
                                    let statusText = '';
                                    statusText = i18n.t('upload.converted', '（已转换）');
                                    btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${file.name}${statusText}`;
                                    toggleImageButtons(inputInfo, true);
                                    
                                    // 移除进度条
                                    setTimeout(() => {
                                        document.body.removeChild(progressContainer);
                                    }, 500);
                                }, 'image/png');
                            };
                            img.src = previewUrl;
                        } else {
                            // 直接使用原始文件，像素调整将在打包时进行
                            window.lastValidImageFiles[inputInfo.id] = {
                                file: file,
                                name: file.name,
                                originalName: file.name,
                                preview: previewUrl,
                                targetName: inputInfo.targetName,
                                isConverted: false,
                                isResized: false
                            };
                            
                            btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${file.name}`;
                            toggleImageButtons(inputInfo, true);
                        }
                    };
                    reader.onerror = function() {
                        showErrorModal(`${i18n.t('errors.error', '错误')}：${i18n.t('errors.image_loading_failed', '图片加载失败')}`);
                        
                        // 重置文件输入元素的值，确保不保留错误文件的信息
                        input.value = '';
                        
                        // 保持上一次成功上传的图片
                    if (window.lastValidImageFiles[inputInfo.id]) {
                        const lastValidFile = window.lastValidImageFiles[inputInfo.id];
                        btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${lastValidFile.name}`;
                        toggleImageButtons(inputInfo, true);
                        
                        // 显示上一次的预览
                        if (lastValidFile.preview) {
                            preview.innerHTML = `<img src="${lastValidFile.preview}" style="width: 100%; height: 100%; object-fit: contain;">`;
                        }
                    } else {
                        btnText.textContent = i18n.t('upload.item_image', '物品展示图');
                        toggleImageButtons(inputInfo, false);
                        
                        // 清空预览
                        preview.innerHTML = '';
                    }
                    };
                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error('图片处理失败:', error);
                    showErrorModal(`${i18n.t('errors.error', '错误')}：${i18n.t('errors.image_processing_failed', '图片处理失败，请重试')}`);
                    
                    // 重置文件输入元素的值，确保不保留错误文件的信息
                    input.value = '';
                    
                    // 保持上一次成功上传的图片
                    if (window.lastValidImageFiles[inputInfo.id]) {
                        const lastValidFile = window.lastValidImageFiles[inputInfo.id];
                        btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${lastValidFile.name}`;
                        toggleImageButtons(inputInfo, true);
                        
                        // 显示上一次的预览
                        if (lastValidFile.preview) {
                            preview.innerHTML = `<img src="${lastValidFile.preview}" style="width: 100%; height: 100%; object-fit: contain;">`;
                        }
                    } else {
                        btnText.textContent = i18n.t('upload.item_image', '物品展示图');
                        toggleImageButtons(inputInfo, false);
                        
                        // 清空预览
                        preview.innerHTML = '';
                    }
                }
            } else {
                // 如果用户取消选择文件，保持上一次成功上传的图片
            if (window.lastValidImageFiles[inputInfo.id]) {
                const lastValidFile = window.lastValidImageFiles[inputInfo.id];
                btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${lastValidFile.name}`;
                toggleImageButtons(inputInfo, true);
                
                // 显示上一次的预览
                if (lastValidFile.preview) {
                    preview.innerHTML = `<img src="${lastValidFile.preview}" style="width: 100%; height: 100%; object-fit: contain;">`;
                }
            } else {
                btnText.textContent = i18n.t('upload.item_image', '物品展示图');
                toggleImageButtons(inputInfo, false);
                
                // 清空预览
                preview.innerHTML = '';
            }
            }
        });
    }
});

// 图标上传事件监听器
const iconFileInput = document.getElementById('iconFile');
const iconBtnText = document.getElementById('iconBtnText');
const iconPreview = document.getElementById('iconPreview');

// 保存上一次成功上传的图标信息
// 保存上一次成功上传的图标文件信息
window.lastValidIconFile = null;
let lastValidIconPreview = '';
let lastValidIconName = '';

// 保存当前选择的文件（无论格式是否正确）
let currentSelectedIconFile = null;

// 图标删除按钮
let iconDeleteBtn = null;



// 确保DOM元素存在
if (iconFileInput && iconBtnText && iconPreview) {
    const iconCustomUpload = iconFileInput.parentElement;
    
    if (iconCustomUpload) {
        // 创建按钮容器
        const iconBtnContainer = document.createElement('div');
        iconBtnContainer.className = 'btn-container';

        // 创建新的自定义上传区域，只包含文件输入和选择按钮
        const newIconCustomUpload = document.createElement('div');
        newIconCustomUpload.className = 'custom-file-upload';

        // 移动现有元素到新的上传区域中
        while (iconCustomUpload.firstChild) {
            newIconCustomUpload.appendChild(iconCustomUpload.firstChild);
        }

        // 创建删除按钮
        iconDeleteBtn = document.createElement('button');
        iconDeleteBtn.className = 'delete-btn';
        iconDeleteBtn.textContent = i18n.t('upload.delete', '删除');
        iconDeleteBtn.onclick = function() {
            openDeleteModal(iconFileInput, 'icon');
        };
        iconDeleteBtn.style.display = 'none'; // 默认隐藏删除按钮

        // 将新的上传区域和删除按钮添加到按钮容器
        iconBtnContainer.appendChild(newIconCustomUpload);
        iconBtnContainer.appendChild(iconDeleteBtn);

        // 将按钮容器添加到原始上传区域
        iconCustomUpload.appendChild(iconBtnContainer);
    }
}

// 自动转换图标格式的函数
function convertToPng(file, callback) {
    const conversionProgress = document.getElementById('conversionProgress');
    const progressBar = conversionProgress.querySelector('.progress-bar');
    const progressText = conversionProgress.querySelector('.progress-text');
    
    // 显示进度条
    conversionProgress.style.display = 'block';
    
    // 模拟进度更新
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 100);
    
    // 创建图片对象
    const img = new Image();
    img.onload = function() {
        // 创建Canvas并设置尺寸
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        
        // 绘制图片到Canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 计算缩放比例，保持图片比例
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // 将Canvas转换为Blob
        canvas.toBlob(function(blob) {
            // 创建新的文件对象
            const convertedFile = new File([blob], 'pack_icon.png', {
                type: 'image/png',
                lastModified: Date.now()
            });
            
            // 清除进度条
            setTimeout(() => {
                conversionProgress.style.display = 'none';
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
            }, 500);
            
            callback(convertedFile);
        }, 'image/png', 1.0);
    };
    
    img.onerror = function() {
        // 清除进度条
        conversionProgress.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        
        callback(null);
    };
    
    // 读取文件
    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 处理图标文件的函数
function handleIconFile(iconFile) {
    // 确保DOM元素存在
    if (!iconFileInput || !iconBtnText || !iconPreview) {
        return;
    }
    
    const status = document.getElementById('status');
    const autoConvertToggle = document.getElementById('autoConvertToggle');
    
    // 确保所有必要的元素都存在
    if (!status || !autoConvertToggle) {
        return;
    }
    
    // 获取删除按钮
    let iconDeleteBtn = null;
    try {
        iconDeleteBtn = iconFileInput.parentElement.parentElement.querySelector('.delete-btn');
    } catch (e) {
        // 忽略错误
    }
    
    // 隐藏全局错误提示
    status.textContent = '';
    status.className = 'status';
    
    if (iconFile) {
        if (!iconFile.name.endsWith('.png')) {
            if (autoConvertToggle.checked) {
                // 检查是否为图片文件
                if (iconFile.type.startsWith('image/')) {
                    // 尝试转换为PNG
                    convertToPng(iconFile, function(convertedFile) {
                        if (convertedFile) {
                            // 保存转换后的图标
                            window.lastValidIconFile = convertedFile;
                            window.lastValidIconFile.isConverted = true;
                            window.lastValidIconName = 'pack_icon.png';
                            
                            iconBtnText.textContent = `${i18n.t('upload.selected_icon', '已选择图标：')}${window.lastValidIconName}${i18n.t('upload.converted', '（已转换）')}`;
                            if (iconDeleteBtn) {
                                iconDeleteBtn.style.display = 'block';
                            }
                            
                            // 预览转换后的图标
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const previewHTML = `<img src="${e.target.result}" alt="图标预览">`;
                                iconPreview.innerHTML = previewHTML;
                                lastValidIconPreview = previewHTML;
                            };
                            reader.readAsDataURL(convertedFile);
                        } else {
                            // 转换失败
                            showErrorModal(`${i18n.t('errors.error', '错误')}：${i18n.t('errors.image_format_not_supported', '图片格式不支持')}`);
                            
                            // 重置文件输入元素的值，确保不保留错误文件的信息
                            iconFileInput.value = '';
                            
                            // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                            if (lastSelectedFiles['iconFile']) {
                                delete lastSelectedFiles['iconFile'];
                            }
                            
                            // 保持上一次成功上传的图标
                            if (window.lastValidIconFile) {
                                iconBtnText.textContent = `${i18n.t('upload.selected_icon', '已选择图标：')}${window.lastValidIconName}`;
                                iconPreview.innerHTML = lastValidIconPreview;
                                if (iconDeleteBtn) {
                                    iconDeleteBtn.style.display = 'block';
                                }
                            } else {
                                iconBtnText.textContent = '选择图标';
                                iconPreview.innerHTML = '';
                                if (iconDeleteBtn) {
                                    iconDeleteBtn.style.display = 'none';
                                }
                            }
                        }
                    });
                } else {
                        // 不是图片文件
                        showErrorModal(`${i18n.t('errors.error', '错误')}：${i18n.t('errors.please_upload_image', '请上传图片文件')}`);
                    
                    // 重置文件输入元素的值，确保不保留错误文件的信息
                    iconFileInput.value = '';
                    
                    // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                    if (lastSelectedFiles['iconFile']) {
                        delete lastSelectedFiles['iconFile'];
                    }
                    
                    // 保持上一次成功上传的图标
                    if (window.lastValidIconFile) {
                        iconBtnText.textContent = `${i18n.t('upload.selected_icon', '已选择图标：')}${window.lastValidIconName}`;
                        iconPreview.innerHTML = lastValidIconPreview;
                        if (iconDeleteBtn) {
                            iconDeleteBtn.style.display = 'block';
                        }
                    } else {
                        iconBtnText.textContent = '选择图标';
                        iconPreview.innerHTML = '';
                        if (iconDeleteBtn) {
                            iconDeleteBtn.style.display = 'none';
                        }
                    }
                }
            } else {
                // 未开启自动转换
                showErrorModal(i18n.t('errors.png_format', '错误：格式必须为 .png'));
                
                // 重置文件输入元素的值，确保不保留错误文件的信息
                iconFileInput.value = '';
                
                // 删除lastSelectedFiles中的错误文件信息，确保下次选择文件时重新处理
                if (lastSelectedFiles['iconFile']) {
                    delete lastSelectedFiles['iconFile'];
                }
                
                // 保持上一次成功上传的图标
                if (window.lastValidIconFile) {
                    iconBtnText.textContent = `${i18n.t('upload.selected_icon', '已选择图标：')}${window.lastValidIconName}`;
                    iconPreview.innerHTML = lastValidIconPreview;
                    if (iconDeleteBtn) {
                        iconDeleteBtn.style.display = 'block';
                    }
                } else {
                    iconBtnText.textContent = '选择图标';
                    iconPreview.innerHTML = '';
                    if (iconDeleteBtn) {
                        iconDeleteBtn.style.display = 'none';
                    }
                }
            }
        } else {
            // 保存当前有效的图标信息
            window.lastValidIconFile = iconFile;
            window.lastValidIconFile.isConverted = false;
            window.lastValidIconName = iconFile.name;
            
            iconBtnText.textContent = `${i18n.t('upload.selected_icon', '已选择图标：')}${iconFile.name}`;
            if (iconDeleteBtn) {
                iconDeleteBtn.style.display = 'block';
            }
            
            // 预览图标
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewHTML = `<img src="${e.target.result}" alt="图标预览">`;
                iconPreview.innerHTML = previewHTML;
                lastValidIconPreview = previewHTML;
            };
            reader.readAsDataURL(iconFile);
        }
    }
}

// 确保iconFileInput存在才添加事件监听器
if (iconFileInput && iconBtnText && iconPreview) {
    iconFileInput.addEventListener('change', function() {
        const iconFile = this.files[0];
        
        // 保存当前选择的文件
        currentSelectedIconFile = iconFile;
        
        if (iconFile) {
            // 处理当前选择的文件
            handleIconFile(iconFile);
        } else {
            // 如果用户取消选择文件，清空当前选择
            currentSelectedIconFile = null;
            
            // 保持上一次成功上传的图标
            if (window.lastValidIconFile) {
                iconBtnText.textContent = `${i18n.t('upload.selected_icon', '已选择图标：')}${lastValidIconName}`;
                iconPreview.innerHTML = lastValidIconPreview;
                try {
                    const iconDeleteBtn = this.parentElement.parentElement.querySelector('.delete-btn');
                    if (iconDeleteBtn) {
                        iconDeleteBtn.style.display = 'block';
                    }
                } catch (e) {
                    // 忽略错误
                }
            } else {
                iconBtnText.textContent = '选择图标';
                iconPreview.innerHTML = '';
                try {
                    const iconDeleteBtn = this.parentElement.parentElement.querySelector('.delete-btn');
                    if (iconDeleteBtn) {
                        iconDeleteBtn.style.display = 'none';
                    }
                } catch (e) {
                    // 忽略错误
                }
            }
        }
    });
}

// 自动转换开关的change事件监听器
const autoConvertToggle = document.getElementById('autoConvertToggle');
if (autoConvertToggle) {
    autoConvertToggle.addEventListener('change', function() {
        // 当开关状态变化时，不重新处理已上传的文件
        // 只有在上传新文件时才根据开关状态进行处理
    });
}

// 音频处理开关的change事件监听器
const audioProcessingToggle = document.getElementById('audioProcessingToggle');
if (audioProcessingToggle) {
    audioProcessingToggle.addEventListener('change', function() {
        if (this.checked) {
            showErrorModal(i18n.t('upload.audio_conversion_not_available', '该功能目前有问题，目前无法使用'));
            this.checked = false;
        }
    });
}

// 打包压缩功能
const packBtn = document.getElementById('packBtn');
if (packBtn) {
    packBtn.addEventListener('click', async function() {
        const status = document.getElementById('status');
        if (status) {
            status.textContent = '';
            status.className = 'status';
        }
        
        try {
            // 收集所有上传的文件
            const uploadedFiles = [];
            fileInputs.forEach(input => {
                let file = null;
                let targetName = input.targetName;
                
                // 优先使用lastValidAudioFiles中保存的有效文件
                if (window.lastValidAudioFiles[input.id]) {
                    file = window.lastValidAudioFiles[input.id].file;
                    // 使用保存的目标文件名
                    if (window.lastValidAudioFiles[input.id].targetName) {
                        targetName = window.lastValidAudioFiles[input.id].targetName;
                    }
                } else {
                    const fileInput = document.getElementById(input.id);
                    if (fileInput) {
                        file = fileInput.files[0];
                    }
                }
                
                if (file) {
                    uploadedFiles.push({ file, targetName });
                }
            });
            
            // 检查是否至少上传了一个文件
            if (uploadedFiles.length === 0) {
                throw new Error(i18n.t('errors.no_files', '必须上传一个音频文件'));
            }
            
            // 获取音乐包名称
            let packName = '';
            const zipNameInput = document.getElementById('zipNameInput');
            if (zipNameInput) {
                packName = zipNameInput.value.trim();
            }
            
            if (!packName) {
                // 如果未输入音乐包名称，依次检查所有自定义描述输入框
                const descInputs = document.querySelectorAll('input[id^="desc_"]');
                for (const descInput of descInputs) {
                    if (descInput && descInput.value.trim()) {
                        packName = descInput.value.trim();
                        break;
                    }
                }
                
                // 如果所有自定义描述输入框都为空，使用第一个上传文件的名称（不含扩展名）
                if (!packName) {
                    if (uploadedFiles.length > 0) {
                        const firstFile = uploadedFiles[0].file;
                        packName = firstFile.name.replace(/\.ogg$/, '');
                    } else {
                        packName = 'music_pack';
                    }
                }
            }
            
            // 创建压缩包
            const zip = new JSZip();
            
            // 添加音频文件到压缩包
            uploadedFiles.forEach(item => {
                const file = item.file;
                const targetName = item.targetName;
                zip.file(`sounds/music/game/records/${targetName}`, file);
            });
            
            // 图片像素调整函数
            function resizeImage(imageFile, maxSize) {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = new Image();
                        img.onload = function() {
                            // 计算新的尺寸
                            let newWidth = img.width;
                            let newHeight = img.height;
                            
                            if (newWidth > maxSize || newHeight > maxSize) {
                                // 计算缩放比例
                                const scale = maxSize / Math.max(newWidth, newHeight);
                                newWidth = Math.round(newWidth * scale);
                                newHeight = Math.round(newHeight * scale);
                            }
                            
                            // 创建Canvas
                            const canvas = document.createElement('canvas');
                            canvas.width = newWidth;
                            canvas.height = newHeight;
                            
                            // 绘制图片
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, newWidth, newHeight);
                            
                            canvas.toBlob(function(blob) {
                                const resizedFile = new File([blob], imageFile.name, {
                                    type: 'image/png',
                                    lastModified: Date.now()
                                });
                                resolve(resizedFile);
                            }, 'image/png');
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(imageFile);
                });
            }
            
            // 添加图片文件到压缩包
            for (const inputInfo of imageFileInputs) {
                const inputId = inputInfo.id;
                if (window.lastValidImageFiles[inputId]) {
                    const imageFile = window.lastValidImageFiles[inputId].file;
                    const targetName = window.lastValidImageFiles[inputId].targetName;
                    
                    // 检查是否启用像素修改
                    const imageSizeToggle = document.getElementById('imageSizeToggle');
                    const isImageSizeEnabled = imageSizeToggle ? imageSizeToggle.checked : true; // 默认打开
                    const imageSizeInput = document.getElementById('imageSizeInput');
                    const maxSize = isImageSizeEnabled && imageSizeInput ? parseInt(imageSizeInput.value) || 32 : 32;
                    
                    if (isImageSizeEnabled) {
                        // 调整图片像素
                        const resizedFile = await resizeImage(imageFile, maxSize);
                        zip.file(`textures/items/${targetName}`, resizedFile);
                    } else {
                        // 直接使用原始文件，不调整像素
                        zip.file(`textures/items/${targetName}`, imageFile);
                    }
                }
            }
            
            // 添加pack_icon.png（如果有，否则使用默认图标）
            if (window.lastValidIconFile) {
                zip.file('pack_icon.png', window.lastValidIconFile);
            } else {
                // 使用bedrockSrc目录中的默认图标
                try {
                    // 创建一个请求来获取默认图标
                    const response = await fetch('bedrockSrc/pack_icon.png');
                    if (response.ok) {
                        const blob = await response.blob();
                        zip.file('pack_icon.png', blob);
                    }
                } catch (error) {
                    console.warn('无法加载默认图标:', error);
                }
            }
            
            // 添加pack.mcmeta文件
            const packMcmeta = {
                "pack": {
                    "pack_format": 5,
                    "description": packName
                }
            };
            zip.file('pack.mcmeta', JSON.stringify(packMcmeta, null, 2));
            
            // 读取并修改bedrockSrc目录中的manifest.json文件
            try {
                const response = await fetch('bedrockSrc/manifest.json');
                if (response.ok) {
                    const manifestJson = await response.json();
                    // 修改name字段
                    manifestJson.header.name = packName;
                    // 保持description字段不变
                    // 生成新的uuid
                    manifestJson.header.uuid = generateUUID();
                    manifestJson.modules[0].uuid = generateUUID();
                    // 添加修改后的manifest.json文件
                    zip.file('manifest.json', JSON.stringify(manifestJson, null, 2));
                } else {
                    // 如果无法加载manifest.json，使用默认模板
                    const headerUUID = generateUUID();
                    const moduleUUID = generateUUID();
                    const manifestJson = {
                        "format_version": 2,
                        "header": {
                            "name": packName,
                            "description": "自定义音乐包",
                            "uuid": headerUUID,
                            "version": [1, 0, 0],
                            "min_engine_version": [1, 19, 0]
                        },
                        "modules": [
                            {
                                "type": "resource_pack",
                                "uuid": moduleUUID,
                                "version": [1, 0, 0]
                            }
                        ]
                    };
                    zip.file('manifest.json', JSON.stringify(manifestJson, null, 2));
                }
            } catch (error) {
                console.warn('无法加载或修改manifest.json:', error);
                // 如果出错，使用默认模板
                const headerUUID = generateUUID();
                const moduleUUID = generateUUID();
                const manifestJson = {
                    "format_version": 2,
                    "header": {
                        "name": packName,
                        "description": "自定义音乐包",
                        "uuid": headerUUID,
                        "version": [1, 0, 0],
                        "min_engine_version": [1, 19, 0]
                    },
                    "modules": [
                        {
                            "type": "resource_pack",
                            "uuid": moduleUUID,
                            "version": [1, 0, 0]
                        }
                    ]
                };
                zip.file('manifest.json', JSON.stringify(manifestJson, null, 2));
            }
            
            // 添加自定义描述
            fileInputs.forEach(input => {
                const descInput = document.getElementById(`desc_${input.id.replace('oggFile_', '')}`);
                if (descInput && descInput.value.trim()) {
                    // 获取对应的音频文件
                    let audioFile = null;
                    if (window.lastValidAudioFiles[input.id]) {
                        audioFile = window.lastValidAudioFiles[input.id].file;
                    } else {
                        const fileInput = document.getElementById(input.id);
                        if (fileInput) {
                            audioFile = fileInput.files[0];
                        }
                    }
                    
                    if (audioFile) {
                        // 添加到description.txt
                        const descriptionContent = `${input.id.replace('oggFile_', '')}=${descInput.value.trim()}`;
                        zip.file(`texts/description.txt`, descriptionContent, { append: true });
                    }
                }
            });
            
            // 添加多语言支持
            const languages = ['zh_CN', 'zh_TW', 'en_US', 'en_GB', 'ja_JP', 'ko_KR', 'id_ID', 'da_DK', 'de_DE', 'es_ES', 'es_MX', 'fr_CA', 'fr_FR', 'it_IT', 'hu_HU', 'nl_NL', 'nb_NO', 'pl_PL', 'pt_BR', 'pt_PT', 'sk_SK', 'fi_FI', 'sv_SE', 'tr_TR', 'cs_CZ', 'el_GR', 'bg_BG', 'ru_RU', 'uk_UA'];
            
            // 默认值映射
            const defaultValues = {
                '11': 'C418 - 11',
                '13': 'C418 - 13',
                '5': '塞缪尔·阿伯格 - 5',
                'blocks': 'C418 - blocks',
                'cat': 'C418 - cat',
                'creator': '莉娜·雷恩 - 创作者',
                'creator_music_box': '莉娜·雷恩 - 创作者（音乐盒）',
                'mall': 'C418 - mall',
                'mellohi': 'C418 - mellohi',
                'otherside': '莉娜·雷恩 - otherside',
                'pigstep_master': '莉娜·雷恩 - Pigstep',
                'precipice': '亚伦·切罗夫 - 峭壁',
                'relic': '亚伦·切罗夫 - Relic',
                'stal': 'C418 - stal',
                'strad': 'C418 - strad',
                'wait': 'C418 - wait',
                'ward': 'C418 - ward',
                'chirp': 'C418 - chirp',
                'far': 'C418 - far',
                'tears': 'Amos Roddy - 泪水',
                'lava_chicken': 'Hyper Potions - 熔岩鸡'
            };
            
            // 收集用户输入的描述
            const userDescriptions = {};
            Object.keys(defaultValues).forEach(key => {
                const descInput = document.getElementById(`desc_${key}`);
                if (descInput && descInput.value.trim()) {
                    userDescriptions[key] = descInput.value.trim();
                }
            });
            
            languages.forEach(lang => {
                let langContent = '# Audio Discs\n';
                
                // 遍历所有可能的记录
                Object.keys(defaultValues).forEach(key => {
                    if (userDescriptions[key]) {
                        // 用户输入了描述，添加到内容中
                        langContent += `item.record_${key}.desc=${userDescriptions[key]}\n`;
                    } else {
                        // 用户没有输入描述，添加空行
                        langContent += '\n';
                    }
                });
                
                zip.file(`texts/${lang}.lang`, langContent.trim());
            });
            
            // 生成压缩包
            const content = await zip.generateAsync({ type: 'blob' });
            
            // 下载压缩包
            saveAs(content, `${packName}.mcpack`);
            
            // 显示成功信息
            if (status) {
                status.textContent = i18n.t('upload.pack_success', '打包成功！');
                status.className = 'status success';
            }
        } catch (error) {
            // 显示错误信息
            showErrorModal(error.message);
            console.error('打包失败:', error);
        }
    });
}

// 打开删除确认模态框
function openDeleteModal(target, type) {
    currentDeleteTarget = target;
    currentDeleteType = type;
    
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const modalTitle = document.getElementById('modalTitle');
    
    // 确保所有必要的元素都存在
    if (!modal || !confirmBtn || !cancelBtn || !modalTitle) {
        return;
    }
    
    if (type === 'icon') {
        modalTitle.textContent = i18n.t('modal.confirm_delete_icon', '确认删除图标');
    } else {
        modalTitle.textContent = i18n.t('modal.confirm_delete', '确认删除');
    }
    
    // 设置弹窗内容
    const modalContent = modal.querySelector('.modal-content p');
    if (modalContent) {
        modalContent.textContent = i18n.t('modal.confirm_delete_message', '确定要删除此文件吗？');
    }
    
    // 设置按钮文本
    if (confirmBtn) {
        confirmBtn.textContent = i18n.t('modal.confirm', '确认');
    }
    if (cancelBtn) {
        cancelBtn.textContent = i18n.t('modal.cancel', '取消');
    }
    
    modal.style.display = 'block';
    
    // 确认删除
    confirmBtn.onclick = function() {
        if (currentDeleteType === 'icon') {
            // 删除图标
            window.lastValidIconFile = null;
            lastValidIconPreview = '';
            window.lastValidIconName = '';
            currentSelectedIconFile = null;
            
            const iconBtnText = document.getElementById('iconBtnText');
            const iconPreview = document.getElementById('iconPreview');
            
            if (iconBtnText) iconBtnText.textContent = '选择图标';
            if (iconPreview) iconPreview.innerHTML = '';
            
            // 获取删除按钮
            let iconDeleteBtn = null;
            try {
                iconDeleteBtn = target.parentElement.parentElement.querySelector('.delete-btn');
                if (iconDeleteBtn) iconDeleteBtn.style.display = 'none';
            } catch (e) {
                // 忽略错误
            }
            
            // 清空文件输入
            try {
                target.value = '';
            } catch (e) {
                // 忽略错误
            }
        } else if (currentDeleteType === 'image') {
            // 删除图片
            try {
                const inputId = target.id;
                delete window.lastValidImageFiles[inputId];
                delete lastSelectedImageFiles[inputId];
                delete lastSelectedFiles[inputId];
                delete lastCropStates[inputId];
                
                const btnText = document.getElementById(`imageBtnText_${inputId.replace('imageFile_', '')}`);
                const preview = document.getElementById(`imagePreview_${inputId.replace('imageFile_', '')}`);
                
                if (btnText) btnText.textContent = i18n.t('upload.item_image', '物品展示图');
                if (preview) preview.innerHTML = '';
                
                // 获取删除和编辑按钮
                let deleteBtn = null;
                let editBtn = null;
                try {
                    deleteBtn = target.parentElement.parentElement.querySelector('.delete-btn');
                    editBtn = document.getElementById('editBtn_' + inputId);
                    if (deleteBtn) deleteBtn.style.display = 'none';
                    if (editBtn) editBtn.style.display = 'none';
                } catch (e) {
                    // 忽略错误
                }
                
                // 清空文件输入
                target.value = '';
            } catch (e) {
                // 忽略错误
            }
        } else {
            // 删除音频文件
            try {
                const inputId = target.id;
                delete window.lastValidAudioFiles[inputId];
                delete lastSelectedFiles[inputId];
                
                const btnText = document.getElementById(`fileBtnText_${inputId.replace('oggFile_', '')}`);
                const descInput = document.getElementById(`desc_${inputId.replace('oggFile_', '')}`);
                
                if (btnText) btnText.textContent = i18n.t('upload.select_audio', '选择音频（不上传即为保持原版音乐）');
                if (descInput) descInput.value = '';
                
                // 获取删除按钮
                let deleteBtn = null;
                try {
                    deleteBtn = target.parentElement.querySelector('.delete-btn');
                    if (deleteBtn) deleteBtn.style.display = 'none';
                } catch (e) {
                    // 忽略错误
                }
                
                // 清空文件输入
                target.value = '';
            } catch (e) {
                // 忽略错误
            }
        }
        
        // 关闭模态框
        modal.style.display = 'none';
    };
    
    // 取消删除
    cancelBtn.onclick = function() {
        modal.style.display = 'none';
    };
}

// 点击模态框外部关闭模态框
window.addEventListener('click', function(event) {
    const deleteModal = document.getElementById('deleteModal');
    const errorModal = document.getElementById('errorModal');
    
    if (deleteModal && event.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
    
    if (errorModal && event.target === errorModal) {
        errorModal.style.display = 'none';
    }
});

// 裁剪功能相关变量
let cropSelection = null;
let cropSelectionBox = null;
let cropHandles = [];
let isResizing = false;
let isDragging = false;
let currentHandle = null;
let cropStartX = 0;
let cropStartY = 0;
let cropStartWidth = 0;
let cropStartHeight = 0;
let cropStartLeft = 0;
let cropStartTop = 0;
let currentCropImageFile = null;
let currentCropPreviewId = null;
let currentCropInputId = null;

// 保存每个图片的上一次裁剪状态
let lastCropStates = {};

// 初始化裁剪功能
// 关闭裁剪模态框并恢复页面滚动
function closeCropModal() {
    const cropModal = document.getElementById('cropModal');
    if (cropModal) {
        cropModal.style.display = 'none';
    }
    document.body.style.overflow = '';
    document.removeEventListener('touchmove', preventBodyScroll);
}

function initCropModal() {
    const cropModal = document.getElementById('cropModal');
    const cancelCropBtn = document.getElementById('cancelCropBtn');
    const confirmCropBtn = document.getElementById('confirmCropBtn');

    if (cancelCropBtn) {
        cancelCropBtn.addEventListener('click', function() {
            closeCropModal();
        });
    }

    if (confirmCropBtn) {
        confirmCropBtn.addEventListener('click', function() {
            cropImageToCanvas();
        });
    }
}

// 创建裁剪选择框和八个调整手柄
function createCropSelection() {
    const cropContainer = document.querySelector('.crop-container');
    if (!cropContainer) return;

    cropSelectionBox = document.createElement('div');
    cropSelectionBox.className = 'crop-selection';

    cropSelectionBox.addEventListener('mousedown', function(e) {
        if (e.target === cropSelectionBox) {
            startDrag(e);
        }
    });

    cropSelectionBox.addEventListener('touchstart', function(e) {
        if (e.target === cropSelectionBox) {
            e.preventDefault();
            e.stopPropagation();
            startDrag(e.touches[0]);
        }
    }, { passive: false });

    const positions = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    cropHandles = [];

    positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = 'crop-handle ' + pos;
        handle.dataset.position = pos;

        handle.addEventListener('mousedown', function(e) {
            startResize(e, pos);
        });

        handle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            startResize(e.touches[0], pos);
        }, { passive: false });

        cropSelectionBox.appendChild(handle);
        cropHandles.push(handle);
    });

    cropContainer.appendChild(cropSelectionBox);
}

// 开始调整大小
function startResize(e, handle) {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;
    currentHandle = handle;
    cropStartX = e.clientX;
    cropStartY = e.clientY;
    const rect = cropSelectionBox.getBoundingClientRect();
    cropStartLeft = rect.left;
    cropStartTop = rect.top;
    cropStartWidth = rect.width;
    cropStartHeight = rect.height;

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', doResize, { passive: false });
    document.addEventListener('touchend', stopResize);
}

// 执行调整大小
function doResize(e) {
    if (!isResizing || !cropSelectionBox) return;

    e.preventDefault();
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - cropStartX;
    const dy = clientY - cropStartY;

    const cropContainer = document.querySelector('.crop-container');
    const containerRect = cropContainer.getBoundingClientRect();
    const imageDisplayRect = getImageDisplayRect();

    if (!imageDisplayRect) return;

    let newLeft = cropStartLeft - containerRect.left;
    let newTop = cropStartTop - containerRect.top;
    let newWidth = cropStartWidth;
    let newHeight = cropStartHeight;

    switch (currentHandle) {
        case 'nw':
            newLeft += dx;
            newTop += dy;
            newWidth -= dx;
            newHeight -= dy;
            break;
        case 'n':
            newTop += dy;
            newHeight -= dy;
            break;
        case 'ne':
            newTop += dy;
            newWidth += dx;
            newHeight -= dy;
            break;
        case 'w':
            newLeft += dx;
            newWidth -= dx;
            break;
        case 'e':
            newWidth += dx;
            break;
        case 'sw':
            newLeft += dx;
            newWidth -= dx;
            newHeight += dy;
            break;
        case 's':
            newHeight += dy;
            break;
        case 'se':
            newWidth += dx;
            newHeight += dy;
            break;
    }

    // 确保不小于最小尺寸
    const minSize = 20;
    if (newWidth < minSize) newWidth = minSize;
    if (newHeight < minSize) newHeight = minSize;

    // 确保在图片显示区域范围内
    const maxLeft = imageDisplayRect.left;
    const maxTop = imageDisplayRect.top;
    const maxWidth = imageDisplayRect.left + imageDisplayRect.width;
    const maxHeight = imageDisplayRect.top + imageDisplayRect.height;

    if (newLeft < maxLeft) newLeft = maxLeft;
    if (newTop < maxTop) newTop = maxTop;
    if (newLeft + newWidth > maxWidth) newWidth = maxWidth - newLeft;
    if (newTop + newHeight > maxHeight) newHeight = maxHeight - newTop;

    cropSelectionBox.style.left = newLeft + 'px';
    cropSelectionBox.style.top = newTop + 'px';
    cropSelectionBox.style.width = newWidth + 'px';
    cropSelectionBox.style.height = newHeight + 'px';
}

// 开始拖动
function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
    cropStartX = e.clientX;
    cropStartY = e.clientY;
    const rect = cropSelectionBox.getBoundingClientRect();
    cropStartLeft = rect.left;
    cropStartTop = rect.top;
    cropStartWidth = rect.width;
    cropStartHeight = rect.height;

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
}

// 执行拖动
function doDrag(e) {
    if (!isDragging || !cropSelectionBox) return;

    e.preventDefault();
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - cropStartX;
    const dy = clientY - cropStartY;

    const cropContainer = document.querySelector('.crop-container');
    const containerRect = cropContainer.getBoundingClientRect();
    const imageDisplayRect = getImageDisplayRect();

    if (!imageDisplayRect) return;

    let newLeft = cropStartLeft - containerRect.left + dx;
    let newTop = cropStartTop - containerRect.top + dy;

    // 确保在图片显示区域范围内
    const maxLeft = imageDisplayRect.left;
    const maxTop = imageDisplayRect.top;
    const maxRight = imageDisplayRect.left + imageDisplayRect.width - cropStartWidth;
    const maxBottom = imageDisplayRect.top + imageDisplayRect.height - cropStartHeight;

    if (newLeft < maxLeft) newLeft = maxLeft;
    if (newTop < maxTop) newTop = maxTop;
    if (newLeft > maxRight) newLeft = maxRight;
    if (newTop > maxBottom) newTop = maxBottom;

    cropSelectionBox.style.left = newLeft + 'px';
    cropSelectionBox.style.top = newTop + 'px';
}

// 停止拖动
function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', doDrag);
    document.removeEventListener('touchend', stopDrag);
}

// 停止调整大小
function stopResize() {
    isResizing = false;
    currentHandle = null;
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchmove', doResize);
    document.removeEventListener('touchend', stopResize);
}

// 阻止页面滚动
function preventBodyScroll(e) {
    e.preventDefault();
    e.stopPropagation();
}

// 显示裁剪模态框
function showCropModal(imageFile, previewId, inputId) {
    const cropModal = document.getElementById('cropModal');
    const cropImage = document.getElementById('cropImage');
    const cropContainer = document.querySelector('.crop-container');

    if (!cropModal || !cropImage || !cropContainer) return;

    currentCropImageFile = imageFile;
    currentCropPreviewId = previewId;
    currentCropInputId = inputId;

    const reader = new FileReader();
    reader.onload = function(e) {
        cropImage.src = e.target.result;
        cropImage.onload = function() {
            cropModal.style.display = 'block';

            document.body.style.overflow = 'hidden';
            document.addEventListener('touchmove', preventBodyScroll, { passive: false });

            setTimeout(() => {
                updateCropSelection();
            }, 100);
        };
    };
    reader.readAsDataURL(imageFile);
}

// 获取图片在容器内的实际显示区域
function getImageDisplayRect() {
    const cropImage = document.getElementById('cropImage');
    const cropContainer = document.querySelector('.crop-container');
    if (!cropImage || !cropContainer) return null;

    const containerRect = cropContainer.getBoundingClientRect();
    const imgRatio = cropImage.naturalWidth / cropImage.naturalHeight;
    const containerRatio = containerRect.width / containerRect.height;

    let displayWidth, displayHeight, displayLeft, displayTop;

    if (imgRatio > containerRatio) {
        // 图片比容器宽，宽度填满
        displayWidth = containerRect.width;
        displayHeight = containerRect.width / imgRatio;
        displayLeft = 0;
        displayTop = (containerRect.height - displayHeight) / 2;
    } else {
        // 图片比容器高，高度填满
        displayHeight = containerRect.height;
        displayWidth = containerRect.height * imgRatio;
        displayTop = 0;
        displayLeft = (containerRect.width - displayWidth) / 2;
    }

    return {
        left: displayLeft,
        top: displayTop,
        width: displayWidth,
        height: displayHeight
    };
}

// 更新裁剪选择框
function updateCropSelection() {
    const cropContainer = document.querySelector('.crop-container');
    const imageDisplayRect = getImageDisplayRect();
    if (!cropContainer || !imageDisplayRect) return;

    if (!cropSelectionBox) {
        createCropSelection();
    }

    const containerRect = cropContainer.getBoundingClientRect();
    let left, top, width, height;

    // 检查是否有保存的裁剪状态
    if (currentCropInputId && lastCropStates[currentCropInputId]) {
        const savedState = lastCropStates[currentCropInputId];
        left = imageDisplayRect.left + savedState.left * imageDisplayRect.width;
        top = imageDisplayRect.top + savedState.top * imageDisplayRect.height;
        width = savedState.width * imageDisplayRect.width;
        height = savedState.height * imageDisplayRect.height;
    } else {
        // 默认选择完整一张图片
        left = imageDisplayRect.left;
        top = imageDisplayRect.top;
        width = imageDisplayRect.width;
        height = imageDisplayRect.height;
    }

    cropSelectionBox.style.left = left + 'px';
    cropSelectionBox.style.top = top + 'px';
    cropSelectionBox.style.width = width + 'px';
    cropSelectionBox.style.height = height + 'px';
    cropSelectionBox.style.display = 'block';
}

// 将裁剪图片到Canvas
function cropImageToCanvas() {
    const cropImage = document.getElementById('cropImage');
    const cropContainer = document.querySelector('.crop-container');
    const imageDisplayRect = getImageDisplayRect();

    if (!cropImage || !cropContainer || !cropSelectionBox || !imageDisplayRect) return;

    const containerRect = cropContainer.getBoundingClientRect();
    const selectionRect = cropSelectionBox.getBoundingClientRect();

    // 保存当前裁剪状态（相对于图片显示区域的位置）
    if (currentCropInputId) {
        lastCropStates[currentCropInputId] = {
            left: (selectionRect.left - containerRect.left - imageDisplayRect.left) / imageDisplayRect.width,
            top: (selectionRect.top - containerRect.top - imageDisplayRect.top) / imageDisplayRect.height,
            width: selectionRect.width / imageDisplayRect.width,
            height: selectionRect.height / imageDisplayRect.height
        };
    }

    // 检查是否选择了完整图片
    const selectionLeftRel = (selectionRect.left - containerRect.left - imageDisplayRect.left) / imageDisplayRect.width;
    const selectionTopRel = (selectionRect.top - containerRect.top - imageDisplayRect.top) / imageDisplayRect.height;
    const selectionWidthRel = selectionRect.width / imageDisplayRect.width;
    const selectionHeightRel = selectionRect.height / imageDisplayRect.height;

    // 如果选择了完整图片，直接使用原始文件
    if (selectionLeftRel <= 0.01 && selectionTopRel <= 0.01 && 
        selectionWidthRel >= 0.99 && selectionHeightRel >= 0.99) {
        updateCroppedImage(currentCropImageFile);
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = function() {
        const cropX = selectionLeftRel * img.width;
        const cropY = selectionTopRel * img.height;
        const cropWidth = selectionWidthRel * img.width;
        const cropHeight = selectionHeightRel * img.height;

        canvas.width = cropWidth;
        canvas.height = cropHeight;
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        canvas.toBlob(function(blob) {
            const croppedFile = new File([blob], currentCropImageFile.name, {
                type: 'image/png',
                lastModified: Date.now()
            });

            updateCroppedImage(croppedFile);
        }, 'image/png');
    };
    img.src = cropImage.src;
}

// 更新裁剪后的图片
function updateCroppedImage(croppedFile) {
    const preview = document.getElementById(currentCropPreviewId);
    const input = document.getElementById(currentCropInputId);

    if (!preview || !input) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const previewUrl = e.target.result;
        if (preview) {
            preview.innerHTML = `<img src="${previewUrl}" style="width: 100%; height: 100%; object-fit: contain;">`;
        }

        const originalName = window.lastValidImageFiles[currentCropInputId]?.name || croppedFile.name;
        
        window.lastValidImageFiles[currentCropInputId] = {
            file: croppedFile,
            name: originalName,
            preview: previewUrl,
            targetName: imageFileInputs.find(info => info.id === currentCropInputId)?.targetName
        };

        const btnText = document.getElementById(`imageBtnText_${currentCropInputId.replace('imageFile_', '')}`);
        if (btnText) {
            btnText.textContent = `${i18n.t('upload.selected_image', '已选择图片：')}${originalName}`;
        }

        closeCropModal();
    };
    reader.readAsDataURL(croppedFile);
}

// 为每个图片上传区域动态添加编辑按钮（删除按钮左边）
imageFileInputs.forEach(inputInfo => {
    const input = document.getElementById(inputInfo.id);
    if (input) {
        const parentElement = input.parentElement.parentElement;
        if (parentElement) {
            const deleteBtn = parentElement.querySelector('.delete-btn');
            if (deleteBtn) {
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.id = 'editBtn_' + inputInfo.id;
                editBtn.textContent = i18n.t('upload.edit', '编辑');
                editBtn.style.display = 'none';
                editBtn.onclick = function() {
                    if (window.lastValidImageFiles[inputInfo.id] && window.lastValidImageFiles[inputInfo.id].file) {
                        showCropModal(window.lastValidImageFiles[inputInfo.id].file, inputInfo.previewId, inputInfo.id);
                    }
                };
                deleteBtn.parentNode.insertBefore(editBtn, deleteBtn);
            }
        }
    }
});

// 初始化
window.addEventListener('DOMContentLoaded', function() {
    initCropModal();
});
