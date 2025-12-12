function init_life_time() {
    // 缓存DOM元素，减少选择器查询
    const dayProgress = {
        text: $('#dayProgress .date-text span'),
        bar: $('#dayProgress .progress .progress-bar')
    };
    const weekProgress = {
        text: $('#weekProgress .date-text span'),
        bar: $('#weekProgress .progress .progress-bar')
    };
    const monthProgress = {
        text: $('#monthProgress .date-text span'),
        bar: $('#monthProgress .progress .progress-bar')
    };
    const yearProgress = {
        text: $('#yearProgress .date-text span'),
        bar: $('#yearProgress .progress .progress-bar')
    };
    
    // 星期映射
    const weeks = {
        0: 7,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6
    };
    
    function updateProgress() {
        /* 当前时间戳 */
        const nowDate = +new Date();
        /* 今天开始时间戳 */
        const todayStartDate = new Date(new Date().toLocaleDateString()).getTime();
        /* 今天已经过去的时间 */
        const todayPassHours = (nowDate - todayStartDate) / 1000 / 60 / 60;
        /* 今天已经过去的时间比 */
        const todayPassHoursPercent = (todayPassHours / 24) * 100;
        const todayPassHoursInt = parseInt(todayPassHours);
        const todayPassHoursPercentInt = parseInt(todayPassHoursPercent);
        
        // 更新日进度
        dayProgress.text.html(todayPassHoursInt);
        dayProgress.bar.css('width', todayPassHoursPercentInt + '%').html(todayPassHoursPercentInt + '%');
        
        /* 当前周几 */
        const weekDay = weeks[new Date().getDay()];
        const weekDayPassPercent = (weekDay / 7) * 100;
        const weekDayPassPercentInt = parseInt(weekDayPassPercent);
        
        // 更新周进度
        weekProgress.text.html(weekDay);
        weekProgress.bar.css('width', weekDayPassPercentInt + '%').html(weekDayPassPercentInt + '%');
        
        /* 月 */
        const year = new Date().getFullYear();
        const date = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const monthAll = new Date(year, month, 0).getDate();
        const monthPassPercent = (date / monthAll) * 100;
        const monthPassPercentInt = parseInt(monthPassPercent);
        
        // 更新月进度
        monthProgress.text.html(date);
        monthProgress.bar.css('width', monthPassPercentInt + '%').html(monthPassPercentInt + '%');
        
        /* 年 */
        const yearPass = (month / 12) * 100;
        const yearPassInt = parseInt(yearPass);
        
        // 更新年进度
        yearProgress.text.html(month);
        yearProgress.bar.css('width', yearPassInt + '%').html(yearPassInt + '%');
    }
    
    // 初始更新
    updateProgress();
    
    // 降低更新频率，从1秒改为60秒，减少DOM操作
    setInterval(updateProgress, 60000);
}

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init_life_time);
} else {
    init_life_time();
}