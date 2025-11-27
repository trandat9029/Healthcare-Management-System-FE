export const adminMenu = [

    { //Dashboard
        name: 'menu.admin.dashboard', 
        link: '/system/dashboard',
        icon: 'fa-solid fa-grip', 
    },

    { //Quản lý người dùng
        name: 'menu.admin.manage-user', 
        link: '/system/manage-user',
        icon: 'fa-solid fa-user', 
        
    },
    
    { //Quản lý bác sĩ
        name: 'menu.admin.manage-doctor', 
        link: '/system/manage-doctor',
        icon: 'fa-solid fa-user-doctor',  
    },

    { //Quản lý kết hoạch khám bệnh của bác sĩ
        name: 'menu.admin.manage-schedule', 
        link: '/system/manage-schedule',
        icon: 'fa-solid fa-calendar', 
    },
    { //Quản lý chuyên khoa
        name: 'menu.admin.manage-specialty', 
        link: '/system/manage-specialty',
        icon: 'fa-solid fa-briefcase-medical', 
        menus: [
            {
                name: 'menu.admin.create-specialty', link: '/system/create-specialty', 
            },
        ]
    },
    { //Quản lý phòng khám
        name: 'menu.admin.manage-clinic', 
        link: '/system/manage-clinic', 
        icon: 'fa-solid fa-house-chimney-medical', 
        menus: [
            {
                name: 'menu.admin.create-clinic', link: '/system/create-clinic', 
            },
        ]
    },
    { //Quản lý cẩm nang
        name: 'menu.admin.manage-handbook', 
        link: '/system/manage-handbook',
        icon: 'fa-solid fa-newspaper',  
        menus: [
            {
                name: 'menu.admin.create-handbook', link: '/system/create-handbook', 
            },            
        ]
    },
    { //Quản lý booking
        name: 'menu.admin.manage-booking', 
        link: '/system/manage-booking',
        icon: 'fa-solid fa-calendar-check',  
    },

];



export const doctorMenu = [
    {
        name: 'menu.admin.manage-schedule', 
        link: '/doctor/manage-schedule',
        icon: 'fa-solid fa-calendar-days', 
    },
    {
        //Quản lý kết hoạch khám bệnh nhân của bác sĩ
        name: 'menu.doctor.manage-patient', 
        link: '/doctor/manage-patient', 
        icon: 'fa-solid fa-bed', 
    },
    {
        //Quản lý kết hoạch khám bệnh nhân của bác sĩ
        name: 'menu.doctor.manage-profile', 
        link: '/doctor/manage-profile', 
        icon: 'fa-solid fa-address-card', 
    },
];