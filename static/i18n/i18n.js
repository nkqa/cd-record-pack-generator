// i18n 国际化工具
const i18n = {
  // 当前语言
  currentLang: 'zh_CN',
  // 语言数据
  langData: {},
  
  // 初始化i18n
  init(lang = 'zh_CN') {
    this.currentLang = lang;
    this.loadLangData(lang);
  },
  
  // 加载语言数据
  loadLangData(lang) {
    fetch(`./static/i18n/${lang}.json`)
      .then(response => response.json())
      .then(data => {
        this.langData = data;
        this.updateUI();
      })
      .catch(error => {
        console.error('Error loading language data:', error);
      });
  },
  
  // 切换语言
  changeLang(lang) {
    this.currentLang = lang;
    this.loadLangData(lang);
    // 保存语言设置到localStorage
    localStorage.setItem('language', lang);
  },
  
  // 获取翻译文本
  t(key, defaultValue = '') {
    const keys = key.split('.');
    let result = this.langData;
    
    for (const k of keys) {
      if (result[k] === undefined) {
        return defaultValue;
      }
      result = result[k];
    }
    
    return result;
  },
  
  // 更新UI
  updateUI() {
    console.log('i18n updateUI called');
    
    // 更新页面标题
    document.title = this.t('title', 'Minecraft Music Disc Replacement Tool');
    
    // 更新头部标题
    const headerTitle = document.querySelector('h1');
    if (headerTitle) {
      headerTitle.textContent = this.t('header.title', 'Minecraft Music Disc Replacement Tool');
    }
    
    // 更新信息部分
    const infoToggle = document.querySelector('.info-toggle');
    if (infoToggle) {
      const toggleText = infoToggle.textContent.replace(/▼|▲/, '');
      infoToggle.innerHTML = `<span class="toggle-icon">▼</span> ${this.t('info.toggle', 'Information')}`;
    }
    
    // 更新信息内容
    const infoContent = document.querySelector('.info-content');
    if (infoContent) {
      // 开发者
      const devElement = infoContent.querySelector('p:nth-child(1)');
      if (devElement) {
        const link = devElement.querySelector('a');
        if (link) {
          devElement.innerHTML = `${this.t('info.developer', 'Developer:')} <a href="https://meowco.cn" target="_blank">Meowco</a>`;
        }
      }
      
      // 社区
      const communityElement = infoContent.querySelector('p:nth-child(2)');
      if (communityElement) {
        const link = communityElement.querySelector('a');
        if (link) {
          communityElement.innerHTML = `${this.t('info.community', 'Community:')} <a href="https://www.mcneko.com" target="_blank">www.mcneko.com</a>`;
        }
      }
      
      // 源代码
      const sourceElement = infoContent.querySelector('p:nth-child(3)');
      if (sourceElement) {
        const link = sourceElement.querySelector('a');
        if (link) {
          sourceElement.innerHTML = `${this.t('info.source_code', 'Source code:')} <a href="https://github.com/nkqa/cd-record-pack-generator/" target="_blank" rel="nofollow">GitHub</a>`;
        }
      }
      
      // 网站用途
      const purposeElement = infoContent.querySelector('h3:nth-child(4)');
      if (purposeElement) {
        purposeElement.textContent = this.t('info.what_is_this', 'What is the purpose of this website?');
      }
      const purposeDescElement = infoContent.querySelector('p:nth-child(5)');
      if (purposeDescElement) {
        purposeDescElement.textContent = this.t('info.what_is_this_desc', 'This website provides a function to generate Minecraft Bedrock Edition disc replacements');
      }
      
      // 使用方法
      const howElement = infoContent.querySelector('h3:nth-child(6)');
      if (howElement) {
        howElement.textContent = this.t('info.how_to_use', 'How to use this tool?');
      }
      const howDescElement = infoContent.querySelector('p:nth-child(7)');
      if (howDescElement) {
        howDescElement.textContent = this.t('info.how_to_use_desc', 'Just upload audio in ogg format, please note the maximum supported duration below');
      }
      
      // 上传问题
      const uploadIssueElement = infoContent.querySelector('h3:nth-child(8)');
      if (uploadIssueElement) {
        uploadIssueElement.textContent = this.t('info.why_cant_upload', 'Why can\'t I upload or download?');
      }
      const uploadIssueDesc1Element = infoContent.querySelector('p:nth-child(9)');
      if (uploadIssueDesc1Element) {
        uploadIssueDesc1Element.innerHTML = this.t('info.why_cant_upload_desc1', 'Please use a Chromium-based browser, such as Google Chrome or Microsoft Edge');
      }
      const uploadIssueDesc2Element = infoContent.querySelector('p:nth-child(10)');
      if (uploadIssueDesc2Element) {
        uploadIssueDesc2Element.textContent = this.t('info.why_cant_upload_desc2', 'Please ensure you upload the correct format');
      }
      
      // 格式转换
      const formatElement = infoContent.querySelector('h3:nth-child(11)');
      if (formatElement) {
        formatElement.textContent = this.t('info.not_ogg_format', 'My audio format is not ogg, is there a tool to convert format?');
      }
      const formatDescElement = infoContent.querySelector('p:nth-child(12)');
      if (formatDescElement) {
        let descText = this.t('info.not_ogg_format_desc', 'Yes, click here to view');
        // 根据不同语言替换链接文本
        if (descText.includes('click here')) {
          // 英文
          descText = descText.replace('click here', `<a href="#convert-tools" onclick="smoothScroll('convert-tools'); return false;">click here</a>`);
        } else if (descText.includes('点击这里')) {
          // 中文
          descText = descText.replace('点击这里', `<a href="#convert-tools" onclick="smoothScroll('convert-tools'); return false;">点击这里</a>`);
        } else if (descText.includes('ここをクリック')) {
          // 日文
          descText = descText.replace('ここをクリック', `<a href="#convert-tools" onclick="smoothScroll('convert-tools'); return false;">ここをクリック</a>`);
        }
        formatDescElement.innerHTML = descText;
      }
      
      // 感谢
      const thanksElement = infoContent.querySelector('h3:nth-child(13)');
      if (thanksElement) {
        thanksElement.textContent = this.t('info.thanks', 'Thanks');
      }
      const thanksDescElement = infoContent.querySelector('p:nth-child(14)');
      if (thanksDescElement) {
        let thanksText = this.t('info.thanks_desc', 'Thanks to this video for inspiring me and providing files');
        // 根据不同语言替换链接文本
        if (thanksText.includes('this video')) {
          // 英文
          thanksText = thanksText.replace('this video', `<a href="https://www.bilibili.com/video/BV1DSBRYrE6N/" target="_blank" rel="nofollow">this video</a>`);
        } else if (thanksText.includes('此视频')) {
          // 中文
          thanksText = thanksText.replace('此视频', `<a href="https://www.bilibili.com/video/BV1DSBRYrE6N/" target="_blank" rel="nofollow">此视频</a>`);
        } else if (thanksText.includes('この動画')) {
          // 日文
          thanksText = thanksText.replace('この動画', `<a href="https://www.bilibili.com/video/BV1DSBRYrE6N/" target="_blank" rel="nofollow">この動画</a>`);
        }
        thanksDescElement.innerHTML = thanksText;
      }
      
      // 常见问题
      const faqElement = infoContent.querySelector('h3:nth-child(15)');
      if (faqElement) {
        faqElement.textContent = this.t('info.faq', 'Frequently Asked Questions');
      }
      const faqDescElement = infoContent.querySelector('p:nth-child(16)');
      if (faqDescElement) {
        let faqText = this.t('info.faq_desc', 'Yes, click here to view');
        // 根据不同语言替换链接文本
        if (faqText.toLowerCase().includes('click here')) {
          // 英文
          faqText = faqText.replace(/Click here|click here/i, `<a href="#faq" onclick="smoothScroll('faq'); return false;">$&</a>`);
        } else if (faqText.includes('点击这里')) {
          // 中文
          faqText = faqText.replace('点击这里', `<a href="#faq" onclick="smoothScroll('faq'); return false;">点击这里</a>`);
        } else if (faqText.includes('ここをクリック')) {
          // 日文
          faqText = faqText.replace('ここをクリック', `<a href="#faq" onclick="smoothScroll('faq'); return false;">ここをクリック</a>`);
        }
        faqDescElement.innerHTML = faqText;
      }
    }
    
    // 更新上传部分标题
    const uploadTitle = document.querySelector('.upload-section h2');
    if (uploadTitle) {
      uploadTitle.textContent = this.t('upload.title', 'Upload Music Files');
    }
    
    // 更新文件输入标签
    const fileInputs = document.querySelectorAll('.file-input label');
    fileInputs.forEach((label, index) => {
      // 基于位置和结构识别标签，不依赖于当前文本内容
      const parent = label.parentElement;
      const input = parent.querySelector('input');
      
      // 识别音乐包图标标签
      if (input && input.type === 'file' && input.id === 'iconFile') {
        label.textContent = this.t('upload.icon_label', 'Music pack icon');
      }
      // 识别音乐包名称标签
      else if (label.getAttribute('for') === 'zipNameInput' || (input && input.type === 'text' && input.id === 'zipNameInput')) {
        label.textContent = this.t('upload.pack_name', 'Music pack name');
      }
    });
    
    // 更新FAQ区域
    const faqSection = document.querySelector('.faq-section');
    if (faqSection) {
      // 更新FAQ标题
      const faqTitle = faqSection.querySelector('h3');
      if (faqTitle) {
        faqTitle.textContent = this.t('faq.title', 'Frequently Asked Questions');
      }
      
      // 根据当前语言显示对应的FAQ区块
      const faqZh = document.querySelector('#faq-zh');
      const faqEn = document.querySelector('#faq-en');
      const faqJa = document.querySelector('#faq-ja');
      
      // 隐藏所有语言区块
      if (faqZh) faqZh.style.display = 'none';
      if (faqEn) faqEn.style.display = 'none';
      if (faqJa) faqJa.style.display = 'none';
      
      // 根据当前语言显示对应的区块
      if (this.currentLang === 'zh_CN' && faqZh) {
        faqZh.style.display = 'block';
      } else if (this.currentLang === 'en_US' && faqEn) {
        faqEn.style.display = 'block';
      } else if (this.currentLang === 'ja_JP' && faqJa) {
        faqJa.style.display = 'block';
      }
      
      // 更新中文FAQ
      if (faqZh) {
        const faqZhTitle = faqZh.querySelector('h4');
        if (faqZhTitle) {
          faqZhTitle.textContent = '中文';
        }
        
        const faqZhItems = faqZh.querySelectorAll('.faq-item');
        if (faqZhItems[0]) {
          const q1 = faqZhItems[0].querySelector('p:nth-child(1)');
          if (q1) {
            q1.innerHTML = `<strong>Q1：为什么我在物品栏里查了填入的自定义描述名查不到？</strong>`;
          }
          const a1 = faqZhItems[0].querySelector('p:nth-child(2)');
          if (a1) {
            a1.textContent = 'A1：您需要输入的是"音乐唱片"（英：Music Disc、日：レコード），然后才能查找。';
          }
        }
      }
      
      // 更新英文FAQ
      if (faqEn) {
        const faqEnTitle = faqEn.querySelector('h4');
        if (faqEnTitle) {
          faqEnTitle.textContent = 'English';
        }
        
        const faqEnItems = faqEn.querySelectorAll('.faq-item');
        if (faqEnItems[0]) {
          const q1 = faqEnItems[0].querySelector('p:nth-child(1)');
          if (q1) {
            q1.innerHTML = `<strong>Q1: Why can't I find my custom description in the inventory search?</strong>`;
          }
          const a1 = faqEnItems[0].querySelector('p:nth-child(2)');
          if (a1) {
            a1.textContent = 'A1: You need to search for "Music Disc" (Chinese: 音乐唱片, Japanese: レコード) first, then you can find it.';
          }
        }
      }
      
      // 更新日文FAQ
      if (faqJa) {
        const faqJaTitle = faqJa.querySelector('h4');
        if (faqJaTitle) {
          faqJaTitle.textContent = '日本語';
        }
        
        const faqJaItems = faqJa.querySelectorAll('.faq-item');
        if (faqJaItems[0]) {
          const q1 = faqJaItems[0].querySelector('p:nth-child(1)');
          if (q1) {
            q1.innerHTML = `<strong>Q1：なぜインベントリ検索でカスタム説明を見つけることができないのですか？</strong>`;
          }
          const a1 = faqJaItems[0].querySelector('p:nth-child(2)');
          if (a1) {
            a1.textContent = 'A1：最初に「レコード」（中国語：音乐唱片、英語：Music Disc）を検索する必要があります。その後、見つけることができます。';
          }
        }
      }
    }
    
    // 更新自定义上传按钮文本
    const customBtns = document.querySelectorAll('.custom-btn');
    customBtns.forEach(btn => {
      const parent = btn.parentElement;
      const input = parent.querySelector('input[type="file"]');
      
      // 识别音频选择按钮
      if (input && input.id && input.id.startsWith('oggFile_')) {
        // 检查是否有保存的音频文件信息
        if (window.lastValidAudioFiles && window.lastValidAudioFiles[input.id]) {
          const lastValidFile = window.lastValidAudioFiles[input.id];
          if (lastValidFile.isConverted) {
            btn.textContent = `${this.t('upload.selected_audio', '已选择音频：')}${lastValidFile.name}${this.t('upload.converted', '（已转换）')}`;
          } else {
            btn.textContent = `${this.t('upload.selected_audio', '已选择音频：')}${lastValidFile.name}`;
          }
        } else {
          btn.textContent = this.t('upload.select_audio', '选择音频（不上传即为保持原版音乐）');
        }
      }
      // 识别图标选择按钮
      else if (input && input.id === 'iconFile') {
        // 检查是否有保存的图标文件信息
        if (window.lastValidIconFile) {
          const lastValidIconName = window.lastValidIconFile.name || 'pack_icon.png';
          if (window.lastValidIconFile.isConverted) {
            btn.textContent = `${this.t('upload.selected_icon', '已选择图标：')}${lastValidIconName}${this.t('upload.converted', '（已转换）')}`;
          } else {
            btn.textContent = `${this.t('upload.selected_icon', '已选择图标：')}${lastValidIconName}`;
          }
        } else {
          btn.textContent = this.t('upload.select_icon', '选择图标');
        }
      }
      // 识别物品展示图按钮
      else if (input && input.id && input.id.startsWith('imageFile_')) {
        // 检查是否有保存的图片文件信息
        if (window.lastValidImageFiles && window.lastValidImageFiles[input.id]) {
          const lastValidFile = window.lastValidImageFiles[input.id];
          if (lastValidFile.isConverted) {
            btn.textContent = `${this.t('upload.selected_image', '已选择图片：')}${lastValidFile.name}${this.t('upload.converted', '（已转换）')}`;
          } else {
            btn.textContent = `${this.t('upload.selected_image', '已选择图片：')}${lastValidFile.name}`;
          }
        } else {
            btn.textContent = this.t('upload.item_image', '选择物品展示图（不上传即为保持原版材质）');
          }
      }
    });
    
    // 更新时长警告
    const durationWarnings = document.querySelectorAll('.duration-warning');
    durationWarnings.forEach(warning => {
      const text = warning.textContent;
      const time = text.match(/\d+:\d+/);
      if (time) {
        warning.textContent = `${this.t('upload.duration_warning', 'The maximum duration for this music cannot exceed')} ${time[0]}`;
      }
    });
    
    // 更新描述输入框占位符
    const descInputs = document.querySelectorAll('input[id^="desc_"]');
    descInputs.forEach(input => {
      input.placeholder = this.t('upload.custom_desc', 'Custom description');
    });
    
    // 更新音乐包名称输入框占位符
    const zipNameInput = document.getElementById('zipNameInput');
    if (zipNameInput) {
      zipNameInput.placeholder = this.t('upload.pack_name_placeholder', 'If not entered, the name of the first uploaded file will be used');
    }
    
    // 更新生成按钮
    const packBtn = document.getElementById('packBtn');
    if (packBtn) {
      packBtn.textContent = this.t('buttons.generate', 'Generate mcpack file');
    }
    
    // 更新注意事项
    const noticeSection = document.querySelector('.notice-section');
    if (noticeSection) {
      const noticeTitle = noticeSection.querySelector('h3');
      if (noticeTitle) {
        noticeTitle.textContent = this.t('notices.title', 'Notes');
      }
      
      const noticeItems = noticeSection.querySelectorAll('p');
      if (noticeItems[0]) {
        noticeItems[0].textContent = this.t('notices.notice1', 'Each music selection button has a duration limit indicated below it. If the uploaded music exceeds the limit, it will be forcibly stopped by the game');
      }
      if (noticeItems[1]) {
        noticeItems[1].textContent = this.t('notices.notice2', 'Some browsers will add .zip to the end of the file name. If this happens, you need to remove it manually');
      }
      if (noticeItems[2]) {
        noticeItems[2].textContent = this.t('notices.slow_conversion', '内置的音频格式转换工具会比较慢');
      }
    }
    
    // 更新转换工具部分
    const toolsSection = document.getElementById('convert-tools');
    if (toolsSection) {
      const toolsTitle = toolsSection.querySelector('h3');
      if (toolsTitle) {
        toolsTitle.textContent = this.t('tools.title', 'Format Conversion Tools');
      }
      
      const toolsDesc = toolsSection.querySelector('p');
      if (toolsDesc) {
        toolsDesc.textContent = this.t('tools.description', 'If you want to upload a file that is not in .ogg format, the following online conversion tools are recommended:');
      }
    }
    
    // 更新背景图声明
    const backgroundNotice = document.querySelector('.background-notice p');
    if (backgroundNotice) {
      backgroundNotice.textContent = this.t('background.notice', 'Background image source: Internet. If there is any infringement, please visit my personal website to get contact email');
    }
    
    // 更新自动转换开关标签
    const autoConvertLabel = document.getElementById('autoConvertText');
    console.log('autoConvertLabel:', autoConvertLabel);
    if (autoConvertLabel) {
      console.log('Updating autoConvertLabel text');
      autoConvertLabel.textContent = this.t('upload.auto_convert', 'Enable automatic format conversion');
    }
    
    // 更新音频处理开关标签
    const audioProcessingLabel = document.getElementById('audioConversionText');
    console.log('audioProcessingLabel:', audioProcessingLabel);
    if (audioProcessingLabel) {
      console.log('Updating audioProcessingLabel text');
      audioProcessingLabel.textContent = `${this.t('upload.audio_conversion', 'Enable audio format conversion')}（${this.t('upload.slow_conversion', '比较慢，建议使用其它在线转换工具')}）`;
    }
    
    // 更新音频时长检查开关标签
    const durationCheckLabel = document.getElementById('durationCheckText');
    console.log('durationCheckLabel:', durationCheckLabel);
    if (durationCheckLabel) {
      console.log('Updating durationCheckLabel text');
      durationCheckLabel.textContent = this.t('upload.duration_check', 'Enable audio duration check');
    }
    
    // 更新物品展示图像素修改文本
    const imageSizeLabel = document.getElementById('imageSizeText');
    console.log('imageSizeLabel:', imageSizeLabel);
    if (imageSizeLabel) {
      console.log('Updating imageSizeLabel text');
      imageSizeLabel.textContent = this.t('upload.image_size_modify', '启用物品展示图像素修改');
    }
    
    // 更新像素输入框占位符
    const imageSizeInput = document.getElementById('imageSizeInput');
    console.log('imageSizeInput:', imageSizeInput);
    if (imageSizeInput) {
      console.log('Updating imageSizeInput placeholder');
      imageSizeInput.placeholder = this.t('upload.pixels', 'Pixels');
    }
    
    // 更新删除按钮文本
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
      btn.textContent = this.t('upload.delete', 'Delete');
    });
    
    // 更新音频转换弹窗
    const conversionModal = document.getElementById('conversionModal');
    if (conversionModal) {
      // 更新标题
      const conversionTitle = conversionModal.querySelector('h3');
      if (conversionTitle) {
        conversionTitle.textContent = this.t('modal.conversion.title', 'Audio Conversion');
      }
      
      // 更新取消按钮
      const cancelBtn = document.getElementById('cancelConversionBtn');
      if (cancelBtn) {
        cancelBtn.textContent = this.t('modal.conversion.cancel', 'Cancel Conversion');
      }
    }
    
    // 更新状态消息
    const status = document.getElementById('status');
    if (status && status.classList.contains('success')) {
      // 如果状态元素存在且显示的是成功消息，则更新它
      status.textContent = this.t('upload.pack_success', '打包成功！');
    }
  }
};

// 初始化i18n
window.addEventListener('DOMContentLoaded', function() {
  // 自动检测系统语言
  function detectSystemLanguage() {
    const systemLang = navigator.language || navigator.userLanguage;
    const langCode = systemLang.toLowerCase();
    
    // 检测语言
    if (langCode.includes('zh')) {
      return 'zh_CN';
    } else if (langCode.includes('ja')) {
      return 'ja_JP';
    } else {
      // 默认使用英语
      return 'en_US';
    }
  }
  
  // 从localStorage获取语言设置，如果没有则检测系统语言
  const savedLang = localStorage.getItem('language') || detectSystemLanguage();
  i18n.init(savedLang);
  
  // 创建语言选择栏
  const langContainer = document.createElement('div');
  langContainer.className = 'language-selector';
  langContainer.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
    padding: 8px 16px;
    background-color: #f5f5f5;
    border-radius: 20px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  `;
  
  // 添加语言标签
  const langLabel = document.createElement('span');
  langLabel.textContent = '语言: ';
  langLabel.style.cssText = `
    font-size: 14px;
    color: #666;
  `;
  langContainer.appendChild(langLabel);
  
  // 语言选项
  const languages = [
    { code: 'zh_CN', name: '中文' },
    { code: 'en_US', name: 'English' },
    { code: 'ja_JP', name: '日本語' }
  ];
  
  languages.forEach(lang => {
    const button = document.createElement('button');
    button.textContent = lang.name;
    button.style.cssText = `
      padding: 4px 10px;
      border: 1px solid #ddd;
      border-radius: 12px;
      background-color: ${savedLang === lang.code ? '#4CAF50' : 'white'};
      color: #333;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    `;
    
    button.addEventListener('mouseenter', function() {
      if (i18n.currentLang !== lang.code) {
        this.style.backgroundColor = '#f0f0f0';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      if (i18n.currentLang !== lang.code) {
        this.style.backgroundColor = 'white';
      }
    });
    
    button.addEventListener('click', function() {
      i18n.changeLang(lang.code);
      // 更新按钮样式
      languages.forEach(l => {
        const btn = document.querySelector(`[data-lang="${l.code}"]`);
        if (btn) {
          btn.style.backgroundColor = l.code === lang.code ? '#4CAF50' : 'white';
          btn.style.color = '#333';
        }
      });
    });
    
    button.setAttribute('data-lang', lang.code);
    langContainer.appendChild(button);
  });
  
  // 添加到页面（在标题之后）
  const container = document.querySelector('.container');
  const h1 = document.querySelector('h1');
  if (container && h1) {
    container.insertBefore(langContainer, h1.nextSibling);
  }
});