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
    fetch(`static/i18n/${lang}.json`)
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
        const link = formatDescElement.querySelector('a');
        if (link) {
          formatDescElement.innerHTML = `${this.t('info.not_ogg_format_desc', 'Yes, click here to view').replace('click here', `<a href="#convert-tools" onclick="smoothScroll('convert-tools'); return false;">click here</a>`)}`;
        }
      }
      
      // 感谢
      const thanksElement = infoContent.querySelector('h3:nth-child(13)');
      if (thanksElement) {
        thanksElement.textContent = this.t('info.thanks', 'Thanks');
      }
      const thanksDescElement = infoContent.querySelector('p:nth-child(14)');
      if (thanksDescElement) {
        const link = thanksDescElement.querySelector('a');
        if (link) {
          thanksDescElement.innerHTML = `${this.t('info.thanks_desc', 'Thanks to this video for inspiring me and providing files').replace('this video', `<a href="https://www.bilibili.com/video/BV1DSBRYrE6N/" target="_blank" rel="nofollow">this video</a>`)}`;
        }
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
      // 跳过不需要翻译的标签（如文件名）
      if (label.textContent === '音乐包图标' || label.textContent === '音乐包名称') {
        if (label.textContent === '音乐包图标') {
          label.textContent = this.t('upload.icon_label', 'Music pack icon');
        } else if (label.textContent === '音乐包名称') {
          label.textContent = this.t('upload.pack_name', 'Music pack name');
        }
      }
    });
    
    // 更新自定义上传按钮文本
    const customBtns = document.querySelectorAll('.custom-btn');
    customBtns.forEach(btn => {
      if (btn.textContent.includes('选择音频')) {
        btn.textContent = this.t('upload.select_audio', 'Select audio');
      } else if (btn.textContent.includes('选择图标')) {
        btn.textContent = this.t('upload.select_icon', 'Select icon');
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
    const descInputs = document.querySelectorAll('input[placeholder*="自定义描述"]');
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
  
  // 创建语言切换按钮
  const langContainer = document.createElement('div');
  langContainer.className = 'language-selector';
  langContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 20px;
  `;
  
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
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: ${savedLang === lang.code ? '#4CAF50' : 'white'};
      color: ${savedLang === lang.code ? 'white' : '#333'};
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', function() {
      if (savedLang !== lang.code) {
        this.style.backgroundColor = '#f0f0f0';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      if (savedLang !== lang.code) {
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
          btn.style.color = l.code === lang.code ? 'white' : '#333';
        }
      });
    });
    
    button.setAttribute('data-lang', lang.code);
    langContainer.appendChild(button);
  });
  
  // 添加到页面（在标题之前）
  const container = document.querySelector('.container');
  const h1 = document.querySelector('h1');
  if (container && h1) {
    container.insertBefore(langContainer, h1);
  }
});