export const adminMenu = [

    { //Dashboard
        name: 'menu.admin.dashboard', link: '/system/dashboard',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/dashboard', 
            },            
        ]
    },

    { //Quản lý người dùng
        name: 'menu.admin.manage-user', 
        menus: [
            {
                name: 'menu.admin.crud', link: '/system/user-manage', 
            },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux', 
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor',  
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage',  },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin', 
            // },
            { //Quản lý kết hoạch khám bệnh của bác sĩ
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule', 
            }, 
        ]
    },
    
    { //Quản lý bác sĩ
        name: 'menu.admin.manage-doctor', 
        menus: [
            {
                name: 'menu.admin.doctor', link: '/system/manage-doctor', 
            },
        ]
    },

    { //Quản lý kết hoạch khám bệnh của bác sĩ
        name: 'menu.admin.manage-schedule', 
        menus: [
            {
                name: 'menu.doctor.schedule', link: '/system/manage-schedule', 
            },
        ]
    },
    { //Quản lý chuyên khoa
        name: 'menu.admin.manage-specialty', 
        menus: [
            {
                name: 'menu.admin.specialty', link: '/system/manage-specialty', 
            },
        ]
    },
    { //Quản lý phòng khám
        name: 'menu.admin.manage-clinic', 
        menus: [
            {
                name: 'menu.admin.clinic', link: '/system/manage-clinic', 
            },
        ]
    },
    { //Quản lý cẩm nang
        name: 'menu.admin.manage-handbook', 
        menus: [
            {
                name: 'menu.admin.handbook', link: '/system/manage-handbook', 
            },            
        ]
    },
    { //Quản lý booking
        name: 'menu.admin.manage-booking', 
        menus: [
            {
                name: 'menu.admin.booking', link: '/system/manage-booking', 
            },            
        ]
    },

];



export const doctorMenu = [
    {
        name: 'menu.admin.manage-user', 
        menus: [
            { //Quản lý kết hoạch khám bệnh của bác sĩ
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule', 
            },
            { //Quản lý kết hoạch khám bệnh nhân của bác sĩ
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient', 
            },
        ]
    },
    {
        //Quản lý kết hoạch khám bệnh nhân của bác sĩ
        name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient', 
    },
    {
        //Quản lý kết hoạch khám bệnh nhân của bác sĩ
        name: 'menu.doctor.manage-profile', link: '/doctor/manage-profile', 
    },
];