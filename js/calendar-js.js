//全局变量now，在日历翻页的时候会被修改
var now = new Date();

/**
 * 初始化函数，在js最后一行进行调用
 * 用来统一开始一个函数集合
 */
function init() {
    drawBody(now);
    setUpHeader(now.getFullYear(), now.getMonth());
}

/**
 * 两个calendar-arrow的onclick事件
 * @param direction 1代表下一月，0代表上一月
 */
function changeCalendarBody(direction) {
//        console.log('点击了' + direction);
    if (direction === 0) {
        if (now.getMonth() === 0) {
            now.setMonth(11);
            now.setFullYear(now.getFullYear() - 1);
        } else {
            now.setMonth(now.getMonth() - 1);
        }
    } else if (direction === 1) {
        if (now.getMonth() === 11) {
            now.setMonth(0);
            now.setFullYear(now.getFullYear() + 1);
        } else {
            now.setMonth(now.getMonth() + 1);
        }
    } else {
        throw new Error('只能点击下一月和上一月');
    }
    drawBody(now);

    setUpHeader(now.getFullYear(), now.getMonth());
}

/**
 * 绘制传入对象代表的月份的日历body数据
 * @param now 传入的date对象
 */
function drawBody(now) {
    var counter = 0;
    var date = now.getDate();
    var daysList = document.getElementById('calendar-days-list');
    while (daysList.hasChildNodes()) {
        daysList.removeChild(daysList.firstChild);
    }
    var daysBelongToLastMonth = (7 - (date % 7 - now.getDay())) % 7;
    var totalDays = numberOfDaysInLastMonth(now);
    //打印上个月剩下的几天
    for (var i = daysBelongToLastMonth; i > 0; i--) {
        var listItem = document.createElement('li');
        //+1的原因：25-30总共6天，但30-25=6
        listItem.innerText = totalDays - i + 1;
        listItem.style.color = '#BBB';
        daysList.appendChild(listItem);
        counter++;
    }

    //打印本月的日子
    var numberOfDaysThisMonth = numberOfDaysInMonth(now);
    for (var d = 1; d <= numberOfDaysThisMonth; d++) {
        var listItem = document.createElement('li');
        listItem.innerText = d;
        //begin-只能选择大于今天的日子
        if (now.getFullYear() > new Date().getFullYear()) {
            listItem.setAttribute('onclick', 'select()');
            listItem.setAttribute('id', 'day-' + d);
        } else if (now.getFullYear() === new Date().getFullYear()) {
            if (now.getMonth() === new Date().getMonth() && d >= now.getDate()) {
                listItem.setAttribute('onclick', 'select()');
                listItem.setAttribute('id', 'day-' + d);
            } else if (now.getMonth() > new Date().getMonth()) {
                listItem.setAttribute('onclick', 'select()');
                listItem.setAttribute('id', 'day-' + d);
            }
        }
        //over-只能选择大于今天的日子
        if (d === now.getDate() &&
            now.getFullYear() === new Date().getFullYear() &&
            now.getMonth() === new Date().getMonth()) {
            listItem.setAttribute('id', 'today-list-item');
        }
        daysList.appendChild(listItem);
        counter++;
    }

    if (counter % 7 !== 0) {
        for (var j = 1; j <= 7 - (counter % 7); j++) {
            var listItem = document.createElement('li');
            listItem.innerText = j;
            listItem.style.color = '#BBB';
            daysList.appendChild(listItem);
        }
    }

    setUpToday();
}

/**
 * 判断当前完整年份是否闰年
 * @param fullYear 完整年份
 * @return number 是闰年返回1 否则返回0
 */
function isLeapYear(fullYear) {
    if (fullYear % 100 !== 0) {
        return fullYear % 4 === 0 ? 1 : 0;
    } else {
        return fullYear % 400 === 0 ? 1 : 0;
    }
}

/**
 * 返回上个月的天数
 * @param now 包含至少fullYear和month信息的Date对象
 */
function numberOfDaysInLastMonth(now) {
    var copy = new Date(now);
    if (copy.getMonth() === 0) {
        copy.setMonth(11);
        copy.setFullYear(now.getFullYear() - 1)
    } else {
        copy.setMonth(copy.getMonth() - 1)
    }
    return numberOfDaysInMonth(copy);
}

/**
 * 返回这个月的天数
 */
function numberOfDaysInMonth(copy) {
    var daysInMonths = [31, 28 + isLeapYear(copy.getFullYear()),
        31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonths[copy.getMonth()];
}

/**
 * 此方法将当前日期着色为墨绿色
 */
function setUpToday() {
    var today = new Date();
    if (today.getMonth() === now.getMonth() &&
        today.getFullYear() === now.getFullYear()) {
        var todayId = document.getElementById('today-list-item');
        todayId.style.background = '#00c1ac'
    }
}

/**
 * 填充日历的头部，月份年份等信息
 * @param fullYear 完整的年份
 * @param month 完整的月份，从0开始
 */
function setUpHeader(fullYear, month) {
    var yearHeader = document.getElementById('year');
    yearHeader.innerText = fullYear;

    var monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    var monthHeader = document.getElementById('month');
    monthHeader.innerText = monthNames[month];
}

var lastSelectedDayId;

/**
 * select方法是在动态生成的li里面被点击才调用，
 * 主要作用是用户点击某一日期时，更换着色点
 */
function select() {
    discolorPresent();
    discolorLastSelection();
    var id = 'day-' + event.target.innerHTML;
    var selectedDay = document.getElementById(id);
    lastSelectedDayId = id;
    selectedDay.style.background = '#00c1ac';
}

function discolorPresent() {
    try {
        var todayId = document.getElementById('today-list-item');
        todayId.style.backgroundColor = '#f3f3f2'
    } catch (Error) {
    }
}

function discolorLastSelection() {
    try {
        var lastSelected = document.getElementById(lastSelectedDayId);
        lastSelected.style.background = '#f3f3f2';
    } catch (Error) {
    }
}

init();